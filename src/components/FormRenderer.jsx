import React, { useState } from 'react';
import { useForm } from '../contexts/FormContext';
import { validateFormData } from '../utils/formHandlers';
import { validatorRegistry } from '../utils/validators';
import FieldGenerator from './FieldGenerator';
import { CheckCircle, AlertCircle, Save, Download, Trash2 } from 'lucide-react';

const FormRenderer = () => {
  const { 
    config, 
    values, 
    formName, 
    savedForms,
    setFieldError, 
    resetForm, 
    saveFormData,
    setFormName,
    generateJsonData,
    clearAllData
  } = useForm();
  const [saveStatus, setSaveStatus] = useState(null);

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Select a form to get started</p>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus(null);

    // Validate form
    const errors = validateFormData(values, config, validatorRegistry);
    
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([fieldId, error]) => {
        setFieldError(fieldId, error);
      });
      setSaveStatus({
        type: 'error',
        message: 'Please fix the errors above before saving.'
      });
      return;
    }

    // Save form data
    saveFormData(config);
    setSaveStatus({
      type: 'success',
      message: `${config.name} saved successfully!`
    });
    
    // Clear status after 3 seconds
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  const handleDownloadJson = () => {
    const jsonData = generateJsonData();
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jsonData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      clearAllData();
      setSaveStatus({
        type: 'success',
        message: 'All data cleared successfully!'
      });
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }
  };

  const hasAnyData = Object.keys(savedForms).length > 0;
  const currentFormHasData = Object.keys(values).length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Name Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <label htmlFor="formName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Collection Name
        </label>
        <input
          type="text"
          id="formName"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter a name for this form collection"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {config.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {config.description}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.fields.map((field) => (
              <div
                key={field.id}
                className={field.type === 'textarea' ? 'md:col-span-2' : ''}
              >
                <FieldGenerator fieldConfig={field} />
              </div>
            ))}
          </div>

          {saveStatus && (
            <div className={`flex items-center gap-2 p-4 rounded-md ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{saveStatus.message}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              {hasAnyData && (
                <>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </>
              )}
            </div>
            
            <div className="flex space-x-4">
            <button
              type="button"
              onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
                disabled={!currentFormHasData}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-cyan-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
                <Save className="w-4 h-4" />
                Save Form
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormRenderer;