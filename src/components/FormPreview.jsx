import React from 'react';
import { useForm } from '../contexts/FormContext';
import { Eye, Code, Database } from 'lucide-react';

const FormPreview = () => {
  const { config, values, savedForms, formName, generateJsonData } = useForm();
  const [showJson, setShowJson] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('current'); // 'current' or 'all'

  if (!config) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Form Preview
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select a form to see the preview
        </p>
      </div>
    );
  }

  const hasValues = Object.keys(values).length > 0;
  const hasSavedForms = Object.keys(savedForms).length > 0;
  const jsonData = generateJsonData();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Data Preview
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'current' ? 'all' : 'current')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title={viewMode === 'current' ? 'Show all saved data' : 'Show current form'}
          >
            <Database className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowJson(!showJson)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title={showJson ? 'Show formatted view' : 'Show JSON'}
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setViewMode('current')}
          className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
            viewMode === 'current'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Current Form
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
            viewMode === 'all'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          All Data ({Object.keys(savedForms).length})
        </button>
      </div>

      {viewMode === 'all' ? (
        showJson ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Complete JSON Output
              </h4>
              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs overflow-auto max-h-96">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Collection Name:</strong> {formName || 'Untitled'}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Saved Forms:</strong> {Object.keys(savedForms).length}
            </div>

            {hasSavedForms ? (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saved Forms:
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(savedForms).map(([formId, formData]) => (
                    <div key={formId} className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs">
                      <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {formData.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Object.keys(formData.data).length} fields filled
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No forms saved yet. Fill out and save forms to see them here.
              </div>
            )}
          </div>
        )
      ) : (
        showJson ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Form Configuration
            </h4>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
          
          {hasValues && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Form Values
              </h4>
              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs overflow-auto max-h-40">
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Current Form:</strong> {config.name}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Fields:</strong> {config.fields.length}
          </div>

          {hasValues ? (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Form Values:
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(values).map(([key, value]) => {
                  const field = config.fields.find(f => f.id === key);
                  const fieldLabel = field?.label || key;
                  
                  return (
                    <div key={key} className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs">
                      <div className="font-medium text-gray-700 dark:text-gray-300">
                        {fieldLabel}:
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-1">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Start filling out this form to see values here
            </div>
          )}
        </div>
        )
      )}
    </div>
  );
};

export default FormPreview;