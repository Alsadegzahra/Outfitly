
# Outfitly Frontend Testing Guide

This guide explains how to test the Outfitly frontend, which is built with React. Follow these instructions to set up and run your tests.

---

## **Backend Folder Structure**
```
frontend/ 
├── build/ # Production build output (auto-generated) 
├── node_modules/ # Frontend dependencies (auto-generated) 
├── public/ # Static public assets 
├── src/ 
│ ├── tests/ # Test files (e.g., Button.test.jsx, Home.test.jsx) 
│ ├── components/ # Reusable UI components 
│ ├── pages/ # Page-level components 
│ ├── index.js # Application entry point 
│ ├── App.jsx # Main App component 
│ └── ...other files... 
├── firebase.js # Firebase configuration (if used) 
├── config.js # Project configuration 
├── package.json # Project dependencies & scripts 
├── package-lock.json # Auto-generated dependency lock file 
├── setupTests.js # Global test setup (e.g. React Testing Library config) 
└── vitest.config.js # Vitest configuration file
```

---

## **1. Install Dependencies**
Before running tests, install all required packages:

```sh
cd backend
npm install --save-dev vitest
```

---

## **2. Running Tests**
We use **vitest** for frontend testing.

#### 🔹 Run all tests:
```sh
npm run test
```

#### 🔹 Run a specific test:
```sh
npx vitest run src/__tests__/Home.test.jsx
```

#### 🔹 Watch mode (continuous testing):
```sh
npx vitest --watch
```
---
