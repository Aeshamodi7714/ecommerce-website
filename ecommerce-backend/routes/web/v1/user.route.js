const express = require("express");
const { body } = require("express-validator");
const userController = require("../../../controllers/user.controller");
const couponController = require("../../../controllers/coupon.controller");
const middleware = require("../../../middlewares/user.middleware");

const router = express.Router();

// register user
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 2 })
      .withMessage("username must be at least 2 characters long"),
    body("email").isEmail().withMessage("Enter Vaild Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long"),
  ],
  userController.registerUser,
);

// login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter Vaild Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 charcters long"),
  ],
  userController.loginUser,
);

// show profile
router.get("/profile", middleware.authUser, userController.profile);

// logout profile
router.get("/logout", middleware.authUser, userController.logout)

// update profile
router.put("/update", middleware.authUser, userController.updateUser)

// change password
router.post("/change-password", middleware.authUser, userController.changePassword)

// forget password
router.post("/forget-password", userController.forgetPassword)

// reset password
router.post("/reset-password/:token", userController.resetPassword)

// Review Routes
router.post("/review", middleware.authUser, userController.postReview);
router.get("/reviews/:productId", userController.getProductReviews);

// Coupon Routes (User)
router.post("/coupon/validate", middleware.authUser, couponController.validateCoupon);
router.get("/coupons/active", middleware.authUser, couponController.getAllCoupons);

const adminMiddleware = require("../../../middlewares/admin.middleware");

// Admin Management Routes
router.get("/admin/all", middleware.authUser, adminMiddleware.authAdmin, userController.getAllAdmins);
router.put("/permissions/:id", middleware.authUser, adminMiddleware.authAdmin, userController.updateAdminPermissions);

module.exports = router;
