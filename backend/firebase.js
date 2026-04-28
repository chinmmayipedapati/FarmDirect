require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// To connect to Firebase, the user MUST download their serviceAccountKey.json 
// from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
// and place it in the backend folder.
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

let db;

try {
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log('Connected to Firebase Firestore.');
    } else {
        console.warn('⚠️ Firebase serviceAccountKey.json not found! Using a temporary mock memory db until you provide it.');
        // Fallback for demonstration if key isn't provided yet
        db = { isMock: true };
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

module.exports = db;
