import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import CategoryManager from './CategoryManager';
import SubcategoryManager from './SubcategoryManager';
import ItemManager from './ItemManager';
import SettingsManager from './SettingsManager';
import QRGenerator from './QRGenerator';
import { 
  LayoutDashboard, FolderTree, Tag, Settings, QrCode, 
  LogOut, Eye, Menu, X, Bell, ChevronDown, User, 
  ShieldAlert, History, MessageSquare, UserCheck, Shield 
} from 'lucide-react';

export default function AdminDashboard({ onBackToCatalog }) {
  const { logout, settings } = useData();
  const [activeTab, setActiveTab] = useState('categories'); // default Categories active to match mockup
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

  // Pre-filled WhatsApp support trigger
  const handleContactSupport = () => {
    const cleanPhone = settings.phone.replace(/[^\d+]/g, '');
    const message = `Hello ZacTEK Support,\n\nI am the Administrator of the wholesale portal and require technical assistance. Please contact me back.`;
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Mock Views for Users and Activity Log tabs
  const renderUsersTab = () => (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px' }}>Users & Roles</h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Manage system administrators, editors, and marketing representative roles.
      </p>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--color-primary)" /> Active Admin Users
        </h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Username</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="user-avatar-circle" style={{ width: '28px', height: '28px' }}>
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60" alt="Admin" className="user-avatar-img" />
                  </div>
                </td>
                <td><strong>{settings.managerName} (You)</strong></td>
                <td><code>{settings.adminUsername}</code></td>
                <td>{settings.managerRole}</td>
                <td><span className="badge badge-primary">Administrator</span></td>
                <td><span className="status-badge active">Active</span></td>
              </tr>
              <tr>
                <td>
                  <div className="user-avatar-circle" style={{ width: '28px', height: '28px', backgroundColor: '#3b82f6' }}>
                    <User size={14} color="#fff" />
                  </div>
                </td>
                <td>Sales Representative</td>
                <td><code>sales_rep1</code></td>
                <td>Wholesale Agent</td>
                <td><span className="badge" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>Editor</span></td>
                <td><span className="status-badge active">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px' }}>Activity Logs</h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Review security audit logs and catalogue modification events.
      </p>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="var(--color-primary)" /> System Log History
        </h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Event Code</th>
                <th>Operation</th>
                <th>Actor</th>
                <th>IP Address</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>EVT-3094</code></td>
                <td>Category "Corporate Services" Created</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 18, 2024 03:15 PM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
              <tr>
                <td><code>EVT-2981</code></td>
                <td>Category "Apparel & Garments" Updated</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 17, 2024 09:20 AM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
              <tr>
                <td><code>EVT-2840</code></td>
                <td>Category "Old Services" Deleted</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 16, 2024 04:10 PM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
              <tr>
                <td><code>EVT-2703</code></td>
                <td>Admin Authenticated Successfully</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 15, 2024 08:30 AM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render current tab component
  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoryManager onNotify={showNotification} onNavigateTab={setActiveTab} />;
      case 'subcategories':
        return <SubcategoryManager onNotify={showNotification} />;
      case 'products':
        return <ItemManager onNotify={showNotification} />;
      case 'qr':
        return <QRGenerator onNotify={showNotification} />;
      case 'settings':
        return <SettingsManager onNotify={showNotification} />;
      case 'users':
        return renderUsersTab();
      case 'logs':
        return renderLogsTab();
      default:
        return <CategoryManager onNotify={showNotification} onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="admin-dashboard-container app-container">
      {/* Main Dashboard Layout */}
      <div className="admin-dashboard-body" style={{ padding: 0 }}>
        {/* Left Navigation Sidebar (Mockup design alignment) */}
        <aside
          className={`admin-sidebar glass-panel no-print ${isSidebarOpen ? 'open' : ''}`}
          style={{ 
            height: '100vh', 
            borderRadius: 0, 
            borderTop: 'none', 
            borderBottom: 'none', 
            borderLeft: 'none',
            backgroundColor: '#07090e',
            zIndex: 105
          }}
        >
          {/* Brand Logo Header inside Sidebar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', marginBottom: '10px' }}>
            <div className="admin-logo-badge">ZT</div>
            <div style={{ textAlign: 'left' }}>
              <h1 className="admin-header-title" style={{ fontSize: '1rem' }}>{settings.companyName}</h1>
              <span className="admin-header-role" style={{ fontSize: '0.65rem' }}>Wholesale Admin Panel</span>
            </div>
          </div>

          <nav className="admin-sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
            {/* CATALOG SECTION */}
            <div className="sidebar-group-title">Catalog</div>
            <button
              onClick={() => { onBackToCatalog(); setIsSidebarOpen(false); }}
              className="admin-nav-btn"
            >
              <Eye size={18} />
              <span>Products Catalogue</span>
            </button>
            <button
              onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
              className={`admin-nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Categories</span>
            </button>
            <button
              onClick={() => { setActiveTab('subcategories'); setIsSidebarOpen(false); }}
              className={`admin-nav-btn ${activeTab === 'subcategories' ? 'active' : ''}`}
            >
              <FolderTree size={18} />
              <span>Subcategories</span>
            </button>
            <button
              onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
              className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
            >
              <Tag size={18} />
              <span>Products</span>
            </button>

            {/* MARKETING SECTION */}
            <div className="sidebar-group-title">Marketing</div>
            <button
              onClick={() => { setActiveTab('qr'); setIsSidebarOpen(false); }}
              className={`admin-nav-btn ${activeTab === 'qr' ? 'active' : ''}`}
            >
              <QrCode size={18} />
              <span>QR Card Generator</span>
            </button>

            {/* SETTINGS SECTION */}
            <div className="sidebar-group-title">Settings</div>
            <button
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>System Settings</span>
            </button>
            <button
              onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
              className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            >
              <UserCheck size={18} />
              <span>Users & Roles</span>
            </button>
            <button
              onClick={() => { setActiveTab('logs'); setIsSidebarOpen(false); }}
              className={`admin-nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
            >
              <History size={18} />
              <span>Activity Logs</span>
            </button>
          </nav>

          {/* Need Help? Sidebar Card */}
          <div className="sidebar-help-card">
            <div className="sidebar-help-title">Need Help?</div>
            <div className="sidebar-help-desc">We are here to help you anytime. Contact our developer team.</div>
            <button onClick={handleContactSupport} className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px', width: '100%' }}>
              <MessageSquare size={14} /> Contact Support
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        <div
          className={`admin-sidebar-backdrop no-print ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
          style={{ zIndex: 100 }}
        />

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          {/* Header Panel (Aligned Right of Sidebar) */}
          <header className="admin-top-header glass-panel no-print" style={{ margin: '16px 16px 8px 16px', borderRadius: '12px' }}>
            <div className="admin-header-left">
              <button className="admin-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              {/* Quick info placeholder or breadcrumb */}
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                Operational Mode: <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Live Connection</span>
              </div>
            </div>

            {/* Top Right Profile Details (Matches mockup) */}
            <div className="header-right-side">
              <button onClick={() => { onBackToCatalog(); }} className="btn btn-secondary admin-action-btn" style={{ padding: '8px 14px' }}>
                <Eye size={16} /> View Shop Catalog
              </button>

              {/* Notification Badge */}
              <button className="notification-bell-btn" title="View Notifications">
                <Bell size={20} />
                <span className="notification-badge-dot">3</span>
              </button>

              {/* User Dropdown Widget */}
              <div className="user-profile-widget" onClick={handleLogout} title="Click to log out">
                <div className="user-avatar-circle">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60" alt="Admin" className="user-avatar-img" />
                </div>
                <div className="user-info-text">
                  <span className="user-name-label">Admin</span>
                  <span className="user-role-label">Administrator</span>
                </div>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ marginLeft: '4px' }} />
              </div>
            </div>
          </header>

          {/* Active Tab Panel Content */}
          <main className="admin-content-area" style={{ padding: '8px 16px 16px 16px' }}>
            <div className="admin-content-card glass-panel" style={{ borderRadius: '12px', minHeight: 'calc(100% - 8px)' }}>
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Alerts/Notifications */}
      {notification && (
        <div
          className={`toast-notification ${
            notification.type === 'success' ? 'toast-success' : 'toast-error'
          }`}
          style={{ zIndex: 110 }}
        >
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
