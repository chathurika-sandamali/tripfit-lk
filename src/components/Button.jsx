import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon = null,
  iconRight = null,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-label-lg rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-label-sm',
    md: 'px-space-lg py-2.5 text-label-md',
    lg: 'px-space-xl py-3.5 text-label-lg',
  };

  const variantStyles = {
    primary:
      'bg-primary-container text-on-primary hover:bg-primary active:scale-[0.98] shadow-sm',
    secondary:
      'bg-surface border border-outline-variant text-primary hover:bg-surface-container active:scale-[0.98]',
    accent:
      'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim font-bold shadow-sm',
    outline:
      'border border-outline-variant text-on-surface hover:bg-surface-container hover:text-on-surface',
    ghost:
      'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children}
      {iconRight && (
        <span className="material-symbols-outlined text-[18px]">{iconRight}</span>
      )}
    </button>
  );
}
