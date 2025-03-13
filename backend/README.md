
# Outfitly Backend Testing Guide

This guide explains how to test the Outfitly backend, which runs on **Express.js** and is deployed using **Firebase Functions**. 

---

## **Backend Folder Structure**
```
backend/
│── functions/               # Firebase functions directory
│   ├── .env                 # Environment variables (ignored in Git)
│── node_modules/            # Backend dependencies (auto-generated)
│── routes/                  # API route handlers
│   ├── clothingRoutes.js    # Routes for clothing management
│   ├── outfitRoutes.js      # Routes for outfits
│   ├── searchRoutes.js      # Routes for searching
│
│── tests/                   # Backend API tests
│   ├── clothingRoutes.test.js   # Tests for clothing API
│   ├── outfitRoutes.test.js     # Tests for outfit API
│   ├── sample.test.js           # Sample test setup
│
│── firebase.js              # Firebase Admin SDK setup
│── index.js                 # Express API setup & Firebase integration
│── package.json             # Backend dependencies & scripts
│── package-lock.json        # Auto-generated dependency lock file
│── serviceAccountKey.json   # Firebase service credentials (not included in repo)
│── fake-cred.json           # Fake credentials for testing
│── .gitignore               # Files to ignore in version control
```

---

## **1. Install Dependencies**
Before running tests, install all required packages:

```sh
cd backend
npm install --save-dev jest supertest firebase-functions-test
```

---

## **2. Running API Tests**
We use **Jest + Supertest** for backend API testing.

#### 🔹 Run all tests:
```sh
npm test
```

#### 🔹 Run a specific test:
```sh
npm test -- tests/clothingRoutes.test.js
```

#### 🔹 Watch mode (continuous testing):
```sh
npm test -- --watch
```
---
