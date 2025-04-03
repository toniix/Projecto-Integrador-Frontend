import { useState } from "react";
import LoginModal from "../user/login/LoginModal";
import RegisterModal from "../user/register/RegisterModal";

const AuthRequiredModal = ({ isOpen, onClose }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
    onClose();
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  if (!isOpen) {
    return (
      <>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          openRegisterModal={openRegisterModal}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
          openLoginModal={openLoginModal}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#7a0715]">
            Inicio de sesión requerido
          </h2>
          <p className="text-gray-600">
            Para reservar un instrumento, necesitas iniciar sesión primero.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-[#c78418] text-[#c78418] rounded-lg hover:bg-[#c78418]/10"
            >
              Cancelar
            </button>
            <button
              onClick={openLoginModal}
              className="px-6 py-2 bg-gradient-to-r from-[#7a0715] to-[#3b0012] text-white rounded-lg hover:shadow-lg hover:shadow-[#7a0715]/20 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
