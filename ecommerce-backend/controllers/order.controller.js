const orderService = require("../services/order.service");

// create order
module.exports.CreateOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    console.log("Creating order for user:", userId);
    const order = await orderService.CreateOrder({ userId, items });

    if (!order) {
      return res.status(404).json("Products not Found");
    }

    return res
      .status(200)
      .json({ message: "Order Created Successfully", order });
  } catch (error) {
    console.error("CreateOrder Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// get order deatils and show order stauts
module.exports.GetOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching orders for user:", userId);

    const order = await orderService.GetOrder(userId);
    console.log("Orders found:", order.length);

    return res
      .status(200)
      .json({ message: "Order Featch Successfully", order });
  } catch (error) {
    console.error("GetOrder Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
// update order status (Admin)
module.exports.UpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.UpdateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order Status Updated", order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
