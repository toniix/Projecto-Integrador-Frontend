import logo from "/img/logo_white.png";

const RegisterConfirmationModal = ({
  handleResendConfirmation,
  registeredEmail,
  openLoginModal,
  isResending,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-md bg-black/50">
      <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-[#3b0012] rounded-xl shadow-lg p-6">
        {/* Header con logo */}
        <div className="flex items-center gap-3 mb-6">
          {logo && <img src={logo} alt="Logo" className="h-6 w-auto" />}
          <h2 className="text-xl font-semibold text-white">
            ¡Te damos la bienvenida!
          </h2>
        </div>

        {/* Contenido principal */}
        <div className="w-full space-y-5">
          {/* Icono de éxito */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje de confirmación */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-medium text-white">Registro Exitoso</h3>
            <p className="text-sm text-white/80">
              Hemos enviado un correo de confirmación a:
            </p>
            <div className="flex justify-center">
              <p className="text-sm bg-white/15 py-2 px-4 rounded-lg inline-block font-medium truncate max-w-xs">
                {registeredEmail}
              </p>
            </div>
          </div>

          {/* Botón reenviar */}
          <button
            onClick={handleResendConfirmation}
            disabled={isResending}
            className="text-sm text-white/70 hover:text-white transition-colors w-full text-center py-2"
          >
            {isResending ? "Reenviando..." : "Reenviar correo de confirmación"}
          </button>

          {/* Botón iniciar sesión */}
          <div className="pt-2">
            <button
              onClick={() => {
                // onClose();
                openLoginModal();
              }}
              className="w-full px-4 py-1.5 bg-[#7a0715] text-white text-sm rounded-lg
              hover:bg-[#7a0715]/90 transition-all duration-300 font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmationModal;
