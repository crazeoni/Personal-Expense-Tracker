import { DollarSign, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <DollarSign className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 hidden sm:inline">{user?.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;