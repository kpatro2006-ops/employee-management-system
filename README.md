# 👥 Employee Management System (Mini Project)

A clean, basic, and easy-to-understand **MERN Stack (MongoDB, Express, React, Node.js)** Employee Management System built for academic / mini project demonstration.

---

## 🛠️ Tech Stack (Pure MERN)

- **Frontend**: React.js (Vite), CSS3, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs for password hashing

---

## ✨ Features

1. **🔐 Authentication & Login**:
   - Secure login portal with role validation.
   - Session persistence using JWT tokens.
2. **🛡️ Role-Based Access Control (RBAC)**:
   - **👑 Admin**: Full access to Add, Edit, and Delete employees.
   - **👤 Employee**: Read-only directory access (View profiles, search, and filter).
3. **📋 Employee CRUD Operations**:
   - Create, Read, Update, and Delete employee records.
   - Indian Rupee (₹ INR) salary representation.
4. **🔍 Search & Filter**:
   - Instant search by Name, Email, or Role.
   - Filter employees by Department.
5. **📊 Dashboard Stats**:
   - Real-time counters for Total Employees, Departments, and Average CTC.

---

## 🚀 How to Run the Project (Proper Way)

### Step 1: Install Dependencies
Open your terminal in the project root folder (`KRISHNA`):

```bash
# Install root orchestration tools
npm install

# Install both backend and frontend dependencies
npm run install-all
```

---

### Step 2: Start the Project

Run the following command to start both the Node backend and React frontend concurrently:

```bash
npm run dev
```

Once started:
- 🌐 **React Frontend**: [http://localhost:3000](http://localhost:3000)
- 🚀 **Node/Express Backend API**: [http://localhost:5000](http://localhost:5000)
- 💓 **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Alternative: Run in Separate Terminals

If you prefer running the backend and frontend in separate command windows:

**Terminal 1 (Backend)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

---

## 🔑 Demo Login Accounts

You can click any of the **Quick Demo Buttons** on the login page or type these credentials:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **👑 Admin** | `admin@company.com` | `Admin@123` | **Full Access** (Add, Edit, Delete) |
| **👤 Employee** | `aarav.sharma@example.com` | `Employee@123` | **Read-Only** (View, Search, Filter) |
| **👤 Employee** | `priya.patel@example.com` | `Employee@123` | **Read-Only** (View, Search, Filter) |

---

## 📁 Project Structure

```
KRISHNA/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & initial sample data
│   ├── controllers/
│   │   ├── authController.js     # Login & authentication logic
│   │   └── employeeController.js # CRUD API controllers
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & RBAC authorization
│   ├── models/
│   │   └── Employee.js           # Mongoose Employee schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes (/api/auth/login)
│   │   └── employeeRoutes.js     # Employee routes (/api/employees)
│   ├── .env                      # Database URI & port settings
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Main Express server entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx  # Form modal for Add / Edit
│   │   │   ├── EmployeeTable.jsx # Clean data table with search & filter
│   │   │   ├── LoginPage.jsx     # Login screen with quick demo accounts
│   │   │   └── Navbar.jsx        # Navigation bar with user profile & logout
│   │   ├── services/
│   │   │   └── api.js            # API fetch calls
│   │   ├── utils/
│   │   │   └── helpers.js        # Salary formatter (₹ INR) & initials
│   │   ├── App.jsx               # Main React application component
│   │   ├── index.css             # Simple clean stylesheet
│   │   └── main.jsx              # React entrypoint
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration with /api proxy
│
├── package.json                  # Root runner script (npm run dev)
└── README.md                     # Documentation
```
