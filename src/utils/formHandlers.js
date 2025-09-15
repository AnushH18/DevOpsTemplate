export const handleFormSubmission = (formData, formConfig) => {
  console.log('Form Submission:', {
    formId: formConfig.id,
    formName: formConfig.name,
    data: formData,
    timestamp: new Date().toISOString()
  });
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `${formConfig.name} submitted successfully!`
      });
    }, 1000);
  });
};

export const validateFormData = (formData, formConfig, validationRegistry) => {
  const errors = {};
  
  formConfig.fields.forEach(field => {
    const value = formData[field.id];
    
    // Check required validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field.id] = 'This field is required';
      return;
    }
    
    // Skip validation if field is empty and not required
    if (!value) return;
    
    // Run field validations
    if (field.validations) {
      field.validations.forEach(validation => {
        if (typeof validation === 'string') {
          // Simple validation like 'required', 'url', 'email'
          const validator = validationRegistry[validation];
          if (validator && !validator(value)) {
            errors[field.id] = getValidationMessage(validation);
          }
        } else if (typeof validation === 'object') {
          // Custom validation with parameters
          const validator = validationRegistry[validation.type];
          if (validator && !validator(value, validation.params)) {
            errors[field.id] = validation.message || `Invalid ${validation.type}`;
          }
        }
      });
    }
  });
  
  return errors;
};

const getValidationMessage = (validationType) => {
  const messages = {
    required: 'This field is required',
    url: 'Please enter a valid URL',
    email: 'Please enter a valid email address'
  };
  
  return messages[validationType] || 'Invalid input';
};

export const shouldShowField = (field, formValues) => {
  // Handle conditional fields
  if (field.conditional) {
    // This would need specific business logic based on the conditional value
    // For now, we'll show all fields
    return true;
  }
  
  // Handle dependencies
  if (field.dependencies) {
    return field.dependencies.every(depId => {
      const depValue = formValues[depId];
      return depValue !== null && depValue !== undefined && depValue !== '';
    });
  }
  
  return true;
};