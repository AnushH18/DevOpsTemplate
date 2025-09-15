import React from 'react';
import { useForm } from '../contexts/FormContext';
import { FileText, ChevronRight, CheckCircle } from 'lucide-react';

const FormSidebar = ({ forms, selectedFormId, onFormSelect }) => {
  const { savedForms } = useForm();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Available Forms
      </h2>

      <nav className="space-y-2">
        {forms.map((form) => {
          const isFormSaved = savedForms[form.id]; // ✅ declare here
          return (
            <button
              key={form.id}
              onClick={() => onFormSelect(form)}
              className={`w-full text-left p-3 rounded-lg transition-colors group ${
                selectedFormId === form.id
                  ? 'bg-blue-50 dark:bg-cyan-900/20 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{form.name}</h3>
                    {isFormSaved && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm opacity-75 mt-1 line-clamp-2">
                    {form.description}
                  </p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 ml-2 transition-transform ${
                    selectedFormId === form.id
                      ? 'rotate-90'
                      : 'group-hover:translate-x-1'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FormSidebar;
