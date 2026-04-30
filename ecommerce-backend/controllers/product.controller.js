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
      isNewProduct,
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
      isNewProduct: isNewProduct || false,
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
      // Seed sample data if empty
      const samples = [
        { name: "iPhone 15 Pro", price: 999, category: "Smartphones", stock: 10, sku: "IP15P", brand: "Apple", description: "Latest flagship" },
        { name: "MacBook Air M2", price: 1199, category: "Laptops", stock: 5, sku: "MBA-M2", brand: "Apple", description: "Powerful laptop" }
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
      isNewProduct,
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
      isNewProduct,
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
