# Outfitly

Outfitly is a digital closet and outfit management web app that helps users organize their wardrobe, log outfits, and track their outfit history. The app uses **React** for the frontend, **Node.js** with **Express** for the backend, and **Firebase** for authentication, Firestore database, and cloud storage.

## Project Structure
The project follows a modular structure for maintainability and scalability:

```
/Outfitly
│── backend/
│   ├── routes/              # API routes for clothing, outfits, and search
│   │   ├── clothingRoutes.js 
│   │   ├── outfitRoutes.js   
│   │   ├── searchRoutes.js   
│   ├── firebase.js          # Firebase Admin SDK setup
│   ├── index.js             # Express server configuration
│   ├── package.json         # Backend dependencies
│
│── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Buttons, etc.)
│   │   ├── pages/           # Application pages (Home, Closet, AddClothing, etc.)
│   │   ├── firebase.js      # Firebase client-side configuration
│   ├── package.json         # Frontend dependencies
│   ├── styles.css           # Global styles
│
│── README.md                # Project documentation
│── .gitignore               # Git ignored files and folders
```

## How to Run the Application Locally

### Prerequisites
Ensure you have the following installed:
- **Node.js v18 or higher**
- **NPM v8 or higher**
- **Firebase CLI (optional, for deployment)**

### 1. Clone the Repository
```bash
cd YOUR_PROJECTS_FOLDER

git clone https://github.com/yourusername/outfitly.git
cd outfitly
```

### 2. Backend Setup
```bash
cd backend
npm install
```
#### Set Up Firebase Admin SDK
1. Go to Firebase Console → Project Settings → Service Accounts.
2. Generate a private key and save it as `serviceAccountKey.json` in `/backend`.
3. Create a `.env` file in `/backend` with:
   ```env
   PORT=5000
   ```
4. Start the backend:
```bash
npx nodemon index.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Open the App
- Navigate to `http://localhost:3000` in your browser.

## Available Features
- Closet Management: Add, edit, and delete clothing items.
- Outfit Logging: Track and save outfits.
- Search & Filter: Find outfits based on category, color, or name.
- Authentication: Sign up, log in, and log out using Firebase authentication.

## Run Tests
?

## Deployment
?

## Contributors
- **Zahra Alsadeg** (Lead Developer)
- **Mentor:** ?


