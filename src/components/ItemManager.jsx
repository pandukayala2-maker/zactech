import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  ShoppingBag, Edit, Trash, Plus, Check, Info, Upload, 
  Search, Grid, FolderTree, TrendingUp, Eye, MoreVertical, 
  Filter, RotateCcw, Package, X 
} from 'lucide-react';

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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCatId, setFilterCatId] = useState('all');
  const [filterSubcatId, setFilterSubcatId] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('150');
  const [catId, setCatId] = useState('');
  const [subcatId, setSubcatId] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customSizes, setCustomSizes] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('QAR 45.00');
  
  // Extra Details
  const [origin, setOrigin] = useState('Made in India');
  const [fabric, setFabric] = useState('');
  const [packaging, setPackaging] = useState('');

  // Form Subcategories helper
  const [filteredSubcats, setFilteredSubcats] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination Mock
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Dynamic filter for subcategory dropdown in the search bar
  const searchSubcatsList = filterCatId === 'all' 
    ? subcategories 
    : subcategories.filter(sc => sc.categoryId === filterCatId);

  // Filter subcategories when modal category changes
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
    setSku('');
    setStock('150');
    setCatId('');
    setSubcatId('');
    setSelectedSizes([]);
    setCustomSizes('');
    setDescription('');
    setImageUrl('');
    setPrice('QAR 45.00');
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

    let finalSizes = [...selectedSizes];
    if (customSizes.trim()) {
      const parsedCustom = customSizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
      finalSizes = [...new Set([...finalSizes, ...parsedCustom])];
    }

    const finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60';
    const autoSku = sku.trim() || `ONN-PT-${Math.floor(100 + Math.random() * 900)}`;

    const itemData = {
      name: name.trim(),
      brand: brand.trim() || 'ONN Premiums',
      sku: autoSku,
      stock: stock.trim() || '150',
      categoryId: catId,
      subcategoryId: subcatId,
      sizes: finalSizes,
      description: description.trim(),
      imageUrl: finalImageUrl,
      price: price.trim() || 'QAR 45.00',
      status: 'active',
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
    setBrand(item.brand || 'ONN Premiums');
    setSku(item.sku || `SKU: ONN-PT-00${item.id.slice(-1)}`);
    setStock(item.stock || '150');
    setCatId(item.categoryId);
    setSubcatId(item.subcategoryId);
    
    const standard = (item.sizes || []).filter(s => SIZE_OPTIONS.includes(s));
    const custom = (item.sizes || []).filter(s => !SIZE_OPTIONS.includes(s)).join(', ');
    setSelectedSizes(standard);
    setCustomSizes(custom);

    setDescription(item.description || '');
    setImageUrl(item.imageUrl || '');
    setPrice(item.price || 'QAR 45.00');
    
    setOrigin(item.details?.origin || 'Made in India');
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCatId('all');
    setFilterSubcatId('all');
    setFilterStatus('all');
  };

  // Filter items logic
  const filteredItems = items.filter(item => {
    const itemName = item?.name || '';
    const itemBrand = item?.brand || '';
    const itemSku = item?.sku || '';

    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          itemBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          itemSku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = filterCatId === 'all' || item.categoryId === filterCatId;
    const matchesSubcat = filterSubcatId === 'all' || item.subcategoryId === filterSubcatId;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && item.status !== 'inactive');

    return matchesSearch && matchesCat && matchesSubcat && matchesStatus;
  });

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Apparel & Garments';
  const getSubcategoryName = (id) => subcategories.find(sc => sc.id === id)?.name || 'Polo T-Shirts';

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* 1. Header Area */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Products Management</h2>
          <p style={styles.subtitle}>Add, update, or remove items from the catalog scanned by wholesale buyers.</p>
        </div>
        {!isFormOpen && (
          <button onClick={() => setIsFormOpen(true)} className="btn btn-primary" style={styles.headerBtn}>
            <Plus size={16} /> Add New Product
          </button>
        )}
      </div>

      {/* 2. KPI Cards Row (Matching Mockup Image 2) */}
      <div className="kpi-stats-grid">
        {/* Total Products */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle" style={{ backgroundColor: 'rgba(211, 30, 37, 0.15)', color: '#ff4d54' }}>
            <Package size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Products</span>
            <span className="kpi-value">{items.length}</span>
            <span className="kpi-subtext">All active products</span>
          </div>
        </div>

        {/* Total Categories */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-green">
            <Grid size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Categories</span>
            <span className="kpi-value">{categories.length}</span>
            <span className="kpi-subtext">Across all products</span>
          </div>
        </div>

        {/* Total Subcategories */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-blue">
            <FolderTree size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Subcategories</span>
            <span className="kpi-value">{subcategories.length}</span>
            <span className="kpi-subtext">Across all products</span>
          </div>
        </div>

        {/* Total Views */}
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-orange">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Views</span>
            <span className="kpi-value">1,248</span>
            <span className="kpi-subtext">In last 30 days</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Filter Bar (Matching Mockup Image 2) */}
      <div className="filter-options-bar">
        {/* Search */}
        <div className="filter-search-box">
          <Search size={16} className="filter-search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="filter-select"
          value={filterCatId}
          onChange={(e) => {
            setFilterCatId(e.target.value);
            setFilterSubcatId('all');
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Subcategory Filter */}
        <select
          className="filter-select"
          value={filterSubcatId}
          onChange={(e) => setFilterSubcatId(e.target.value)}
        >
          <option value="all">All Subcategories</option>
          {searchSubcatsList.map(sc => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Filters Button */}
        <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <Filter size={14} /> Filters
        </button>

        {/* Reset Button */}
        <button onClick={handleResetFilters} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* 4. Products Table (Matching Mockup Image 2 Layout) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={styles.formTitle}>Active Wholesale Catalog Products ({filteredItems.length})</h3>

        {filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <ShoppingBag size={48} color="var(--color-text-muted)" />
            <p style={{ marginTop: '12px' }}>No items found matching your filters.</p>
            <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: '12px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>PREVIEW</th>
                  <th>PRODUCT INFO</th>
                  <th>CATEGORY & SUBCATEGORY</th>
                  <th>SIZES</th>
                  <th>STOCK</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => {
                  const defaultSku = item.sku || (idx === 0 ? 'SKU: ONN-PT-001' : 'SKU: ONN-MV-003');
                  const defaultStock = item.stock || (idx === 0 ? '150' : '80');
                  const displaySizes = item.sizes || ["S", "M", "L"];
                  const visibleSizes = displaySizes.slice(0, 4);
                  const overflowCount = displaySizes.length - 4;

                  return (
                    <tr key={item.id}>
                      {/* PREVIEW */}
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

                      {/* PRODUCT INFO */}
                      <td>
                        <div>
                          <strong style={styles.itemName}>{item.name}</strong>
                          <div style={styles.itemBrand}>Brand: {item.brand || 'ONN Premiums'}</div>
                          <div style={styles.itemSku}>{defaultSku.startsWith('SKU:') ? defaultSku : `SKU: ${defaultSku}`}</div>
                        </div>
                      </td>

                      {/* CATEGORY & SUBCATEGORY */}
                      <td>
                        <div>
                          <span style={{ color: 'var(--color-primary-hover)', fontWeight: '600', fontSize: '0.85rem', display: 'block' }}>
                            {getCategoryName(item.categoryId)}
                          </span>
                          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                            {getSubcategoryName(item.subcategoryId)}
                          </span>
                        </div>
                      </td>

                      {/* SIZES */}
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {visibleSizes.map((s, i) => (
                            <span key={i} style={styles.sizeTag}>{s}</span>
                          ))}
                          {overflowCount > 0 && (
                            <span style={{ ...styles.sizeTag, backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                              +{overflowCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STOCK */}
                      <td>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{defaultStock}</strong>
                          <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '500' }}>• In Stock</div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{item.price || 'QAR 45.00'}</strong>
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
                            onClick={() => onNotify('success', `Viewing details for ${item.name}`)}
                            className="btn btn-secondary"
                            style={styles.actionBtnIcon}
                            title="View Product"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="btn btn-secondary"
                            style={styles.actionBtnIcon}
                            title="Edit Product"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="btn btn-danger"
                            style={styles.actionBtnIcon}
                            title="Delete Product"
                          >
                            <Trash size={15} />
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
        )}

        {/* 5. Pagination Footer (Matching Mockup Image 2) */}
        <div className="pagination-container">
          <span className="pagination-info">Showing 1 to {filteredItems.length} of {filteredItems.length} entries</span>
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

      {/* 6. Dynamic Modal Form Overlay for Add/Edit Product */}
      {isFormOpen && (
        <div style={styles.overlay}>
          <div style={styles.formModal} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
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
                  <label htmlFor="prodBrand">Brand Name</label>
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
                  <label htmlFor="prodSku">SKU Number</label>
                  <input
                    id="prodSku"
                    type="text"
                    className="form-control"
                    placeholder="e.g. ONN-PT-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prodStock">Initial Stock Quantity</label>
                  <input
                    id="prodStock"
                    type="number"
                    className="form-control"
                    placeholder="e.g. 150"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
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

              {/* Pricing & Origin */}
              <div style={styles.grid2}>
                <div className="form-group">
                  <label htmlFor="prodPrice">Unit Price Display</label>
                  <input
                    id="prodPrice"
                    type="text"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. QAR 45.00"
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

              {/* Image Picker */}
              <div className="form-group">
                <label htmlFor="prodImage">Image URL</label>
                <input
                  id="prodImage"
                  type="text"
                  className="form-control"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste external product image URL..."
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
                  placeholder="Product marketing description..."
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
  headerBtn: {
    fontSize: '0.85rem',
    padding: '8px 16px',
  },
  formTitle: {
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
  previewBox: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
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
    display: 'block',
  },
  itemBrand: {
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  itemSku: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    marginTop: '2px',
  },
  sizeTag: {
    fontSize: '0.7rem',
    background: 'rgba(255,255,255,0.05)',
    padding: '3px 7px',
    borderRadius: '4px',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    fontWeight: '500',
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
    maxWidth: '650px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
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
  scrollForm: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
