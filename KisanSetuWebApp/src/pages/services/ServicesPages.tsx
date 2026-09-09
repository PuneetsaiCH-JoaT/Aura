import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button, Card, PageHeader } from '../../components/shared';
import { MOCK_WEATHER, MOCK_SCHEMES, FARMER_RIGHTS } from '../../data/mockData';
import { mockSubmitGrievance } from '../../services/mockApi';
import { clsx } from 'clsx';

// ============================================================
// SERVICES HOME
// ============================================================
export const ServicesHomePage: React.FC = () => {
  const { farmer, navigate } = useAppStore();

  const services = [
    {
      id: 'weather', label: 'Weather', icon: '🌤️',
      sub: 'Forecasts & Alerts', color: 'bg-sky-50 border-sky-200',
      alert: MOCK_WEATHER.severeAlert ? 'Heavy Rain Tomorrow' : undefined
    },
    {
      id: 'schemes', label: 'Schemes', icon: '📋',
      sub: 'Govt Schemes for You', color: 'bg-green-50 border-green-200'
    },
    {
      id: 'farmer-rights', label: 'Farmer Rights', icon: '⚖️',
      sub: 'Know Your Rights', color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'grievance', label: 'Grievance', icon: '📝',
      sub: 'File a Complaint', color: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'ai-assistant', label: 'AI / IVR', icon: '📞',
      sub: '1800-XXX-XXXX', color: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 'procurement-history', label: 'History', icon: '📊',
      sub: 'Past Procurements', color: 'bg-gray-50 border-gray-200'
    },
  ];

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      {/* Header */}
      <div className="bg-[#22863A] px-4 pt-6 pb-5">
        <p className="text-green-200 text-xs mb-1">Good Morning, {farmer?.name?.split(' ')[0] ?? 'Farmer'}</p>
        <h1 className="text-white text-xl font-bold">365-Day Services</h1>
        <p className="text-green-200 text-xs mt-0.5">Everything you need, year-round</p>
      </div>

      {/* Weather alert strip */}
      {MOCK_WEATHER.severeAlert && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <p className="text-xs text-amber-800 font-medium">
            {MOCK_WEATHER.severeAlert.split('–')[0]}
          </p>
        </div>
      )}

      {/* Services grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {services.map(svc => (
            <button
              key={svc.id}
              onClick={() => navigate(svc.id as any)}
              className={clsx(
                'rounded-2xl border p-4 text-left relative transition-all hover:shadow-md active:scale-[0.98]',
                svc.color
              )}
            >
              {svc.alert && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  Alert
                </span>
              )}
              <div className="text-3xl mb-2">{svc.icon}</div>
              <p className="font-bold text-gray-800 text-sm">{svc.label}</p>
              <p className="text-xs text-gray-500">{svc.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Subsidy tracker */}
      <div className="px-4 pb-4">
        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">Subsidy Tracker</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'PM-KISAN Installment', amount: '₹2,000', status: 'Credited', date: 'Apr 2024' },
              { label: 'Rythu Bandhu', amount: '₹10,000/acre', status: 'Due Nov 2024', date: '' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-xs font-medium text-gray-800">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#22863A]">{item.amount}</p>
                  <p className={clsx('text-[10px]', item.status === 'Credited' ? 'text-green-600' : 'text-amber-600')}>
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// WEATHER PAGE
// ============================================================
export const WeatherPage: React.FC = () => {
  const { goBack } = useAppStore();
  const w = MOCK_WEATHER;

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      <PageHeader title="Weather" subtitle={w.location} onBack={goBack} />

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Current weather */}
        <div className="bg-sky-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sky-200 text-xs">{w.location}</p>
              <p className="text-5xl font-extrabold">{w.temperatureC}°C</p>
              <p className="text-sky-100 text-sm mt-1">{w.condition}</p>
            </div>
            <div className="text-7xl">☁️</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <MetricItem label="Humidity" value={`${w.humidity}%`} icon="💧" />
            <MetricItem label="Wind" value={`${w.windKmh} km/h`} icon="💨" />
            <MetricItem label="Rain" value="Low" icon="🌧️" />
          </div>
        </div>

        {/* Alert */}
        {w.severeAlert && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-amber-800 text-sm">Severe Weather Alert</p>
                <p className="text-xs text-amber-700 mt-0.5">{w.severeAlert}</p>
              </div>
            </div>
          </div>
        )}

        {/* 5-day forecast */}
        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">5-Day Forecast</p>
          <div className="flex flex-col gap-0">
            {w.forecast.map((day) => (
              <div key={day.day} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xl w-8">{day.rain ? '🌧️' : day.condition.includes('Cloud') ? '⛅' : '☀️'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{day.day}</p>
                  <p className="text-xs text-gray-500">{day.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{day.tempHigh}°</p>
                  <p className="text-xs text-gray-400">{day.tempLow}°</p>
                </div>
                {day.rain && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Rain</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* Farming advice */}
        <Card variant="green">
          <p className="font-semibold text-[#1B5E20] text-sm mb-2">🌾 Farming Advisory</p>
          <p className="text-xs text-gray-700">
            Heavy rain expected tomorrow. Consider visiting the procurement centre <strong>today</strong> or <strong>Thursday</strong> for better conditions.
          </p>
        </Card>
      </div>
    </div>
  );
};

const MetricItem: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-white/20 rounded-xl p-2 text-center">
    <p className="text-lg">{icon}</p>
    <p className="text-sm font-bold text-white">{value}</p>
    <p className="text-[10px] text-sky-200">{label}</p>
  </div>
);

// ============================================================
// SCHEMES PAGE
// ============================================================
export const SchemesPage: React.FC = () => {
  const { goBack } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      <PageHeader title="Government Schemes" subtitle="Schemes for You" onBack={goBack} />

      <div className="px-4 py-4 flex flex-col gap-3">
        <p className="text-xs text-gray-500">Schemes available in your area</p>

        {MOCK_SCHEMES.map(scheme => (
          <Card key={scheme.id}>
            <button
              className="w-full text-left"
              onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-3">
                  <p className="font-bold text-[#1B5E20] text-sm">{scheme.name}</p>
                  <p className="text-sm font-semibold text-[#22863A] mt-1">{scheme.benefit}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{scheme.description}</p>
                </div>
                <svg
                  className={clsx('w-4 h-4 text-gray-400 mt-1 flex-shrink-0 transition-transform', expanded === scheme.id && 'rotate-180')}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expanded === scheme.id && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Eligibility</p>
                    <p className="text-xs text-gray-700">{scheme.eligibility}</p>
                  </div>
                  {scheme.deadline && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Last Date</p>
                      <p className="text-xs text-red-600 font-medium">{scheme.deadline}</p>
                    </div>
                  )}
                </div>
                <Button variant="secondary" className="mt-3 py-2" size="sm">
                  Check Eligibility & Apply
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// FARMER RIGHTS PAGE
// ============================================================
export const FarmerRightsPage: React.FC = () => {
  const { goBack } = useAppStore();
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after' | 'payment'>('before');

  const tabs = [
    { id: 'before', label: 'Before' },
    { id: 'during', label: 'During' },
    { id: 'after', label: 'After' },
    { id: 'payment', label: 'Payment' },
  ] as const;

  const contentMap = {
    before: FARMER_RIGHTS.beforeSelling,
    during: FARMER_RIGHTS.duringProcurement,
    after: FARMER_RIGHTS.afterProcurement,
    payment: FARMER_RIGHTS.paymentReceipts,
  };

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      <PageHeader title="Know Your Rights" subtitle="Farmer Rights & Protection" onBack={goBack} />

      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
                activeTab === tab.id
                  ? 'bg-[#22863A] text-white'
                  : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        <Card variant="green">
          <p className="text-xs font-semibold text-[#1B5E20]">
            {activeTab === 'before' ? '⚖️ Before Selling' :
             activeTab === 'during' ? '📋 During Procurement' :
             activeTab === 'after' ? '✅ After Procurement' :
             '💰 Payment & Receipts'}
          </p>
        </Card>

        <div className="flex flex-col gap-3">
          {contentMap[activeTab].map((right, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="w-7 h-7 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#22863A]">{i + 1}</span>
              </div>
              <p className="text-sm text-gray-700">{right}</p>
            </div>
          ))}
        </div>

        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-2">📞 Helpline Numbers</p>
          {[
            { label: 'Kisan Call Centre', number: '1800-180-1551' },
            { label: 'PM-KISAN Helpline', number: '155261' },
            { label: 'State Agriculture Dept', number: '1800-599-0019' },
          ].map(h => (
            <div key={h.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-600">{h.label}</span>
              <a href={`tel:${h.number}`} className="text-sm font-bold text-[#22863A]">{h.number}</a>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// GRIEVANCE PAGE
// ============================================================
export const GrievancePage: React.FC = () => {
  const { goBack, addGrievance } = useAppStore();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState<{ trackingNumber: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const types = [
    { value: 'PAYMENT_DELAYED', label: 'Payment Delayed' },
    { value: 'QUALITY_DISPUTE', label: 'Quality Dispute' },
    { value: 'WEIGHING_ISSUE', label: 'Weighing Issue' },
    { value: 'CENTRE_ISSUE', label: 'Centre Issue' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!type) return;
    setLoading(true);
    const result = await mockSubmitGrievance({ type, description });
    addGrievance({
      id: result.trackingNumber,
      type: type as any,
      description,
      submittedAt: new Date().toLocaleTimeString(),
      status: 'SUBMITTED',
      trackingNumber: result.trackingNumber,
    });
    setLoading(false);
    setSubmitted({ trackingNumber: result.trackingNumber });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4">
          <svg className="w-9 h-9 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#1B5E20] mb-1">Complaint Submitted</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Your grievance has been registered with the district agriculture office.
        </p>
        <Card className="w-full mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
            <p className="text-2xl font-bold text-[#22863A]">{submitted.trackingNumber}</p>
            <p className="text-xs text-gray-500 mt-2">Status: Under Review</p>
            <p className="text-xs text-gray-400">Expected resolution: 3-5 working days</p>
          </div>
        </Card>
        <Button onClick={goBack}>
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader title="File a Grievance" subtitle="Report an Issue" onBack={goBack} />

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div>
          <label className="field-label">Select Issue Type *</label>
          <div className="grid grid-cols-1 gap-2">
            {types.map(t => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={clsx(
                  'py-3 px-4 rounded-xl text-sm font-medium border-2 text-left transition-all',
                  type === t.value
                    ? 'border-[#22863A] bg-[#E8F5E9] text-[#1B5E20]'
                    : 'border-gray-200 text-gray-600'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">Describe your issue (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Please describe what happened in detail..."
            className="field-input min-h-[100px] resize-none"
          />
        </div>

        <Card variant="green">
          <p className="text-xs text-[#1B5E20]">
            📋 Your complaint will be reviewed by the District Agriculture Officer within 3-5 working days.
            You will receive an SMS update on your registered mobile number.
          </p>
        </Card>
      </div>

      <div className="px-4 py-4">
        <Button onClick={handleSubmit} loading={loading} disabled={!type}>
          Submit Complaint
        </Button>
      </div>
    </div>
  );
};
