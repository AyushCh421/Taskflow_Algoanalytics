import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">404</h1>
      <p className="text-gray-500 dark:text-gray-400">Page not found</p>
      <Link to="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-medium">
        Go to dashboard
      </Link>
    </div>
  );
}
