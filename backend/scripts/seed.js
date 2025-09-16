const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Idea = require('../models/Idea');

dotenv.config({ path: './.env' }); // Make sure the path to your .env is correct

// --- MOCK DATA TO BE INSERTED ---

const sampleArtisans = [
    { name: "Ramesh Kumar", email: "ramesh.k@example.com", password: "password123", role: "artisan" },
    { name: "Fatima Begum", email: "fatima.b@example.com", password: "password123", role: "artisan" },
    { name: "Sita Devi", email: "sita.d@example.com", password: "password123", role: "artisan" },
    { name: "Mani Selvam", email: "mani.s@example.com", password: "password123", role: "artisan" },
    { name: "Aisha Khan", email: "aisha.k@example.com", password: "password123", role: "artisan" },
    { name: "Irfan Husain", email: "irfan.h@example.com", password: "password123", role: "artisan" },
    { name: "Jivya Soma Mashe", email: "jivya.sm@example.com", password: "password123", role: "artisan" },
    { name: "Anusha Reddy", email: "anusha.r@example.com", password: "password123", role: "artisan" },
    { name: "Priya S.", email: "priya.s@example.com", password: "password123", role: "artisan" },
    { name: "Rohan D.", email: "rohan.d@example.com", password: "password123", role: "artisan" },
    { name: "Anjali Varma", email: "anjali.v@example.com", password: "password123", role: "artisan" },
];

const sampleProducts = [
  { name: "Jaipur Blue Pottery Vase", artisanName: "Ramesh Kumar", price: 45.0, category: "Pottery", images: [{url: "/3.png", alt: "Jaipur Blue Pottery Vase"}], description: "A stunning hand-painted vase.", status: 'active' },
  { name: "Handwoven Pashmina Shawl", artisanName: "Fatima Begum", price: 120.0, category: "Textiles", images: [{url: "/4.png", alt: "Handwoven Pashmina Shawl"}], description: "Luxurious and warm.", status: 'active' },
  { name: "Madhubani 'Tree of Life'", artisanName: "Sita Devi", price: 85.0, category: "Painting", images: [{url: "/5.png", alt: "Madhubani 'Tree of Life'"}], description: "Vibrant Indian folk art.", status: 'active' },
  { name: "Terracotta Horse Statue", artisanName: "Mani Selvam", price: 60.0, category: "Sculpture", images: [{url: "/6.png", alt: "Terracotta Horse Statue"}], description: "Rustic and handcrafted.", status: 'active' },
  { name: "Chikankari Kurta", artisanName: "Aisha Khan", price: 75.0, category: "Textiles", images: [{url: "/7.png", alt: "Chikankari Kurta"}], description: "Elegant hand-embroidery.", status: 'active' },
  { name: "Bidriware Silver Coasters", artisanName: "Irfan Husain", price: 95.0, category: "Metalwork", images: [{url: "/8.png", alt: "Bidriware Silver Coasters"}], description: "Exquisite silver inlay craft.", status: 'active' },
  { name: "Warli Village Life Canvas", artisanName: "Jivya Soma Mashe", price: 110.0, category: "Painting", images: [{url: "/9.png", alt: "Warli Village Life Canvas"}], description: "Minimalist tribal art.", status: 'active' },
  { name: "Kondapalli Wooden Toys", artisanName: "Anusha Reddy", price: 35.0, category: "Woodwork", images: [{url: "/10.png", alt: "Kondapalli Wooden Toys"}], description: "Eco-friendly and charming.", status: 'active' },
];

const sampleIdeas = [
  { title: "Eco-Dyed Yoga Mats", artisanName: "Priya S.", description: "Handwoven mats using natural dyes from marigold and indigo. Would you buy this?", images: [{url: "/11.png", alt: "Eco-Dyed Yoga Mats"}], category: 'Textiles', status: 'published' },
  { title: "Modern Warli Art Lamps", artisanName: "Rohan D.", description: "Minimalist lamps featuring traditional Warli art on recycled paper shades.", images: [{url: "/12.png", alt: "Modern Warli Art Lamps"}], category: 'Other', status: 'published' },
  { title: "3D Printed Terracotta Jewelry", artisanName: "Anjali Varma", description: "Combining modern 3D printing with classic terracotta finishing for unique jewelry designs.", images: [{url: "/13.png", alt: "3D Printed Terracotta Jewelry"}], category: 'Jewelry', status: 'published' },
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    await connectDB();

    try {
        console.log('--- Clearing existing data ---');
        await Product.deleteMany({});
        await Idea.deleteMany({});
        // Be careful with deleting users in a real environment!
        // Here, we only delete the specific sample artisans.
        await User.deleteMany({ email: { $in: sampleArtisans.map(a => a.email) } });

        console.log('--- Creating sample artisans ---');
        const createdUsers = await User.insertMany(sampleArtisans);
        const userMap = new Map(createdUsers.map(user => [user.name, user._id]));
        
        console.log('--- Creating sample products ---');
        const productsToCreate = sampleProducts.map(p => ({
            ...p,
            artisan: userMap.get(p.artisanName)
        }));
        await Product.insertMany(productsToCreate);

        console.log('--- Creating sample ideas ---');
        const ideasToCreate = sampleIdeas.map(i => ({
            ...i,
            artisan: userMap.get(i.artisanName)
        }));
        await Idea.insertMany(ideasToCreate);

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();