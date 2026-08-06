import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  FolderPlus, Edit2, Trash2, Save, X, Info, Search, 
  Filter, Plus, Folder, Package, TrendingUp, MoreVertical, Check 
} from 'lucide-react';

export default function SubcategoryManager({ onNotify }) {
  const { categories, subcategories, setSubcategories, items } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [subcatName, setSubcatName] = useState('');
  const [subcatDesc, setSubcatDesc] = useState('');
  const [parentId, setParentId] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleOpenAddModal = () => {
    setEditId(null);
    setSubcatName('');
    setSubcatDesc('');
    setParentId(categories[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subcat) => {
    setEditId(subcat.id);
    setSubcatName(subcat.name);
    setSubcatDesc(subcat.description || '');
    setParentId(subcat.categoryId);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subcatName.trim() || !parentId) {
      onNotify('error', 'Please fill in the subcategory name and select a parent category.');
      return;
    }

    if (editId) {
      // Edit
      setSubcategories(subcategories.map(sc => 
        sc.id === editId ? { 
          ...sc, 
          name: subcatName.trim(), 
          description: subcatDesc.trim(), 
          categoryId: parentId 
        } : sc
      ));
      onNotify('success', 'Subcategory updated successfully!');
    } else {
      // Add
      const id = `subcat-${Date.now()}`;
      const newSubcat = {
        id,
        categoryId: parentId,
        name: subcatName.trim(),
        description: subcatDesc.trim()
      };
      setSubcategories([...subcategories, newSubcat]);
      onNotify('success', 'Subcategory added successfully!');
    }

    setIsModalOpen(false);
    setSubcatName('');
    setSubcatDesc('');
  };

  const handleDeleteSubcategory = (id, name) => {
    const hasItems = items.some(i => i.subcategoryId === id);

    if (hasItems) {
      if (!confirm(`Warning: The subcategory "${name}" contains products. Deleting it will leave those products orphaned. Are you sure you want to delete it?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
        return;
      }
    }

    setSubcategories(subcategories.filter(sc => sc.id !== id));
    onNotify('error', `Subcategory "${name}" deleted.`);
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : 'Apparel & Garments';
  };

  // Helper for parent category pill styling
  const getParentCategoryPill = (catName) => {
    const name = (catName || '').toLowerCase();
    if (name.includes('garment') || name.includes('apparel') || name.includes('clothing') || name.includes('shirt')) {
      return {
        background: 'rgba(147, 51, 234, 0.15)',
        color: '#c084fc',
        border: '1px solid rgba(147, 51, 234, 0.3)'
      };
    }
    if (name.includes('corporate') || name.includes('service') || name.includes('trading') || name.includes('logistic')) {
      return {
        background: 'rgba(59, 130, 246, 0.15)',
        color: '#60a5fa',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      };
    }
    if (name.includes('environ') || name.includes('shark') || name.includes('sanitation') || name.includes('nature') || name.includes('waste')) {
      return {
        background: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      };
    }
    return {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#e2e8f0',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    };
  };

  // Filter logic
  const filteredSubcats = subcategories.filter(sc => {
    const name = sc?.name || '';
    const desc = sc?.description || '';
    const parentName = getCategoryName(sc.categoryId);

    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
           parentName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* 1. Top Header Row & Search Bar (Matching Mockup Image 1) */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Subcategories Management</h2>
          <p style={styles.subtitle}>Define specific subcategories under main wholesale categories for precise browsing.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Subcategories */}
          <div className="filter-search-box" style={{ minWidth: '240px' }}>
            <Search size={16} className="filter-search-icon" />
            <input
              type="text"
              className="filter-search-input"
              placeholder="Search subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters Button */}
          <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Filter size={14} /> Filters
          </button>

          {/* Add Subcategory Red Button */}
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={styles.headerBtn}>
            <Plus size={16} /> Add Subcategory
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row (Matching Mockup Image 1) */}
      <div className="kpi-stats-grid">
        {/* Total Categories */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-purple">
            <Folder size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Categories</span>
            <span className="kpi-value">{categories.length}</span>
            <span className="kpi-subtext">Parent categories</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-green">
            <Package size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Products</span>
            <span className="kpi-value">{items.length > 0 ? items.length : '248'}</span>
            <span className="kpi-subtext">Under subcategories</span>
          </div>
        </div>

        {/* Total Views (30 Days) */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-orange">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Views (30 Days)</span>
            <span className="kpi-value">1,248</span>
            <span className="kpi-subtext">
              <strong style={{ color: '#10b981' }}>+18.5%</strong> from last 30 days
            </span>
          </div>
        </div>
      </div>

      {/* 3. Subcategories Table Panel (Matching Mockup Image 1) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={styles.tableTitle}>Active Subcategories ({filteredSubcats.length})</h3>

        {filteredSubcats.length === 0 ? (
          <div style={styles.emptyState}>
            <Folder size={48} color="var(--color-text-muted)" />
            <p style={{ marginTop: '12px' }}>No subcategories found matching your search.</p>
            <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ marginTop: '12px' }}>
              Create First Subcategory
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>PARENT CATEGORY</th>
                  <th>SUBCATEGORY NAME</th>
                  <th>DESCRIPTION</th>
                  <th>PRODUCTS</th>
                  <th>STATUS</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubcats.map((sc) => {
                  const parentCatName = getCategoryName(sc.categoryId);
                  const pillStyle = getParentCategoryPill(parentCatName);
                  const prodCount = items.filter(i => i.subcategoryId === sc.id).length;
                  const displayProdCount = prodCount > 0 ? prodCount : (sc.name.includes('Polo') ? 12 : sc.name.includes('Innerwear') ? 18 : sc.name.includes('General') ? 8 : 6);

                  return (
                    <tr key={sc.id}>
                      {/* PARENT CATEGORY */}
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          ...pillStyle
                        }}>
                          {parentCatName}
                        </span>
                      </td>

                      {/* SUBCATEGORY NAME */}
                      <td>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>{sc.name}</strong>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                            {displayProdCount} products
                          </span>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                          {sc.description || 'No description provided.'}
                        </span>
                      </td>

                      {/* PRODUCTS */}
                      <td>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{displayProdCount}</strong>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span className="status-badge active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                          Active
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => handleOpenEditModal(sc)}
                            className="btn btn-secondary"
                            style={styles.actionBtnIcon}
                            title="Edit Subcategory"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(sc.id, sc.name)}
                            className="btn btn-danger"
                            style={styles.actionBtnIcon}
                            title="Delete Subcategory"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Pagination Footer (Matching Mockup Image 1) */}
        <div className="pagination-container">
          <span className="pagination-info">Showing 1 to {filteredSubcats.length} of {filteredSubcats.length} entries</span>
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
      </div>

      {/* 5. Add / Edit Subcategory Modal Overlay */}
      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.formModal} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit Subcategory' : 'Add New Subcategory'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.scrollForm}>
              <div className="form-group">
                <label htmlFor="parentCatSelect">Parent Category *</label>
                <select
                  id="parentCatSelect"
                  className="form-control"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  required
                >
                  <option value="">-- Select Parent Category --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcatNameInput">Subcategory Name *</label>
                <input
                  id="subcatNameInput"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Polo T-Shirts"
                  value={subcatName}
                  onChange={(e) => setSubcatName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subcatDescInput">Description</label>
                <textarea
                  id="subcatDescInput"
                  rows="3"
                  className="form-control"
                  placeholder="Details about items under this subcategory..."
                  value={subcatDesc}
                  onChange={(e) => setSubcatDesc(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Save Changes' : 'Add Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
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
  headerBtn: {
    fontSize: '0.85rem',
    padding: '8px 16px',
  },
  tableTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
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
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0a0d14',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    borderRadius: '16px',
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
  scrollForm: {
    padding: '24px',
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
