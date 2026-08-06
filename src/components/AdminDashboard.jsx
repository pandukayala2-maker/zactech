import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import CategoryManager from './CategoryManager';
import SubcategoryManager from './SubcategoryManager';
import ItemManager from './ItemManager';
import SettingsManager from './SettingsManager';
import QRGenerator from './QRGenerator';
import { LayoutDashboard, FolderTree, Tag, Settings, QrCode, LogOut, Eye, Menu, X } from 'lucide-react';

export default function AdminDashboard({ onBackToCatalog }) {
  const { logout, settings } = useData();
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Floating notifications
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of the administration console?')) {
      logout();
    }
  };

  // Render current tab component
  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ItemManager onNotify={showNotification} />;
      case 'categories':
        return <CategoryManager onNotify={showNotification} />;
      case 'subcategories':
        return <SubcategoryManager onNotify={showNotification} />;
      case 'qr':
        return <QRGenerator onNotify={showNotification} />;
      case 'settings':
        return <SettingsManager onNotify={showNotification} />;
      default:
        return <ItemManager onNotify={showNotification} />;
    }
  };

  const navItems = [
    { id: 'products', name: 'Products Catalogue', icon: <Tag size={18} /> },
    { id: 'categories', name: 'Categories', icon: <LayoutDashboard size={18} /> },
    { id: 'subcategories', name: 'Subcategories', icon: <FolderTree size={18} /> },
    { id: 'qr', name: 'QR Card Generator', icon: <QrCode size={18} /> },
    { id: 'settings', name: 'System Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-dashboard-container app-container">
      {/* Top Banner (No-print) */}
      <header className="admin-top-header glass-panel no-print">
        <div className="admin-header-left">
          <button className="admin-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-logo-badge">ZT</div>
          <div>
            <h1 className="admin-header-title">{settings.companyName}</h1>
            <span className="admin-header-role">Wholesale Admin Panel</span>
          </div>
        </div>

        <div className="admin-header-actions">
          <button onClick={onBackToCatalog} className="btn btn-secondary admin-action-btn">
            <Eye size={16} /> View Shop Catalog
          </button>
          <button onClick={handleLogout} className="btn btn-danger admin-action-btn">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="admin-dashboard-body">
        {/* Left Navigation Sidebar */}
        <aside
          className={`admin-sidebar glass-panel no-print ${isSidebarOpen ? 'open' : ''}`}
        >
          <nav className="admin-sidebar-nav">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false); // Close mobile sidebar
                  }}
                  className={`admin-nav-btn ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile sidebar */}
        <div
          className={`admin-sidebar-backdrop no-print ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Content Panel */}
        <main className="admin-content-area">
          <div className="admin-content-card glass-panel">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Floating Alerts/Notifications */}
      {notification && (
        <div
          className={`toast-notification ${
            notification.type === 'success' ? 'toast-success' : 'toast-error'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}

