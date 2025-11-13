


## 📌 **Overview**

This project implements a fully client-side **Intelligent Registration System** along with a complete **Selenium Automation Suite**.
It fulfills every requirement of **Section A – Option 2** of the Frugal Testing SE assignment.

The system is built using:

* **HTML5**
* **CSS3 (Responsive UI)**
* **JavaScript (Client-side validation + dynamic logic)**
* **Python Selenium (Automation)**

---

## 🚀 **Features**

### **1. Registration Form (Front-End)**

* Responsive, modern UI (dark theme)
* Smooth input interactions & error highlighting
* Inline error messages for each field
* Real-time password strength meter
* Country → State → City dynamic dropdown logic
* Disposable email domain blocking
* Phone number prefix validation based on selected country
* Submit button disabled until all validations are satisfied
* Success & error alerts

---

### **2. Client-Side Validations**

Implemented as required:

* Required fields (First Name, Last Name, Email, Phone, Gender, Terms)
* Email formatting + disposable domain filter
* Password strength categories (Very Weak → Very Strong)
* Password & confirm-password matching
* Submit locked until form becomes valid

---

### **3. Selenium Automation**

Automates all test flows:

#### ✔ **Flow A — Negative Test**

* Leave Last Name blank
* Validate error message
* Validate error highlighting
* Capture `error-state.png`

#### ✔ **Flow B — Positive Test**

* Fill complete valid form
* Validate success message
* Capture `success-state.png`

#### ✔ **Flow C — Logic Validation**

* Country → States update
* States → Cities update
* Password mismatch prevents submission
* Capture `logic-validation.png`

Screenshots are automatically saved inside the **/screenshots/** folder.

---

## 📁 **Project Structure**

```
/
│── index.html
│── style.css
│── script.js
│── selenium_test.py
│── README.md
│── screenshots/
│     ├── error-state.png
│     ├── success-state.png
│     └── logic-validation.png
```

---

## 🧪 **How to Run the Project**

### **1. Launch Local Server**

Inside project folder:

```bash
python -m http.server 8000
```

Open:

```
http://localhost:8000/index.html
```

---

## 🧪 **How to Run Selenium Automation**

### **Install dependencies**

```bash
pip install selenium webdriver-manager
```

### **Run automation**

```bash
python selenium_test.py
```





---

## 📦 **Technologies Used**

| Layer           | Technology                  |
| --------------- | --------------------------- |
| UI              | HTML, CSS                   |
| Logic           | JavaScript                  |
| Validation      | Regex + custom JS logic     |
| Automation      | Selenium WebDriver (Python) |
| Browser         | Chrome                      |
| Package Manager | webdriver-manager           |

---

## 🎯 **Purpose**

This repository demonstrates:

* UI development
* Frontend validation logic
* Web automation scripting
* End-to-end test scenario execution


---

## 📜 **Author**

**Anurag Singh**


