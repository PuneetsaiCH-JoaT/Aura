import React from 'react';
import { useAppStore } from './store/appStore';
import { BottomNavigation } from './components/shared/BottomNavigation';

// Auth Pages
import { SplashScreen, LoginPage, OtpPage, RegisterPage } from './pages/auth/AuthPages';

// Procurement Pages
import { LocationAccessPage, NearbycentresPage, CentreDetailPage } from './pages/procurement/CentrePages';
import { CropQuantityPage, SelectSlotPage, BookingConfirmedPage } from './pages/procurement/BookingPages';
import {
  LiveQueuePage, CheckInPage, RegistrationPage
} from './pages/procurement/QueuePages';
import {
  QualityCheckPage, WeighingPage, AcceptancePage,
  PaymentStatusPage, DigitalReceiptPage
} from './pages/procurement/ProcurementPages';

// Services Pages
import {
  ServicesHomePage, WeatherPage, SchemesPage,
  FarmerRightsPage, GrievancePage
} from './pages/services/ServicesPages';

// AI Page
import { AIAssistantPage } from './pages/ai/AIAssistantPage';

// Profile Pages
import { ProfilePage, NotificationsPage, ProcurementHistoryPage } from './pages/profile/ProfilePages';

// ============================================================
// DEMO MODE BANNER (for hackathon judges)
// ============================================================
const DemoBanner: React.FC = () => {
  const { setDemoQualityMode, demoQualityMode, navigate, resetProcurement, demoMode } = useAppStore();

  if (!demoMode) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-[398px]">
      <div className="bg-[#1B5E20] text-white rounded-2xl px-3 py-2 flex items-center gap-2 shadow-xl">
        <span className="text-xs font-bold text-green-300 flex-shrink-0">🚀 DEMO</span>
        <div className="flex gap-1 flex-1 overflow-x-auto">
          <button
            onClick={() => {
              resetProcurement();
              navigate('centres');
            }}
            className="flex-shrink-0 bg-white/20 text-white text-[10px] px-2 py-1 rounded-lg font-medium"
          >
            Restart
          </button>
          <button
            onClick={() => setDemoQualityMode('ACCEPTED')}
            className={`flex-shrink-0 text-[10px] px-2 py-1 rounded-lg font-medium ${demoQualityMode === 'ACCEPTED' ? 'bg-green-400 text-white' : 'bg-white/20 text-white'}`}
          >
            ✓ Quality Pass
          </button>
          <button
            onClick={() => setDemoQualityMode('REJECTED')}
            className={`flex-shrink-0 text-[10px] px-2 py-1 rounded-lg font-medium ${demoQualityMode === 'REJECTED' ? 'bg-red-400 text-white' : 'bg-white/20 text-white'}`}
          >
            ✗ Quality Fail
          </button>
          <button
            onClick={() => navigate('payment-status')}
            className="flex-shrink-0 bg-white/20 text-white text-[10px] px-2 py-1 rounded-lg font-medium"
          >
            → Payment
          </button>
          <button
            onClick={() => navigate('digital-receipt')}
            className="flex-shrink-0 bg-white/20 text-white text-[10px] px-2 py-1 rounded-lg font-medium"
          >
            → Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PAGE ROUTER
// ============================================================
const PageRouter: React.FC = () => {
  const { currentPage } = useAppStore();

  switch (currentPage) {
    // Auth
    case 'splash': return <SplashScreen />;
    case 'login': return <LoginPage />;
    case 'otp': return <OtpPage />;
    case 'register': return <RegisterPage />;

    // Location + Centres
    case 'location': return <LocationAccessPage />;
    case 'centres': return <NearbycentresPage />;
    case 'centre-detail': return <CentreDetailPage />;

    // Procurement booking
    case 'crop-quantity': return <CropQuantityPage />;
    case 'select-slot': return <SelectSlotPage />;
    case 'booking-confirmed': return <BookingConfirmedPage />;

    // Queue + Registration
    case 'live-queue': return <LiveQueuePage />;
    case 'checkin': return <CheckInPage />;
    case 'registration': return <RegistrationPage />;

    // Procurement process
    case 'quality-check': return <QualityCheckPage />;
    case 'weighing': return <WeighingPage />;
    case 'acceptance': return <AcceptancePage />;
    case 'payment-status': return <PaymentStatusPage />;
    case 'digital-receipt': return <DigitalReceiptPage />;

    // Services
    case 'services-home': return <ServicesHomePage />;
    case 'weather': return <WeatherPage />;
    case 'schemes': return <SchemesPage />;
    case 'farmer-rights': return <FarmerRightsPage />;
    case 'grievance': return <GrievancePage />;

    // AI
    case 'ai-assistant': return <AIAssistantPage />;

    // Profile
    case 'profile': return <ProfilePage />;
    case 'notifications': return <NotificationsPage />;
    case 'procurement-history': return <ProcurementHistoryPage />;

    default: return <SplashScreen />;
  }
};

// ============================================================
// SHOW BOTTOM NAV PAGES (authenticated non-auth pages)
// ============================================================
const PAGES_WITH_NAV: string[] = [
  'centres', 'centre-detail', 'crop-quantity', 'select-slot', 'booking-confirmed',
  'live-queue', 'checkin', 'registration', 'quality-check', 'weighing',
  'acceptance', 'payment-status', 'digital-receipt',
  'services-home', 'weather', 'schemes', 'farmer-rights', 'grievance',
  'ai-assistant', 'profile', 'notifications', 'procurement-history',
];

// ============================================================
// APP ROOT
// ============================================================
const App: React.FC = () => {
  const { currentPage, isAuthenticated } = useAppStore();
  const showNav = isAuthenticated && PAGES_WITH_NAV.includes(currentPage);

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center">
      <div className="app-container">
        <div className={showNav ? 'pb-20' : ''}>
          <PageRouter />
        </div>
        {showNav && <BottomNavigation />}
        {isAuthenticated && <DemoBanner />}
      </div>
    </div>
  );
};

export default App;
