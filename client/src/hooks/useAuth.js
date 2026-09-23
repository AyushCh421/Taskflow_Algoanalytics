import { useSelector } from 'react-redux';

// Custom hook: exposes auth state cleanly to any component
export default function useAuth() {
  const { user, token, status, error } = useSelector((state) => state.auth);
  return { user, token, isAuthenticated: !!token, status, error };
}
