const express = require("express");
const router = express.Router();
const middleware = require("../../../middlewares/admin.middleware");
const usermiddleware = require("../../../middlewares/user.middleware");
const adminController = require("../../../controllers/admin.controller");
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

module.exports = router;
