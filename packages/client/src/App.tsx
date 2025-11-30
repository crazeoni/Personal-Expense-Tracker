import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

const App = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has valid token on mount
    const hasAuth = checkAuth();
    setIsChecking(false);
    
    // If no auth, the state is already set to not authenticated
    if (!hasAuth) {
      useAuthStore.getState().logout();
    }
  }, [checkAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

export default App;