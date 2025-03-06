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
