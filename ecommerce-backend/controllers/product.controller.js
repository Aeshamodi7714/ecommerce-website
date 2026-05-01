const productService = require("../services/product.service");
const productModel = require("../models/product.model");

// add new products
module.exports.createProduct = async (req, res) => {
  console.log('--- CREATE PRODUCT ATTEMPT ---', req.body.name);
  try {
    const {
      name,
      description,
      stock,
      price,
      discount,
      isNewproduct,
      sku,
      images,
      brand,
      category,
    } = req.body;

    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ message: "Name, Price, Category and Stock are required" });
    }

    const isExist = await productModel.findOne({ sku: sku });

    if (isExist) {
      return res.status(400).json({ message: "Product Already Registered with this SKU" });
    }

    const product = await productService.createProduct({
      name,
      description: description || "No description provided",
      stock,
      price,
      discount: discount || 0,
      isNewproduct: isNewproduct || false,
      sku,
      images: Array.isArray(images) ? images : [images],
      brand: brand || "Generic",
      category,
    });

    return res.status(200).json({ message: "Product Added Successfully", product });
  } catch (error) {
    console.error("❌ CreateProduct Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// all products
module.exports.allProduct = async (req, res) => {
  try {
    let products = await productService.AllProduct(req.query);

    if (!products || products.length === 0) {
      // Robust Seeding with full catalog
      const samples = [
        // SMARTPHONES
        { name: "iPhone 15 Pro Max", price: 1199, category: "Smartphones", stock: 15, sku: "IP15PM", brand: "Apple", description: "The ultimate iPhone with Titanium design and A17 Pro chip.", images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"], isNewproduct: true },
        { name: "Samsung Galaxy S24 Ultra", price: 1299, category: "Smartphones", stock: 12, sku: "S24U", brand: "Samsung", description: "AI-powered flagship with 200MP camera and S-Pen.", images: ["https://images.unsplash.com/photo-1707065153400-0e7b0a724f6f?w=800"], isNewproduct: true },
        
        // LAPTOPS
        { name: "MacBook Pro M3 Max", price: 2499, category: "Laptops", stock: 8, sku: "MBP-M3M", brand: "Apple", description: "Extreme performance for pros with Liquid Retina XDR.", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"], isNewproduct: true },
        { name: "Dell XPS 15", price: 1899, category: "Laptops", stock: 10, sku: "XPS15", brand: "Dell", description: "InfinityEdge display with powerful RTX graphics.", images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"], isNewproduct: false },
        
        // AUDIO
        { name: "Sony WH-1000XM5", price: 399, category: "Audio", stock: 25, sku: "XM5", brand: "Sony", description: "Industry leading noise canceling headphones.", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"], isNewproduct: false },
        { name: "AirPods Max", price: 549, category: "Audio", stock: 15, sku: "APMAX", brand: "Apple", description: "High-fidelity audio with active noise cancellation.", images: ["https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800"], isNewproduct: true },
        
        // WATCHES
        { name: "Apple Watch Ultra 2", price: 799, category: "Watches", stock: 20, sku: "AWU2", brand: "Apple", description: "The most rugged and capable Apple Watch.", images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800"], isNewproduct: true },
        { name: "Samsung Galaxy Watch 6 Classic", price: 349, category: "Watches", stock: 18, sku: "GW6C", brand: "Samsung", description: "Classic design with advanced health tracking.", images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800"], isNewproduct: false },
        
        // ACCESSORIES
        { name: "Logitech MX Master 3S", price: 99, category: "Accessories", stock: 50, sku: "MX3S", brand: "Logitech", description: "Ultimate productivity mouse with silent clicks.", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"], isNewproduct: false },
        { name: "Keychron Q6 Pro", price: 210, category: "Accessories", stock: 12, sku: "KCQ6P", brand: "Keychron", description: "Full-size wireless mechanical keyboard.", images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800"], isNewproduct: true }
      ];
      await productModel.insertMany(samples);
      products = await productService.AllProduct(req.query);
    }

    return res.status(200).json({ message: "Fetch All Products:", products });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// single product
module.exports.singleProduct = async (req, res) => {
  try {
    const product = await productService.singleProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found !!" });
    }

    return res.status(200).json({ message: "Product Found !!", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// update product
module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      stock,
      price,
      discount,
      isNewproduct,
      sku,
      images,
      brand,
      category,
    } = req.body;

    const updatedProduct = await productService.updateProduct({
      productId,
      name,
      description,
      stock,
      price,
      discount,
      isNewproduct,
      sku,
      images,
      brand,
      category,
    });

    return res
      .status(200)
      .json({ message: "Product Update Successfully", updatedProduct });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// delete product
module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await productService.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product Not Found !!" });
    }

    return res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
