// context/SignupContext.jsx
import React, { createContext, useState } from 'react';

export const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <SignupContext.Provider value={{
      step,
      formData,
      darkMode,
      nextStep,
      prevStep,
      toggleDarkMode,
      updateFormData
    }}>
      {children}
    </SignupContext.Provider>
  );
};
