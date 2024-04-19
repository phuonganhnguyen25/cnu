import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  showModal: (title: any, content: any, footer: any) => void;
  hideModal: () => void;
  modalLoading: boolean;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  Modal: React.FC;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<any> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );
  const [modalFooter, setModalFooter] = useState<React.ReactNode | null>(null);

  const showModal = (title: any, content: any, footer: any) => {
    setModalTitle(title);
    setModalContent(content);
    setModalFooter(footer);
    setIsVisible(true);
  };

  const hideModal = () => {
    setModalContent(null);
    setModalFooter(null);
    setIsVisible(false);
    setModalLoading(false);
  };

  const Modal: React.FC = () => (
    <div
      className={`fixed z-50 inset-0 overflow-y-auto ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pb-80">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={hideModal}
        ></div>
        <div className="relative bg-white w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-xl">
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white">{modalTitle}</h3>
            <button onClick={hideModal} className="text-white">
              &times;
            </button>
          </div>
          <div className="p-6">{modalContent}</div>
          <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-lg">
            {modalFooter || (
              <button
                onClick={hideModal}
                className="text-gray-700 hover:text-gray-900 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            )}

            {/* You can add additional buttons here */}
          </div>
        </div>
      </div>
    </div>
  );

  const value: ModalContextType = {
    showModal,
    hideModal,
    modalLoading,
    setModalLoading,
    Modal,
  };

  return (
    <ModalContext.Provider value={value}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
