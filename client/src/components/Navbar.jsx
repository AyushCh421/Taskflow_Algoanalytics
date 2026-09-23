import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../store/slices/authSlice';
import useAuth from '../hooks/useAuth';
import useDarkMode from '../hooks/useDarkMode';

export default function Navbar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-200"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <span className="text-sm px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 capitalize">
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
