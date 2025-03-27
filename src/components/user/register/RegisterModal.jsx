import { useState } from "react";
import { successToast, errorToast } from "../../../utils/toastNotifications";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import RegisterConfirmationModal from "./RegisterConfirmationModal";
import { X, Eye, EyeOff } from "lucide-react";

const RegisterModal = ({ isOpen, onClose, openLoginModal }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    document: "",
    email: "",
    password: "",
    passwordconfirm: "",
    phone: "",
    address: "",
    locality: "",
  });

  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio";

    if (!formData.document) {
      newErrors.document = "El documento es obligatorio";
    } else if (formData.document.trim().length > 8) {
      newErrors.document = "El documento debe tener máximo 8 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email debe tener un formato válido";
    }

    if (!formData.phone) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{1,9}$/.test(formData.phone)) {
      newErrors.phone =
        "El teléfono debe contener solo números y tener máximo 9 dígitos";
    }

    if (!formData.address) newErrors.address = "La dirección es obligatoria";
    if (!formData.locality) newErrors.locality = "La localidad es obligatoria";
    if (!isChecked)
      newErrors.terminos =
        "Debe aceptar nuestros Términos de Servicio y Política de Privacidad para poder continuar";
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (
      formData.password.trim().length < 8 ||
      formData.password.trim().length > 20
    ) {
      newErrors.password = "Debe tener entre 8 y 20 caracteres";
    }
    if (formData.password !== formData.passwordconfirm) {
      newErrors.passwordconfirm =
        "La contraseña debe coincidir en ambos campos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para reenviar el correo de confirmación
  const handleResendConfirmation = async () => {
    console.log("handleResendConfirmation called for mail:", registeredEmail);
    if (!registeredEmail) return;

    setIsResending(true);
    try {
      // API endpoint
      const response = await axios.post(
        `${API_URL}/users/resend-confirmation?email=${encodeURIComponent(
          registeredEmail
        )}`,
        { headers: { "Content-Type": "application/json" } }
      );
      successToast("Correo de confirmación reenviado exitosamente");
    } catch (error) {
      console.error("Error al reenviar correo:", error);
      errorToast(
        error.response?.data?.message ||
          "Error al reenviar el correo de confirmación. Por favor, intenta más tarde."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Función para enviar el formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // API endpoint
      const response = await axios.post(`${API_URL}/users/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setRegisteredEmail(formData.email);
      successToast(
        "Registro exitoso. Hemos enviado un correo de confirmación a tu dirección de email."
      );

      // Cerramos el modal de registro y activamos el modal de confirmación
      setRegistrationComplete(true);
      // onClose();

      setFormData({
        firstName: "",
        lastName: "",
        document: "",
        email: "",
        password: "",
        passwordconfirm: "",
        phone: "",
        address: "",
        locality: "",
      });
    } catch (error) {
      console.error(error);
      errorToast(
        error.response?.data?.message || "Hubo un problema con el registro"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex justify-center items-center ${
          isOpen ? "backdrop-blur-md bg-black/50" : "hidden"
        }`}
      >
        <div
          className="w-full max-w-4xl transform transition-all duration-300 ease-out hover:-translate-y-1 bg-[#3b0012] rounded-xl 
           shadow-lg p-6 sm:p-8 space-y-6 relative overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-[#7a0715]/20"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>

          <div className="text-center space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-[#d9c6b0] tracking-tight">
              Crea tu Cuenta
            </h1>
            <p className="text-white/70 text-base">
              Completa los campos para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="flex flex-col space-y-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  {errors.firstName && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Apellidos"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  {errors.lastName && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="document"
                    placeholder="Documento"
                    value={formData.document}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  {errors.document && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.document}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  {errors.address && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="locality"
                    placeholder="Localidad"
                    value={formData.locality}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  {errors.locality && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.locality}
                    </p>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="flex flex-col space-y-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  {errors.email && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  {errors.phone && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[50%] -translate-y-[50%] text-white/70 hover:text-white"
                    style={{ transform: "translateY(-50%)" }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="passwordconfirm"
                    placeholder="Repetir contraseña"
                    value={formData.passwordconfirm}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-[#3d2130] bg-[#3b0012]/80 text-white rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7a0715] transition-colors text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    style={{ transform: "translateY(-50%)" }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                  {errors.passwordconfirm && (
                    <p className="text-[#c78418] text-sm mt-2 pl-1">
                      {errors.passwordconfirm}
                    </p>
                  )}
                </div>

                {/* Checkbox con estilo mejorado */}
                <div className="flex items-start mt-2">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 bg-[#3b0012] accent-[#7a0715] border-2 border-[#3d2130] rounded cursor-pointer mt-0.5 mr-3"
                  />
                  <label className="text-white/80 text-sm">
                    He leído y acepto los{" "}
                    <a
                      href="#"
                      className="text-white hover:text-white/80 hover:underline transition-colors font-medium"
                    >
                      Términos de Servicio
                    </a>{" "}
                    y la{" "}
                    <a
                      href="#"
                      className="text-white hover:text-white/80 hover:underline transition-colors font-medium"
                    >
                      Política de Privacidad
                    </a>{" "}
                    del sitio.
                  </label>
                </div>
                {errors.terminos && (
                  <p className="text-[#c78418] text-sm pl-1">
                    {errors.terminos}
                  </p>
                )}
              </div>
            </div>

            {/* Botón Registrarme con estilo mejorado */}
            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                className="px-10 py-2 bg-[#7a0715] text-white rounded-lg font-medium hover:bg-[#7a0715]/90 transition-all duration-300 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Registrarse
              </button>
            </div>
          </form>

          {/* Opción para iniciar sesión */}
          <p className="text-center text-white/70 text-base mt-2">
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={openLoginModal}
              className="text-white hover:text-white/80 hover:underline transition-colors font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>

      {/* Modal de confirmación independiente */}
      {registrationComplete && (
        <RegisterConfirmationModal
          handleResendConfirmation={handleResendConfirmation}
          registeredEmail={registeredEmail}
          openLoginModal={openLoginModal}
          isResending={isResending}
        />
      )}
    </>
  );
};

export default RegisterModal;
