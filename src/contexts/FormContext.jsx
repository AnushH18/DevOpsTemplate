import React, { createContext, useContext, useReducer } from 'react';

const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FORM_NAME':
      return { ...state, formName: action.name };
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.fieldId]: action.value }
      };
    case 'SAVE_FORM_DATA':
      const formData = {
        name: action.formConfig.name,
        data: { ...state.values }
      };
      return {
        ...state,
        savedForms: { ...state.savedForms, [action.formConfig.id]: formData }
      };
    case 'LOAD_SAVED_FORM':
      const savedForm = state.savedForms[action.formId];
      return {
        ...state,
        config: action.config,
        values: savedForm ? { ...savedForm.data } : {},
        errors: {}
      };
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.fieldId]: action.error }
      };
    case 'CLEAR_FIELD_ERROR':
      const { [action.fieldId]: removed, ...remainingErrors } = state.errors;
      return { ...state, errors: remainingErrors };
    case 'SET_FORM_CONFIG':
      return {
        ...state,
        config: action.config,
        values: state.savedForms[action.config.id]?.data || {},
        errors: {}
      };
    case 'RESET_FORM':
      return { ...state, values: {}, errors: {} };
    case 'CLEAR_ALL_DATA':
      return { ...state, formName: '', savedForms: {}, values: {}, errors: {} };
    default:
      return state;
  }
};

const initialState = {
  config: null,
  formName: '',
  values: {},
  errors: {},
  savedForms: {}
};

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setFieldValue = (fieldId, value) =>
    dispatch({ type: 'SET_FIELD_VALUE', fieldId, value });

  const setFieldError = (fieldId, error) =>
    dispatch({ type: 'SET_FIELD_ERROR', fieldId, error });

  const clearFieldError = (fieldId) =>
    dispatch({ type: 'CLEAR_FIELD_ERROR', fieldId });

  const setFormConfig = (config) =>
    dispatch({ type: 'SET_FORM_CONFIG', config });

  const setFormName = (name) =>
    dispatch({ type: 'SET_FORM_NAME', name });

  const saveFormData = (formConfig) =>
    dispatch({ type: 'SAVE_FORM_DATA', formConfig });

  const loadSavedForm = (formId, config) =>
    dispatch({ type: 'LOAD_SAVED_FORM', formId, config });

  const resetForm = () =>
    dispatch({ type: 'RESET_FORM' });

  const clearAllData = () =>
    dispatch({ type: 'CLEAR_ALL_DATA' });

  const generateJsonData = () => ({
    name: state.formName || 'Untitled Form Collection',
    time: new Date().toISOString(),
    forms: Object.values(state.savedForms)
  });

  return (
    <FormContext.Provider
      value={{
        ...state,
        setFieldValue,
        setFieldError,
        clearFieldError,
        setFormConfig,
        setFormName,
        saveFormData,
        loadSavedForm,
        resetForm, 
        clearAllData,
        generateJsonData
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
