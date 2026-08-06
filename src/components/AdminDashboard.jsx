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
    <div style={styles.dashboardContainer} className="app-container">
      {/* Top Banner (No-print) */}
      <header style={styles.topHeader} className="glass-panel no-print">
        <div style={styles.headerLeft}>
          <button style={styles.menuToggle} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={styles.logoBadge}>ZT</div>
          <div>
            <h1 style={styles.headerTitle}>{settings.companyName}</h1>
            <span style={styles.headerRole}>Wholesale Admin Panel</span>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button onClick={onBackToCatalog} className="btn btn-secondary" style={styles.actionBtn}>
            <Eye size={16} /> View Shop Catalog
          </button>
          <button onClick={handleLogout} className="btn btn-danger" style={styles.actionBtn}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div style={styles.dashboardBody}>
        {/* Left Navigation Sidebar */}
        <aside
          style={{
            ...styles.sidebar,
            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
          className="glass-panel no-print"
        >
          <nav style={styles.sidebarNav}>
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false); // Close mobile sidebar
                  }}
                  style={{
                    ...styles.navBtn,
                    backgroundColor: isActive ? 'rgba(211, 30, 37, 0.12)' : 'transparent',
                    borderLeftColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--color-text-secondary)',
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div
            style={styles.sidebarBackdrop}
            onClick={() => setIsSidebarOpen(false)}
            className="no-print"
          />
        )}

        {/* Content Panel */}
        <main style={styles.contentArea}>
          <div style={styles.contentCard} className="glass-panel">
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

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  topHeader: {
    margin: '16px',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    borderRadius: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuToggle: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '4px',
    marginRight: '4px',
    display: 'none', // Shown on mobile
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    lineHeight: '1.2',
  },
  headerRole: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    fontSize: '0.85rem',
    padding: '8px 16px',
  },
  dashboardBody: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    padding: '0 16px 16px 16px',
  },
  sidebar: {
    width: '260px',
    marginRight: '16px',
    padding: '16px 8px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 90,
    transition: 'transform var(--transition-normal)',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    borderLeft: '4px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all var(--transition-fast)',
    width: '100%',
  },
  contentArea: {
    flex: 1,
    height: '100%',
    overflowY: 'auto',
  },
  contentCard: {
    padding: '28px',
    minHeight: '100%',
    backgroundColor: 'rgba(15, 19, 32, 0.4)',
  },
  sidebarBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 80,
  },
  // Responsive layout overrides
  '@media (max-width: 991px)': {
    menuToggle: {
      display: 'block',
    },
    sidebar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      marginRight: 0,
      height: '100%',
      backgroundColor: '#0a0d17',
    },
    dashboardBody: {
      padding: '0 16px 16px 16px',
    }
  },
  '@media (max-width: 576px)': {
    headerActions: {
      display: 'none', // We can build fallback icons or hide to save space
    }
  }
};

// Simple media query fallback for React style sheet
if (typeof window !== 'undefined') {
  const applyLayout = () => {
    const isDesktop = window.innerWidth >= 992;
    styles.sidebar.transform = isDesktop ? 'translateX(0)' : 'translateX(-100%)';
    styles.menuToggle.display = isDesktop ? 'none' : 'block';
    
    // adjust display actions
    const isMobile = window.innerWidth <= 576;
    styles.headerActions.display = isMobile ? 'none' : 'flex';
  };
  window.addEventListener('resize', applyLayout);
  applyLayout();
}
