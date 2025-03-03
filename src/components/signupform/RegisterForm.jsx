import { useState } from "react";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        documento: "",
        correo: "",
        contrasenia: "",
        telefono: "",
        direccion: "",
        localidad: "",
    });

    const [errors, setErrors] = useState({});
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
      };
    

    const validateForm = () => {
        let newErrors = {};
        if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
        if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio";
        if (!formData.documento) newErrors.documento = "El documento es obligatorio";
        if (!formData.correo) newErrors.correo = "El correo es obligatorio";
        if (!formData.telefono) newErrors.telefono = "El teléfono es obligatorio";
        if (!formData.direccion) newErrors.direccion = "La dirección es obligatoria";
        if (!formData.localidad) newErrors.localidad = "La localidad es obligatoria";
        if(!isChecked) newErrors.terminos = "Debe aceptar nuestros Términos de Servicio y Política de Privacidad para poder continuar";
        if (!formData.contrasenia) {
            newErrors.contrasenia = "La contraseña es obligatoria";
        } else if (formData.contrasenia.length < 8 || formData.contrasenia.length > 20) {
            newErrors.contrasenia = "Debe tener entre 8 y 20 caracteres";
        }
        if(formData.contrasenia !== formData.repetirContrasenia){
            newErrors.repetirContrasenia = "La contraseña debe coincidir en ambos campos";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:8080/api/usuarios/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error en el registro");

            alert("Registro exitoso");
            setFormData({
                nombre: "",
                apellido: "",
                documento: "",
                correo: "",
                contrasenia: "",
                repetirContrasenia: "",
                telefono: "",
                direccion: "",
                localidad: "",
            });
        } catch (error) {
            console.error(error);
            alert("Hubo un problema con el registro");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-[#3e0b05] shadow-lg rounded-3xl p-8 w-full max-w-3xl">
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
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
                  <input
                    type="text"
                    name="documento"
                    placeholder="Documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.documento && <p className="text-red-500 text-sm">{errors.documento}</p>}
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
                  <input
                    type="text"
                    name="localidad"
                    placeholder="Localidad"
                    value={formData.localidad}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.localidad && <p className="text-red-500 text-sm">{errors.localidad}</p>}
                </div>
    
                {/* Columna derecha */}
                <div className="flex flex-col space-y-6 items-center space-y-6">
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
                  <input
                    type="password"
                    name="contrasenia"
                    placeholder="Contraseña"
                    value={formData.contrasenia}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.contrasenia && <p className="text-red-500 text-sm">{errors.contrasenia}</p>}
                  <input
                    type="password"
                    name="repetirContrasenia"
                    placeholder="Repetir contraseña"
                    value={formData.repetirContrasenia}
                    onChange={handleChange}
                    required
                    className="w-60 p-2 border border-gray-300 rounded-xl"
                  />
                  {errors.repetirContrasenia && <p className="text-red-500 text-sm">{errors.repetirContrasenia}</p>}
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
                {errors.aceptaTerminos && <p className="text-red-500 text-sm">{errors.aceptaTerminos}</p>}
              </div>
    
              {/* Enlace de Iniciar sesión */}
              <div className="mt-3 mb-6 text-center">
                <p className="text-gray-600 text-xs">
                  ¿Ya tienes una cuenta?{" "}
                  <a href="/login" className="text-[#b08562] font-bold hover:underline">
                    Inicia sesión aquí.
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      );
};

export default RegisterForm;
