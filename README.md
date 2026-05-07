# FoodDesk: High-Speed Counter Operations System

FoodDesk is a professional, production-grade vendor kitchen management application built with **React Native** and **Expo**. It is designed specifically for high-volume food counters to manage live orders, menu availability, and pre-order logistics with extreme efficiency.

## 🚀 Key Features

### 1. Live Order Management (Kanban Board)
* **Real-time Tracking**: Monitor orders through three primary stages: *Incoming*, *Preparing*, and *Ready*.
* **SLA Monitoring**: Visual progress bars and breach indicators to ensure timely delivery.
* **Batch Actions**: Mark entire columns as "Preparing" or "Ready" to handle rush-hour volume.

### 2. Smart Menu & Inventory
* **Automated Stock Calculation**: Intelligent inventory tracking using the formula: `Remaining = 200 (Daily Capacity) - Ordered Today`.
* **Visual Stock Alerts**: Color-coded availability bars (Green, Amber, Yellow, Red) based on remaining quantity.
* **Rapid Toggles**: Quickly hide items from the menu or mark them as "Sold Out" instantly.

### 3. Pre-Order & Planning
* **Slot-based Breakdowns**: View future demand across 15-minute time slots (12:00, 12:15, etc.).
* **KOT Batching**: Group hundreds of individual orders into consolidated Kitchen Order Tickets for mass production.
* **Ingredient Lists**: Automatically generate raw material requirements based on pre-order volumes.

### 4. Operations & Settlements
* **Daily Reports**: Comprehensive overview of GMV, order volume, and performance metrics.
* **Settlement Tracking**: Manage payouts and financial history directly from the dashboard.
* **Scan & Verify**: QR/Token scanning for order pickup verification.

## 🛠 Tech Stack
* **Core**: React Native (Expo)
* **Language**: TypeScript
* **Navigation**: React Navigation (Bottom Tabs & Drawer)
* **Styling**: Centralized design system with custom `COLORS`, `SPACING`, and `TYPOGRAPHY` tokens.
* **Icons**: Expo Vector Icons (MaterialIcons)

## 📁 Project Structure
```text
Frontend/
├── src/
│   ├── components/       # Reusable UI components (Live cards, Menu cards, etc.)
│   ├── constants/        # Design system tokens (Colors, Typography)
│   ├── navigation/       # App routing and layout wrappers
│   ├── screens/          # Core modules (Live, Menu, Pre-Orders, etc.)
│   └── services/         # API and authentication logic
└── assets/               # Local images and branding assets
```

## 🏁 Getting Started

### Prerequisites
* Node.js (v16+)
* Expo Go app on your mobile device (to test)

### Installation
1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npx expo start
   ```

## 🎨 Design Philosophy
FoodDesk follows a **"Data-First"** design philosophy. Interfaces are designed to be high-contrast and dense with information, ensuring that kitchen staff can make split-second decisions during a lunch rush without searching for buttons.

---
Developed by the FoodDesk Engineering Team.