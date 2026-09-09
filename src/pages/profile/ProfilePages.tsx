import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Button, Card, PageHeader } from '../../components/shared';
import { clsx } from 'clsx';

// ============================================================
// PROFILE PAGE
// ============================================================
export const ProfilePage: React.FC = () => {
  const { farmer, logout, navigate } = useAppStore();

  const menuItems = [
    { icon: '🌾', label: 'My Farm Details', sub: '4.5 acres · Paddy, Cotton', action: () => {} },
    { icon: '📊', label: 'Procurement History', sub: '3 transactions this season', action: () => navigate('procurement-history') },
    { icon: '📄', label: 'Documents', sub: 'Aadhaar, Land Records, Bank', action: () => {} },
    { icon: '⚙️', label: 'Settings', sub: 'Language, Notifications', action: () => {} },
    { icon: '❓', label: 'Help & Support', sub: 'FAQs, Contact Us', action: () => {} },
  ];

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      {/* Header */}
      <div className="bg-[#22863A] px-4 pt-6 pb-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-green-200 text-xs mb-1">Farmer Profile</p>
            <h1 className="text-white text-xl font-bold">{farmer?.name ?? 'Ramesh Kumar'}</h1>
            <p className="text-green-200 text-sm">{farmer?.mobile ?? '+91 98765 43210'}</p>
            <p className="text-green-200 text-xs mt-0.5">{farmer?.district}, {farmer?.state}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{(farmer?.name ?? 'R')[0]}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { label: 'Procurements', value: '3' },
              { label: 'Total Sold', value: '9T' },
              { label: 'Total Earned', value: '₹2.1L' },
            ].map(stat => (
              <div key={stat.label} className="text-center px-2">
                <p className="text-xl font-bold text-[#22863A]">{stat.value}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-4 flex flex-col gap-2">
        {menuItems.map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl w-8 text-center">{item.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}

        <button
          onClick={logout}
          className="mt-2 w-full py-3.5 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

// ============================================================
// NOTIFICATIONS PAGE
// ============================================================
export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationsRead, goBack } = useAppStore();

  React.useEffect(() => {
    markNotificationsRead();
  }, []);

  const typeIcon = (type: string) => {
    const icons: Record<string, string> = {
      ALERT: '⚠️',
      INFO: 'ℹ️',
      SUCCESS: '✅',
      WARNING: '🌧️',
    };
    return icons[type] ?? '📢';
  };

  const typeBg = (type: string) => {
    const bgs: Record<string, string> = {
      ALERT: 'bg-amber-50 border-amber-200',
      INFO: 'bg-blue-50 border-blue-200',
      SUCCESS: 'bg-green-50 border-green-200',
      WARNING: 'bg-amber-50 border-amber-200',
    };
    return bgs[type] ?? 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      <PageHeader
        title="Notifications"
        subtitle={`${notifications.length} alerts`}
        onBack={goBack}
        rightAction={
          <button className="text-xs text-[#22863A] font-medium py-1 px-2">
            Mark all read
          </button>
        }
      />

      <div className="px-4 py-4 flex flex-col gap-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={clsx(
              'rounded-xl border p-3 flex items-start gap-3',
              typeBg(notif.type)
            )}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{typeIcon(notif.type)}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{notif.title}</p>
              <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
              <p className="text-[10px] text-gray-400 mt-1">{notif.createdAt}</p>
            </div>
            {!notif.isRead && (
              <div className="w-2 h-2 bg-[#22863A] rounded-full mt-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// PROCUREMENT HISTORY PAGE
// ============================================================
export const ProcurementHistoryPage: React.FC = () => {
  const { goBack } = useAppStore();

  const history = [
    { id: 'H001', date: '28 May 2024', crop: 'Paddy', quantity: '3,000 kg', amount: '₹72,000', status: 'PAID', centre: 'Centre A' },
    { id: 'H002', date: '15 Feb 2024', crop: 'Paddy', quantity: '2,500 kg', amount: '₹58,750', status: 'PAID', centre: 'Centre A' },
    { id: 'H003', date: '20 Nov 2023', crop: 'Wheat', quantity: '1,800 kg', amount: '₹38,340', status: 'PAID', centre: 'Centre C' },
  ];

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      <PageHeader title="Procurement History" subtitle="All past transactions" onBack={goBack} />

      <div className="px-4 py-4 flex flex-col gap-3">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs text-gray-500">Total Earned</p>
            <p className="text-xl font-bold text-[#22863A]">₹1,69,090</p>
            <p className="text-xs text-gray-400">This season</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500">Transactions</p>
            <p className="text-xl font-bold text-[#22863A]">3</p>
            <p className="text-xs text-gray-400">All successful</p>
          </Card>
        </div>

        {history.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-[#1B5E20] text-sm">{item.crop}</p>
                <p className="text-xs text-gray-500">{item.date} · {item.centre}</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                {item.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{item.quantity}</span>
              <span className="text-base font-bold text-[#22863A]">{item.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
