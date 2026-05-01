const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  // Prefer Authorization Header (used by frontend bypass) over cookies
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(" ")[1] : null) || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Token Expired or Missing. Please Sign-In." });
  }

  if (token === 'admin-auth-token-bypass') {
    console.log("⚠️ Dev Bypass: Admin Token Used via Header");
    // Ensure we provide a full admin object
    req.user = { 
      _id: '65f1a2b3c4d5e6f7a8b9c0d0', 
      role: 'admin', 
      email: 'admin@hub.com',
      username: 'Super Admin'
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({ message: "Unathorized" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("🔒 Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
