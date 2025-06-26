import React from 'react';
import clsx from 'clsx';

type Color = 'primary' | 'secondary' | 'success' | 'error' | string;
type Size = 'sm' | 'md' | 'lg';
type Variant = 'text' | 'contained' | 'outlined';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  color?: Color;
  disabled?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

const sizeStyles: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-3',
};

const getColorStyles = (variant: Variant, color: Color) => {
  const colorMap = {
    primary: {
      contained: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-transparent',
      outlined: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-transparent',
      text: 'text-blue-600 hover:bg-blue-50 hover:border-blue-500 focus:ring-transparent',
    },
    secondary: {
      contained: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-transparent',
      outlined: 'border border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-transparent',
      text: 'text-gray-600 hover:bg-gray-50 hover:border-gray-500 focus:ring-transparent',
    },
    success: {
      contained: 'bg-green-600 text-white hover:bg-green-700 focus:ring-transparent',
      outlined: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-transparent',
      text: 'text-green-600 hover:bg-green-50 hover:border-green-500 focus:ring-transparent',
    },
    error: {
      contained: 'bg-red-600 text-white hover:bg-red-700 focus:ring-transparent',
      outlined: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-transparent',
      text: 'text-red-600 hover:bg-red-50 hover:border-red-500 focus:ring-transparent',
    },
  };

  if (color === 'primary' || color === 'secondary' || color === 'error' || color === 'success') {
    return colorMap[color][variant];
  }

  // custom hex color fallback
  const baseText = `text-[${color}]`;
  const baseBg = `bg-[${color}]`;
  const baseBorder = `border-[${color}]`;

  return {
    contained: `${baseBg} text-white hover:opacity-90 focus:ring-transparent`,
    outlined: `${baseBorder} text-[${color}] border hover:bg-[${color}] hover:bg-opacity-10 focus:ring-transparent`,
    text: `${baseText} hover:bg-[${color}] hover:bg-opacity-10 focus:ring-transparent`,
  }[variant];
};

const Button: React.FC<ButtonProps> = ({
  variant = 'text',
  size = 'md',
  color = 'primary',
  disabled = false,
  onClick,
  className,
  children,
  ...rest
}) => {
  const colorClasses = getColorStyles(variant, color);
  const classes = clsx(baseStyles, sizeStyles[size], colorClasses, className);

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;