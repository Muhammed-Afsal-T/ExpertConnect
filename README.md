# ExpertConnect 🚀

ExpertConnect is a Modern and Feature-rich **Progressive Web Application (PWA)** built on the **MERN stack**. It is designed to bridge the gap between students/learners and industry experts through structured consultation, real-time communication, and secure payments.

[ExpertConnect](https://expertconnect-here.vercel.app) 

## Key Features

* **Verified Professional Accounts**: Experts undergo a verification process by the Admin.
* **Real-time Consultation**: Seamless real-time chat using **Socket.io**.
* **Video Conferencing**: Integrated high-quality video sessions via **Jitsi Meet API**.
* **Secure Payment Gateway**: Hassle-free transactions through **Razorpay**.
* **PWA Support**: Installable on mobile devices with offline caching for a native-app experience.
* **3D Interactive Landing Page**: Built using **Three.js** for a premium user experience.
* **Automated Reminders**: Email notifications via **Nodemailer** for upcoming sessions.

---

## System Architecture

The platform follows a **Layered Architecture**:

1.  **Client Layer (Frontend)**: React.js & Vite.
2.  **Application Layer (Backend)**: Node.js & Express.js with a Real-time Engine (Socket.io).
3.  **Data Layer**: MongoDB Atlas for cloud database and Cloudinary for media storage.
4.  **External APIs**: Razorpay (Payments), Jitsi Meet (Video), and Nodemailer (Emails).

---

##  Tech Stack

### **Frontend**
- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **State/API**: Axios, React Icons
- **Animation**: Three.js

### **Backend**
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT & bcrypt
- **Real-time**: Socket.io

---

## Getting Started

### **Prerequisites**
- Node.js installed
- MongoDB Atlas account
- Razorpay API keys

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Muhammed-Afsal-T/ExpertConnect.git
   cd ExpertConnect
   ```
2.**Backend Setup**
```bash
cd server
npm install
```
Create a .env file in the server folder and add:
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```
```bash
npm start
```
3.**Frontend Setup**
```bash
cd client
npm install
```
```bash
npm run dev
```
## Author

**Muhammed Afsal T**\
**Student at GPTC Meppadi, Wayanad**\
**https://www.linkedin.com/in/muhammed-afsal-t**