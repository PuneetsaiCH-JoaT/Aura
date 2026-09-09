import type {
  Booking, QualityAssessment, WeighingRecord, PaymentRecord, Receipt, QueueStatus
} from '../types';
import { MOCK_CENTRES, MOCK_SLOTS } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSendOtp = async (_mobile: string): Promise<{ success: boolean }> => {
  await delay(1200);
  return { success: true };
};

export const mockVerifyOtp = async (_mobile: string, otp: string): Promise<{ success: boolean }> => {
  await delay(1000);
  return { success: otp.length === 4 };
};

export const mockGetNearbycentres = async () => {
  await delay(800);
  return MOCK_CENTRES;
};

export const mockGetSlots = async () => {
  await delay(600);
  return MOCK_SLOTS;
};

export const mockCreateBooking = async (data: Partial<Booking>): Promise<Booking> => {
  await delay(1500);
  const base = {
    id: `BK${Date.now()}`,
    centre: MOCK_CENTRES[0],
    slot: MOCK_SLOTS[1],
    cropDetails: data.cropDetails!,
    date: '28 May 2024',
    createdAt: new Date().toISOString(),
    status: 'BOOKED' as const,
    estimatedWaitMin: [35, 50] as [number, number],
    ...data,
  };
  return { ...base, tokenNumber: 'A104' } as Booking;
};

let queuePosition = 14;

export const mockGetQueueStatus = async (_token: string): Promise<QueueStatus> => {
  await delay(400);
  if (queuePosition > 1) {
    queuePosition = Math.max(1, queuePosition - Math.floor(Math.random() * 2));
  }
  const totalInQueue = 32;
  const estimatedWaitMin = Math.max(5, queuePosition * 2.5);

  const tokens: QueueStatus['tokens'] = [];
  for (let i = 1; i <= 3; i++) {
    tokens.push({ tokenNumber: `A10${i}`, status: 'COMPLETED' });
  }
  tokens.push({
    tokenNumber: 'A104',
    status: queuePosition === 1 ? 'CURRENT' : 'WAITING',
    isMyToken: true,
  });
  for (let i = 105; i <= 108; i++) {
    tokens.push({ tokenNumber: `A${i}`, status: 'WAITING' });
  }

  return {
    myToken: 'A104',
    currentPosition: queuePosition,
    totalInQueue,
    estimatedWaitMin: Math.round(estimatedWaitMin),
    lastUpdated: new Date(),
    tokens,
  };
};

export const resetQueuePosition = () => { queuePosition = 14; };

export const mockQualityCheck = async (mode: 'ACCEPTED' | 'REJECTED'): Promise<QualityAssessment> => {
  await delay(2000);
  if (mode === 'ACCEPTED') {
    return {
      result: 'ACCEPTED',
      assessedAt: '11:32 AM',
      parameters: [
        { name: 'Moisture', value: '13.8', unit: '%', limit: '≤ 16%', status: 'PASS' },
        { name: 'Foreign Matter', value: '0.4', unit: '%', limit: '≤ 1%', status: 'PASS' },
        { name: 'Grain Quality', value: 'Good', unit: '', limit: 'Good/Fair', status: 'PASS' },
      ],
    };
  }
  return {
    result: 'REJECTED',
    assessedAt: '11:32 AM',
    rejectionReason: 'Moisture Above Limit',
    parameters: [
      { name: 'Moisture', value: '18.2', unit: '%', limit: '≤ 16%', status: 'FAIL' },
      { name: 'Foreign Matter', value: '2.8', unit: '%', limit: '≤ 1%', status: 'FAIL' },
      { name: 'Grain Quality', value: 'Fair', unit: '', limit: 'Good/Fair', status: 'PASS' },
    ],
  };
};

export const mockRecordWeight = async (): Promise<WeighingRecord> => {
  await delay(1000);
  return { grossWeightKg: 3240, tareWeightKg: 240, netWeightKg: 3000, recordedAt: '11:45 AM' };
};

export const mockInitiatePayment = async (_netWeightKg: number): Promise<PaymentRecord> => {
  await delay(1200);
  return {
    procurementValue: 72000,
    msp: 2183,
    status: 'INITIATED',
    transactionId: 'GS102938',
    initiatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    expectedWithinHours: 48,
  };
};

export const mockGenerateReceipt = async (_payment: PaymentRecord): Promise<Receipt> => {
  await delay(500);
  return {
    transactionId: 'GS102938',
    crop: 'Paddy',
    quantity: 3000,
    amount: 72000,
    centre: 'Centre A — Hanamkonda',
    date: '28 May 2024',
    farmerName: 'Ramesh Kumar',
    mobileNumber: '+91 98765 43210',
  };
};

export const mockSubmitGrievance = async (_data: { type: string; description: string }): Promise<{ trackingNumber: string; success: boolean }> => {
  await delay(1500);
  return {
    success: true,
    trackingNumber: `GR${Math.floor(100000 + Math.random() * 900000)}`,
  };
};
