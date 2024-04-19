import React, { createContext, useContext, useState, useEffect } from "react";

interface NotificationContextType {
  showNotification: (
    message: string,
    status: keyof typeof STATUS_CLASSES
  ) => void;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

const STATUS_CLASSES = {
  default: "bg-blue-500",
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<keyof typeof STATUS_CLASSES>("default");

  const showNotification = (
    newMessage: string,
    newStatus: keyof typeof STATUS_CLASSES
  ) => {
    setMessage(newMessage);
    setStatus(newStatus);
    setIsVisible(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (message) {
      timeout = setTimeout(() => {
        setMessage("");
        setStatus("default");
      }, 3000); // Hide notification after 3 seconds
    }

    return () => clearTimeout(timeout);
  }, [message]);

  const contextValue: NotificationContextType = {
    showNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Notification message={message} status={status} isVisible={isVisible} />
    </NotificationContext.Provider>
  );
};

const Notification: React.FC<{
  message: string;
  status: keyof typeof STATUS_CLASSES;
  isVisible: boolean;
}> = ({ message, status, isVisible }) => (
  <div
    className={`fixed top-0 right-0 mt-8 mr-8 transition-transform transform ${
      isVisible ? "translate-x-0" : "translate-x-full"
    }`}
    style={!message ? { right: "-1000px" } : {}}
  >
    <div
      className={`notification ${
        status === "success"
          ? "bg-green-600"
          : status === "error"
          ? "bg-red-600"
          : "bg-blue-600"
      } text-white px-6 py-4 rounded-md shadow-2xl flex items-center justify-between`}
      style={{ maxWidth: "400px" }}
    >
      <div className="text-sm font-light">{message}</div>
    </div>
  </div>
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
