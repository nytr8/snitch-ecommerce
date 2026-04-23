import { register } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "../state/auth.slice";
export const useAuth = () => {
  const dispatch = useDispatch();
  const handleRegister = async ({ email, password, contact, fullname }) => {
    dispatch(setLoading(true));
    try {
      const result = await register({ email, password, contact, fullname });
      dispatch(setUser(result.user));
    } catch (error) {
      console.error("Registration error:", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleRegister };
};
