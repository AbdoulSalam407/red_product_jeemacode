import React from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-gray-700 mb-0.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-2 text-gray-400">{icon}</div>}
          <input
            ref={ref}
            className={`input-field text-xs px-2 py-1 ${icon ? 'pl-8' : ''} ${
              error ? 'border-red-500 focus:ring-red-500' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-0.5">{error.message}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
