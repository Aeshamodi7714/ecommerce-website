const Coupon = require('../models/coupon.model');

// Admin: Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, type, value, expiry, minOrder } = req.body;
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value,
      expiry,
      minOrder
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get All Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Validate Coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon' });
    }

    if (new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (cartTotal < coupon.minOrder) {
      return res.status(400).json({ success: false, message: `Minimum order of $${coupon.minOrder} required` });
    }

    res.status(200).json({ 
      success: true, 
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
