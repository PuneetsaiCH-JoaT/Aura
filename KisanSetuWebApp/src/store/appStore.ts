import { create } from 'zustand';
import type {
  Farmer, Centre, CropDetails, Slot, Booking, QueueStatus,
  QualityAssessment, WeighingRecord, PaymentRecord, Receipt,
  Grievance, AppNotification, ProcurementStep, AppPage, MainTab
} from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

interface AppState {
  // Navigation
  currentPage: AppPage;
  currentTab: MainTab;
  pageHistory: AppPage[];

  // Auth
  isAuthenticated: boolean;
  farmer: Farmer | null;
  demoMode: boolean;

  // Location & Filters
  locationGranted: boolean;
  userLocation: string;
  userCoords: { lat: number; lng: number };
  cropFilter: string;
  maxDistanceKm: number | null;
  searchQuery: string;

  // Procurement State
  selectedCentre: Centre | null;
  cropDetails: CropDetails | null;
  selectedSlot: Slot | null;
  booking: Booking | null;
  procurementStep: ProcurementStep;

  // Live Data
  queueStatus: QueueStatus | null;
  qualityAssessment: QualityAssessment | null;
  weighingRecord: WeighingRecord | null;
  paymentRecord: PaymentRecord | null;
  receipt: Receipt | null;

  // Services
  notifications: AppNotification[];
  grievances: Grievance[];
  unreadCount: number;

  // Demo triggers
  demoQualityMode: 'ACCEPTED' | 'REJECTED';

  // Actions
  navigate: (page: AppPage) => void;
  goBack: () => void;
  setTab: (tab: MainTab) => void;
  login: (farmer: Farmer) => void;
  logout: () => void;
  setDemoMode: (val: boolean) => void;
  setLocationGranted: (val: boolean, location?: string, coords?: { lat: number; lng: number }) => void;
  setUserCoords: (coords: { lat: number; lng: number }, locationName?: string) => void;
  setCropFilter: (crop: string) => void;
  setMaxDistanceKm: (dist: number | null) => void;
  setSearchQuery: (query: string) => void;
  selectCentre: (centre: Centre) => void;
  setCropDetails: (details: CropDetails) => void;
  selectSlot: (slot: Slot) => void;
  createBooking: (booking: Booking) => void;
  setProcurementStep: (step: ProcurementStep) => void;
  setQueueStatus: (status: QueueStatus) => void;
  setQualityAssessment: (qa: QualityAssessment) => void;
  setWeighingRecord: (record: WeighingRecord) => void;
  setPaymentRecord: (record: PaymentRecord) => void;
  setReceipt: (receipt: Receipt) => void;
  addGrievance: (grievance: Grievance) => void;
  markNotificationsRead: () => void;
  setDemoQualityMode: (mode: 'ACCEPTED' | 'REJECTED') => void;
  resetProcurement: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentPage: 'splash',
  currentTab: 'home',
  pageHistory: [],

  // Auth
  isAuthenticated: false,
  farmer: null,
  demoMode: false,

  // Location & Filters
  locationGranted: false,
  userLocation: 'Warangal, Telangana',
  userCoords: { lat: 17.9689, lng: 79.5941 }, // Default Warangal pilot region
  cropFilter: 'All',
  maxDistanceKm: null,
  searchQuery: '',

  // Procurement
  selectedCentre: null,
  cropDetails: null,
  selectedSlot: null,
  booking: null,
  procurementStep: 'IDLE',

  // Live Data
  queueStatus: null,
  qualityAssessment: null,
  weighingRecord: null,
  paymentRecord: null,
  receipt: null,

  // Services
  notifications: MOCK_NOTIFICATIONS,
  grievances: [],
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,

  // Demo
  demoQualityMode: 'ACCEPTED',

  // ---- Actions ----
  navigate: (page: AppPage) => {
    const history = get().pageHistory;
    set({
      currentPage: page,
      pageHistory: [...history, get().currentPage],
    });
  },

  goBack: () => {
    const history = get().pageHistory;
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      currentPage: prev,
      pageHistory: history.slice(0, -1),
    });
  },

  setTab: (tab: MainTab) => {
    const tabPageMap: Record<MainTab, AppPage> = {
      home: 'centres',
      procurement: 'live-queue',
      services: 'services-home',
      notifications: 'notifications',
      profile: 'profile',
    };
    set({ currentTab: tab, currentPage: tabPageMap[tab], pageHistory: [] });
  },

  login: (farmer: Farmer) => {
    set({ isAuthenticated: true, farmer, currentPage: 'location' });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      farmer: null,
      currentPage: 'splash',
      pageHistory: [],
      selectedCentre: null,
      cropDetails: null,
      selectedSlot: null,
      booking: null,
      procurementStep: 'IDLE',
      queueStatus: null,
      qualityAssessment: null,
      weighingRecord: null,
      paymentRecord: null,
      receipt: null,
    });
  },

  setDemoMode: (val: boolean) => set({ demoMode: val }),

  setLocationGranted: (val: boolean, location?: string, coords?: { lat: number; lng: number }) => {
    set({
      locationGranted: val,
      userLocation: location || get().userLocation,
      userCoords: coords || get().userCoords,
      currentPage: 'centres',
    });
  },

  setUserCoords: (coords: { lat: number; lng: number }, locationName?: string) => {
    set({
      userCoords: coords,
      userLocation: locationName || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
    });
  },

  setCropFilter: (crop: string) => set({ cropFilter: crop }),
  setMaxDistanceKm: (dist: number | null) => set({ maxDistanceKm: dist }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  selectCentre: (centre: Centre) => {
    set({ selectedCentre: centre, currentPage: 'centre-detail' });
  },

  setCropDetails: (details: CropDetails) => {
    set({ cropDetails: details, currentPage: 'select-slot' });
  },

  selectSlot: (slot: Slot) => {
    set({ selectedSlot: slot });
  },

  createBooking: (booking: Booking) => {
    set({ booking, procurementStep: 'BOOKED', currentPage: 'booking-confirmed' });
  },

  setProcurementStep: (step: ProcurementStep) => set({ procurementStep: step }),

  setQueueStatus: (status: QueueStatus) => set({ queueStatus: status }),

  setQualityAssessment: (qa: QualityAssessment) => set({ qualityAssessment: qa }),

  setWeighingRecord: (record: WeighingRecord) => set({ weighingRecord: record }),

  setPaymentRecord: (record: PaymentRecord) => set({ paymentRecord: record }),

  setReceipt: (receipt: Receipt) => set({ receipt }),

  addGrievance: (grievance: Grievance) => {
    set(state => ({ grievances: [...state.grievances, grievance] }));
  },

  markNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  setDemoQualityMode: (mode: 'ACCEPTED' | 'REJECTED') => {
    set({ demoQualityMode: mode });
  },

  resetProcurement: () => {
    set({
      selectedCentre: null,
      cropDetails: null,
      selectedSlot: null,
      booking: null,
      procurementStep: 'IDLE',
      queueStatus: null,
      qualityAssessment: null,
      weighingRecord: null,
      paymentRecord: null,
      receipt: null,
    });
  },
}));

// Convenience selector
export const useNavigate = () => useAppStore(s => s.navigate);
export const useGoBack = () => useAppStore(s => s.goBack);
export const useFarmer = () => useAppStore(s => s.farmer);
