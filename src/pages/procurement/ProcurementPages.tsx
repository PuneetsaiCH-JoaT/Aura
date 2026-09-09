import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button, Card, PageHeader, CheckIcon, CrossIcon, StepBanner } from '../../components/shared';
import { mockQualityCheck, mockRecordWeight, mockInitiatePayment } from '../../services/mockApi';
import type { QualityParameter, QualityAssessment } from '../../types';
import { clsx } from 'clsx';

// ============================================================
// QUALITY ASSESSMENT PAGE
// ============================================================
export const QualityCheckPage: React.FC = () => {
  const { navigate, goBack, setQualityAssessment, demoQualityMode, setProcurementStep } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<QualityAssessment | null>(null);

  useEffect(() => {
    mockQualityCheck(demoQualityMode).then((qa) => {
      setResult(qa);
      setQualityAssessment(qa);
      setLoading(false);
    });
  }, [demoQualityMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8">
        <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[#22863A] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Quality Assessment</h2>
        <p className="text-gray-500 text-sm text-center">Analyzing your produce samples...</p>
        <div className="mt-6 flex gap-3">
          {['Moisture', 'Foreign\nMatter', 'Grain\nQuality'].map((p, i) => (
            <div key={p} className="flex flex-col items-center gap-1">
              <div
                className="w-3 bg-[#22863A] rounded-full animate-pulse"
                style={{ height: `${24 + i * 12}px`, animationDelay: `${i * 0.2}s` }}
              />
              <p className="text-[9px] text-gray-400 text-center whitespace-pre-line">{p}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  if (result.result === 'REJECTED') {
    return (
      <QualityRejectedPage
        parameters={result.parameters}
        reason={result.rejectionReason ?? 'Quality below acceptable limit'}
      />
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Quality Assessment" subtitle="Initial Check" onBack={goBack} />
      <StepBanner step={2} total={3} label="Quality Check" />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="bg-[#22863A] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <CheckIcon className="w-8 h-8 text-[#22863A]" />
          </div>
          <div>
            <p className="text-green-200 text-xs">Early Quality Assessment</p>
            <p className="text-2xl font-extrabold text-white">QUALITY ACCEPTED</p>
            <p className="text-green-200 text-xs mt-0.5">Assessed at {result.assessedAt}</p>
          </div>
        </div>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">Quality Parameters</p>
          <div className="flex flex-col gap-3">
            {result.parameters.map(param => (
              <ParameterRow key={param.name} param={param} />
            ))}
          </div>
        </Card>

        <Card variant="green">
          <p className="text-xs text-[#1B5E20] font-semibold mb-1">✅ Why was this accepted?</p>
          <p className="text-xs text-gray-700">
            All quality parameters are within government-mandated limits for Paddy procurement.
            Assessment by certified quality inspector ID: QI-2847.
          </p>
        </Card>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-2">What happens next?</p>
          <div className="flex flex-col gap-1.5">
            {['✓ Quality Accepted', '→ Proceed to Weighing', '→ Procurement Acceptance', '→ Payment Initiation'].map((s, i) => (
              <p key={i} className={clsx('text-xs', i === 0 ? 'text-green-600 font-semibold' : 'text-gray-500')}>{s}</p>
            ))}
          </div>
        </Card>
      </div>

      <div className="px-4 py-4">
        <Button onClick={() => { setProcurementStep('WEIGHING'); navigate('weighing'); }} size="lg">
          Proceed to Weighing
        </Button>
      </div>
    </div>
  );
};

const ParameterRow: React.FC<{ param: QualityParameter }> = ({ param }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-800">{param.name}</p>
      <p className="text-xs text-gray-500">Limit: {param.limit}</p>
    </div>
    <div className="flex items-center gap-2">
      <p className={clsx('font-bold text-sm', param.status === 'PASS' ? 'text-[#22863A]' : 'text-red-500')}>
        {param.value}{param.unit}
      </p>
      <div className={clsx(
        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
        param.status === 'PASS' ? 'bg-green-100' : 'bg-red-100'
      )}>
        {param.status === 'PASS'
          ? <CheckIcon className="w-4 h-4 text-green-600" />
          : <CrossIcon className="w-4 h-4 text-red-500" />
        }
      </div>
    </div>
  </div>
);

// ============================================================
// QUALITY REJECTED PAGE
// ============================================================
const QualityRejectedPage: React.FC<{ parameters: QualityParameter[]; reason: string }> = ({
  parameters, reason
}) => {
  const { navigate, booking, addGrievance, setProcurementStep } = useAppStore();
  const [view, setView] = useState<'options' | 'grievance' | 'done'>('options');
  const [grievanceText, setGrievanceText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGrievance = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    const trackingId = `GR${Math.floor(100000 + Math.random() * 900000)}`;
    addGrievance({
      id: trackingId,
      type: 'QUALITY_DISPUTE',
      description: grievanceText || 'Quality rejection disputed by farmer',
      submittedAt: new Date().toLocaleTimeString(),
      status: 'SUBMITTED',
      trackingNumber: trackingId,
    });
    setSubmitting(false);
    setView('done');
  };

  if (view === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
        <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4">
          <CheckIcon className="w-9 h-9 text-[#22863A]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B5E20] mb-1">Grievance Submitted</h2>
        <p className="text-gray-500 text-sm mb-6">
          A quality inspector will contact you within 24 hours.
        </p>
        <Card className="w-full mb-4 text-left">
          <p className="text-xs text-gray-500">Tracking Number</p>
          <p className="text-xl font-bold text-[#22863A]">GR{Math.floor(100000 + Math.random() * 900000)}</p>
          <p className="text-xs text-gray-500 mt-1">Status: Under Review</p>
        </Card>
        <Button onClick={() => navigate('centres')}>Book New Slot</Button>
      </div>
    );
  }

  if (view === 'grievance') {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <PageHeader title="File Grievance" onBack={() => setView('options')} />
        <div className="px-4 py-4 flex flex-col gap-4 flex-1">
          <Card>
            <p className="font-semibold text-[#1B5E20] mb-2 text-sm">Quality Dispute</p>
            <p className="text-xs text-gray-600 mb-3">
              Rejection reason: <strong className="text-red-600">{reason}</strong>
            </p>
            <label className="field-label">Your concern (optional)</label>
            <textarea
              value={grievanceText}
              onChange={e => setGrievanceText(e.target.value)}
              placeholder="Describe why you disagree with this assessment..."
              className="field-input min-h-[100px] resize-none"
            />
          </Card>
          <Button onClick={handleGrievance} loading={submitting}>Submit Grievance</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Quality Assessment" subtitle="Initial Check" />
      <StepBanner step={2} total={3} label="Quality Check" />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="bg-red-500 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <CrossIcon className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <p className="text-red-200 text-xs">Quality Assessment Result</p>
            <p className="text-2xl font-extrabold text-white">QUALITY REJECTED</p>
            <p className="text-red-100 text-xs mt-0.5">Reason: {reason}</p>
          </div>
        </div>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">Quality Parameters</p>
          {parameters.map(p => <ParameterRow key={p.name} param={p} />)}
        </Card>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-semibold text-amber-800 text-sm">Token Released</p>
          </div>
          <p className="text-xs text-amber-700">
            Token <strong>{booking?.tokenNumber ?? 'A104'}</strong> has been released. You can rebook after improving crop quality.
          </p>
        </div>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">What can you do?</p>
          {[
            { icon: '💧', text: 'Remove moisture / recheck quality, then rebook' },
            { icon: '🔄', text: 'Request re-assessment by a senior quality inspector' },
            { icon: '❌', text: 'Cancel and take your crop back' },
          ].map((opt, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="text-xl">{opt.icon}</span>
              <p className="text-xs text-gray-700">{opt.text}</p>
            </div>
          ))}
        </Card>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        <Button onClick={() => { setProcurementStep('IDLE'); navigate('crop-quantity'); }}>
          🔄 Rebook After Fixing Quality
        </Button>
        <Button variant="secondary" onClick={() => setView('grievance')}>
          📋 File a Grievance
        </Button>
        <Button variant="outline" onClick={() => navigate('centres')}>
          Cancel & Go Back
        </Button>
      </div>
    </div>
  );
};

// ============================================================
// WEIGHING PAGE
// ============================================================
export const WeighingPage: React.FC = () => {
  const { navigate, goBack, setWeighingRecord, setProcurementStep } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<{ grossWeightKg: number; tareWeightKg: number; netWeightKg: number; recordedAt: string } | null>(null);

  useEffect(() => {
    mockRecordWeight().then(r => {
      setRecord(r);
      setWeighingRecord(r);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Weighing" subtitle="Step 3 of 3" onBack={goBack} />
      <StepBanner step={3} total={3} label="Digital Weighing" />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#22863A] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Weighing in progress...</p>
          </div>
        ) : record ? (
          <>
            <div className="flex items-center justify-center py-2">
              <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <WeightCard label="Gross Weight" value={`${record.grossWeightKg.toLocaleString()} kg`} />
              <WeightCard label="Tare Weight" value={`${record.tareWeightKg} kg`} dim />
              <WeightCard label="Net Weight" value={`${record.netWeightKg.toLocaleString()} kg`} highlight />
            </div>

            <Card>
              {[
                ['Recorded At', record.recordedAt],
                ['Weighing Machine ID', 'WM-1042'],
                ['Inspector', 'WI-3921'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{l}</span>
                  <span className="text-sm font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </Card>

            <Card variant="green">
              <p className="text-xs text-[#1B5E20]">
                ✅ Weight recorded in your presence. Inspector ID verified.
                You can request a recheck if you disagree.
              </p>
            </Card>
          </>
        ) : null}
      </div>

      {!loading && (
        <div className="px-4 py-4">
          <Button onClick={() => { setProcurementStep('ACCEPTED'); navigate('acceptance'); }} size="lg">
            Weight Recorded — Proceed
          </Button>
        </div>
      )}
    </div>
  );
};

const WeightCard: React.FC<{ label: string; value: string; highlight?: boolean; dim?: boolean }> = ({
  label, value, highlight, dim
}) => (
  <div className={clsx(
    'rounded-2xl p-3 text-center',
    highlight ? 'bg-[#22863A] text-white' : 'bg-gray-50'
  )}>
    <p className={clsx('text-lg font-bold', highlight ? 'text-white' : dim ? 'text-gray-400' : 'text-gray-800')}>
      {value}
    </p>
    <p className={clsx('text-[10px] mt-0.5', highlight ? 'text-green-200' : 'text-gray-500')}>{label}</p>
  </div>
);

// ============================================================
// ACCEPTANCE PAGE
// ============================================================
export const AcceptancePage: React.FC = () => {
  const { navigate, weighingRecord, setPaymentRecord, setProcurementStep, booking } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleTrackPayment = async () => {
    setLoading(true);
    const payment = await mockInitiatePayment(weighingRecord?.netWeightKg ?? 3000);
    setPaymentRecord(payment);
    setProcurementStep('PAYMENT_PROCESSING');
    setLoading(false);
    navigate('payment-status');
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Procurement Acceptance" />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="bg-[#22863A] rounded-2xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#22863A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <p className="text-green-200 text-xs">Procurement Status</p>
              <p className="text-2xl font-extrabold text-white">Procurement Accepted!</p>
            </div>
          </div>
          {['Quality Approved', 'Weight Verified', 'All Good'].map(item => (
            <div key={item} className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-[#22863A]" />
              </div>
              <span className="text-white text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>

        <Card className="text-center">
          <p className="text-xs text-gray-500 mb-1">Procurement Value</p>
          <p className="text-4xl font-extrabold text-[#22863A]">₹72,000</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((weighingRecord?.netWeightKg ?? 3000) / 100)} quintals × ₹2,183 MSP
          </p>
        </Card>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">Procurement Summary</p>
          {[
            ['Crop', booking?.cropDetails?.crop ?? 'Paddy'],
            ['Net Weight', `${(weighingRecord?.netWeightKg ?? 3000).toLocaleString()} kg`],
            ['MSP Rate', '₹2,183/quintal'],
            ['Centre', booking?.centre?.name?.split('—')[0]?.trim() ?? 'Centre A'],
            ['Date', booking?.date ?? '28 May 2024'],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{l}</span>
              <span className="text-sm font-semibold text-gray-800">{v}</span>
            </div>
          ))}
        </Card>

        <Card variant="green">
          <p className="text-xs text-[#1B5E20] font-semibold">💰 Payment Timeline</p>
          <p className="text-xs text-gray-700 mt-1">
            ₹72,000 will be credited directly to your bank account within <strong>48 hours</strong>.
          </p>
        </Card>
      </div>

      <div className="px-4 py-4">
        <Button onClick={handleTrackPayment} loading={loading} size="lg">
          Track Payment
        </Button>
      </div>
    </div>
  );
};

// ============================================================
// PAYMENT STATUS PAGE
// ============================================================
export const PaymentStatusPage: React.FC = () => {
  const { paymentRecord, navigate, setProcurementStep, setReceipt } = useAppStore();
  const [currentStatus, setCurrentStatus] = useState<'INITIATED' | 'PROCESSING' | 'COMPLETED'>('INITIATED');

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStatus('PROCESSING'), 3000);
    const t2 = setTimeout(async () => {
      setCurrentStatus('COMPLETED');
      setProcurementStep('PAID');
      if (paymentRecord) {
        const { mockGenerateReceipt } = await import('../../services/mockApi');
        const r = await mockGenerateReceipt(paymentRecord);
        setReceipt(r);
      }
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const steps = [
    { id: 'INITIATED' as const, label: 'Payment Initiated', sub: paymentRecord?.initiatedAt ?? '11:45 AM' },
    { id: 'PROCESSING' as const, label: 'Processing', sub: 'Bank verification in progress' },
    { id: 'COMPLETED' as const, label: 'Payment Completed', sub: 'Credited to your account' },
  ];

  const statusOrder = ['INITIATED', 'PROCESSING', 'COMPLETED'];
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="Payment Status" />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="bg-[#22863A] rounded-2xl p-5 text-center">
          <p className="text-green-200 text-xs mb-1">Procurement Amount</p>
          <p className="text-4xl font-extrabold text-white">₹72,000</p>
          <p className="text-green-200 text-xs mt-1">
            Transaction ID: {paymentRecord?.transactionId ?? 'GS102938'}
          </p>
        </div>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-4">Payment Timeline</p>
          <div className="relative">
            <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-gray-100" />
            {steps.map((step, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={step.id} className="flex gap-3 pb-5 last:pb-0 relative">
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10',
                    done && !active ? 'bg-[#22863A]' : active ? 'bg-amber-500 animate-pulse' : 'bg-gray-200'
                  )}>
                    {done && !active
                      ? <CheckIcon className="w-4 h-4 text-white" />
                      : <span className="w-2 h-2 bg-white rounded-full" />
                    }
                  </div>
                  <div>
                    <p className={clsx('font-semibold text-sm', done ? 'text-[#1B5E20]' : 'text-gray-400')}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card variant="green">
          <p className="text-xs text-[#1B5E20] font-semibold">📅 Expected Payment</p>
          <p className="text-sm font-bold text-[#1B5E20] mt-0.5">Within 48 Hours</p>
          <p className="text-xs text-gray-600 mt-1">Payment credited to: XXXX XXXX 5678 (SBI)</p>
        </Card>

        {currentStatus === 'COMPLETED' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22863A] rounded-full flex items-center justify-center">
              <CheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1B5E20] text-sm">Payment Successful! 🎉</p>
              <p className="text-xs text-green-700">₹72,000 credited to your account</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        <Button onClick={() => navigate('digital-receipt')} size="lg">
          View Digital Receipt
        </Button>
      </div>
    </div>
  );
};

// ============================================================
// DIGITAL RECEIPT
// ============================================================
export const DigitalReceiptPage: React.FC = () => {
  const { receipt, navigate, resetProcurement } = useAppStore();
  const [downloaded, setDownloaded] = useState(false);

  const r = receipt ?? {
    transactionId: 'GS102938',
    crop: 'Paddy',
    quantity: 3000,
    amount: 72000,
    centre: 'Centre A — Hanamkonda',
    date: '28 May 2024',
    farmerName: 'Ramesh Kumar',
    mobileNumber: '+91 98765 43210',
  };

  const handleDownload = () => {
    const text = [
      'KRISHI SETU — PROCUREMENT RECEIPT',
      '===================================',
      `Transaction ID : ${r.transactionId}`,
      `Crop           : ${r.crop}`,
      `Quantity       : ${r.quantity.toLocaleString()} kg`,
      `Amount         : ₹${r.amount.toLocaleString()}`,
      `Centre         : ${r.centre}`,
      `Date           : ${r.date}`,
      `Farmer         : ${r.farmerName}`,
      `Mobile         : ${r.mobileNumber}`,
      '===================================',
      'Government of Telangana · PACS Procurement 2024',
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KrishiSetu_${r.transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="bg-[#22863A] px-6 py-6 flex flex-col items-center">
        <svg className="w-10 h-10 text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-xl font-bold text-white">Procurement Receipt</h2>
        <p className="text-green-200 text-xs">Official Government Record</p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="border-2 border-dashed border-[#22863A] rounded-2xl overflow-hidden">
          <div className="bg-[#E8F5E9] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#22863A] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#1B5E20] text-sm">KRISHI SETU</p>
              <p className="text-xs text-gray-500">Government Procurement Platform</p>
            </div>
          </div>

          <div className="px-4 py-4">
            {([
              ['Transaction ID', r.transactionId],
              ['Crop', r.crop],
              ['Quantity', `${r.quantity.toLocaleString()} kg`],
              ['Amount', `₹${r.amount.toLocaleString()}`],
              ['Centre', r.centre.split('—')[0].trim()],
              ['Date', r.date],
              ['Farmer', r.farmerName],
              ['Mobile', r.mobileNumber],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-500">{label}</span>
                <span className={clsx(
                  'text-sm font-semibold',
                  label === 'Amount' ? 'text-[#22863A] text-base' :
                  label === 'Transaction ID' ? 'text-[#22863A] font-bold' : 'text-gray-800'
                )}>{value}</span>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 bg-gray-50 text-center">
            <p className="text-xs text-gray-400">
              Government of Telangana · PACS Procurement 2024<br />
              Official document — No signature required
            </p>
          </div>
        </div>

        {downloaded && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700">Receipt downloaded successfully!</p>
          </div>
        )}
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        <Button onClick={handleDownload}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Receipt
        </Button>
        <Button variant="secondary" onClick={() => {
          if (navigator.share) {
            navigator.share({ title: 'Krishi Setu Receipt', text: `Token A104 · ₹${r.amount.toLocaleString()} · ${r.date}` });
          }
        }}>
          Share Receipt
        </Button>
        <Button variant="outline" onClick={() => { resetProcurement(); navigate('centres'); }}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};
