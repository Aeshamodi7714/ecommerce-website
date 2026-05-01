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

const reviewService = require("../services/review.service");

module.exports.AllReviews = async (req, res) => {
  try {
    let reviews = await reviewService.getAllReviews();
    
    if (!reviews || reviews.length === 0) {
      // Seed some sample reviews if empty
      const products = await productModel.find().limit(3);
      const user = await userModel.findOne({ role: 'admin' });
      
      if (products.length > 0 && user) {
        const samples = [
          { productId: products[0]._id, userId: user._id, rating: 5, comment: "Absolutely love this product! The build quality is top-notch." },
          { productId: products[1]?._id || products[0]._id, userId: user._id, rating: 4, comment: "Very good performance, though the battery life could be slightly better." },
          { productId: products[2]?._id || products[0]._id, userId: user._id, rating: 2, comment: "Expected more for the price. The interface is a bit laggy." }
        ];
        for(let s of samples) await reviewService.createReview(s);
        reviews = await reviewService.getAllReviews();
      }
    }
    
    return res.status(200).json({ message: "Reviews Fetched Successfully", reviews });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    return res.status(200).json({ message: "Review Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.seedProducts = async (req, res) => {
  console.log("🚀 [SEED] Starting robust database seeding...");
  try {
    // 1. Clear existing products
    await productModel.deleteMany({});
    console.log("🧹 [SEED] Database cleared.");
    
    const samples = [
      // SMARTPHONES
      { name: "iPhone 15 Pro Max", price: 1199, category: "Smartphones", stock: 15, sku: "IP15PM", brand: "Apple", description: "The ultimate iPhone with Titanium design and A17 Pro chip.", images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"], isNewproduct: true, discount: 0 },
      { name: "Samsung Galaxy S24 Ultra", price: 1299, category: "Smartphones", stock: 12, sku: "S24U", brand: "Samsung", description: "AI-powered flagship with 200MP camera and S-Pen.", images: ["https://images.unsplash.com/photo-1707065153400-0e7b0a724f6f?w=800"], isNewproduct: true, discount: 0 },
      
      // LAPTOPS
      { name: "MacBook Pro M3 Max", price: 2499, category: "Laptops", stock: 8, sku: "MBP-M3M", brand: "Apple", description: "Extreme performance for pros with Liquid Retina XDR.", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"], isNewproduct: true, discount: 0 },
      { name: "Dell XPS 15", price: 1899, category: "Laptops", stock: 10, sku: "XPS15", brand: "Dell", description: "InfinityEdge display with powerful RTX graphics.", images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"], isNewproduct: false, discount: 0 },
      
      // AUDIO
      { name: "Sony WH-1000XM5", price: 399, category: "Audio", stock: 25, sku: "XM5", brand: "Sony", description: "Industry leading noise canceling headphones.", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"], isNewproduct: false, discount: 0 },
      { name: "AirPods Max", price: 549, category: "Audio", stock: 15, sku: "APMAX", brand: "Apple", description: "High-fidelity audio with active noise cancellation.", images: ["https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800"], isNewproduct: true, discount: 0 },
      
      // WATCHES
      { name: "Apple Watch Ultra 2", price: 799, category: "Watches", stock: 20, sku: "AWU2", brand: "Apple", description: "The most rugged and capable Apple Watch.", images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800"], isNewproduct: true, discount: 0 },
      { name: "Samsung Galaxy Watch 6 Classic", price: 349, category: "Watches", stock: 18, sku: "GW6C", brand: "Samsung", description: "Classic design with advanced health tracking.", images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800"], isNewproduct: false, discount: 0 },
      
      // ACCESSORIES
      { name: "Logitech MX Master 3S", price: 99, category: "Accessories", stock: 50, sku: "MX3S", brand: "Logitech", description: "Ultimate productivity mouse with silent clicks.", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"], isNewproduct: false, discount: 0 },
      { name: "Keychron Q6 Pro", price: 210, category: "Accessories", stock: 12, sku: "KCQ6P", brand: "Keychron", description: "Full-size wireless mechanical keyboard.", images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800"], isNewproduct: true, discount: 0 }
    ];
    
    const results = [];
    for (const item of samples) {
      try {
        const p = new productModel(item);
        await p.save();
        results.push(p);
        console.log(`✅ [SEED] Added: ${item.name}`);
      } catch (err) {
        console.error(`❌ [SEED] Failed to add ${item.name}:`, err.message);
      }
    }
    
    return res.status(200).json({ 
      message: "Database Seeding Attempt Finished", 
      successCount: results.length,
      totalCount: samples.length 
    });
  } catch (error) {
    console.error("🔥 [SEED] Fatal Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

module.exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await adminService.toggleBlockUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ 
      message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'} Successfully`,
      user 
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
