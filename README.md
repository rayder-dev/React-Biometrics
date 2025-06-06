# React Biometrics

A modern biometric authentication system built with **WebAuthn**, **React + Vite**, **Tailwind CSS**, and **Shadcn**.

## 🔗 Live Demo

[React Biometrics](https://react-biometrics-ray.vercel.app/)

## 🚀 Features

- WebAuthn-based biometric authentication
- React.js front-end powered by Vite
- Express.js backend for API handling
- Tailwind CSS for styling
- UI components with Shadcn
- Fullstack mono-repo setup with client and server

## 🛠 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rayder-dev/React-Biometrics.git
cd react-biometrics
```

### 2️⃣ Setup Environment Variables

Create a .env file in client directory:
```bash
VITE_REACT_APP_BACKEND_BASEURL=http://localhost:3001
```

Create a .env file in server directory:
```bash
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 3️⃣ Run Frontend

```bash
cd client
npm install
npm run dev
```

### 4️⃣ Run Backend

```bash
cd server
npm install
npm run dev
```

📜 Technologies Used

WebAuthn – Secure biometric authentication

React + Vite – Fast front-end development

Express – Lightweight and flexible Node.js backend

Tailwind CSS – Utility-first styling

Shadcn – UI component library

✨ Contribution
Feel free to open an issue or submit a pull request!

📄 License
MIT License
