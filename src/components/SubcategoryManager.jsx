import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FolderPlus, Edit2, Trash2, Save, X, Info } from 'lucide-react';

export default function SubcategoryManager({ onNotify }) {
  const { categories, subcategories, setSubcategories, items } = useData();
  const [newSubcatName, setNewSubcatName] = useState('');
  const [newSubcatDesc, setNewSubcatDesc] = useState('');
  const [newSubcatParentId, setNewSubcatParentId] = useState('');

  // Editing state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editParentId, setEditParentId] = useState('');

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!newSubcatName.trim() || !newSubcatParentId) {
      onNotify('error', 'Please fill in all required fields and select a parent category.');
      return;
    }

    const id = `subcat-${Date.now()}`;
    const newSubcat = {
      id,
      categoryId: newSubcatParentId,
      name: newSubcatName.trim(),
      description: newSubcatDesc.trim()
    };

    setSubcategories([...subcategories, newSubcat]);
    setNewSubcatName('');
    setNewSubcatDesc('');
    // keep newSubcatParentId selected for easier batch adding
    onNotify('success', 'Subcategory added successfully!');
  };

  const handleStartEdit = (subcat) => {
    setEditId(subcat.id);
    setEditName(subcat.name);
    setEditDesc(subcat.description);
    setEditParentId(subcat.categoryId);
  };

  const handleSaveEdit = (id) => {
    if (!editName.trim() || !editParentId) return;

    setSubcategories(subcategories.map(subcat => 
      subcat.id === id ? { 
        ...subcat, 
        name: editName.trim(), 
        description: editDesc.trim(), 
        categoryId: editParentId 
      } : subcat
    ));
    setEditId(null);
    onNotify('success', 'Subcategory updated successfully!');
  };

  const handleDeleteSubcategory = (id, name) => {
    // Check if items exist
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

    setSubcategories(subcategories.filter(subcat => subcat.id !== id));
    onNotify('error', `Subcategory "${name}" deleted.`);
  };

  // Helper to get category name
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : 'Unknown Category';
  };

  return (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Subcategories Management</h2>
          <p style={styles.subtitle}>Define specific subcategories under main wholesale categories for precise browsing.</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="glass-panel" style={styles.warningBox}>
          <Info size={32} color="var(--color-warning)" />
          <div>
            <h3 style={{ color: 'var(--color-warning)', marginBottom: '4px' }}>No Categories Found</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              You must create at least one category before you can define subcategories. 
              Please go to the Categories section first.
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.layout}>
          {/* Add Subcategory Form */}
          <div style={styles.formContainer} className="glass-panel">
            <h3 style={styles.formTitle}>
              <FolderPlus size={18} color="var(--color-primary)" /> Add Subcategory
            </h3>
            <form onSubmit={handleAddSubcategory}>
              <div className="form-group">
                <label htmlFor="parentCat">Parent Category *</label>
                <select
                  id="parentCat"
                  className="form-control"
                  value={newSubcatParentId}
                  onChange={(e) => setNewSubcatParentId(e.target.value)}
                  required
                >
                  <option value="">-- Select Parent Category --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcatName">Subcategory Name *</label>
                <input
                  id="subcatName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Polo T-Shirts"
                  value={newSubcatName}
                  onChange={(e) => setNewSubcatName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subcatDesc">Description</label>
                <textarea
                  id="subcatDesc"
                  rows="3"
                  className="form-control"
                  placeholder="Details about items under this subcategory..."
                  value={newSubcatDesc}
                  onChange={(e) => setNewSubcatDesc(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Add Subcategory
              </button>
            </form>
          </div>

          {/* Subcategories List */}
          <div style={styles.listContainer} className="glass-panel">
            <h3 style={styles.formTitle}>Active Subcategories ({subcategories.length})</h3>

            {subcategories.length === 0 ? (
              <div style={styles.emptyState}>
                <Info size={36} color="var(--color-text-muted)" />
                <p>No subcategories defined yet. Add one on the left to get started!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Parent Category</th>
                      <th>Subcategory Name</th>
                      <th>Description</th>
                      <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map(subcat => {
                      const isEditing = editId === subcat.id;
                      const itemsCount = items.filter(i => i.subcategoryId === subcat.id).length;

                      return (
                        <tr key={subcat.id}>
                          <td>
                            {isEditing ? (
                              <select
                                className="form-control"
                                value={editParentId}
                                onChange={(e) => setEditParentId(e.target.value)}
                                style={{ padding: '6px 12px' }}
                              >
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            ) : (
                              <span style={styles.parentName}>{getCategoryName(subcat.categoryId)}</span>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ padding: '6px 12px' }}
                              />
                            ) : (
                              <div>
                                <strong style={styles.subcatName}>{subcat.name}</strong>
                                <div style={styles.counterBadge}>{itemsCount} wholesale products</div>
                              </div>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <textarea
                                rows="2"
                                className="form-control"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                style={{ padding: '6px 12px', resize: 'none', fontSize: '0.875rem' }}
                              />
                            ) : (
                              <span style={styles.subcatDesc}>{subcat.description || <em style={{ color: 'var(--color-text-muted)' }}>No description</em>}</span>
                            )}
                          </td>
                          <td>
                            <div style={styles.actionButtons}>
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEdit(subcat.id)}
                                    className="btn btn-secondary"
                                    style={styles.actionBtnIcon}
                                    title="Save Changes"
                                  >
                                    <Save size={16} color="var(--color-success)" />
                                  </button>
                                  <button
                                    onClick={() => setEditId(null)}
                                    className="btn btn-secondary"
                                    style={styles.actionBtnIcon}
                                    title="Cancel"
                                  >
                                    <X size={16} color="var(--color-danger)" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleStartEdit(subcat)}
                                    className="btn btn-secondary"
                                    style={styles.actionBtnIcon}
                                    title="Edit"
                                  >
                                    <Edit2 size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubcategory(subcat.id, subcat.name)}
                                    className="btn btn-danger"
                                    style={styles.actionBtnIcon}
                                    title="Delete"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '24px',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  formContainer: {
    padding: '24px',
    height: 'fit-content',
  },
  formTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  listContainer: {
    padding: '24px',
  },
  parentName: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.875rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
  },
  subcatName: {
    color: '#fff',
    fontSize: '0.95rem',
  },
  subcatDesc: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.875rem',
  },
  counterBadge: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'flex-end',
  },
  actionBtnIcon: {
    padding: '6px 10px',
    minHeight: 'auto',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    gap: '12px',
    color: 'var(--color-text-muted)',
  },
  warningBox: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    alignItems: 'center',
    borderLeft: '4px solid var(--color-warning)',
  },
  // Responsive layout addition
  '@media (min-width: 992px)': {
    layout: {
      gridTemplateColumns: '350px 1fr',
    }
  }
};

// Simple media query fallback for React style sheet
if (typeof window !== 'undefined') {
  const applyLayout = () => {
    const isDesktop = window.innerWidth >= 992;
    styles.layout.gridTemplateColumns = isDesktop ? '350px 1fr' : '1fr';
  };
  window.addEventListener('resize', applyLayout);
  applyLayout();
}
