import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const variants = {
  primary: 'bg-[#714B67] hover:bg-[#5e3c55] active:bg-[#4d3146] text-white shadow-xs focus:ring-[#714B67]',
  secondary: 'bg-[#F1F1F3] hover:bg-[#e5e5e8] text-[#1B1B26] border border-slate-300 shadow-2xs focus:ring-slate-400',
  emerald: 'bg-[#2AB79B] hover:bg-[#239c84] active:bg-[#1c7e6b] text-white shadow-xs focus:ring-[#2AB79B]',
  coral: 'bg-[#F16E62] hover:bg-[#de5d51] active:bg-[#c94d42] text-white shadow-xs focus:ring-[#F16E62]',
  outline: 'border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-[#1B1B26] focus:ring-[#714B67]',
  ghost: 'bg-transparent hover:bg-slate-200/70 text-[#1B1B26] focus:ring-slate-400',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs font-semibold rounded-[6px] gap-1',
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-[6px] gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-[6px] gap-2',
  lg: 'px-5 py-2.5 text-base font-bold rounded-[6px] gap-2.5',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    iconRight: IconRight,
    type = 'button',
    to,
    href,
    ...props
  },
  ref
) {
  const classes = clsx(
    'inline-flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none no-underline',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className
  );

  const innerContent = (
    <>
      {loading ? (
        <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {innerContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {innerContent}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {innerContent}
    </button>
  );
});

export default Button;
