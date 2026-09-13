# FarmDirect — Marketplace API Prototype

FarmDirect explores direct connections between farmers and customers. This repository currently contains a **Node.js and Express backend** for user lookup and product listings, with Firebase Firestore integration and a mock demo mode.

## Current implementation

- A welcome endpoint and routes for users, simulated login, and products.
- Firestore access through Firebase Admin.
- Fixed mock responses when no Firebase service-account file is present.
- An earlier SQLite implementation in `backend/database.js`; the current server imports `firebase.js` instead.

The `frontend` entry is a Git submodule pointer, but this repository has no `.gitmodules` mapping. A normal clone does not include usable frontend source, so the instructions below cover the backend.

## Run the backend locally

Requirements: Node.js and npm compatible with the dependencies in `backend/package-lock.json`. Native build tools may be needed for the SQLite dependency.

```bash
git clone https://github.com/chinmmayipedapati/FarmDirect.git
cd FarmDirect/backend
npm ci
node server.js
```

The default port is **5000**. The server also reads the `PORT` environment variable. There is currently no `npm start` script; launch `server.js` directly.

Without `backend/serviceAccountKey.json`, the server starts in mock mode. Mock product creation returns a demo ID and does not persist a product.

## Try the demo

With the server running, open <http://localhost:5000/> or use:

```bash
curl http://localhost:5000/api/products
```

In mock mode, the products route returns a fixed sample product.

## API routes

| Method | Route | Current behavior |
| --- | --- | --- |
| GET | `/` | Welcome message |
| GET | `/api/users` | List users or return a mock response |
| POST | `/api/login` | Look up a user by phone; simulated login |
| GET | `/api/products` | List products or return a mock response |
| POST | `/api/products` | Add a product in Firestore or return a mock ID |

Product creation accepts `farmerId`, `name`, `category`, `price`, `quantity`, `unit`, and an optional `imageUrl`.

## Firebase configuration

The current wrapper reads a local service-account file from `backend/serviceAccountKey.json` and uses the Firestore `users` and `products` collections.

Use a dedicated development Firebase project and keep its service-account key outside version control. This repository currently has no root `.gitignore`; add an appropriate ignore rule before placing any credential file in the working tree.

## Development status

This is a learning prototype. The current routes do not enforce authentication or authorization, and phone lookup is not identity verification. Use local test data until those controls and input validation are implemented.

The repository also tracks `backend/node_modules` and a SQLite database file. Dependency cleanup and restoring the frontend source are useful next improvements.

The package's `npm test` command is a placeholder that exits with an error; an automated test suite has not been configured.

