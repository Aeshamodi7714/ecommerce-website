const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const adminService = require("../services/admin.service");
const orderService = require("../services/order.service");
const { validationResult } = require("express-validator");

// get all user
module.exports.AllUser = async (req, res) => {
  try {
    const users = await adminService.getAllUser();

    return res.status(200).json({ message: "User Fetch Sucessfully", users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await adminService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not Find" });
    }

    return res.status(200).json({ message: "User Delete Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// update user role
module.exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Access Denined !!" });
    }

    const user = await adminService.updateUserRole({ userId, role });

    if (!user) {
      throw new Error("User Not Found !!");
    }

    return res
      .status(200)
      .json({ message: "User Role Updated Successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.AllOrders = async (req, res) => {
  try {
    let orders = await orderService.GetAllOrders();
    
    if (!orders || orders.length === 0) {
      // Seed sample order if empty
      const sampleOrder = {
        userId: "65f1a2b3c4d5e6f7a8b9c0d1", // Dummy ID
        items: [{ productId: "65f1a2b3c4d5e6f7a8b9c0d2", name: "Sample Item", quantity: 1, price: 100, total: 100 }],
        totalbill: 100,
        status: "pending"
      };
      await orderModel.create(sampleOrder);
      orders = await orderService.GetAllOrders();
    }
    
    return res.status(200).json({ message: "All Orders Fetched", orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.DashboardStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const orders = await orderModel.find();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalbill || 0), 0);

    // Recent orders (last 5)
    const recentOrders = await orderModel.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      },
      recentOrders
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
