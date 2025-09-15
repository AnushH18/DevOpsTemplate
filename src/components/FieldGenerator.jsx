import React, { useCallback, useEffect } from 'react';
import { useForm } from '../contexts/FormContext';
import { validatorRegistry } from '../utils/validators';
import { shouldShowField } from '../utils/formHandlers';
import ValidationError from './ValidationError';

const FieldGenerator = ({ fieldConfig }) => {
  const { values, errors, setFieldValue, setFieldError, clearFieldError } = useForm();
  
  const fieldValue = values[fieldConfig.id] || '';
  const fieldError = errors[fieldConfig.id];

  const validateField = useCallback((value) => {
    if (!fieldConfig.validations) return;

    // Clear existing error first
    clearFieldError(fieldConfig.id);

    // Check required validation
    if (fieldConfig.required && (!value || (typeof value === 'string' && !value.trim()))) {
      setFieldError(fieldConfig.id, 'This field is required');
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value) return;

    // Run field validations
    fieldConfig.validations.forEach(validation => {
      if (typeof validation === 'string') {
        const validator = validatorRegistry[validation];
        if (validator && !validator(value)) {
          setFieldError(fieldConfig.id, getValidationMessage(validation));
        }
      } else if (typeof validation === 'object') {
        const validator = validatorRegistry[validation.type];
        if (validator && !validator(value, validation.params)) {
          setFieldError(fieldConfig.id, validation.message || `Invalid ${validation.type}`);
        }
      }
    });
  }, [fieldConfig, setFieldError, clearFieldError]);

  const handleChange = (value) => {
    setFieldValue(fieldConfig.id, value);
    // Debounced validation
    setTimeout(() => validateField(value), 300);
  };

  // Don't render if field should be hidden
  if (!shouldShowField(fieldConfig, values)) {
    return null;
  }

  const baseInputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  const renderField = () => {
    switch (fieldConfig.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={fieldConfig.type}
            id={fieldConfig.id}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={fieldConfig.placeholder}
            className={baseInputClasses}
            aria-describedby={fieldError ? `${fieldConfig.id}-error` : undefined}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={fieldConfig.id}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={fieldConfig.placeholder}
            rows={4}
            className={baseInputClasses}
            aria-describedby={fieldError ? `${fieldConfig.id}-error` : undefined}
          />
        );

      case 'select':
        return (
          <select
            id={fieldConfig.id}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            className={baseInputClasses}
            aria-describedby={fieldError ? `${fieldConfig.id}-error` : undefined}
          >
            <option value="">Select an option</option>
            {fieldConfig.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {fieldConfig.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={fieldConfig.id}
                  value={option.value}
                  checked={fieldValue === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 dark:text-cyan-500 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        if (fieldConfig.multiple) {
          // Multiple checkboxes
          const selectedValues = Array.isArray(fieldValue) ? fieldValue : [];
          return (
            <div className="space-y-2">
              {fieldConfig.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option]
                        : selectedValues.filter(v => v !== option);
                      handleChange(newValues);
                    }}
                    className="w-4 h-4 text-blue-600 dark:text-cyan-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fieldValue === true}
                onChange={(e) => handleChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 dark:text-cyan-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {fieldConfig.label}
              </span>
            </label>
          );
        }

      case 'checklist':
        const selectedItems = Array.isArray(fieldValue) ? fieldValue : [];
        return (
          <div className="space-y-2">
            {fieldConfig.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedItems, option]
                      : selectedItems.filter(v => v !== option);
                    handleChange(newValues);
                  }}
                  className="w-4 h-4 text-blue-600 dark:text-cyan-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            id={fieldConfig.id}
            onChange={(e) => handleChange(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
            aria-describedby={fieldError ? `${fieldConfig.id}-error` : undefined}
          />
        );

      default:
        return (
          <input
            type="text"
            id={fieldConfig.id}
            value={fieldValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={fieldConfig.placeholder}
            className={baseInputClasses}
            aria-describedby={fieldError ? `${fieldConfig.id}-error` : undefined}
          />
        );
    }
  };

  return (
    <div className="mb-6">
      {fieldConfig.type !== 'checkbox' || fieldConfig.multiple ? (
        <label htmlFor={fieldConfig.id} className={labelClasses}>
          {fieldConfig.label}
          {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      ) : null}
      
      {renderField()}
      
      {fieldConfig.helpText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {fieldConfig.helpText}
        </p>
      )}
      
      <ValidationError error={fieldError} />
    </div>
  );
};

const getValidationMessage = (validationType) => {
  const messages = {
    required: 'This field is required',
    url: 'Please enter a valid URL',
    email: 'Please enter a valid email address'
  };
  
  return messages[validationType] || 'Invalid input';
};

export default FieldGenerator;