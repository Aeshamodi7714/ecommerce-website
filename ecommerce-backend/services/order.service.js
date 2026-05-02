const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");


// create order
module.exports.CreateOrder = async ({ userId, items }) => {
  let totalAmount = 0;

  let orderItems = [];

  for (let item of items) {
    console.log(item);
    const productId = item.productId;
    const product = await productModel.findOne({ _id: productId });

    // Fallback: If product not in DB (e.g. sample data), use item details from cart
    const price = product ? product.price : (item.price || 0);
    const itemsTotal = price * item.quantity;

    totalAmount += itemsTotal;

    orderItems.push({
      productId: item.productId,
      name: product ? product.name : (item.name || "Unknown Product"),
      image: product ? product.image : (item.image || ""),
      quantity: item.quantity,
      price: price,
      total: itemsTotal,
    });
  }

  return await orderModel.create({
    userId,
    items: orderItems,
    totalbill: totalAmount,
  });
};

// get order history or show order
module.exports.GetOrder = async(userId)=>{
    return await orderModel.find({userId});
}

// get all orders (Admin)
module.exports.GetAllOrders = async () => {
    return await orderModel.find({}).populate('userId', 'username email').sort({ createdAt: -1 });
}

// update status (Admin)
module.exports.UpdateOrderStatus = async (orderId, updateData) => {
    // If updateData is just a string, convert to object
    const update = typeof updateData === 'string' ? { status: updateData } : updateData;
    return await orderModel.findByIdAndUpdate(orderId, { $set: update }, { new: true }).populate('userId', 'username email');
}