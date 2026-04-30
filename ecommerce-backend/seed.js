const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.model');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Read sampleProducts from frontend
const sampleProductsFile = fs.readFileSync(path.join(__dirname, '../ecommerce-frontend/src/data/sampleProducts.js'), 'utf-8');

// Use regex or eval to extract the array, or just copy it into the seed file.
// Let's just require it if we convert it to JSON or we can just parse it manually.
// Actually, it's safer to just define it here or execute it in a clean context.
const extractArray = () => {
    try {
        const code = sampleProductsFile.replace('export const sampleProducts = ', 'module.exports = ');
        const tempPath = path.join(__dirname, 'tempSample.js');
        fs.writeFileSync(tempPath, code);
        const products = require('./tempSample.js');
        fs.unlinkSync(tempPath);
        return products;
    } catch(e) {
        console.error(e);
        return [];
    }
}

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');

        await Product.deleteMany({});
        console.log('Old products removed');

        const products = extractArray();
        
        const productsToInsert = products.map(p => ({
            name: p.name,
            description: p.description,
            stock: p.stock,
            price: p.price,
            discount: 0,
            isNewproduct: true,
            sku: 'SKU-' + p._id + '-' + Date.now(),
            images: [p.image],
            brand: 'Generic',
            category: p.category
        }));

        await Product.insertMany(productsToInsert);
        console.log(`Successfully seeded ${productsToInsert.length} products`);

        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

seedDatabase();
