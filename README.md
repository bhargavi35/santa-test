# 🎁 **Secret Santa Game - Backend**

**Automated Secret Santa Assignment System for Employees**

## 📌 **Project Overview**

This is a **Node.js-based backend application** that automates the **Secret Santa assignment** process for employees. It reads employee details from a **CSV file**, assigns each employee a **Secret Child**, and generates a new CSV file with the assignments.

---

## 🚀 **Features**

✅ Accepts CSV input of employee details.  
✅ Ensures fair Secret Santa assignment (no self-assignment, no repeated assignments from last year).  
✅ Generates a new CSV file with the Secret Santa assignments.  
✅ Provides an API to download the generated file.  
✅ Handles file uploads via **Multer**.  
✅ Implements error handling for invalid inputs.

---

## 🛠 **Installation & Setup**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/bhargavi35/santa-test.git
cd secret-santa
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Run the Server**

```sh
node server.js
```

By default, the backend runs on `http://localhost:5000`

---

## 📂 **File Structure**

```
/secret-santa
│── server.js             # Main backend logic
│── output/               # Stores generated Secret Santa CSV files
│── uploads/              # Temporary file storage
│── package.json          # Dependencies and scripts
│── README.md             # Documentation
```

---

## 🎯 **API Endpoints**

### **1️⃣ Test API**

📌 **Check if the server is running**

```http
GET /
```

✅ **Response**: `"API is working! 🔥"`

---

### **2️⃣ Upload Employee CSV & Assign Secret Santa**

📌 **Assign Secret Santa & Generate CSV**

```http
POST /santa
```

🔹 **Request (Multipart Form Data)**

- `employees` (Required) - CSV file with employee details
- `previousAssignments` (Optional) - CSV file with last year's assignments

🔹 **Response**

- Returns the generated CSV file for download.

**Example cURL Request:**

```sh
curl -X POST -F "employees=@employees.csv" -F "previousAssignments=@previous.csv" http://localhost:5000/santa --output secret_santa_assignments.csv
```

---

## 📑 **CSV File Formats**

### **🎯 Employee Input CSV**

| Employee_Name | Employee_EmailID  |
| ------------- | ----------------- |
| John Doe      | john@example.com  |
| Alice Smith   | alice@example.com |

---

### **🎯 Output CSV (Secret Santa Assignments)**

| Employee_Name | Employee_EmailID | Secret_Child_Name | Secret_Child_EmailID |
| ------------- | ---------------- | ----------------- | -------------------- |
| John Doe      | john@example.com | Alice Smith       | alice@example.com    |

---

## 🏗 **Technology Stack**

🔹 **Backend:** Node.js (Express.js)  
🔹 **File Handling:** Multer  
🔹 **CSV Parsing & Writing:** csv-parser, fast-csv  
🔹 **Environment Variables:** dotenv

---

## ⚠️ **Error Handling**

✅ **Invalid file upload** → `400 Bad Request`  
✅ **No valid assignment found** → `500 Internal Server Error`

---

## 📌 **Next Steps**

🚀 Add a **frontend UI** for uploading files.  
📩 Send email notifications to assigned Secret Santa employees.  
📊 Implement a **dashboard** for tracking assignments.

---

## 📞 **Contact & Contributions**
👨‍💻 **Bhargavi Chella** – _Full Stack Developer_  
📩 Email: chellabhargavi2002@gmail.com  
📌 LinkedIn: [https://www.linkedin.com/in/bhargavichella/] 
📌 Portfolio: [https://bhargavi35-portfolio.vercel.app/]

