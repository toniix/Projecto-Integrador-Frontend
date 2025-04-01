import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authReducer } from "./authReducer";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_USER,
  AUTH_LOADING,
  AUTH_ERROR,
  UPDATE_USER,
} from "./authActions";
import { successToast, errorToast } from "../../utils/toastNotifications";
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
  error: null,
};

// Funciones de utilidad para manejar tokens y autenticación
export const getToken = () => localStorage.getItem("token");

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Error validando token:", error);
    return false;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para refrescar los favoritos en la UI
  const refreshFavorites = useCallback(() => {
    // Emitir un evento global para que todos los componentes FavoriteButton se actualicen
    window.dispatchEvent(new CustomEvent('refresh-favorites'));
    
    // Además, forzar actualización de la lista de favoritos si está visible
    window.dispatchEvent(new CustomEvent('refresh-favorites-list'));
  }, []);

  // Initialize auth state from token stored in localStorage
  useEffect(() => {
    const loadUserSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUserData = localStorage.getItem("userData");

        if (token && savedUserData) {
          const decodedToken = jwtDecode(token);

          // Verify if token is still valid
          if (decodedToken.exp * 1000 > Date.now()) {
            const userData = JSON.parse(savedUserData);

            dispatch({
              type: SET_USER,
              payload: userData,
            });

            setupAxiosInterceptors(token);

            // Cuando se carga la sesión, también refrescamos los favoritos
            refreshFavorites();

          } else {
            // Token expired
            handleLogout();
          }
        } else {
          dispatch({ type: AUTH_ERROR });
        }
      } catch (error) {
        console.error("Error loading session:", error);
        handleLogout();
      }
    };

    loadUserSession();
  }, [refreshFavorites]);

  // Configure Axios interceptors for authentication
  const setupAxiosInterceptors = (token) => {
    // Remove existing interceptors to avoid duplicates
    if (
      axios.interceptors.request.handlers &&
      axios.interceptors.request.handlers[0]
    ) {
      axios.interceptors.request.eject(axios.interceptors.request.handlers[0]);
    }

    if (
      axios.interceptors.response.handlers &&
      axios.interceptors.response.handlers[0]
    ) {
      axios.interceptors.response.eject(
        axios.interceptors.response.handlers[0]
      );
    }

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
        if (error.response?.status === 403) {
          errorToast("Acceso denegado. Verifica tus permisos.");
          console.error("Error 403:", error.response?.data);
          console.log(error.response?.data);
        }
        return Promise.reject(error);
      }
    );
  };

  // Login user
  const login = async (credentials) => {
    dispatch({ type: AUTH_LOADING });
    console.log(credentials);
    if (!credentials.email || !credentials.password) {
      dispatch({
        type: LOGIN_FAIL,
        payload: "Por favor, completa todos los campos",
      });
      return { success: false, error: "Por favor, completa todos los campos" };
    }

    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      const { token, user: userData = {} } = response.data.response;

      // Decode token to get additional information
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      // Combine token data with any user data provided by API
      const combinedUserData = {
        ...decodedToken, // Include roles, sub (email), etc.
        ...userData, // Include any additional user data if available
        email: userData.email || decodedToken.sub || credentials.email, // Ensure we have email
      };

      // Save both token and combined user data
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(combinedUserData));

      // Update auth state with combined data
      dispatch({
        type: LOGIN_SUCCESS,
        payload: combinedUserData,
      });

      setupAxiosInterceptors(token);

      // Después de iniciar sesión exitosamente, refrescar favoritos
      refreshFavorites();

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      console.log("Error response:", error.response);

      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión";

      dispatch({
        type: LOGIN_FAIL,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Update user data
  const updateUserData = (newUserData) => {
    if (state.isAuthenticated && state.user) {
      const updatedUser = { ...state.user, ...newUserData };

      localStorage.setItem("userData", JSON.stringify(updatedUser));

      dispatch({
        type: UPDATE_USER,
        payload: updatedUser,
      });
    }
  };

  // Check session status (can be called periodically)
  const checkSessionStatus = useCallback(() => {
    return isTokenValid();
  }, []);

  // Logout user
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    dispatch({ type: LOGOUT });

    // Disparar evento para limpiar el estado de favoritos cuando el usuario cierra sesión
    window.dispatchEvent(new CustomEvent('user-logged-out'));

    successToast("Sesión cerrada exitosamente");
  }, []);

  // Check if user has a specific role
  const hasRole = (role) => {
    return state.user?.roles?.includes(role);
  };

  // Get current user ID
  const getUserId = () => {
    return state.user?.id || null;
  };

  // Context value
  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout: handleLogout,
    updateUserData,
    checkSessionStatus,
    hasRole,
    getUserId,
    refreshFavorites,
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