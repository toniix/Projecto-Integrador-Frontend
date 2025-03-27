import { useState } from "react";
import { successToast, errorToast } from "../../../utils/toastNotifications"
import LoginModal from "../../login/LoginModal";
import axios from "axios";
import logo from "/img/logo_white.png";

const RegisterForm = () => {
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio";
    if (!formData.document) newErrors.document = "El documento es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";
    if (!formData.address) newErrors.address = "La dirección es obligatoria";
    if (!formData.locality) newErrors.locality = "La localidad es obligatoria";
    if (!isChecked) newErrors.terminos = "Debe aceptar nuestros Términos de Servicio y Política de Privacidad para poder continuar";
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8 || formData.password.length > 20) {
      newErrors.password = "Debe tener entre 8 y 20 caracteres";
    }
    if (formData.password !== formData.passwordconfirm) {
      newErrors.passwordconfirm = "La contraseña debe coincidir en ambos campos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    const handleResendConfirmation = async () => {
      console.log("handleResendConfirmation called for mail:", registeredEmail);
      if (!registeredEmail) return;
    
      setIsResending(true);
      try {
        // API endpoint
        // const response = await axios.post(
        //   `https://clavecompas-production.up.railway.app/clavecompas/users/resend-confirmation?email=${encodeURIComponent(registeredEmail)}`,
        //   {},
        //   { headers: { "Content-Type": "application/json" } }
        // );
      
        // Local development endpoint
        const response = await axios.post(
          `http://localhost:8080/clavecompas/users/resend-confirmation?email=${encodeURIComponent(registeredEmail)}`,
          {},
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // API endpoint
      const response = await axios.post(
        "https://clavecompas-production.up.railway.app/clavecompas/users/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Local development endpoint
      // const response = await axios.post(
      //   "http://localhost:8080/clavecompas/users/register",
      //   formData,
      //   { headers: { "Content-Type": "application/json" } }
      // );

      setRegisteredEmail(formData.email);
      successToast("Registro exitoso. Hemos enviado un correo de confirmación a tu dirección de email.");
      
      setRegistrationComplete(true);
      
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
      errorToast(error.response?.data?.message || "Hubo un problema con el registro");
    }
  };

// Componente de bienvenida después del registro exitoso
const WelcomeMessage = () => (
  <div className="flex flex-col items-center w-full">
    <div className="flex items-center gap-4 mb-6">
      <img src={logo} alt="Logo" className="h-8 w-auto" />
      <h2 className="text-2xl text-white">¡Bienvenido a Clave&Compás!</h2>
    </div>
    <div className="bg-transparent text-white p-6 rounded-lg w-full max-w-xl">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="text-left flex-1">
          <h3 className="text-xl mb-2">Registro Exitoso</h3>
          <p className="text-sm">
            Tu cuenta ha sido creada correctamente. Ahora solo falta confirmarla.
          </p>
        </div>
        <div className="w-15 h-15 border-2 border-white rounded-full flex items-center justify-center mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-4">
        <p className="mb-2">
          Hemos enviado un correo de confirmación a:
        </p>
        <p className="bg-white/5 p-2 rounded text-center break-all">
          {registeredEmail}
        </p>
      </div>
      
      <p className="mb-4 text-sm">
        Por favor, revisa tu bandeja de entrada y confirma tu cuenta para comenzar a disfrutar
        de todos nuestros servicios.
      </p>
      
      <button
        onClick={handleResendConfirmation}
        disabled={isResending}
        className="text-sm text-white hover:text-white/80 hover:underline disabled:opacity-50 mb-6 w-full text-center"
        type="button"
      >
        {isResending ? "Reenviando..." : "¿No recibiste el correo? Haz clic aquí para reenviarlo"}
      </button>
      
      <div className="flex justify-center">
        <button
          onClick={openLoginModal}
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-2 rounded-xl transition w-full md:w-2/3"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  </div>
);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-[#3B0012] shadow-lg rounded-3xl p-8 w-full max-w-3xl">
        {!registrationComplete ? (
          <>
            <h1 className="text-center text-white mt-6">
              Crear Cuenta
            </h1>
            <h6 className="text-center text-gray-600 text-sm mb-12">Completa los campos para continuar</h6>
            
            <form onSubmit={handleSubmit}>
              {/* Grid de 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna izquierda */}
                <div className="flex flex-col space-y-6 items-center">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Apellidos"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  <input
                    type="text"
                    name="document"
                    placeholder="Documento"
                    value={formData.document}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.document && <p className="text-red-500 text-sm">{errors.document}</p>}
                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  <input
                    type="text"
                    name="locality"
                    placeholder="Localidad"
                    value={formData.locality}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.locality && <p className="text-red-500 text-sm">{errors.locality}</p>}
                </div>

                {/* Columna derecha */}
                <div className="flex flex-col items-center space-y-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  <input
                    type="password"
                    name="passwordconfirm"
                    placeholder="Repetir contraseña"
                    value={formData.passwordconfirm}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.passwordconfirm && <p className="text-red-500 text-sm">{errors.passwordconfirm}</p>}
                  {/* Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="aceptaTerminos"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      required
                      className="w-5 h-5 bg-[#3e0b05] accent-[#730f06] border-2 border-gray-500 rounded-xl cursor-pointer mr-3"
                    />
                    <label className="w-60 text-white text-xs">
                      He leído y acepto los{" "}
                      <a href="#" className="text-gray-600 hover:underline">
                        Términos de Servicio
                      </a>{" "}
                      y la{" "}
                      <a href="#" className="text-gray-600 hover:underline">
                        Política de Privacidad
                      </a>
                      {" "}del sitio.
                    </label>
                  </div>
                </div>
              </div>

              {/* Botón Registrarme */}
              <div className="mt-12 flex justify-center">
                <button
                  type="submit"
                  className="bg-[#730f06] text-white font-semibold px-20 py-2 rounded-xl hover:bg-[#5c0c05] transition"
                >
                  Registrarme
                </button>
              </div>
              {errors.terminos && (
                <p className="text-red-500 text-sm text-center mt-2">{errors.terminos}</p>
              )}

              {/* Enlace de Iniciar sesión */}
              <div className="mt-3 mb-6 text-center">
                <p className="text-gray-600 text-xs">
                  ¿Ya tienes una cuenta?{" "}
                  <a onClick={openLoginModal} className="text-[#b08562] font-bold hover:underline cursor-pointer">
                    Inicia sesión aquí.
                  </a>
                </p>
              </div>
            </form>
          </>
        ) : (
          <WelcomeMessage />
        )}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default RegisterForm;