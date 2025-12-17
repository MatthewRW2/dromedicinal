'use client';

import { forwardRef } from 'react';

/**
 * Componente Input - Campo de texto reutilizable
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    type = 'text',
    className = '',
    required = false,
    disabled = false,
    icon,
    ...props
  },
  ref
) {
  const inputId = props.id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-brand-red ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-lg
            border border-gray-300
            text-gray-900 placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-brand-red focus:ring-brand-red focus:border-brand-red' : ''}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-brand-red">{error}</p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

export default Input;

/**
 * Componente Textarea - Área de texto reutilizable
 */
export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helper,
    className = '',
    required = false,
    disabled = false,
    rows = 4,
    ...props
  },
  ref
) {
  const inputId = props.id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-brand-red ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={inputId}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-2.5 rounded-lg
          border border-gray-300
          text-gray-900 placeholder:text-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
          resize-y min-h-[100px]
          ${error ? 'border-brand-red focus:ring-brand-red focus:border-brand-red' : ''}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-brand-red">{error}</p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

/**
 * Componente Select - Selector reutilizable
 */
export const Select = forwardRef(function Select(
  {
    label,
    error,
    helper,
    className = '',
    required = false,
    disabled = false,
    options = [],
    placeholder = 'Seleccionar...',
    ...props
  },
  ref
) {
  const inputId = props.id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-brand-red ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={inputId}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2.5 rounded-lg
          border border-gray-300
          text-gray-900
          bg-white
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
          cursor-pointer
          ${error ? 'border-brand-red focus:ring-brand-red focus:border-brand-red' : ''}
        `}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-brand-red">{error}</p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

