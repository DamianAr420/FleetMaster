# FleetMaster – System Zarządzania Flotą

FleetMaster to webowa aplikacja umożliwiająca zarządzanie flotą pojazdów oraz pracą kierowców. System oferuje osobne panele dla administratora i kierowcy, a także funkcje ułatwiające obsługę pojazdów, raportowanie usterek oraz prowadzenie dziennika tras.

---

## 📸 Zrzuty ekranu

### 🔐 Logowanie
![Login](ss/login.png)

### 🧭 Dashboard
**Admin:**
![Dashboard](ss/dashboard.png)

**Kierowca:**
![Driver Dashboard](ss/driver-dashboard.png)

### 🚗 Zarządzanie pojazdami (admin)
![Vehicles](ss/vehicles.png)
**Widok mobilny:**
![Vehicles Mobile](ss/vehicles-mobile.png)

### 👥 Zarządzanie kierowcami (admin)
![Drivers](ss/drivers.png)
**Widok mobilny:**
![Drivers Mobile](ss/drivers-mobile.png)

### 🛠️ Usterki (admin i kierowca)
![Issues](ss/issues.png)
**Widok mobilny:**
![Issues Mobile](ss/issues-mobile.png)

**Zgłaszanie usterki (kierowca):**
![Report Issue](ss/report-issue.png)

**Widok mobilny:**
![Report Issue Mobile](ss/report-issue-mobile.png)

### 📘 Dziennik tras (kierowca)
![Logs](ss/logs.png)
**Widok mobilny:**
![Logs Mobile](ss/logs-mobile.png)

### 📱 Nawigacja mobilna
![Navbar Mobile](ss/navbar-mobile.png)
![Navbar Close](ss/navbar-close.png)

---

## ✨ Funkcje

### 🔑 Logowanie
- brak rejestracji — konta kierowców tworzy administrator
- konto administratora tworzone wyłącznie w bazie danych

### 👨‍💼 Funkcje administratora
- dodawanie pojazdów:  
  *typ, marka, model, numer rejestracyjny*
- dodawanie kierowców:  
  *imię, nazwisko, numer licencji, login i hasło*
- przegląd wszystkich usterek + możliwość dodawania nowych

### 👨‍🔧 Funkcje kierowcy
- zgłaszanie usterek przypisanego pojazdu
- dziennik tras:  
  *skąd → dokąd, dystans, czas*

---

## 🛠️ Technologie

### Frontend
- **Vue 3**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Axios**

### Backend
- **.NET 8 (ASP.NET Core Web API)**
- **Entity Framework Core**
- **JWT Authentication**

### Baza danych
- **SQL Server**

---


---

# 🇺🇸
# FleetMaster – Fleet Management System

FleetMaster is a web application designed to manage vehicle fleets and drivers.  
It provides separate dashboards for admins and drivers, enabling vehicle handling, issue reporting, and route logging.

---

## 📸 Screenshots

### 🔐 Login
![Login](ss/login.png)

### 🧭 Dashboards
**Admin:**
![Dashboard](ss/dashboard.png)

**Driver:**
![Driver Dashboard](ss/driver-dashboard.png)

### 🚗 Vehicle Management (Admin)
![Vehicles](ss/vehicles.png)
**Mobile view:**
![Vehicles Mobile](ss/vehicles-mobile.png)

### 👥 Driver Management (Admin)
![Drivers](ss/drivers.png)
**Mobile view:**
![Drivers Mobile](ss/drivers-mobile.png)

### 🛠️ Issues (Admin & Driver)
![Issues](ss/issues.png)
**Mobile view:**
![Issues Mobile](ss/issues-mobile.png)

**Report Issue (Driver):**
![Report Issue](ss/report-issue.png)

**Mobile view:**
![Report Issue Mobile](ss/report-issue-mobile.png)

### 📘 Route Log (Driver)
![Logs](ss/logs.png)
**Mobile view:**
![Logs Mobile](ss/logs-mobile.png)

### 📱 Mobile Navigation
![Navbar Mobile](ss/navbar-mobile.png)
![Navbar Close](ss/navbar-close.png)

---

## ✨ Features

### 🔑 Login
- no user self-registration — drivers are added by the admin
- admin account must be created directly in the database

### 👨‍💼 Admin features
- add vehicles:  
  *type, brand, model, registration number*
- add drivers:  
  *first name, last name, license number, login & password*
- view all issues + create new ones

### 👨‍🔧 Driver features
- report issues for the assigned vehicle
- route log:  
  *from → to, distance, duration*

---

## 🛠️ Tech Stack

### Frontend
- **Vue 3**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Axios**

### Backend
- **.NET 8 (ASP.NET Core Web API)**
- **Entity Framework Core**
- **JWT Authentication**

### Database
- **SQL Server**

---
