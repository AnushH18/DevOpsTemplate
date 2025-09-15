export const validateDomainByType = (value, params) => {
  const { urlTypeField } = params;
  const patterns = {
    'customer-facing': /\.masterworkslive\.com$/,
    'internal': /\.aurigo\.net$/
  };
  
  // This would need access to form values to get the urlType
  // For now, we'll return true and handle this in the component
  return true;
};

export const validateMWVersion = (value, params) => {
  const { minVersion } = params;
  const parseVersion = (version) => {
    return version.split('.').map(num => parseInt(num, 10));
  };
  
  try {
    const valueVersion = parseVersion(value);
    const minVersionParts = parseVersion(minVersion);
    
    for (let i = 0; i < Math.max(valueVersion.length, minVersionParts.length); i++) {
      const valuePart = valueVersion[i] || 0;
      const minPart = minVersionParts[i] || 0;
      
      if (valuePart > minPart) return true;
      if (valuePart < minPart) return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const validatePipelineNaming = (value, params) => {
  const { pattern } = params;
  const regex = new RegExp(pattern);
  return regex.test(value);
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateUrl = (value) => {
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlPattern.test(value);
};

export const validateEmail = (value) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
};

export const validatorRegistry = {
  required: validateRequired,
  url: validateUrl,
  email: validateEmail,
  validateDomainByType,
  validateMWVersion,
  validatePipelineNaming
};