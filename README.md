# 🌱 FoodBridge v3 — Fully Functional, Interconnected Platform

## Quick Start
```bash
npm install
npm start
```
Open http://localhost:3000

---

## ✅ How It Works (Zero Mock Data)

### Step 1 — Register (each person separately)
Go to the platform and register accounts for each role:

| Role | What they do |
|------|-------------|
| **Food Donor** | List real surplus food donations |
| **Recipient Organization** | Browse & request available donations |
| **Admin** | Approve/reject requests, see all data |
| **Data Analyst** | View live analytics, write reports |

### Step 2 — Donor lists food
- Login as Food Donor → "List Donation"
- Fill in food name, quantity, expiry, location
- It appears instantly in "Available Food" for recipients

### Step 3 — Recipient requests
- Login as Recipient Org → "Available Food"
- Click "Request This Food" on any listing
- Set need-by date, submit
- Donor's listing status changes to "Requested"
- Admin sees it in "All Requests" as Pending

### Step 4 — Admin approves
- Login as Admin → "All Requests"
- Click "Approve" → status becomes "In Transit"
- Click "Reject" → donation becomes available again

### Step 5 — Recipient confirms delivery
- Login as Recipient → "My Requests"
- Click "Confirm Delivery" when food arrives
- Status → "Delivered"

### Step 6 — Analyst tracks it all
- Login as Data Analyst → "Analytics"
- All charts update in real time based on actual activity
- Create reports with live platform data shown for reference

---

## 🔗 Interconnection Map
```
Donor lists food
  → Appears in Recipient's "Available Food"
  → Appears in Admin's "All Donations"
  → Analyst sees it in Analytics charts

Recipient requests food
  → Donation status → "Requested"
  → Admin sees pending request with red badge
  → Notification generated for all

Admin approves
  → Donation status → "In Transit"
  → Recipient sees "Approved" in My Requests
  → "Confirm Delivery" button appears

Recipient confirms delivery
  → Donation status → "Delivered"
  → Analytics: delivery count increases
  → Kg delivered counter updates
```

---

## 📱 Pages Per Role

**Food Donor**: Dashboard · List Donation · My Donations
**Recipient Org**: Dashboard · Available Food · My Requests  
**Data Analyst**: Dashboard · Analytics · Reports
**Admin**: Dashboard · All Donations · All Requests · Users · Analytics
