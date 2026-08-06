import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import CustomerCatalog from './components/CustomerCatalog';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { currentUser } = useData();
  const [view, setView] = useState('admin'); // Default view directly to admin dashboard

  // Route based on URL search query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');

    if (viewParam === 'catalog') {
      setView('catalog');
    } else if (viewParam === 'login') {
      setView('login');
    } else {
      setView('admin');
    }
  }, []);

  // Handle switching views
  const handleNavigateToLogin = () => {
    setView('admin');
  };

  const handleBackToCatalog = () => {
    // Clear url query if present to prevent locking
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setView('catalog');
  };

  if (view === 'admin') {
    return <AdminDashboard onBackToCatalog={handleBackToCatalog} />;
  }

  if (view === 'login') {
    return <Login onBackToCatalog={handleBackToCatalog} />;
  }

  return <CustomerCatalog onNavigateToLogin={handleNavigateToLogin} />;
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
