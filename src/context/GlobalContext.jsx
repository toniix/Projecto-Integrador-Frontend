import PropTypes from "prop-types";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { successToast } from "../utils/toastNotifications";
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
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token on Load:", decodedToken); // Añadir esta línea para depuración
      if (decodedToken.exp * 1000 > Date.now()) {
        setUser(decodedToken); // Ajuste aquí
        setIsAuthenticated(true);
        setupAxiosInterceptors(token);
      } else {
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

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
      return { success: false, error: "Por favor, completa todos los campos" };
    }
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      // console.log(response);
      console.log(response.data);
      const { token, user: userData } = response.data.response;
      console.log(userData);
      sessionStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token on Login:", decodedToken); // Añadir esta línea para depuración
      setUser(userData); // Ajuste aquí
      setIsAuthenticated(true);
      setupAxiosInterceptors(token);

      return { success: true };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  console.log(user);
  // Logout
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    successToast("Sesión cerrada,exitosamente");
    // window.location.reload();
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
