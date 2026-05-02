const productModel = require("../models/product.model");

// create product
module.exports.createProduct = async ({
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
}) => {
  if (
    !name ||
    !description ||
    !stock ||
    !price ||
    !sku ||
    !images ||
    !brand ||
    !category
  ) {
    throw new Error("All Fields Are Required !!");
  }

  let product = await productModel.create({
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

  return product;
};

// get single product
module.exports.singleProduct = async (id) => {
  const product = await productModel.findOne({ _id: id });
  return product;
};

// all product
module.exports.AllProduct = async (query = {}) => {
  const { category, search, minPrice, maxPrice, sort, limit } = query;
  
  let filter = {};
  if (category) {
    filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  let dbQuery = productModel.find(filter);

  if (sort) {
    if (sort === 'price_asc') dbQuery = dbQuery.sort({ price: 1 });
    else if (sort === 'price_desc') dbQuery = dbQuery.sort({ price: -1 });
    else if (sort === 'newest') dbQuery = dbQuery.sort({ createdAt: -1 });
  }

  if (limit) {
    dbQuery = dbQuery.limit(Number(limit));
  }

  return await dbQuery;
};

// update product
module.exports.updateProduct = async (updateData) => {
  const { productId, ...fields } = updateData;
  
  // Remove undefined fields
  Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);

  const updatedProduct = await productModel.findOneAndUpdate(
    { _id: productId },
    { $set: fields },
    { new: true },
  );

  if (!updatedProduct) {
    throw new Error("Product not Found");
  }

  return updatedProduct;
};

// delete product
module.exports.deleteProduct = async (id) => {
  return await productModel.findOneAndDelete({ _id: id });
};
