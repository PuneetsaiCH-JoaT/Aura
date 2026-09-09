import React from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/appStore';
import type { MainTab } from '../../types';

const tabs: { id: MainTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (active) => (
      <svg className={clsx('w-6 h-6', active ? 'text-[#22863A]' : 'text-gray-400')} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'procurement',
    label: 'Track',
    icon: (active) => (
      <svg className={clsx('w-6 h-6', active ? 'text-[#22863A]' : 'text-gray-400')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Services',
    icon: (active) => (
      <svg className={clsx('w-6 h-6', active ? 'text-[#22863A]' : 'text-gray-400')} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: (active) => (
      <svg className={clsx('w-6 h-6', active ? 'text-[#22863A]' : 'text-gray-400')} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (active) => (
      <svg className={clsx('w-6 h-6', active ? 'text-[#22863A]' : 'text-gray-400')} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const BottomNavigation: React.FC = () => {
  const { currentTab, setTab, unreadCount, booking, navigate } = useAppStore();

  const handleTabClick = (tab: MainTab) => {
    if (tab === 'procurement' && booking) {
      setTab('procurement');
    } else if (tab === 'procurement' && !booking) {
      navigate('centres');
    } else {
      setTab(tab);
    }
  };

  return (
    <div className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={clsx(
            'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors relative',
            currentTab === tab.id ? 'text-[#22863A]' : 'text-gray-400'
          )}
        >
          <div className="relative">
            {tab.icon(currentTab === tab.id)}
            {tab.id === 'notifications' && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className={clsx(
            'text-[10px] font-medium',
            currentTab === tab.id ? 'text-[#22863A]' : 'text-gray-400'
          )}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};
