import PropTypes from "prop-types";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { authReducer } from "./authReducer";
import { 
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  LOGOUT, 
  SET_USER, 
  AUTH_LOADING,
  AUTH_ERROR
} from "./authActions";
import { successToast } from "../../utils/toastNotifications";
import axios from "axios";

/**
 * AuthContext - Responsible for authentication state and operations
 * 
 * Single Responsibility Principle: Handles only authentication concerns
 */
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

// Initial authentication state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from token
  useEffect(() => {
    const loadUser = async () => {
      const token = sessionStorage.getItem("token");
      
      if (!token) {
        dispatch({ type: AUTH_ERROR });
        return;
      }
      
      try {
        const decodedToken = jwtDecode(token);
        
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch({ type: AUTH_ERROR });
          sessionStorage.removeItem("token");
          return;
        }
        
        // Set up axios interceptors
        setupAxiosInterceptors(token);
        
        // Set authenticated user
        dispatch({ 
          type: SET_USER, 
          payload: decodedToken 
        });
        console.log("Token decodificado: " + decodedToken)

      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch({ type: AUTH_ERROR });
        sessionStorage.removeItem("token");
      }
    };
    loadUser();
  }, []);

  // Setup axios interceptors for auth
  const setupAxiosInterceptors = (token) => {
    // Request interceptor - Add auth token
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle auth errors
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

  // Login user
  const login = async (credentials) => {
    dispatch({ type: AUTH_LOADING });

    if (!credentials.email || !credentials.password) {
      dispatch({ 
        type: LOGIN_FAIL, 
        payload: "Por favor, completa todos los campos" 
      });
      return { success: false, error: "Por favor, completa todos los campos" };
    }

    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      const { token, user } = response.data.response;
      
      // Save token and set up interceptors
      sessionStorage.setItem("token", token);
      setupAxiosInterceptors(token);
      
      // Update auth state
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user
      });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
      
      dispatch({
        type: LOGIN_FAIL,
        payload: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    dispatch({ type: LOGOUT });
    successToast("Sesión cerrada exitosamente");
  }, []);

  // Context value
  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};