import type {
  Centre, Slot, WeatherData, Scheme, AppNotification, Farmer
} from '../types';

// ============================================================
// MOCK FARMERS
// ============================================================
export const DEMO_FARMER: Farmer = {
  id: 'F001',
  name: 'Ramesh Kumar',
  mobile: '+91 98765 43210',
  aadhaarLast4: '1234',
  location: 'Hanamkonda',
  district: 'Warangal',
  state: 'Telangana',
  landHolding: '4.5 acres',
  bankAccount: 'XXXX XXXX 5678',
  ifsc: 'SBI0001234',
};

// ============================================================
// MOCK CENTRES
// ============================================================
export const MOCK_CENTRES: Centre[] = [
  {
    id: 'C001',
    name: 'Centre A — Hanamkonda',
    address: 'Agricultural Market Yard, Hanamkonda, Warangal',
    distanceKm: 7.2,
    farmersWaiting: 32,
    estimatedWaitMin: [40, 60],
    confidencePct: 82,
    status: 'OPEN',
    lat: 17.9689,
    lng: 79.5941,
    cropTypes: ['Paddy', 'Maize', 'Wheat'],
    dailyCapacity: 500,
    bookedCount: 410,
    loadLevel: 'low',
    operations: {
      registration: 'Active',
      qualityCheck: 'Active',
      weighing: 'Active',
      storage: 'Moderate',
    },
    todayProgress: 82,
    todayTarget: 500,
    todayCompleted: 410,
    liveQueueCount: 32,
  },
  {
    id: 'C002',
    name: 'Centre B — Kazipet Yard',
    address: 'Govt Procurement Yard, Kazipet, Warangal',
    distanceKm: 10.1,
    farmersWaiting: 84,
    estimatedWaitMin: [120, 150],
    confidencePct: 74,
    status: 'HIGH_LOAD',
    lat: 17.9505,
    lng: 79.6033,
    cropTypes: ['Cotton', 'Maize', 'Paddy'],
    dailyCapacity: 600,
    bookedCount: 548,
    loadLevel: 'heavy',
    operations: {
      registration: 'Moderate',
      qualityCheck: 'Delayed',
      weighing: 'Moderate',
      storage: 'Active',
    },
    todayProgress: 58,
    todayTarget: 600,
    todayCompleted: 348,
    liveQueueCount: 84,
  },
  {
    id: 'C003',
    name: 'Centre C — Narsampet PACS',
    address: 'PACS Procurement Centre, Narsampet, Warangal',
    distanceKm: 15.6,
    farmersWaiting: 18,
    estimatedWaitMin: [30, 40],
    confidencePct: 90,
    status: 'OPEN',
    lat: 17.9210,
    lng: 79.8975,
    cropTypes: ['Paddy', 'Groundnut', 'Soybean'],
    dailyCapacity: 400,
    bookedCount: 260,
    loadLevel: 'low',
    operations: {
      registration: 'Active',
      qualityCheck: 'Active',
      weighing: 'Active',
      storage: 'Active',
    },
    todayProgress: 65,
    todayTarget: 400,
    todayCompleted: 260,
    liveQueueCount: 18,
  },
  {
    id: 'C004',
    name: 'Centre D — Ranga Reddy Yard',
    address: 'LB Nagar Main Rd, Ranga Reddy',
    distanceKm: 22.4,
    farmersWaiting: 25,
    estimatedWaitMin: [35, 50],
    confidencePct: 88,
    status: 'OPEN',
    lat: 17.3850,
    lng: 78.4867,
    cropTypes: ['Paddy', 'Tur (Arhar Dal)', 'Bajra (Pearl Millet)'],
    dailyCapacity: 500,
    bookedCount: 175,
    loadLevel: 'low',
    operations: {
      registration: 'Active',
      qualityCheck: 'Active',
      weighing: 'Active',
      storage: 'Active',
    },
    todayProgress: 45,
    todayTarget: 500,
    todayCompleted: 225,
    liveQueueCount: 25,
  },
  {
    id: 'C005',
    name: 'Centre E — Medchal Mandi',
    address: 'NH 44, Medchal Town, Medchal-Malkajgiri',
    distanceKm: 31.8,
    farmersWaiting: 62,
    estimatedWaitMin: [90, 110],
    confidencePct: 79,
    status: 'BUSY',
    lat: 17.6294,
    lng: 78.4813,
    cropTypes: ['Cotton', 'Maize', 'Paddy'],
    dailyCapacity: 350,
    bookedCount: 290,
    loadLevel: 'heavy',
    operations: {
      registration: 'Active',
      qualityCheck: 'Moderate',
      weighing: 'Delayed',
      storage: 'Moderate',
    },
    todayProgress: 72,
    todayTarget: 350,
    todayCompleted: 252,
    liveQueueCount: 62,
  },
];

// ============================================================
// MOCK SLOTS
// ============================================================
export const MOCK_SLOTS: Slot[] = [
  {
    id: 'S1',
    label: '10:00 AM – 11:00 AM',
    startTime: '10:00',
    endTime: '11:00',
    available: 12,
    estimatedWaitMin: 45,
  },
  {
    id: 'S2',
    label: '11:00 AM – 12:00 PM',
    startTime: '11:00',
    endTime: '12:00',
    available: 8,
    estimatedWaitMin: 35,
  },
  {
    id: 'S3',
    label: '12:00 PM – 1:00 PM',
    startTime: '12:00',
    endTime: '13:00',
    available: 16,
    estimatedWaitMin: 50,
  },
  {
    id: 'S4',
    label: '1:00 PM – 2:00 PM',
    startTime: '13:00',
    endTime: '14:00',
    available: 10,
    estimatedWaitMin: 40,
  },
];

// ============================================================
// CROPS
// ============================================================
export const CROP_LIST = [
  'Paddy', 'Wheat', 'Maize', 'Sorghum (Jowar)', 'Bajra (Pearl Millet)',
  'Cotton', 'Groundnut', 'Sunflower', 'Soybean', 'Tur (Arhar Dal)',
  'Moong (Green Gram)', 'Urad (Black Gram)', 'Chana (Chickpea)',
];

// ============================================================
// WEATHER
// ============================================================
export const MOCK_WEATHER: WeatherData = {
  location: 'Warangal, Telangana',
  temperatureC: 24,
  condition: 'Cloudy',
  humidity: 68,
  windKmh: 12,
  forecastTomorrow: 'Heavy Rain Expected',
  severeAlert: 'Heavy Rain Expected Tomorrow – 2 PM to 5 PM. Consider postponing travel to procurement centres.',
  forecast: [
    { day: 'Today', tempHigh: 24, tempLow: 19, condition: 'Cloudy', rain: false },
    { day: 'Tomorrow', tempHigh: 22, tempLow: 18, condition: 'Heavy Rain', rain: true },
    { day: 'Thursday', tempHigh: 26, tempLow: 20, condition: 'Partly Cloudy', rain: false },
    { day: 'Friday', tempHigh: 28, tempLow: 21, condition: 'Sunny', rain: false },
    { day: 'Saturday', tempHigh: 27, tempLow: 20, condition: 'Cloudy', rain: false },
  ],
};

// ============================================================
// SCHEMES
// ============================================================
export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'SC001',
    name: 'PM-KISAN Samman Nidhi',
    description: 'Income support of ₹6,000 per year to farmer families',
    benefit: '₹6,000/year in 3 installments',
    eligibility: 'All eligible farmer families with cultivable land',
    deadline: '31 March 2025',
  },
  {
    id: 'SC002',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop Insurance Scheme for financial support on crop failure',
    benefit: 'Up to ₹2 lakh crop insurance coverage',
    eligibility: 'Farmers with crops in notified areas',
    deadline: '30 November 2024',
  },
  {
    id: 'SC003',
    name: 'Crop Diversification Scheme',
    description: 'Financial assistance for adopting alternative crops',
    benefit: '₹7,000/acre subsidy for alternative crops',
    eligibility: 'Traditional paddy growing areas',
  },
  {
    id: 'SC004',
    name: 'Rythu Bandhu (Telangana)',
    description: 'Investment support scheme for farmers in Telangana',
    benefit: '₹10,000/acre per season',
    eligibility: 'Land-owning farmers in Telangana',
  },
  {
    id: 'SC005',
    name: 'Kisan Credit Card',
    description: 'Easy credit access for agricultural needs',
    benefit: 'Credit limit up to ₹3 lakh at 4% interest',
    eligibility: 'All farmers, sharecroppers, tenant farmers',
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N001',
    title: 'Your turn is approaching!',
    message: '5 farmers ahead. Please start travelling to Centre A.',
    type: 'ALERT',
    createdAt: '10:15 AM',
    isRead: false,
  },
  {
    id: 'N002',
    title: 'Check-in required',
    message: 'Please check in at Centre A reception. Token: A104',
    type: 'INFO',
    createdAt: '10:22 AM',
    isRead: false,
  },
  {
    id: 'N003',
    title: 'Payment Initiated',
    message: '₹72,000 payment initiated. Token A104. Expected within 48 hours.',
    type: 'SUCCESS',
    createdAt: '11:48 AM',
    isRead: true,
  },
  {
    id: 'N004',
    title: 'Weather Alert',
    message: 'Heavy rain expected tomorrow 2–5 PM. Plan accordingly.',
    type: 'WARNING',
    createdAt: 'Yesterday',
    isRead: true,
  },
];

// ============================================================
// FARMER RIGHTS
// ============================================================
export const FARMER_RIGHTS = {
  beforeSelling: [
    'You have the right to know the Minimum Support Price (MSP) before selling.',
    'You can demand a clean, calibrated weighing machine.',
    'You have the right to get a pre-inspection of your produce quality.',
    'You can reject procurement if conditions are unfair.',
    'You are entitled to a slot booking before visiting the centre.',
  ],
  duringProcurement: [
    'You have the right to witness every stage of quality assessment.',
    'You can request a re-test if you disagree with quality results.',
    'Your produce must be weighed in your presence.',
    'You must receive a signed acknowledgment after check-in.',
    'You can request the name and ID of the quality assessor.',
  ],
  afterProcurement: [
    'You must receive a signed procurement receipt immediately.',
    'You are entitled to a digital copy of all records.',
    'Centre officials cannot withhold your receipt.',
    'You have the right to track your payment status.',
    'You can escalate unresolved grievances to district officials.',
  ],
  paymentReceipts: [
    'Payment must be credited within 48 hours of procurement acceptance.',
    'You must receive a digital receipt with transaction ID.',
    'Any deduction must be explained with written reason.',
    'You can demand bank statement proof of payment.',
    'Interest must be paid if payment is delayed beyond 7 days.',
  ],
};
