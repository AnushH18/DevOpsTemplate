import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FormProvider, useForm } from "./contexts/FormContext";
import ThemeToggle from "./components/ThemeToggle";
import FormSidebar from "./components/FormSidebar";
import FormRenderer from "./components/FormRenderer";
import FormPreview from "./components/FormPreview";
import formConfigData from "./data/formSchema.json";
import logo from "../src/assets/logo.svg"; // Ensure you have a logo image in your assets folder

// import { Settings } from "lucide-react";

const AppContent = () => {
  const { setFormConfig } = useForm();
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const forms = formConfigData.forms;

  useEffect(() => {
    // Auto-select first form on load
    if (forms.length > 0 && !selectedFormId) {
      const firstForm = forms[0];
      setSelectedFormId(firstForm.id);
      setFormConfig(firstForm);
    }
  }, [forms, selectedFormId, setFormConfig]);

  const handleFormSelect = (form) => {
    setSelectedFormId(form.id);
    setFormConfig(form);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors">
      {/* Header */}

      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Custom Logo */}
              <img
                src={logo} // Place image in public/ and use /logo.png
                alt="Aurigo Logo"
                className="w-15 h-8"
              />
              <h1 className=" text-2xl font-bold text-blue-600 dark:text-gray-100 ml-3">
                SRE Form Builder
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src="/path/to/your/menu-icon.png"
                  alt="Menu"
                  className="w-5 h-5"
                />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div
            className={`lg:col-span-1 ${
              isSidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            <FormSidebar
              forms={forms}
              selectedFormId={selectedFormId}
              onFormSelect={handleFormSelect}
            />
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2">
            <FormRenderer />
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1 hidden xl:block">
            <FormPreview />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <FormProvider>
        <AppContent />
      </FormProvider>
    </ThemeProvider>
  );
}

export default App;
