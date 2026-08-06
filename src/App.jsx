import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import CustomerCatalog from './components/CustomerCatalog';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { currentUser } = useData();
  const [view, setView] = useState('catalog'); // 'catalog' | 'login' | 'admin'

  // Route based on URL search query and auth state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');

    if (viewParam === 'catalog') {
      setView('catalog');
    } else if (currentUser) {
      setView('admin');
    } else {
      setView('catalog');
    }
  }, [currentUser]);

  // Handle switching views
  const handleNavigateToLogin = () => {
    if (currentUser) {
      setView('admin');
    } else {
      setView('login');
    }
  };

  const handleBackToCatalog = () => {
    // Clear url query if present to prevent locking
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setView('catalog');
  };

  if (view === 'admin' && currentUser) {
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
