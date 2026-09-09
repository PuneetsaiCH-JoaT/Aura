# 🌾 Krishi Setu — Government Procurement Platform for Farmers

> **Smart India Hackathon Solution**  
> *A transparent, predictable, fair, and trackable agricultural procurement platform built for farmers.*

---

## 📌 Overview

**Krishi Setu** (कृषि सेतु) bridges the gap between farmers and government agricultural procurement centres (PACS / Mandis). It addresses the core uncertainties farmers face during harvest sales:
- Nearby procurement centre discovery & live status
- Transparent distance calculation (Haversine Formula) & interactive map routing
- Digital slot booking & automated token/queue management
- Live queue tracking with automated arrival alerts
- Transparent quality assessment (with comprehensive quality rejection & grievance resolution workflows)
- Digital weighing transparency & instant MSP procurement value calculation
- 48-hour direct bank payment tracking & official digital receipt generation
- 365-day farmer services (Weather, Government Schemes, Farmer Rights, Grievances)
- Conversational AI / IVR voice assistant for low-digital-literacy users

---

## 🚀 Key Features & Architectural Modules

### 1. 🌾 Procurement Journey (17 Core Screens)
- **Splash & Authentication**: Mobile number login, mocked 4-digit OTP verification, Aadhaar authentication UI, and farmer registration.
- **Location & Centre Discovery**: Real GPS browser geolocation with multi-tier fallback (Telangana pilot region presets), Haversine distance ranking (nearest-first), crop type filtering, and max distance radius filter.
- **Interactive Leaflet / OpenStreetMap**: Custom color-coded markers for centre capacity load, nearest-centre star badge, interactive popups, and one-touch **Google Maps Navigation**.
- **Crop & Slot Booking**: Crop selection, bag count / net weight calculation, harvest date entry, vehicle registration, and time slot selection with real-time capacity indicators.
- **Token Generation**: Unique digital token (e.g. `A104`) with instant WhatsApp / SMS sharing.
- **Live Queue Tracking**: Auto-refreshing queue position (updates every 8s), wait time estimation, and position progress bar.
- **Turn Approaching Alert**: Prominent notification modal when 5 farmers ahead with "I'm On My Way" action.
- **GPS Verified Check-in**: Arrival confirmation at centre gate with vehicle verification.
- **Registration Stepper**: 3-step verification flow (Farmer Details → Document Verification → Vehicle Details).
- **Quality Assessment Module**:
  - **ACCEPTED Flow**: Transparent parameter breakdown (Moisture ≤16%, Foreign Matter ≤1%, Grain Quality) with inspector ID stamp.
  - **REJECTED Flow**: Complete alternative state showing token release, clear rejection reason, options (re-test, remove moisture, cancel), and **File a Grievance** integration.
- **Digital Weighing**: Gross weight, Tare weight, Net weight calculation with inspector ID and digital scale confirmation.
- **Procurement Acceptance**: MSP calculation (e.g. 3,000 kg paddy × ₹2,183/quintal = ₹72,000) with instant approval checkmarks.
- **Payment Status Timeline**: Real-time progression (Initiated → Bank Processing → Completed within 48 hours).
- **Digital Receipt**: Official government procurement receipt generation with `.txt` download and sharing capabilities.

### 2. 📅 365-Day Farmer Services
- **Weather Forecast**: Current temperature, humidity, wind speed, 5-day forecast, and severe weather warning alerts.
- **Government Schemes**: PM-KISAN, PM Fasal Bima Yojana, Crop Diversification Scheme, Rythu Bandhu, Kisan Credit Card.
- **Farmer Rights & Protections**: Categorized rights (Before Selling, During Procurement, After Procurement, Payment & Receipts) + Toll-free helplines.
- **Grievance Resolution**: File complaints for payment delays, quality disputes, or weighing issues with tracking numbers (`GRxxxxxx`).

### 3. 📞 AI / IVR Voice Assistant
- Toll-free hotline simulation (`1800-XXX-XXXX`).
- Multi-lingual selection (**Telugu**, **Hindi**, **English**, **Other**).
- Conversational chat assistant with guided quick-reply chips for crop selection, slot booking, and token SMS delivery.

### 4. 👤 Farmer Profile & Notifications
- Landholding details, bank account linkage, total procurement earnings history.
- Real-time notification center with type badges (Alert, Info, Success, Warning).

### 5. 🚀 Demo Mode for Hackathon Judges
- Bottom demo control bar allowing judges to:
  - Restart procurement flow
  - Force Quality PASS
  - Force Quality FAIL (to evaluate rejection & grievance workflow)
  - Fast-forward directly to Payment or Digital Receipt

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, custom agricultural green palette (`#22863A`, `#1B5E20`, `#E8F5E9`)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Map & Routing**: Leaflet.js, OpenStreetMap tiles, Haversine Distance Formula, Google Maps Directions API link
- **Mock Backend Layer**: In-memory async API simulation layer with deterministic state transitions

---

## 📥 Installation & Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

```bash
# 1. Clone the repository
git clone <repository-url>
cd kisan-setu

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Build for Production

```bash
npm run build
```

The optimized static production assets will be generated in the `dist/` directory.

---

## 📄 License

This project is open-source and developed for the **Smart India Hackathon**.
