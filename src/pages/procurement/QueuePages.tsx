import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button, Card, PageHeader, CheckIcon, StepBanner } from '../../components/shared';
import { mockGetQueueStatus } from '../../services/mockApi';
import type { QueueItem } from '../../types';
import { clsx } from 'clsx';

// ============================================================
// LIVE QUEUE TRACKING
// ============================================================
export const LiveQueuePage: React.FC = () => {
  const { booking, queueStatus, setQueueStatus, setProcurementStep, navigate } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showApproaching, setShowApproaching] = useState(false);

  const refreshQueue = useCallback(async () => {
    if (!booking) return;
    setLoading(true);
    const status = await mockGetQueueStatus(booking.tokenNumber);
    setQueueStatus(status);
    setLastUpdate(new Date());
    setLoading(false);

    // Check if approaching (position <= 5)
    if (status.currentPosition <= 5 && status.currentPosition > 1) {
      setShowApproaching(true);
      setProcurementStep('APPROACHING');
    }
  }, [booking, setQueueStatus, setProcurementStep]);

  // Auto-refresh every 8 seconds
  useEffect(() => {
    refreshQueue();
    const interval = setInterval(refreshQueue, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!booking) return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <p className="text-gray-500 text-center">No active booking found.</p>
      <Button onClick={() => navigate('centres')} className="mt-4 max-w-[200px]">
        Book a Slot
      </Button>
    </div>
  );

  if (showApproaching) {
    return <TurnApproachingPage onDismiss={() => setShowApproaching(false)} />;
  }

  const queue = queueStatus;
  const position = queue?.currentPosition ?? 14;
  const total = queue?.totalInQueue ?? 32;
  const tokens = queue?.tokens ?? [];

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      <div className="bg-[#22863A] px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-green-200 text-xs">My Token</p>
            <p className="text-4xl font-extrabold text-white">{booking.tokenNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-green-200 text-xs">Centre</p>
            <p className="text-white font-semibold text-sm">{booking.centre.name.split('—')[0]}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{position}</p>
            <p className="text-green-200 text-xs">My Position</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-green-200 text-xs">Total Queue</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{queue?.estimatedWaitMin ?? 32}m</p>
            <p className="text-green-200 text-xs">Est. Wait</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Queue updates */}
        <div className="flex items-center justify-between">
          <p className="section-header">Queue Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs text-gray-500">
              Updated {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Queue list */}
        <Card>
          <div className="flex flex-col gap-2">
            {tokens.map((token) => (
              <QueueItemRow key={token.tokenNumber} item={token} />
            ))}
          </div>
        </Card>

        {/* Queue position bar */}
        <Card>
          <p className="text-xs text-gray-500 mb-2">Queue & ETA Updated for all farmers</p>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-[#22863A] transition-all duration-1000"
              style={{ width: `${Math.max(5, 100 - (position / total) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>You are here</span>
            <span>{position} ahead</span>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={refreshQueue} loading={loading}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </Button>
          <Button onClick={() => navigate('checkin')}>
            Check In
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---- Queue Item ----
const QueueItemRow: React.FC<{ item: QueueItem }> = ({ item }) => {
  if (item.status === 'COMPLETED') {
    return (
      <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-gray-50">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckIcon className="w-4 h-4 text-green-600" />
        </div>
        <span className="font-semibold text-gray-600 text-sm">{item.tokenNumber}</span>
        <span className="ml-auto text-xs text-green-600 font-medium">Completed</span>
      </div>
    );
  }

  if (item.isMyToken) {
    return (
      <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-[#E8F5E9] border-2 border-[#22863A]">
        <div className="w-8 h-8 rounded-full bg-[#22863A] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">★</span>
        </div>
        <span className="font-bold text-[#1B5E20] text-sm">{item.tokenNumber}</span>
        <span className="ml-auto text-xs font-bold text-[#22863A]">
          {item.status === 'CURRENT' ? '● Your Turn' : '⏳ Waiting'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white border border-gray-100">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-500 text-xs font-semibold">#</span>
      </div>
      <span className="font-medium text-gray-600 text-sm">{item.tokenNumber}</span>
      <span className="ml-auto text-xs text-gray-400">Waiting</span>
    </div>
  );
};

// ============================================================
// TURN APPROACHING PAGE
// ============================================================
const TurnApproachingPage: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { navigate, booking, queueStatus } = useAppStore();
  const position = queueStatus?.currentPosition ?? 5;

  const handleOnMyWay = () => {
    useAppStore.getState().setProcurementStep('APPROACHING');
    onDismiss();
    navigate('checkin');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Pulsing header */}
      <div className="bg-amber-500 px-6 py-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 animate-bounce">
          <svg className="w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L19 6L15.45 11.29L22 12L15.45 12.71L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.71L2 12L8.55 11.29L5 6L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-1">Your Turn Is Approaching!</h2>
        <p className="text-amber-100 text-center text-sm">Get ready to visit the centre</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-amber-100 rounded-2xl p-6 text-center">
            <p className="text-5xl font-extrabold text-amber-600">{position}</p>
            <p className="text-amber-700 text-sm font-medium mt-1">Farmers Ahead</p>
          </div>
        </div>

        <Card className="w-full mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
              <span className="text-xl">🏃</span>
            </div>
            <div>
              <p className="font-semibold text-[#1B5E20]">Time to head out!</p>
              <p className="text-xs text-gray-500">Please start travelling to the centre</p>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Token:</span>
            <span className="font-bold text-[#1B5E20]">{booking?.tokenNumber}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Centre:</span>
            <span className="font-semibold text-gray-800">{booking?.centre.name.split('—')[0]}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Slot:</span>
            <span className="font-semibold text-gray-800">{booking?.slot.label}</span>
          </div>
        </Card>

        <Card variant="green" className="w-full mb-6">
          <p className="text-xs text-[#1B5E20]">
            📍 <strong>Directions:</strong> Show this token to the centre staff at the gate.
            Carry your Aadhaar and vehicle documents.
          </p>
        </Card>

        <Button onClick={handleOnMyWay} size="lg" className="mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          I'm On My Way
        </Button>

        <button onClick={onDismiss} className="text-sm text-gray-400">
          Back to Queue
        </button>
      </div>
    </div>
  );
};

// ============================================================
// CHECK-IN PAGE
// ============================================================
export const CheckInPage: React.FC = () => {
  const { booking, navigate, goBack, setProcurementStep } = useAppStore();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const handleCheckIn = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setConfirmed(true);
    setProcurementStep('CHECKED_IN');
  };

  if (confirmed) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="bg-[#22863A] px-6 py-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
            <svg className="w-9 h-9 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">You Have Arrived!</h2>
          <p className="text-green-200 text-sm mt-1">Check-in successful</p>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          <Card>
            <p className="text-xs text-gray-500 mb-3">Check-in Confirmation</p>
            <InfoItem label="Token" value={booking.tokenNumber} bold />
            <InfoItem label="Centre" value={booking.centre.name.split('—')[0]} />
            <InfoItem label="Vehicle No." value={booking.cropDetails.vehicleNumber} />
            <InfoItem label="Check-in Time" value={new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} />
          </Card>

          <Card variant="green">
            <p className="text-sm text-[#1B5E20] font-semibold">📋 What happens next?</p>
            <p className="text-xs text-gray-700 mt-1">
              A centre staff member will guide you to the registration counter. 
              Please wait with your vehicle at the designated parking area.
            </p>
          </Card>

          <Button onClick={() => navigate('registration')} size="lg">
            Proceed to Registration
          </Button>

          <Button variant="secondary" onClick={() => {}}>
            Need Help?
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Check-in" subtitle="Confirm your arrival at the centre" onBack={goBack} />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <Card variant="green">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#22863A] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{booking.tokenNumber}</span>
            </div>
            <div>
              <p className="font-bold text-[#1B5E20]">{booking.centre.name}</p>
              <p className="text-xs text-gray-600">{booking.slot.label}</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">Arrival Confirmation</p>
          <InfoItem label="Token" value={booking.tokenNumber} />
          <InfoItem label="Centre" value={booking.centre.name.split('—')[0]} />
          <InfoItem label="Vehicle No." value={booking.cropDetails.vehicleNumber} />
          <InfoItem label="Crop" value={booking.cropDetails.crop} />
          <InfoItem label="Quantity" value={`${booking.cropDetails.quantityBags} bags`} />
        </Card>

        <Card variant="green">
          <p className="text-xs text-[#1B5E20] font-semibold">✅ You are at the correct location</p>
          <p className="text-xs text-gray-600 mt-1">GPS verified · {booking.centre.name}</p>
        </Card>
      </div>

      <div className="px-4 py-4">
        <Button onClick={handleCheckIn} loading={loading} size="lg">
          Confirm Check-in
        </Button>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={clsx('text-sm text-gray-800', bold && 'font-bold text-[#1B5E20]')}>{value}</span>
  </div>
);

// ============================================================
// REGISTRATION STEPPER
// ============================================================
export const RegistrationPage: React.FC = () => {
  const { navigate, goBack, setProcurementStep } = useAppStore();
  const [step, setStep] = useState<'farmer' | 'docs' | 'vehicle' | 'done'>('farmer');
  const [processing, setProcessing] = useState(false);

  const steps = [
    { id: 'farmer', label: 'Farmer Details', icon: '👤' },
    { id: 'docs', label: 'Document Verification', icon: '📋' },
    { id: 'vehicle', label: 'Vehicle Details', icon: '🚛' },
  ];

  const currentIdx = steps.findIndex(s => s.id === step);

  const handleNext = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setProcessing(false);

    if (step === 'farmer') setStep('docs');
    else if (step === 'docs') setStep('vehicle');
    else {
      setProcurementStep('REGISTRATION');
      navigate('quality-check');
    }
  };

  if (step === 'done') return null;

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Registration" subtitle="Step 3 of 4" onBack={goBack} />
      <StepBanner step={3} total={4} label="Centre Registration" />

      <div className="px-4 py-4 flex flex-col flex-1">
        {/* Stepper */}
        <div className="mb-6">
          {steps.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            const pending = i > currentIdx;
            return (
              <div key={s.id} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className={clsx(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm z-10',
                    done ? 'bg-[#22863A] text-white' :
                    active ? 'bg-[#22863A] border-4 border-green-200 text-white' :
                    'bg-gray-200 text-gray-500'
                  )}>
                    {done ? <CheckIcon className="w-4 h-4" /> : s.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={clsx('w-0.5 h-12 mt-1', done ? 'bg-[#22863A]' : 'bg-gray-200')} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className={clsx(
                    'font-semibold text-sm',
                    active ? 'text-[#1B5E20]' : done ? 'text-gray-600' : 'text-gray-400'
                  )}>
                    {s.label}
                  </p>
                  {active && (
                    <p className="text-xs text-[#22863A] font-medium">Processing...</p>
                  )}
                  {done && (
                    <p className="text-xs text-green-600 font-medium">✓ Verified</p>
                  )}
                  {pending && (
                    <p className="text-xs text-gray-400">Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current step content */}
        <Card className="flex-1 mb-4">
          {step === 'farmer' && (
            <div>
              <p className="font-semibold text-[#1B5E20] mb-3">Farmer Information</p>
              {[['Name', 'Ramesh Kumar'], ['Mobile', '+91 98765 43210'], ['Aadhaar', 'XXXX XXXX 1234'], ['District', 'Warangal']].map(([l, v]) => (
                <InfoItem key={l} label={l} value={v} />
              ))}
            </div>
          )}
          {step === 'docs' && (
            <div>
              <p className="font-semibold text-[#1B5E20] mb-3">Document Verification</p>
              {[
                ['Aadhaar Card', '✓ Verified'],
                ['Land Records', '✓ Verified'],
                ['Bank Account', '✓ Linked'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{l}</span>
                  <span className="text-sm text-green-600 font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
          {step === 'vehicle' && (
            <div>
              <p className="font-semibold text-[#1B5E20] mb-3">Vehicle & Crop Details</p>
              {[
                ['Vehicle No.', 'AP 26 AB 1234'],
                ['Crop', 'Paddy'],
                ['Quantity', '60 Bags'],
                ['Weight (est.)', '3,000 kg'],
              ].map(([l, v]) => (
                <InfoItem key={l} label={l} value={v} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="px-4 py-4">
        <Button onClick={handleNext} loading={processing} size="lg">
          {step === 'vehicle' ? 'Complete Registration' : 'Next'}
        </Button>
      </div>
    </div>
  );
};


