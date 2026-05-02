const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
// Route
const userRouter = require("./routes/web/v1/user.route");
const adminRouter = require("./routes/web/v1/admin.route");
const productRouter = require("./routes/web/v1/product.route");
const chatRouter = require("./routes/web/v1/chat.route");
const cartRouter = require("./routes/web/v1/cart.route");
const orderRouter = require("./routes/web/v1/order.route");
const wishlistRouter = require("./routes/web/v1/wishlist.route");

const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set(db());

// Logger
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode}`);
  });
  next();
});

// cors origin
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5000"], 
  credentials: true 
}));

PORT = process.env.PORT || 5000;

// API routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/bot", chatRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter)

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, "../ecommerce-frontend/dist");
app.use(express.static(frontendPath));

// Fallback to index.html for React Router (must be after API routes)
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: "API endpoint not found" });
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ server is Running on PORT ${PORT}`);
});
