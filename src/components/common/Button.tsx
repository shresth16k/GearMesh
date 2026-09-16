import React from 'react';
import './Button.css';
import { ArrowRight } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'capsule' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  withArrow?: boolean;
  caption?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  withArrow = false,
  caption,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const isCapsule = variant === 'capsule';

  const buttonElement = (
    <button
      className={`rewrap-btn rewrap-btn--${variant} rewrap-btn--${size} ${fullWidth ? 'rewrap-btn--full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="rewrap-btn__text">{children}</span>
      {withArrow && <ArrowRight className="rewrap-btn__arrow" size={isCapsule ? 18 : 16} />}
    </button>
  );

  if (caption) {
    return (
      <div className={`rewrap-btn-wrapper ${fullWidth ? 'rewrap-btn-wrapper--full' : ''}`}>
        {buttonElement}
        <p className="rewrap-btn__caption">{caption}</p>
      </div>
    );
  }

  return buttonElement;
};
