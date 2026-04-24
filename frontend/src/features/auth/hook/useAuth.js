import { login, register } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../state/auth.slice";

const getErrorMessage = (error, fallbackMessage) => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors[0]?.msg || fallbackMessage;
  }

  return fallbackMessage;
};

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({ email, password, contact, fullname }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await register({ email, password, contact, fullname });
      dispatch(setUser(result.user));
      return { success: true, data: result };
    } catch (error) {
      const message = getErrorMessage(error, "Registration failed");
      dispatch(setError(message));
      return { success: false, message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await login({ email, password });
      dispatch(setUser(result.user));
      return { success: true, data: result };
    } catch (error) {
      const message = getErrorMessage(error, "Login failed");
      dispatch(setError(message));
      return { success: false, message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleRegister, handleLogin };
};
