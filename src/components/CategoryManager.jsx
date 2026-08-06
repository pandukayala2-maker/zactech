import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FolderPlus, Edit2, Trash2, Save, X, Info } from 'lucide-react';

export default function CategoryManager({ onNotify }) {
  const { categories, setCategories, subcategories, items } = useData();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Editing state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = `cat-${Date.now()}`;
    const newCat = {
      id,
      name: newCatName.trim(),
      description: newCatDesc.trim()
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    onNotify('success', 'Category added successfully!');
  };

  const handleStartEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description);
  };

  const handleSaveEdit = (id) => {
    if (!editName.trim()) return;

    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: editName.trim(), description: editDesc.trim() } : cat
    ));
    setEditId(null);
    onNotify('success', 'Category updated successfully!');
  };

  const handleDeleteCategory = (id, name) => {
    // Check if subcategories exist
    const hasSubcats = subcategories.some(sc => sc.categoryId === id);
    // Check if items exist
    const hasItems = items.some(i => i.categoryId === id);

    if (hasSubcats || hasItems) {
      if (!confirm(`Warning: The category "${name}" contains subcategories or products. Deleting it will leave those elements orphaned. Are you sure you want to delete it?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete category "${name}"?`)) {
        return;
      }
    }

    setCategories(categories.filter(cat => cat.id !== id));
    onNotify('error', `Category "${name}" deleted.`);
  };

  return (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Categories Management</h2>
          <p style={styles.subtitle}>Define top-level wholesale categories (e.g. Apparel, Logistics, Services).</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Add Category Form */}
        <div style={styles.formContainer} className="glass-panel">
          <h3 style={styles.formTitle}>
            <FolderPlus size={18} color="var(--color-primary)" /> Add New Category
          </h3>
          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <label htmlFor="catName">Category Name *</label>
              <input
                id="catName"
                type="text"
                className="form-control"
                placeholder="e.g. Garments & Apparel"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="catDesc">Description</label>
              <textarea
                id="catDesc"
                rows="3"
                className="form-control"
                placeholder="Brief description of products in this category..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Add Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div style={styles.listContainer} className="glass-panel">
          <h3 style={styles.formTitle}>Active Categories ({categories.length})</h3>

          {categories.length === 0 ? (
            <div style={styles.emptyState}>
              <Info size={36} color="var(--color-text-muted)" />
              <p>No categories defined yet. Add one on the left to get started!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => {
                    const isEditing = editId === cat.id;
                    const itemsCount = items.filter(i => i.categoryId === cat.id).length;
                    const subcatCount = subcategories.filter(s => s.categoryId === cat.id).length;

                    return (
                      <tr key={cat.id}>
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
                              <strong style={styles.catName}>{cat.name}</strong>
                              <div style={styles.counterBadge}>
                                {subcatCount} subcats • {itemsCount} products
                              </div>
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
                            <span style={styles.catDesc}>{cat.description || <em style={{ color: 'var(--color-text-muted)' }}>No description</em>}</span>
                          )}
                        </td>
                        <td>
                          <div style={styles.actionButtons}>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(cat.id)}
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
                                  onClick={() => handleStartEdit(cat)}
                                  className="btn btn-secondary"
                                  style={styles.actionBtnIcon}
                                  title="Edit"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
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
  // We'll set media queries in stylesheet if needed, but since it is dashboard layout, grid works fine. Let's make it responsive.
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
  catName: {
    color: '#fff',
    fontSize: '0.95rem',
  },
  catDesc: {
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
