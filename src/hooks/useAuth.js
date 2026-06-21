import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status } = useSelector((s) => s.auth);

  const handleLogout = () => dispatch(logout());

  return { user, isAuthenticated, status, handleLogout };
};
