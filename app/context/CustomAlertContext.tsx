// context/CustomAlertContext.tsx
import CustomAlert from '@/components/CustomAlert';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AlertOptions {
  title?: string | null;
  message: string;
  ok?: string | null;
  cancel?: string | null;
  cancelDisplayed?: boolean;
  position?: 'middle' | 'bottom';
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface CustomAlertContextProps {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

interface CustomAlertProviderProps {
  children: ReactNode;
}

const CustomAlertContext = createContext<CustomAlertContextProps | undefined>(undefined);

export const useCustomAlert = () => {
  const context = useContext(CustomAlertContext);
  if (!context) {
    throw new Error('useCustomAlert must be used within a CustomAlertProvider');
  }
  return context;
};

export const CustomAlertProvider: React.FC<CustomAlertProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [alertData, setAlertData] = useState<AlertOptions>({
    title: '',
    message: '',
    ok: 'OK',
    cancel: 'Cancel',
    cancelDisplayed: false,
    position: 'middle',
  });

  const showAlert = (options: AlertOptions) => {
    setAlertData({
      title: options.title ?? '',
      message: options.message,
      ok: options.ok ?? 'OK',
      cancel: options.cancel ?? 'Cancel',
      cancelDisplayed: options.cancelDisplayed ?? false,
      position: options.position ?? 'middle',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
    setVisible(true);
  };

  const hideAlert = () => setVisible(false);

  return (
    <CustomAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      
  <CustomAlert
    {...alertData}
    title={alertData.title ?? null}
    visible={visible}
    onConfirm={() => {
      alertData.onConfirm?.();
      hideAlert();
    }}
    onCancel={() => {
      alertData.onCancel?.();
      hideAlert();
    }}
  />


      {/* {visible && <CustomAlert {...alertData} onClose={oncancel} />} */}
    </CustomAlertContext.Provider>
  );
};
