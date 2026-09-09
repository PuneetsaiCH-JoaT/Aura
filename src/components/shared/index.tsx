import React from 'react';
import { clsx } from 'clsx';

// ============================================================
// Button
// ============================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const base = 'flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#22863A] text-white hover:bg-[#1B5E20] shadow-sm',
    secondary: 'bg-[#E8F5E9] text-[#22863A] hover:bg-[#C8E6C9] border border-[#C8E6C9]',
    outline: 'border-2 border-[#22863A] text-[#22863A] hover:bg-[#E8F5E9]',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-[#22863A] hover:bg-[#E8F5E9]',
  };
  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-3.5',
    lg: 'text-base px-6 py-4',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
};

// ============================================================
// StatusBadge
// ============================================================
interface StatusBadgeProps {
  status: 'OPEN' | 'HIGH_LOAD' | 'BUSY' | 'CLOSED' | 'Active' | 'Moderate' | 'Delayed' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    OPEN: 'bg-green-100 text-green-800',
    Active: 'bg-green-100 text-green-800',
    HIGH_LOAD: 'bg-amber-100 text-amber-800',
    Moderate: 'bg-amber-100 text-amber-800',
    BUSY: 'bg-red-100 text-red-700',
    Delayed: 'bg-red-100 text-red-700',
    CLOSED: 'bg-gray-100 text-gray-600',
  };
  const labels: Record<string, string> = {
    OPEN: '● Open',
    HIGH_LOAD: '● High Load',
    BUSY: '● Busy',
    CLOSED: '● Closed',
    Active: 'Active',
    Moderate: 'Moderate',
    Delayed: 'Delayed',
  };

  return (
    <span className={clsx(
      'text-xs font-semibold px-2.5 py-1 rounded-full',
      styles[status] || 'bg-gray-100 text-gray-600'
    )}>
      {labels[status] || status}
    </span>
  );
};

// ============================================================
// Card
// ============================================================
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'white' | 'green';
}> = ({ children, className, onClick, variant = 'white' }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl p-4',
        variant === 'white'
          ? 'bg-white border border-gray-100 shadow-sm'
          : 'bg-[#E8F5E9] border border-[#C8E6C9]',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================================
// ProgressBar
// ============================================================
export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  color?: 'green' | 'amber' | 'red';
  className?: string;
}> = ({ value, max = 100, color = 'green', className }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors = {
    green: 'bg-[#22863A]',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };
  return (
    <div className={clsx('w-full bg-gray-100 rounded-full h-2', className)}>
      <div
        className={clsx('h-2 rounded-full transition-all duration-500', colors[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

// ============================================================
// MetricCard
// ============================================================
export const MetricCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  color?: 'green' | 'amber' | 'red' | 'blue';
}> = ({ label, value, sub, icon, color = 'green' }) => {
  const colors = {
    green: 'text-[#22863A]',
    amber: 'text-amber-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  };
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={clsx('text-2xl font-bold', colors[color])}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {icon && <div className={clsx('p-2 rounded-xl', color === 'green' ? 'bg-[#E8F5E9]' : 'bg-gray-50')}>{icon}</div>}
      </div>
    </div>
  );
};

// ============================================================
// FormField
// ============================================================
export const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}> = ({ label, children, error, required }) => (
  <div className="mb-4">
    <label className="text-sm font-medium text-gray-600 mb-1.5 block">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ============================================================
// Input
// ============================================================
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
}> = ({ error, className, ...props }) => (
  <input
    className={clsx(
      'w-full border rounded-xl px-4 py-3 text-base text-gray-900',
      'focus:outline-none focus:ring-2 focus:ring-[#22863A] focus:border-transparent',
      'placeholder:text-gray-400 bg-white transition-all',
      error ? 'border-red-400' : 'border-gray-200',
      className
    )}
    {...props}
  />
);

// ============================================================
// Select
// ============================================================
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ options, placeholder, className, ...props }) => (
  <select
    className={clsx(
      'w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900',
      'focus:outline-none focus:ring-2 focus:ring-[#22863A] focus:border-transparent',
      'bg-white appearance-none cursor-pointer',
      className
    )}
    {...props}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

// ============================================================
// PageHeader
// ============================================================
export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}> = ({ title, subtitle, onBack, rightAction }) => (
  <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-50">
    {onBack && (
      <button
        onClick={onBack}
        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    )}
    <div className="flex-1 min-w-0">
      <h1 className="text-base font-bold text-[#1B5E20] truncate">{title}</h1>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {rightAction}
  </div>
);

// ============================================================
// StepBanner (procurement step indicator)
// ============================================================
export const StepBanner: React.FC<{
  step: number;
  total: number;
  label: string;
}> = ({ step, total, label }) => (
  <div className="flex items-center gap-3 px-4 py-2.5 bg-[#E8F5E9] border-b border-[#C8E6C9]">
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'h-1.5 rounded-full transition-all',
            i < step ? 'bg-[#22863A] w-6' : 'bg-gray-200 w-4'
          )}
        />
      ))}
    </div>
    <span className="text-xs font-medium text-[#22863A]">
      Step {step} of {total} — {label}
    </span>
  </div>
);

// ============================================================
// Toast (simple inline notification)
// ============================================================
export const Toast: React.FC<{
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}> = ({ message, type = 'success', onClose }) => {
  const styles = {
    success: 'bg-[#22863A] text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-600 text-white',
  };
  return (
    <div className={clsx(
      'fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-[380px] w-[90%]',
      'px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3',
      styles[type]
    )}>
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ============================================================
// Spinner
// ============================================================
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({
  size = 'md', color = '#22863A'
}) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={clsx('border-4 border-gray-200 border-t-current rounded-full animate-spin', sizes[size])}
      style={{ borderTopColor: color }} />
  );
};

// ============================================================
// EmptyState
// ============================================================
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center py-12 px-6 text-center">
    {icon && <div className="mb-4 text-gray-300">{icon}</div>}
    <p className="font-semibold text-gray-500 text-base">{title}</p>
    {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ============================================================
// CheckIcon / CrossIcon helpers
// ============================================================
export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={clsx('w-5 h-5', className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

export const CrossIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={clsx('w-5 h-5', className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
