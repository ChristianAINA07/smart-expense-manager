import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-slate-900">
      {!isAuthenticated ? (
        <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <Dashboard onLogout={() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }} />
      )}
    </div>
  );
}
