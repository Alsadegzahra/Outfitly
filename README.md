# Outfitly

Outfitly is a digital closet and outfit management web app that helps users organize their wardrobe, log outfits, and track their outfit history. The app uses **React** for the frontend, **Firebase Firestore** for the database, **Firebase Functions** for backend API, and **Firebase Authentication** for user login.

## Project Structure

The project follows a modular structure for maintainability and scalability:

```
/Outfitly
│── backend/               # Backend (Firebase Functions & Express API)
│   ├── index.js          # Main Express server & Firebase Functions
│   ├── routes/           # API routes
│   ├── firebase.js       # Firebase Admin SDK setup
│   ├── package.json      # Backend dependencies
│
│── frontend/             # Frontend (React)
│   ├── src/
│   │   ├── components/   # UI components (Navbar, Closet, etc.)
│   │   ├── pages/        # Application pages (Home, AddClothing, etc.)
│   │   ├── firebase.js   # Firebase client-side config
│   ├── public/           # Static files (index.html, manifest.json, etc.)
│   ├── package.json      # Frontend dependencies
│   ├── styles.css        # Global styles
│
│── .firebaserc           # Firebase project settings
│── firebase.json         # Firebase hosting & function settings
│── .gitignore            # Git ignored files and folders
│── README.md             # Project documentation
```

## How to Run the Application Locally

### Prerequisites

Ensure you have the following installed:

- **Node.js v18 or higher**
- **NPM v8 or higher**
- **Firebase CLI**

### 1. Clone the Repository

```sh
git clone https://github.com/Alsadegzahra/Outfitly.git
cd outfitly
```

### 2. Backend Setup (Firebase Functions & Express API)

```sh
cd backend
npm install
firebase emulators:start
```

### 3. Frontend Setup

```sh
cd frontend
npm install
npm start
```

### 4. Open the App

- Navigate to `http://localhost:3000` in your browser.

## Available Features

- **Closet Management**: Add, edit, and delete clothing items.
- **Outfit Logging**: Track and save outfits.
- **Search & Filter**: Find outfits based on category, color, or name.
- **Authentication**: Sign up, log in, and log out using Firebase authentication.

## Deployment

### 1. Deploy Frontend to Firebase Hosting

```sh
cd frontend
npm run build
firebase deploy
```

### 2. Deploy Backend (Firebase Functions)

```sh
cd backend
firebase deploy --only functions
```

### 3. Confirm Deployment

- **Frontend is live at:** [https://outfitly-dbd69.web.app](https://outfitly-dbd69.web.app)
- **Backend API is available at:** [https://us-central1-outfitly-dbd69.cloudfunctions.net/api](https://us-central1-outfitly-dbd69.cloudfunctions.net/api)

## Contributors

- **Zahra Alsadeg** (Lead Developer)
- **Mentor:** *[Add mentor’s name if applicable]*

---
