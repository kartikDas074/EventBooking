import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

const variantClasses: Record<string, string> = {
  default: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
  neutral: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]';
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${sizeClass} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

export function statusVariant(status: string): BadgeProps['variant'] {
  switch (status.toUpperCase()) {
    case 'PUBLISHED':
    case 'CONFIRMED':
    case 'ACTIVE':
    case 'COMPLETED': return 'success';
    case 'DRAFT':
    case 'PENDING': return 'warning';
    case 'CANCELLED':
    case 'BLOCKED': return 'danger';
    default: return 'neutral';
  }
}
