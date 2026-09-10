import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Exact 2x padding rule: py-1.5 px-3, py-2 px-4, py-2.5 px-5
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'py-1.5 px-3 text-xs gap-1.5',
      md: 'py-2 px-4 text-sm gap-2',
      lg: 'py-2.5 px-5 text-base gap-2.5',
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-[var(--palette-blue-700)] text-white hover:bg-[var(--palette-blue-800)] active:bg-[var(--palette-blue-900)] shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2',
      secondary:
        'bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)] shadow-xs focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
      outline:
        'bg-transparent text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
      danger:
        'bg-[var(--palette-rose-600)] text-white hover:bg-[var(--palette-rose-700)] shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[var(--border-danger)]',
      ghost:
        'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] border border-transparent focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 select-none whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none outline-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
