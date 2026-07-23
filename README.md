# ⭐ RateNest - Store Rating Web Application

A full-stack web application that allows users to browse stores, submit ratings, and enables store owners and administrators to manage stores efficiently.

---

# 📌 Project Overview

RateNest is a role-based Store Rating Platform developed as part of the **Roxiler Systems Coding Challenge**.

The application provides three different dashboards:

- 👤 User
- 🏪 Store Owner
- 👑 Administrator

Users can browse stores, search stores, submit ratings, and update previously submitted ratings.

Store Owners can monitor their store performance through analytics and customer ratings.

Administrators can manage users, stores, and assign store owners.

---

# 🚀 Features

## 👤 User

- User Registration & Login
- JWT Authentication
- Browse Stores
- Search Stores
- Filter Stores by Category
- Sort Stores by Name & Rating
- Submit Rating (1–5)
- Update Existing Rating
- View Personal Ratings
- Profile Management

---

## 🏪 Store Owner

- Secure Login
- Dashboard Analytics
- View Store Information
- Average Rating
- Rating Distribution
- Recent Customer Ratings
- Profile Management

---

## 👑 Admin

- Dashboard
- Add/Edit/Delete Users
- Add/Edit/Delete Stores
- Assign Store Owners
- Search Users
- Search Stores
- Filter Users
- Filter Stores
- Role Management

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- CSS3

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

---

## Database

- MySQL

---

# 📂 Project Structure

```
Store-Rating-Web-App
│
├── Frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   └── App.jsx
│   │
│   └── package.json
│
├── Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── services
│   ├── database
│   ├── app.js
│   └── package.json
│
└── README.md
```

---

# 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication.

Role-based authorization is implemented for:

- Admin
- Store Owner
- User

---

# 👥 User Roles

## Admin

- Manage Users
- Manage Stores
- Assign Store Owners

---

## Store Owner

- View Store Analytics
- View Ratings
- View Store Details
- Update Profile

---

## User

- Browse Stores
- Submit Rating
- Update Rating
- Search & Filter Stores
- Manage Profile

---

# 📊 Dashboard Analytics

## Admin Dashboard

- Total Users
- Total Stores
- Total Store Owners

---

## Store Owner Dashboard

- Store Name
- Average Rating
- Total Ratings
- Rating Distribution
- Recent Ratings

---

## User Dashboard

- Total Stores
- Stores Rated
- Average Rating Given

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/Store-Rating-Web-App.git
```

---

## Backend

```bash
cd Backend
npm install
npm start
```

---

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

# 🗄 Database

Create a MySQL database.

Example:

```sql
CREATE DATABASE store_rating;
```

Import the SQL schema provided in the project.

---

# 🔑 Environment Variables

Create a `.env` file inside the Backend folder.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating

JWT_SECRET=your_secret_key
```

---

# 📷 Screenshots

### Admin Dashboard

<img width="1912" height="876" alt="Screenshot 2026-06-30 201630" src="https://github.com/user-attachments/assets/a06e93db-7fed-4549-8691-929f3195c8aa" />


### Store Owner Dashboard

<img width="1878" height="870" alt="image" src="https://github.com/user-attachments/assets/23c5c996-d060-464d-99ff-4ef0bb95a92a" />


### User Dashboard

<img width="1913" height="872" alt="image" src="https://github.com/user-attachments/assets/62c96f53-bd09-469d-a346-a768d8269ed3" />

### Browse Stores

<img width="1901" height="880" alt="image" src="https://github.com/user-attachments/assets/6b1ede78-8440-4df7-b620-eb74e2c74cd2" />


---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

---

## Admin

```
GET    /api/admin/dashboard
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

GET    /api/admin/stores
POST   /api/admin/stores
PUT    /api/admin/stores/:id
DELETE /api/admin/stores/:id

PUT    /api/admin/stores/:id/assign-owner
```

---

## Store Owner

```
GET /api/owner/dashboard
GET /api/owner/store
GET /api/owner/ratings
PUT /api/owner/profile
```

---

## User

```
GET /api/user/dashboard
GET /api/user/stores
GET /api/user/profile
PUT /api/user/profile

POST /api/user/rating
GET  /api/user/my-ratings
```

---

# 🎯 Future Improvements

- Email Verification
- Forgot Password
- Rating Comments
- Store Images
- Pagination
- Admin Reports
- Charts using Recharts
- Notifications

---

# 👨‍💻 Author

**Sakshi Sanjay Chavan**

Bachelor of Engineering (Computer Engineering)

GitHub:
https://github.com/Sakshi13-05

LinkedIn:
https://linkedin.com/in/sakshichavan-dev

---

# 📄 License

This project was developed as part of the **Roxiler Systems Coding Challenge** and is intended for educational and evaluation purposes.

