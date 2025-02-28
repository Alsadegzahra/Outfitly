# Outfitly - Digital Closet & Outfit Manager

## 📌 Project Overview
Outfitly is a **full-stack web application** that helps users **manage their digital closet**, log outfits, and track their outfit history. Built using **React (frontend)** and **Node.js with Firebase Admin SDK (backend)**, Outfitly allows users to **add clothing, organize outfits, and search their wardrobe** efficiently.

## 🚀 Features
### **Frontend (React)**
- 🏠 **Home Page**: Displays recent outfits and most worn clothing items.
- 👕 **Closet**: View, edit, and delete clothing items.
- ➕ **Add Clothing**: Upload new clothing items with images.
- 📜 **Outfit History**: Track logged outfits with images and timestamps.
- 🔍 **Search**: Filter clothing items and outfits based on name, category, or color.
- 🔐 **Authentication**: User signup/login using email-password or Google Sign-In.

### **Backend (Node.js & Firebase Admin SDK)**
- 🔥 **Firestore Database**: Stores clothing items, outfits, and user data.
- 🗂 **Firebase Storage**: Handles image uploads for clothing items.
- 📡 **REST API**:
  - `POST /api/clothing` - Add clothing items
  - `GET /api/clothing` - Fetch all clothing items
  - `DELETE /api/clothing/:id` - Remove clothing items
  - `POST /api/outfits` - Log an outfit
  - `GET /api/outfits` - Fetch logged outfits
  - `DELETE /api/outfits/:id` - Remove outfits
  - `GET /api/search` - Search clothing & outfits
- 🛠 **Authentication & Security**: Uses Firebase Admin SDK for secure backend operations.

## 🛠️ Technologies Used
### **Frontend**
- React (with React Router & Framer Motion for animations)
- Firebase Authentication (Google Sign-In & Email-Password login)
- Tailwind CSS (for styling)

### **Backend**
- Node.js & Express (API handling)
- Firebase Admin SDK (Firestore & Storage management)
- Cors & dotenv (Environment setup)

## 📂 Project Structure
```
Outfitly/
│── backend/
│   ├── routes/
│   │   ├── clothingRoutes.js  # API routes for clothing
│   │   ├── outfitRoutes.js    # API routes for outfits
│   │   ├── searchRoutes.js    # API routes for searching
│   ├── firebase.js            # Firebase Admin SDK setup
│   ├── index.js               # Main backend server
│   ├── package.json           # Backend dependencies
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js       # Navigation bar
│   │   ├── pages/
│   │   │   ├── Home.js         # Home screen
│   │   │   ├── Closet.js       # Closet management
│   │   │   ├── AddClothing.js  # Add clothing page
│   │   │   ├── OutfitHistory.js # Outfit tracking
│   │   │   ├── Search.js       # Search function
│   │   ├── firebase.js         # Firebase client setup
│   ├── package.json            # Frontend dependencies
│
│── README.md                   # Project documentation
│── .env                         # Environment variables
```

## 🏁 Getting Started
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/outfitly.git
cd outfitly
```
### **2️⃣ Backend Setup**
```bash
cd backend
npm install
```
#### **Set Up Firebase Admin SDK**
1. Go to Firebase Console → Project Settings → Service Accounts.
2. Generate a private key and save it as `serviceAccountKey.json` in `/backend`.
3. Add a `.env` file in `/backend` with:
   ```env
   PORT=5000
   ````
4. Start the backend:
```bash
npx nodemon index.js
```

### **3️⃣ Frontend Setup**
```bash
cd frontend
npm install
npm start
```

## 🚀 Deployment
- **Frontend**: Can be deployed using **Vercel** or **Netlify**.
- **Backend**: Deploy using **Firebase Cloud Functions** or **Render**.

## 🤝 Contributors
- **Zahra Alsadeg** (Lead Developer)
- **Mentor:** [Your Instructor or TA]

## 📜 License
This project is **MIT licensed**.

---
🚀 **Happy styling with Outfitly!** 👗👕
