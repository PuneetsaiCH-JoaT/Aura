// ============================================================
// KRISHI SETU — All TypeScript Types & Interfaces
// ============================================================

export type ProcurementStep =
  | 'IDLE'
  | 'BOOKED'
  | 'WAITING'
  | 'APPROACHING'
  | 'CHECKED_IN'
  | 'REGISTRATION'
  | 'QUALITY_CHECK'
  | 'QUALITY_REJECTED'
  | 'WEIGHING'
  | 'ACCEPTED'
  | 'PAYMENT_PROCESSING'
  | 'PAID';

export type CentreStatus = 'OPEN' | 'HIGH_LOAD' | 'BUSY' | 'CLOSED';
export type OperationStatus = 'Active' | 'Moderate' | 'Delayed';
export type QualityResult = 'ACCEPTED' | 'REJECTED';
export type PaymentStatus = 'INITIATED' | 'PROCESSING' | 'COMPLETED';

// ---- Farmer / Auth ----
export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  aadhaarLast4?: string;
  location: string;
  district: string;
  state: string;
  landHolding?: string;
  bankAccount?: string;
  ifsc?: string;
}

// ---- Centre ----
export interface Centre {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  farmersWaiting: number;
  estimatedWaitMin: [number, number]; // [min, max]
  confidencePct: number;
  status: CentreStatus;
  lat: number;
  lng: number;
  cropTypes?: string[];
  dailyCapacity?: number;
  bookedCount?: number;
  loadLevel?: 'low' | 'moderate' | 'heavy';
  operations: {
    registration: OperationStatus;
    qualityCheck: OperationStatus;
    weighing: OperationStatus;
    storage: OperationStatus;
  };
  todayProgress: number; // 0-100
  todayTarget: number; // bags
  todayCompleted: number;
  liveQueueCount: number;
}

// ---- Crop ----
export interface CropDetails {
  crop: string;
  variety?: string;
  quantityBags: number;
  quantityKg: number;
  harvestDate: string;
  vehicleNumber: string;
}

// ---- Slot ----
export interface Slot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  available: number;
  estimatedWaitMin: number;
  isSelected?: boolean;
}

// ---- Booking ----
export interface Booking {
  id: string;
  tokenNumber: string;
  centre: Centre;
  slot: Slot;
  cropDetails: CropDetails;
  date: string;
  createdAt: string;
  status: ProcurementStep;
  estimatedWaitMin: [number, number];
}

// ---- Queue ----
export interface QueueItem {
  tokenNumber: string;
  status: 'COMPLETED' | 'CURRENT' | 'WAITING';
  isMyToken?: boolean;
}

export interface QueueStatus {
  myToken: string;
  currentPosition: number;
  totalInQueue: number;
  estimatedWaitMin: number;
  lastUpdated: Date;
  tokens: QueueItem[];
}

// ---- Quality ----
export interface QualityParameter {
  name: string;
  value: string;
  unit: string;
  limit: string;
  status: 'PASS' | 'FAIL';
}

export interface QualityAssessment {
  result: QualityResult;
  parameters: QualityParameter[];
  assessedAt: string;
  rejectionReason?: string;
}

// ---- Weighing ----
export interface WeighingRecord {
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  recordedAt: string;
}

// ---- Payment ----
export interface PaymentRecord {
  procurementValue: number;
  msp: number; // minimum support price per quintal
  status: PaymentStatus;
  transactionId: string;
  initiatedAt?: string;
  completedAt?: string;
  expectedWithinHours: number;
}

// ---- Receipt ----
export interface Receipt {
  transactionId: string;
  crop: string;
  quantity: number; // kg
  amount: number;
  centre: string;
  date: string;
  farmerName: string;
  mobileNumber: string;
}

// ---- Weather ----
export interface WeatherData {
  location: string;
  temperatureC: number;
  condition: string;
  humidity: number;
  windKmh: number;
  forecastTomorrow: string;
  severeAlert?: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  rain: boolean;
}

// ---- Scheme ----
export interface Scheme {
  id: string;
  name: string;
  description: string;
  benefit: string;
  eligibility: string;
  deadline?: string;
  link?: string;
}

// ---- Grievance ----
export type GrievanceType =
  | 'PAYMENT_DELAYED'
  | 'QUALITY_DISPUTE'
  | 'WEIGHING_ISSUE'
  | 'CENTRE_ISSUE'
  | 'OTHER';

export interface Grievance {
  id: string;
  type: GrievanceType;
  description: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED';
  trackingNumber: string;
}

// ---- Notification ----
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  createdAt: string;
  isRead: boolean;
}

// ---- AI Conversation ----
export interface ConversationMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
}

// ---- Navigation ----
export type MainTab = 'home' | 'procurement' | 'services' | 'notifications' | 'profile';
export type AppPage =
  | 'splash'
  | 'login'
  | 'otp'
  | 'register'
  | 'location'
  | 'centres'
  | 'centre-detail'
  | 'crop-quantity'
  | 'select-slot'
  | 'booking-confirmed'
  | 'live-queue'
  | 'turn-approaching'
  | 'checkin'
  | 'registration'
  | 'quality-check'
  | 'quality-rejected'
  | 'weighing'
  | 'acceptance'
  | 'payment-status'
  | 'digital-receipt'
  | 'services-home'
  | 'weather'
  | 'schemes'
  | 'farmer-rights'
  | 'grievance'
  | 'ai-assistant'
  | 'profile'
  | 'notifications'
  | 'procurement-history';
