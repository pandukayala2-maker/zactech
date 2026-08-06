import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  FolderPlus, Edit2, Trash2, Save, X, Info, Download, 
  Search, Grid, Plus, ListFilter, ArrowUpDown, ChevronDown, 
  Calendar, Eye, EyeOff, MoreVertical, Shirt, Briefcase, Leaf, 
  Folder, PlusCircle, ArrowRight, Activity, Zap, Check 
} from 'lucide-react';

export default function CategoryManager({ onNotify, onNavigateTab }) {
  const { categories, setCategories, subcategories, items } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'az'

  // Add/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Pagination Mock
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Activity Log State (Preset mockup data + dynamic logs)
  const [activities, setActivities] = useState([
    { id: 1, type: 'create', text: 'New category "Corporate Services" was created', meta: 'by Admin • May 18, 2024 03:15 PM' },
    { id: 2, type: 'update', text: 'Category "Apparel & Garments" was updated', meta: 'by Admin • May 17, 2024 09:20 AM' },
    { id: 3, type: 'delete', text: 'Category "Old Services" was deleted', meta: 'by Admin • May 16, 2024 04:10 PM' }
  ]);

  const addLog = (type, text) => {
    const time = new Date().toLocaleString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
    const newLog = {
      id: Date.now(),
      type,
      text,
      meta: `by Admin • ${time}`
    };
    setActivities([newLog, ...activities]);
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setCatName('');
    setCatDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editId) {
      // Edit
      setCategories(categories.map(cat => 
        cat.id === editId ? { ...cat, name: catName.trim(), description: catDesc.trim() } : cat
      ));
      addLog('update', `Category "${catName.trim()}" was updated`);
      onNotify('success', 'Category updated successfully!');
    } else {
      // Add new
      const id = `cat-${Date.now()}`;
      const newCat = {
        id,
        name: catName.trim(),
        description: catDesc.trim(),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setCategories([...categories, newCat]);
      addLog('create', `New category "${catName.trim()}" was created`);
      onNotify('success', 'Category added successfully!');
    }

    setIsModalOpen(false);
    setCatName('');
    setCatDesc('');
  };

  const handleDeleteCategory = (id, name) => {
    const hasSubcats = subcategories.some(sc => sc.categoryId === id);
    const hasItems = items.some(i => i.categoryId === id);

    const warnMsg = hasSubcats || hasItems 
      ? `Warning: The category "${name}" contains subcategories or products. Deleting it will leave those elements orphaned. Are you sure you want to delete it?`
      : `Are you sure you want to delete category "${name}"?`;

    if (!confirm(warnMsg)) return;

    setCategories(categories.filter(cat => cat.id !== id));
    addLog('delete', `Category "${name}" was deleted`);
    onNotify('error', `Category "${name}" deleted.`);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "zactek_categories.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onNotify('success', 'Categories data exported successfully!');
  };

  // Get Custom Icon per category name
  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('garment') || lower.includes('apparel') || lower.includes('clothing') || lower.includes('shirt')) {
      return { frame: 'cat-icon-purple', element: <Shirt size={18} /> };
    }
    if (lower.includes('corporate') || lower.includes('service') || lower.includes('trading') || lower.includes('logistic')) {
      return { frame: 'cat-icon-blue', element: <Briefcase size={18} /> };
    }
    if (lower.includes('environ') || lower.includes('shark') || lower.includes('sanitation') || lower.includes('clean') || lower.includes('nature') || lower.includes('waste')) {
      return { frame: 'cat-icon-green', element: <Leaf size={18} /> };
    }
    return { frame: 'cat-icon-grey', element: <Folder size={18} /> };
  };

  // Filter & Sort Logic
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // In our local storage, categories are active by default. We can mock status or implement toggle status.
    const isMockActive = true; 
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && isMockActive) || 
                          (statusFilter === 'inactive' && !isMockActive);

    return matchesSearch && matchesStatus;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOrder === 'az') return a.name.localeCompare(b.name);
    if (sortOrder === 'oldest') return 1; // standard local order
    return -1; // newest/default local order
  });

  // KPI count helpers
  const totalSubcategoriesCount = subcategories.length;
  const totalProductsCount = items.length;

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* 1. Header Area */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Categories</h2>
          <p style={styles.subtitle}>Manage all top-level wholesale product categories.</p>
        </div>
        <div style={styles.headerBtnGroup}>
          <button onClick={handleExportData} className="btn btn-secondary" style={styles.headerBtn}>
            <Download size={16} /> Export
          </button>
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={styles.headerBtn}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="kpi-stats-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-purple">
            <Grid size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Categories</span>
            <span className="kpi-value">{categories.length}</span>
            <span className="kpi-subtext">All top-level categories</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-green">
            <FolderTree size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Subcategories</span>
            <span className="kpi-value">{totalSubcategoriesCount}</span>
            <span className="kpi-subtext">Across all categories</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-blue">
            <ShoppingBag size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Products</span>
            <span className="kpi-value">{totalProductsCount}</span>
            <span className="kpi-subtext">Linked to categories</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-orange">
            <Calendar size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Recently Added</span>
            <span className="kpi-value">2</span>
            <span className="kpi-subtext">In last 7 days</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>
      </div>

      {/* 3. Search and Filters Control bar */}
      <div className="filter-options-bar">
        {/* Search */}
        <div className="filter-search-box">
          <Search size={16} className="filter-search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Status Pills toggler */}
        <div className="filter-toggle-buttons">
          <button
            onClick={() => setStatusFilter('all')}
            className={`filter-toggle-btn ${statusFilter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`filter-toggle-btn ${statusFilter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`filter-toggle-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
          >
            Inactive
          </button>
        </div>

        {/* Sort order dropdown */}
        <select
          className="filter-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ paddingLeft: '34px', backgroundImage: 'none' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Alphabetical A-Z</option>
        </select>
      </div>

      {/* 4. Main Categories Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Subcategories</th>
              <th>Products</th>
              <th>Created Date</th>
              <th>Status</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map(cat => {
              const subcatCount = subcategories.filter(s => s.categoryId === cat.id).length;
              const itemsCount = items.filter(i => i.categoryId === cat.id).length;
              const iconObj = getCategoryIcon(cat.name);
              const mockDate = cat.createdAt || 'May 15, 2024';
              const mockTime = '11:45 AM';

              return (
                <tr key={cat.id}>
                  {/* Category info */}
                  <td>
                    <div className="cat-row-header">
                      <div className={`cat-icon-frame ${iconObj.frame}`}>
                        {iconObj.element}
                      </div>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{cat.name}</strong>
                        <span className="cat-details-desc">{cat.description || 'No description provided'}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Subcategories count */}
                  <td>
                    <span style={{ fontWeight: '600', color: '#fff' }}>{subcatCount}</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginLeft: '6px' }}>Subcategories</span>
                  </td>

                  {/* Products count */}
                  <td>
                    <span style={{ fontWeight: '600', color: '#fff' }}>{itemsCount}</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginLeft: '6px' }}>Products</span>
                  </td>

                  {/* Created Date */}
                  <td>
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.85rem' }}>{mockDate}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{mockTime}</div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => { onNotify('success', `Viewing category "${cat.name}" details.`); }}
                        className="btn btn-secondary"
                        style={styles.actionBtnIcon}
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="btn btn-secondary"
                        style={styles.actionBtnIcon}
                        title="Edit category"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="btn btn-danger"
                        style={styles.actionBtnIcon}
                        title="Delete category"
                      >
                        <Trash2 size={15} />
                      </button>
                      <button className="btn btn-secondary" style={styles.actionBtnIcon} title="Options">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination controls */}
      <div className="pagination-container">
        <span className="pagination-info">Showing 1 to {sortedCategories.length} of {sortedCategories.length} entries</span>
        <div className="pagination-actions">
          <button className="pagination-btn" disabled>&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn" disabled>&gt;</button>
          
          <select 
            className="filter-select" 
            value={itemsPerPage} 
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            style={{ minWidth: '90px', padding: '6px 24px 6px 8px', fontSize: '0.8rem', marginLeft: '10px' }}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* 6. Widgets Grid Area (Recent Activity & Quick Actions) */}
      <div className="widgets-grid-container">
        {/* Recent Activity */}
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3 className="widget-title">
              <Activity size={18} color="var(--color-primary)" /> Recent Activity
            </h3>
            <button className="widget-action-link" onClick={() => onNotify('success', 'Viewing complete audit log logs.')}>View All</button>
          </div>
          <div className="activity-list">
            {activities.map(act => (
              <div key={act.id} className="activity-row">
                <div className={`activity-icon-badge ${
                  act.type === 'create' ? 'activity-icon-create' : 
                  act.type === 'update' ? 'activity-icon-update' : 'activity-icon-delete'
                }`}>
                  {act.type === 'create' ? <Plus size={14} /> : 
                   act.type === 'update' ? <Edit2 size={12} /> : <Trash2 size={12} />}
                </div>
                <div className="activity-detail">
                  <span className="activity-text">{act.text}</span>
                  <span className="activity-meta">{act.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3 className="widget-title">
              <Zap size={18} color="var(--color-primary)" /> Quick Actions
            </h3>
          </div>
          <div className="quick-actions-flex">
            {/* Add Category */}
            <div className="quick-action-square" onClick={handleOpenAddModal}>
              <div className="quick-action-icon" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#c084fc' }}>
                <PlusCircle size={20} />
              </div>
              <span className="quick-action-title">Add Category</span>
              <span className="quick-action-desc">Create a new top-level category</span>
            </div>

            {/* Manage Subcategories */}
            <div className="quick-action-square" onClick={() => onNavigateTab('subcategories')}>
              <div className="quick-action-icon" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                <FolderTree size={20} />
              </div>
              <span className="quick-action-title">Manage Subcats</span>
              <span className="quick-action-desc">Organize subcategories under categories</span>
            </div>

            {/* Generate QR Card */}
            <div className="quick-action-square" onClick={() => onNavigateTab('qr')}>
              <div className="quick-action-icon" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                <QrCode size={20} />
              </div>
              <span className="quick-action-title">Generate QR</span>
              <span className="quick-action-desc">Create QR cards for your categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Modal Overlay Form (Add/Edit) */}
      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.formModal} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div className="form-group">
                <label htmlFor="modalCatName">Category Name *</label>
                <input
                  id="modalCatName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Apparel & Garments"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalCatDesc">Description</label>
                <textarea
                  id="modalCatDesc"
                  rows="3"
                  className="form-control"
                  placeholder="Details of this wholesale category..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Save Changes' : 'Publish Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const ShoppingBag = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  headerBtnGroup: {
    display: 'flex',
    gap: '8px',
  },
  headerBtn: {
    fontSize: '0.85rem',
    padding: '8px 16px',
  },
  actionButtons: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'flex-end',
  },
  actionBtnIcon: {
    padding: '6px 8px',
    minHeight: 'auto',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'var(--color-border)'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  formModal: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#0a0d14',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '16px',
  }
};
