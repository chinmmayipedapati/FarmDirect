const express = require('express');
const cors = require('cors');
const db = require('./firebase'); // Require our new firebase wrapper instead

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FarmDirect API (Firebase Enabled)' });
});

// Helper for Mock DB fallback
const handleMock = (res, data = []) => {
    if (db.isMock) {
        return res.json(data);
    }
    return false;
};

// Get all users
app.get('/api/users', async (req, res) => {
    if (handleMock(res, [{ id: 'mock', name: 'Please add serviceAccountKey.json' }])) return;

    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get user by phone (simulated login)
app.post('/api/login', async (req, res) => {
    const { phone } = req.body;
    if (handleMock(res, { id: 'mock', role: 'Farmer', name: 'Mock User' })) return;

    try {
        const snapshot = await db.collection('users').where('phone', '==', phone).get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userDoc = snapshot.docs[0];
        res.json({ id: userDoc.id, ...userDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    if (handleMock(res, [{ id: 'mock', name: 'Mock Tomatoes', price: 40 }])) return;

    try {
        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add a product (Farmer)
app.post('/api/products', async (req, res) => {
    const { farmerId, name, category, price, quantity, unit, imageUrl } = req.body;
    if (handleMock(res, { id: 'mock-id' })) return;

    try {
        const productRef = await db.collection('products').add({
            farmerId,
            name,
            category,
            price,
            quantity,
            unit,
            imageUrl: imageUrl || '/images/default.jpg',
            createdAt: new Date().toISOString()
        });
        res.json({ id: productRef.id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (db.isMock) {
         console.log("WARNING: Running in MOCK mode. Firebase 'serviceAccountKey.json' is missing!");
    }
});
