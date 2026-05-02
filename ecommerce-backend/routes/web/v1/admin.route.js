const express = require("express");
const router = express.Router();
const middleware = require("../../../middlewares/admin.middleware");
const usermiddleware = require("../../../middlewares/user.middleware");
const adminController = require("../../../controllers/admin.controller");
const couponController = require("../../../controllers/coupon.controller");
const { body } = require("express-validator");

// show all users
// login user --> check user is Admin? --> show all users
router.get(
  "/all/user",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.AllUser,
);

// Delete User
router.delete(
  "/user/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.deleteUser,
);

// update role -- create manager
router.put(
  "/user/:id/role",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.updateUserRole,
);

// Get All Orders (Admin)
router.get(
  "/all/orders",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.AllOrders,
);

// Get Dashboard Stats
router.get(
  "/stats",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.DashboardStats,
);

// Toggle Block User
router.put(
  "/user/:id/block",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.toggleBlockUser,
);

// Get All Reviews
router.get(
  "/all/reviews",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.AllReviews,
);

// Delete Review
router.delete(
  "/review/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.deleteReview,
);

// Seed Products
router.post(
  "/seed-products",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.seedProducts,
);

// Coupon Routes (Admin)
router.post(
  "/coupon",
  usermiddleware.authUser,
  middleware.authAdmin,
  couponController.createCoupon,
);

router.get(
  "/all/coupons",
  usermiddleware.authUser,
  middleware.authAdmin,
  couponController.getAllCoupons,
);

router.delete(
  "/coupon/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  couponController.deleteCoupon,
);

// Banner Routes
router.get("/banners", usermiddleware.authUser, middleware.authAdmin, adminController.getAllBanners);
router.post("/banner", usermiddleware.authUser, middleware.authAdmin, adminController.createBanner);
router.put("/banner/:id", usermiddleware.authUser, middleware.authAdmin, adminController.updateBanner);
router.delete("/banner/:id", usermiddleware.authUser, middleware.authAdmin, adminController.deleteBanner);

// Ticket Routes
router.get("/tickets", usermiddleware.authUser, middleware.authAdmin, adminController.getAllTickets);
router.put("/ticket/:id/status", usermiddleware.authUser, middleware.authAdmin, adminController.updateTicketStatus);
router.post("/ticket/:id/reply", usermiddleware.authUser, middleware.authAdmin, adminController.replyToTicket);
router.get("/logs", usermiddleware.authUser, middleware.authAdmin, adminController.getSystemLogs);

module.exports = router;
