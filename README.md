# 🏥 MediCare Hospital Management System (HMS)

A comprehensive, full-stack Hospital Management System designed to streamline hospital operations, patient records, appointments, laboratory tests, pharmacy inventory, billing, and staff management with role-based access control (RBAC).

---

## 🚀 Key Features

* **Multi-Role Portal System:** Secure authentication and customized dashboards for Admin, Doctors, Nurses, Receptionists, Pharmacists, Accountants, and Lab Technicians.
* **Patient Record Management:** Register patients, track medical histories, and manage hospital visits.
* **Appointment Scheduling:** Book, reschedule, track, or cancel patient appointments efficiently.
* **Laboratory Management:** Request diagnostic tests, collect samples, input lab results, and generate printable medical reports.
* **Pharmacy & Inventory:** Monitor medicine stock levels, expiry alerts, and prescription processing.
* **Staff Attendance & Directory:** Track employee records, attendance status, and department assignments.
* **Billing & Financial Reports:** Manage hospital revenue, invoices, and statistical analytics.

---

## 🛠️ Tech Stack

### **Frontend:**
* **React.js** (with Vite)
* **Tailwind CSS** (for modern, responsive UI styling)
* **React Router DOM** (for client-side routing & protected routes)
* **Axios** (for HTTP API requests)

### **Backend:**
* **Node.js & Express.js** (RESTful API architecture)
* **MongoDB & Mongoose** (NoSQL database for secure data persistence)
* **JWT (JSON Web Tokens)** (for secure authentication & authorization)
* **Bcrypt.js** (for password hashing)

---

## 📂 Project Structure

```text
medicare-hms/
├── backend/
│   ├── controllers/   # Request logic & business handlers
│   ├── models/        # Mongoose database schemas
│   ├── routes/        # API route endpoints
│   ├── middleware/    # Auth & role verification middleware
│   └── server.js      # Express application entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components & dashboards
    │   ├── pages/       # Specific page views (e.g., Register Staff)
    │   ├── App.jsx      # Main routing configuration
    │   └── main.js      # React DOM entry point
    └── package.json