import PropTypes from "prop-types";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [instruments, setInstruments] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const addInstrument = (instrument) => {
    setInstruments([...instruments, instrument]);
  };

  // Verificar token al inicio
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Validar token
  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.valid) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setupAxiosInterceptors(token);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Configurar interceptores de Axios
  const setupAxiosInterceptors = (token) => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );
  };

  // Login
  const handleLogin = async (credentials) => {
    console.log("Login", credentials);
    if (!credentials.email || !credentials.password) {
      //   errorToast("Por favor, completa todos los campos");
      return { success: false, error: "Campos incompletos" };
    }
    try {
      const response = await axios.post("/api/auth/login", credentials);
      const { token, user: userData } = response.data;

      sessionStorage.setItem("token", token);
      setUser(userData);
      setIsAuthenticated(true);
      setupAxiosInterceptors(token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  // Logout
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.reload(); // Recargar para limpiar estado
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    instruments,
    addInstrument,
  };

  return (
    <GlobalContext.Provider value={value}>
      {!loading && children}
    </GlobalContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useUser debe ser usado dentro de UserProvider");
  }
  return context;
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
