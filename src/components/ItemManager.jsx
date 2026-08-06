import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ShoppingBag, Edit, Trash, Plus, Check, Info, Upload } from 'lucide-react';

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
const PRESET_IMAGES = [
  { name: 'Polo T-Shirt (Beige)', url: '/images/polo_tshirt.jpg' },
  { name: 'Men\'s Vest (White Pack)', url: '/images/mens_vest.jpg' },
  { name: 'General Apparel Item', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60' },
  { name: 'Corporate Trading Package', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60' },
  { name: 'Sea Shark environmental Logo', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=60' }
];

export default function ItemManager({ onNotify }) {
  const { categories, subcategories, items, setItems } = useData();

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [catId, setCatId] = useState('');
  const [subcatId, setSubcatId] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customSizes, setCustomSizes] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('Wholesale (Contact for Quote)');
  
  // Extra Details
  const [origin, setOrigin] = useState('Made in India');
  const [fabric, setFabric] = useState('');
  const [packaging, setPackaging] = useState('');

  // UI state
  const [filteredSubcats, setFilteredSubcats] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter subcategories when category changes
  useEffect(() => {
    if (catId) {
      setFilteredSubcats(subcategories.filter(sc => sc.categoryId === catId));
    } else {
      setFilteredSubcats([]);
    }
  }, [catId, subcategories]);

  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setEditingItemId(null);
    setName('');
    setBrand('');
    setCatId('');
    setSubcatId('');
    setSelectedSizes([]);
    setCustomSizes('');
    setDescription('');
    setImageUrl('');
    setPrice('Wholesale (Contact for Quote)');
    setOrigin('Made in India');
    setFabric('');
    setPackaging('');
    setIsFormOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !catId || !subcatId) {
      onNotify('error', 'Please fill in the Product Name, Category, and Subcategory.');
      return;
    }

    // Combine standard and custom sizes
    let finalSizes = [...selectedSizes];
    if (customSizes.trim()) {
      const parsedCustom = customSizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
      finalSizes = [...new Set([...finalSizes, ...parsedCustom])];
    }

    // Fallback image
    const finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60';

    const itemData = {
      name: name.trim(),
      brand: brand.trim() || 'Generic',
      categoryId: catId,
      subcategoryId: subcatId,
      sizes: finalSizes,
      description: description.trim(),
      imageUrl: finalImageUrl,
      price: price.trim(),
      details: {
        origin: origin.trim(),
        fabric: fabric.trim(),
        packaging: packaging.trim()
      }
    };

    if (isEditing) {
      setItems(items.map(item => 
        item.id === editingItemId ? { ...item, ...itemData } : item
      ));
      onNotify('success', 'Product updated successfully!');
    } else {
      const newItem = {
        id: `item-${Date.now()}`,
        ...itemData
      };
      setItems([...items, newItem]);
      onNotify('success', 'Product added successfully!');
    }

    handleResetForm();
  };

  const handleStartEdit = (item) => {
    setIsEditing(true);
    setEditingItemId(item.id);
    setName(item.name);
    setBrand(item.brand);
    setCatId(item.categoryId);
    // Explicitly set subcategory id after the effect triggers
    setSubcatId(item.subcategoryId);
    
    // Split sizes
    const standard = item.sizes.filter(s => SIZE_OPTIONS.includes(s));
    const custom = item.sizes.filter(s => !SIZE_OPTIONS.includes(s)).join(', ');
    setSelectedSizes(standard);
    setCustomSizes(custom);

    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setPrice(item.price);
    
    setOrigin(item.details?.origin || '');
    setFabric(item.details?.fabric || '');
    setPackaging(item.details?.packaging || '');
    
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id, itemName) => {
    if (!confirm(`Are you sure you want to delete product "${itemName}"?`)) {
      return;
    }
    setItems(items.filter(item => item.id !== id));
    onNotify('error', `Product "${itemName}" deleted.`);
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getSubcategoryName = (id) => subcategories.find(sc => sc.id === id)?.name || 'Unknown';

  return (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Products Management</h2>
          <p style={styles.subtitle}>Add, update, or remove items from the catalog scanned by wholesale buyers.</p>
        </div>
        {!isFormOpen && (
          <button onClick={() => setIsFormOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Add New Product
          </button>
        )}
      </div>

      {subcategories.length === 0 ? (
        <div className="glass-panel" style={styles.warningBox}>
          <Info size={32} color="var(--color-warning)" />
          <div>
            <h3 style={{ color: 'var(--color-warning)', marginBottom: '4px' }}>No Subcategories Configured</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              You need to configure at least one Subcategory under a Category before you can add products.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Dynamic Form Modal/Overlay */}
          {isFormOpen && (
            <div style={styles.overlay}>
              <div style={styles.formModal} className="glass-panel animate-fade-in">
                <div style={styles.modalHeader}>
                  <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={handleResetForm} style={styles.closeBtn}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.scrollForm}>
                  <div style={styles.grid2}>
                    <div className="form-group">
                      <label htmlFor="prodName">Product Name *</label>
                      <input
                        id="prodName"
                        type="text"
                        className="form-control"
                        placeholder="e.g. ONN Premium Polo T-Shirt"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prodBrand">Brand</label>
                      <input
                        id="prodBrand"
                        type="text"
                        className="form-control"
                        placeholder="e.g. ONN Premiums"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={styles.grid2}>
                    <div className="form-group">
                      <label htmlFor="prodCat">Category *</label>
                      <select
                        id="prodCat"
                        className="form-control"
                        value={catId}
                        onChange={(e) => {
                          setCatId(e.target.value);
                          setSubcatId('');
                        }}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="prodSubcat">Subcategory *</label>
                      <select
                        id="prodSubcat"
                        className="form-control"
                        value={subcatId}
                        onChange={(e) => setSubcatId(e.target.value)}
                        required
                        disabled={!catId}
                      >
                        <option value="">-- Select Subcategory --</option>
                        {filteredSubcats.map(sc => (
                          <option key={sc.id} value={sc.id}>{sc.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="form-group">
                    <label>Available Sizes</label>
                    <div className="pill-selector" style={{ marginBottom: '12px' }}>
                      {SIZE_OPTIONS.map(size => {
                        const checked = selectedSizes.includes(size);
                        return (
                          <label key={size} className="pill-checkbox">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleSizeToggle(size)}
                            />
                            <span className="pill-label">{size}</span>
                          </label>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add custom sizes (comma-separated, e.g. XXL, 38, 40)"
                      value={customSizes}
                      onChange={(e) => setCustomSizes(e.target.value)}
                    />
                  </div>

                  {/* Pricing and Origin */}
                  <div style={styles.grid2}>
                    <div className="form-group">
                      <label htmlFor="prodPrice">Wholesale Price Display</label>
                      <input
                        id="prodPrice"
                        type="text"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. Wholesale (Contact for Quote)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prodOrigin">Country of Origin</label>
                      <input
                        id="prodOrigin"
                        type="text"
                        className="form-control"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="e.g. Made in India"
                      />
                    </div>
                  </div>

                  {/* Fabric details & Packaging */}
                  <div style={styles.grid2}>
                    <div className="form-group">
                      <label htmlFor="prodFabric">Fabric / Material Details</label>
                      <input
                        id="prodFabric"
                        type="text"
                        className="form-control"
                        value={fabric}
                        onChange={(e) => setFabric(e.target.value)}
                        placeholder="e.g. 100% Combed Cotton"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prodPackaging">Packaging details</label>
                      <input
                        id="prodPackaging"
                        type="text"
                        className="form-control"
                        value={packaging}
                        onChange={(e) => setPackaging(e.target.value)}
                        placeholder="e.g. 3-Pack box, Single Polybag"
                      />
                    </div>
                  </div>

                  {/* Image Picker */}
                  <div className="form-group">
                    <label htmlFor="prodImage">Image URL</label>
                    <input
                      id="prodImage"
                      type="text"
                      className="form-control"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste Unsplash or external product image link..."
                      style={{ marginBottom: '10px' }}
                    />
                    <div style={styles.presetHeading}>Or Select Quick Preset Asset:</div>
                    <div style={styles.presetRow}>
                      {PRESET_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          style={{
                            ...styles.presetBtn,
                            borderColor: imageUrl === img.url ? 'var(--color-primary)' : 'var(--color-border)'
                          }}
                          onClick={() => setImageUrl(img.url)}
                          title={img.name}
                        >
                          {img.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="prodDesc">Product Description</label>
                    <textarea
                      id="prodDesc"
                      rows="3"
                      className="form-control"
                      placeholder="Enter premium product marketing pitch or details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <div style={styles.modalActions}>
                    <button type="button" onClick={handleResetForm} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isEditing ? 'Save Changes' : 'Publish Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Product Items Table View */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={styles.formTitle}>Active Wholesale Catalog Products ({items.length})</h3>

            {items.length === 0 ? (
              <div style={styles.emptyState}>
                <ShoppingBag size={48} color="var(--color-text-muted)" />
                <p style={{ marginTop: '12px' }}>No items in the catalogue. Let's create some wholesale garments!</p>
                <button onClick={() => setIsFormOpen(true)} className="btn btn-primary" style={{ marginTop: '12px' }}>
                  <Plus size={16} /> Create First Product
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Preview</th>
                      <th>Product Info</th>
                      <th>Category & Sub</th>
                      <th>Sizes</th>
                      <th>Details</th>
                      <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div style={styles.previewBox}>
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={styles.previewImg}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60';
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong style={styles.itemName}>{item.name}</strong>
                            <div style={styles.itemBrand}>Brand: {item.brand}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <span style={styles.catBadge}>{getCategoryName(item.categoryId)}</span>
                            <div style={styles.subcatName}>{getSubcategoryName(item.subcategoryId)}</div>
                          </div>
                        </td>
                        <td>
                          <div style={styles.sizeWrapper}>
                            {item.sizes && item.sizes.length > 0 ? (
                              item.sizes.map((s, i) => (
                                <span key={i} style={styles.sizeTag}>{s}</span>
                              ))
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>None</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={styles.descCell} title={item.description}>
                            {item.price} • {item.details?.origin || 'India'}
                          </div>
                        </td>
                        <td>
                          <div style={styles.actionButtons}>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="btn btn-secondary"
                              style={styles.actionBtnIcon}
                              title="Edit product"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="btn btn-danger"
                              style={styles.actionBtnIcon}
                              title="Delete product"
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const X = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const styles = {
  header: {
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
  formTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
  },
  warningBox: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    alignItems: 'center',
    borderLeft: '4px solid var(--color-warning)',
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
    maxWidth: '650px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0d101d',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '20px 24px',
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
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
  },
  scrollForm: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  presetHeading: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
    marginBottom: '6px',
    marginTop: '4px',
  },
  presetRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '14px',
  },
  presetBtn: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    color: 'var(--color-text-secondary)',
    padding: '4px 8px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  previewBox: {
    width: '56px',
    height: '56px',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    backgroundColor: '#1b223c',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemName: {
    color: '#fff',
    fontSize: '0.95rem',
  },
  itemBrand: {
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  catBadge: {
    fontSize: '0.75rem',
    color: 'var(--color-primary)',
    fontWeight: '600',
  },
  subcatName: {
    fontSize: '0.825rem',
    color: 'var(--color-text-secondary)',
  },
  sizeWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  sizeTag: {
    fontSize: '0.7rem',
    background: 'rgba(255,255,255,0.06)',
    padding: '2px 6px',
    borderRadius: '3px',
    color: '#fff',
    border: '1px solid var(--color-border)',
  },
  descCell: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'flex-end',
  },
  actionBtnIcon: {
    padding: '6px 10px',
    minHeight: 'auto',
  }
};
