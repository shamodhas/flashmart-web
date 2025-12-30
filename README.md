# 🛍️ FlashMart Pro - Web Client

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)

The modern, responsive frontend for the FlashMart E-commerce system. Built with **React 18** and **TypeScript**, featuring a secure Admin Dashboard and real-time inventory updates.

## ✨ Features
* **Role-Based UI:** The interface changes dynamically based on user role (`Admin` sees management tools, `Customer` sees buy buttons).
* **JWT Management:** Automatic token storage, attachment, and session handling.
* **Protected Routes:** Higher-order logic prevents unauthorized access to admin features.
* **Real-time State:** Product stock updates instantly across the UI after transactions.

## 🛠 Tech Stack
* **Core:** React 18, TypeScript
* **Build Tool:** Vite
* **HTTP Client:** Axios (with Interceptors)
* **Styling:** CSS Modules / Custom Responsive CSS

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 18+
* The Backend API running on port `8080`

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Running the App

```bash
# Start development server
npm run dev
```

Open http://localhost:5173 to view it in the browser.

## 📸 Usage Guide

1. **Guest Mode:** View products.
2. **Customer Mode:** Register/Login to purchase items.
3. **Admin Mode:** Login as Admin to add/delete products and manage inventory.

---

*Developed by [Shamodha Sahan](https://github.com/shamodhas)*
