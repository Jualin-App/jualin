import React from 'react';

const Input = ({ 
  label, 
  type, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = true,
  className = '',
  error = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 bg-white border rounded-2xl shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-[#E83030] focus:border-[#E83030] 
          transition-all duration-200
          ${error ? 'border-red-500' : 'border-gray-200'}
        `}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;