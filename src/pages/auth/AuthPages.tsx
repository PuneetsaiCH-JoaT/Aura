import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../../components/shared';
import { DEMO_FARMER } from '../../data/mockData';

// ============================================================
// SPLASH SCREEN
// ============================================================
export const SplashScreen: React.FC = () => {
  const { navigate, login, setDemoMode } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleDemo = () => {
    setDemoMode(true);
    login(DEMO_FARMER);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#22863A] px-8">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          {/* Logo */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
            <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
              <circle cx="40" cy="40" r="38" fill="#E8F5E9" />
              <path d="M20 55 Q30 35 40 30 Q50 35 60 55" stroke="#22863A" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M40 30 L40 58" stroke="#22863A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M35 45 Q40 38 45 45" fill="#22863A"/>
              <path d="M33 50 Q40 43 47 50" fill="#66BB6A" opacity="0.6"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">KRISHI SETU</h1>
          <p className="text-green-200 text-sm text-center">Government Procurement Platform<br/>for Farmers</p>
        </div>
        <div className="absolute bottom-12 flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/40'} animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[#22863A] flex flex-col items-center justify-center pt-16 pb-10 px-8 flex-1">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl mb-5">
          <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
            <circle cx="40" cy="40" r="38" fill="#E8F5E9" />
            <path d="M20 56 Q32 32 40 26 Q48 32 60 56" stroke="#22863A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M40 26 L40 60" stroke="#22863A" strokeWidth="3" strokeLinecap="round"/>
            <path d="M33 44 Q40 36 47 44" fill="#22863A"/>
            <path d="M31 51 Q40 43 49 51" fill="#4CAF50" opacity="0.7"/>
            <circle cx="25" cy="60" r="3" fill="#66BB6A"/>
            <circle cx="55" cy="60" r="3" fill="#66BB6A"/>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">KRISHI SETU</h1>
        <p className="text-green-200 text-sm text-center leading-relaxed">
          Government Procurement Platform<br/>for Farmers
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
          {['Transparent', 'Real-time', 'Farmer First', 'Trustworthy'].map(tag => (
            <span key={tag} className="bg-white/20 text-white px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white px-6 py-8 flex flex-col gap-3">
        <Button onClick={() => navigate('login')} variant="primary" size="lg">
          Get Started
        </Button>
        <Button onClick={() => navigate('login')} variant="outline" size="lg">
          Login / Register
        </Button>
        <div className="relative my-1">
          <div className="border-t border-gray-200" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-gray-400">or</span>
        </div>
        <button
          onClick={handleDemo}
          className="text-sm text-[#22863A] font-medium py-2 hover:underline"
        >
          🚀 Try Demo Mode (Ramesh Kumar)
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          Government of Telangana · PACS Procurement 2024
        </p>
      </div>
    </div>
  );
};

// ============================================================
// LOGIN PAGE
// ============================================================
export const LoginPage: React.FC = () => {
  const { navigate } = useAppStore();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (mobile.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    useAppStore.setState({ currentPage: 'otp' });
    // Store mobile in a temp state
    sessionStorage.setItem('ks_mobile', mobile);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#22863A] px-6 py-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
          <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
            <circle cx="40" cy="40" r="38" fill="#E8F5E9" />
            <path d="M20 56 Q32 32 40 26 Q48 32 60 56" stroke="#22863A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M40 26 L40 60" stroke="#22863A" strokeWidth="3" strokeLinecap="round"/>
            <path d="M33 44 Q40 36 47 44" fill="#22863A"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">KRISHI SETU</h1>
        <p className="text-green-200 text-xs mt-1">Government Procurement for Farmers</p>
      </div>

      <div className="px-6 py-8 flex-1">
        <h2 className="text-xl font-bold text-[#1B5E20] mb-1">Welcome Back!</h2>
        <p className="text-gray-500 text-sm mb-6">Login to continue</p>

        <div className="mb-4">
          <label className="field-label">Mobile Number</label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">
              +91
            </span>
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="98765 43210"
              maxLength={10}
              className="field-input flex-1"
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <Button onClick={handleSendOtp} loading={loading} className="mb-4">
          Get OTP
        </Button>

        <div className="relative my-4">
          <div className="border-t border-gray-200" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-gray-400">or</span>
        </div>

        <Button variant="secondary" onClick={() => navigate('register')} className="mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
          </svg>
          Continue with Aadhaar
        </Button>

        <p className="text-center text-sm text-gray-500">
          New farmer?{' '}
          <button onClick={() => navigate('register')} className="text-[#22863A] font-semibold hover:underline">
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};

// ============================================================
// OTP PAGE
// ============================================================
export const OtpPage: React.FC = () => {
  const { navigate, login } = useAppStore();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const mobile = sessionStorage.getItem('ks_mobile') || '9876543210';

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 3) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) { setError('Enter 4-digit OTP'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    // Any 4-digit OTP works in demo
    login({ ...DEMO_FARMER, mobile: '+91 ' + mobile });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-8">
      <button onClick={() => navigate('login')} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 mb-6">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#1B5E20] mb-1">Verify OTP</h2>
      <p className="text-gray-500 text-sm mb-8">
        Sent to +91 {mobile}<br/>
        <span className="text-xs text-gray-400">(Demo: use any 4 digits)</span>
      </p>

      <div className="flex gap-3 mb-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="tel"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(idx, e.target.value)}
            className="w-full h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-[#1B5E20] focus:outline-none focus:border-[#22863A] transition-colors"
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <Button onClick={handleVerify} loading={loading} className="mt-4 mb-3">
        Verify & Continue
      </Button>

      <p className="text-center text-sm text-gray-500">
        {resendTimer > 0 ? (
          <span>Resend OTP in <strong className="text-[#22863A]">{resendTimer}s</strong></span>
        ) : (
          <button onClick={() => setResendTimer(30)} className="text-[#22863A] font-semibold">
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
};

// ============================================================
// REGISTER PAGE
// ============================================================
export const RegisterPage: React.FC = () => {
  const { navigate, login } = useAppStore();
  const [form, setForm] = useState({
    name: '', mobile: '', district: '', state: 'Telangana'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.mobile) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    login({
      id: 'F' + Date.now(),
      name: form.name,
      mobile: form.mobile,
      location: form.district,
      district: form.district,
      state: form.state,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-[#22863A] px-6 py-6 flex items-center gap-3">
        <button onClick={() => navigate('login')} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Register as Farmer</h1>
          <p className="text-green-200 text-xs">Create your Krishi Setu account</p>
        </div>
      </div>

      <div className="px-6 py-6 flex-1">
        {['name', 'mobile', 'district'].map(field => (
          <div key={field} className="mb-4">
            <label className="field-label capitalize">{field === 'mobile' ? 'Mobile Number' : field === 'district' ? 'District' : 'Full Name'}</label>
            <input
              type={field === 'mobile' ? 'tel' : 'text'}
              placeholder={field === 'name' ? 'Ramesh Kumar' : field === 'mobile' ? '9876543210' : 'Warangal'}
              value={form[field as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              className="field-input"
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="field-label">State</label>
          <select
            value={form.state}
            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            className="field-input"
          >
            {['Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <Button onClick={handleSubmit} loading={loading}>
          Create Account & Continue
        </Button>

        <p className="text-center text-xs text-gray-400 mt-4">
          By registering, you agree to the Government of India's<br/>
          Digital Farmer Services terms & privacy policy.
        </p>
      </div>
    </div>
  );
};
