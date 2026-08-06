import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Search, ShoppingBag, Phone, Mail, MapPin, Send, ArrowRight, UserCheck, X, Check } from 'lucide-react';

export default function CustomerCatalog({ onNavigateToLogin }) {
  const { categories, subcategories, items, settings } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [selectedSubcatId, setSelectedSubcatId] = useState('all');

  // Modal State
  const [activeItem, setActiveItem] = useState(null);
  const [inquirySize, setInquirySize] = useState('');
  
  // Quick status updates
  const [subcatList, setSubcatList] = useState([]);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCatId === 'all') {
      setSubcatList([]);
      setSelectedSubcatId('all');
    } else {
      const list = subcategories.filter(sc => sc.categoryId === selectedCatId);
      setSubcatList(list);
      setSelectedSubcatId('all'); // Reset subcategory filter on category change
    }
  }, [selectedCatId, subcategories]);

  // Handle WhatsApp Link Generation
  const generateWhatsAppLink = (item, size) => {
    // Format phone: strip non-numeric characters except +
    const cleanPhone = settings.phone.replace(/[^\d+]/g, '');
    const message = `Hello ZacTEK Team,\n\nI scanned your QR code card and would like a wholesale price quote for:\n\n*Product:* ${item.name}\n*Brand:* ${item.brand}\n*Selected Size:* ${size || 'Any size'}\n*Category:* ${categories.find(c => c.id === item.categoryId)?.name || ''}\n\nPlease let me know the bulk pricing and availability. Thank you!`;
    
    return `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
  };

  // Filter items dynamically
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCatId === 'all' || item.categoryId === selectedCatId;
    const matchesSubcategory = selectedSubcatId === 'all' || item.subcategoryId === selectedSubcatId;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const getSubcategoryName = (id) => subcategories.find(sc => sc.id === id)?.name || '';

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Top Header */}
      <header style={styles.header} className="glass-panel">
        <div style={styles.headerLogo}>
          <div style={styles.logoBadge}>ZT</div>
          <div>
            <h1 style={styles.logoTitle}>{settings.companyName}</h1>
            <p style={styles.logoArabic}>{settings.companyArabic}</p>
          </div>
        </div>
        <button onClick={onNavigateToLogin} style={styles.adminLink} className="btn btn-secondary">
          <UserCheck size={16} /> Admin Portal
        </button>
      </header>

      {/* Hero Welcome banner */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <span style={styles.welcomeTag} className="badge badge-primary">Wholesale Showroom</span>
          <h2 style={styles.heroTitle}>Premium Garments & Trading</h2>
          <p style={styles.heroSubtitle}>
            Browse our complete catalogue. Scan, view, and send instant WhatsApp inquiries directly to our marketing team.
          </p>
          
          {/* Large search bar */}
          <div style={styles.searchWrapper}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search product brands, vests, polo t-shirts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main style={styles.catalogArea}>
        {/* Categories Grid Selector */}
        <div style={styles.categoryHeading}>Browse by Category</div>
        <div style={styles.categoriesGrid}>
          <button
            onClick={() => setSelectedCatId('all')}
            style={{
              ...styles.catCard,
              borderColor: selectedCatId === 'all' ? 'var(--color-primary)' : 'var(--color-border)',
              background: selectedCatId === 'all' ? 'rgba(211, 30, 37, 0.1)' : 'var(--glass-bg)'
            }}
            className="glass-panel"
          >
            <div style={styles.catIcon}>📦</div>
            <strong style={styles.catName}>All Categories</strong>
            <span style={styles.catCount}>{items.length} items</span>
          </button>
          
          {categories.map(cat => {
            const count = items.filter(i => i.categoryId === cat.id).length;
            const isActive = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                style={{
                  ...styles.catCard,
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  background: isActive ? 'rgba(211, 30, 37, 0.1)' : 'var(--glass-bg)'
                }}
                className="glass-panel"
              >
                <div style={styles.catIcon}>
                  {cat.name.includes("Garments") ? "👕" : cat.name.includes("Corporate") ? "🤝" : "♻️"}
                </div>
                <strong style={styles.catName}>{cat.name}</strong>
                <span style={styles.catCount}>{count} items</span>
              </button>
            );
          })}
        </div>

        {/* Subcategories Horizontal Scroll Filter (Only if a category is selected) */}
        {selectedCatId !== 'all' && subcatList.length > 0 && (
          <div style={styles.subcatContainer}>
            <div style={styles.subcatScroll}>
              <button
                onClick={() => setSelectedSubcatId('all')}
                style={{
                  ...styles.subcatTab,
                  background: selectedSubcatId === 'all' ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                  borderColor: selectedSubcatId === 'all' ? 'var(--color-primary)' : 'var(--color-border)'
                }}
              >
                All Subcategories
              </button>
              {subcatList.map(sc => {
                const isActive = selectedSubcatId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedSubcatId(sc.id)}
                    style={{
                      ...styles.subcatTab,
                      background: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                      borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)'
                    }}
                  >
                    {sc.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Product Grid */}
        <div style={styles.productsSection}>
          <div style={styles.resultBar}>
            <div>Showing <strong>{filteredItems.length}</strong> products</div>
            {(selectedCatId !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCatId('all');
                  setSelectedSubcatId('all');
                  setSearchQuery('');
                }}
                style={styles.clearFilterLink}
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div style={styles.emptyCatalog} className="glass-panel">
              <ShoppingBag size={48} color="var(--color-text-muted)" />
              <h3>No products found</h3>
              <p>Try searching for a different keyword or reset filters.</p>
            </div>
          ) : (
            <div style={styles.productGrid}>
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item);
                    setInquirySize(item.sizes?.[0] || '');
                  }}
                  style={styles.productCard}
                  className="glass-panel"
                >
                  <div style={styles.cardImageContainer}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={styles.cardImage}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div style={styles.brandBadge}>{item.brand}</div>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.cardSubcat}>{getSubcategoryName(item.subcategoryId)}</div>
                    <h3 style={styles.cardTitle}>{item.name}</h3>
                    
                    <div style={styles.sizesRow}>
                      {item.sizes.map((s, idx) => (
                        <span key={idx} style={styles.sizeItem}>{s}</span>
                      ))}
                    </div>

                    <div style={styles.cardFooter}>
                      <span style={styles.priceTag}>{item.price}</span>
                      <span style={styles.viewDetailsBtn}>View details <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Customer-Facing Contact Card Footer */}
      <footer style={styles.footer} className="glass-panel">
        <div style={styles.footerMain}>
          {/* Card Left Layout */}
          <div style={styles.footerLeft}>
            <h3 style={styles.footerLogo}>{settings.companyName}</h3>
            <p style={styles.footerArabic}>{settings.companyArabic}</p>
            <div style={styles.divider}></div>
            
            <div style={styles.agentBox}>
              <div style={styles.agentAvatar}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" style={{color: '#fff'}}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <strong style={styles.agentName}>{settings.managerName}</strong>
                <div style={styles.agentRole}>{settings.managerRole}</div>
              </div>
            </div>
          </div>

          {/* Card Right Layout */}
          <div style={styles.footerRight}>
            <div style={styles.contactDetails}>
              <a href={`tel:${settings.phone}`} style={styles.contactLink}>
                <div style={styles.contactIconCircle}><Phone size={14} fill="#fff" color="var(--color-primary)" /></div>
                <span>{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} style={styles.contactLink}>
                <div style={styles.contactIconCircle}><Mail size={14} fill="#fff" color="var(--color-primary)" /></div>
                <span style={styles.emailText}>{settings.email}</span>
              </a>
              <div style={styles.contactLink}>
                <div style={styles.contactIconCircle}><MapPin size={14} fill="#fff" color="var(--color-primary)" /></div>
                <span style={styles.addrText}>{settings.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} ZacTEK Corporation. All Rights Reserved. Delivering Trust.</p>
        </div>
      </footer>

      {/* Product Detail & WhatsApp Inquiry Modal */}
      {activeItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="glass-panel animate-fade-in">
            <button onClick={() => setActiveItem(null)} style={styles.modalClose}>
              <X size={22} />
            </button>

            <div style={styles.modalBody}>
              {/* Product Visual */}
              <div style={styles.modalImageWrapper}>
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.name}
                  style={styles.modalImage}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60';
                  }}
                />
              </div>

              {/* Product Info & Inquiry Form */}
              <div style={styles.modalDetails}>
                <span style={styles.modalBrand}>{activeItem.brand}</span>
                <h2 style={styles.modalTitle}>{activeItem.name}</h2>
                <span className="badge badge-primary" style={{ marginBottom: '16px', display: 'inline-block' }}>
                  {getSubcategoryName(activeItem.subcategoryId)}
                </span>
                
                <p style={styles.modalDesc}>{activeItem.description}</p>

                {/* Specific details */}
                <div style={styles.specsContainer}>
                  {activeItem.details?.origin && (
                    <div style={styles.specRow}>
                      <strong>Origin:</strong> <span>{activeItem.details.origin}</span>
                    </div>
                  )}
                  {activeItem.details?.fabric && (
                    <div style={styles.specRow}>
                      <strong>Material:</strong> <span>{activeItem.details.fabric}</span>
                    </div>
                  )}
                  {activeItem.details?.packaging && (
                    <div style={styles.specRow}>
                      <strong>Packaging:</strong> <span>{activeItem.details.packaging}</span>
                    </div>
                  )}
                </div>

                {/* Sizing Picker for Inquiry */}
                {activeItem.sizes && activeItem.sizes.length > 0 && (
                  <div style={styles.sizingPicker}>
                    <div style={styles.sizeTitle}>Select size for WhatsApp inquiry:</div>
                    <div style={styles.sizesGrid}>
                      {activeItem.sizes.map(size => {
                        const isSelected = inquirySize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setInquirySize(size)}
                            style={{
                              ...styles.sizeButton,
                              background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                              borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                              color: '#fff'
                            }}
                          >
                            {size} {isSelected && <Check size={12} style={{marginLeft: '4px', display: 'inline'}} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={styles.priceContainer}>
                  <div style={styles.priceLabel}>Wholesale Pricing</div>
                  <div style={styles.priceVal}>{activeItem.price}</div>
                </div>

                <a
                  href={generateWhatsAppLink(activeItem, inquirySize)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={styles.whatsappBtn}
                >
                  <Phone size={18} fill="#fff" /> Inquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    flex: 1,
  },
  header: {
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px var(--color-primary-glow)',
  },
  logoTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    lineHeight: '1.1',
  },
  logoArabic: {
    fontSize: '0.65rem',
    color: 'var(--color-text-secondary)',
    fontFamily: 'system-ui, sans-serif',
  },
  adminLink: {
    fontSize: '0.85rem',
  },
  heroSection: {
    textAlign: 'center',
    padding: '40px 20px',
    marginBottom: '30px',
    background: 'radial-gradient(circle at center, rgba(211, 30, 37, 0.08) 0%, transparent 60%)',
    borderRadius: '20px',
  },
  heroContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  welcomeTag: {
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '12px',
    fontFamily: 'var(--font-heading)',
  },
  heroSubtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '1rem',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '560px',
    margin: '0 auto',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '16px 16px 16px 48px',
    backgroundColor: 'var(--glass-bg)',
    backdropFilter: 'blur(var(--glass-blur))',
    border: '1px solid var(--color-border)',
    borderRadius: '30px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all var(--transition-normal)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
  },
  catalogArea: {
    marginBottom: '60px',
  },
  categoryHeading: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '16px',
    fontFamily: 'var(--font-heading)',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '30px',
  },
  catCard: {
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-normal)',
  },
  catIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  catName: {
    color: '#fff',
    fontSize: '0.95rem',
    display: 'block',
    marginBottom: '4px',
  },
  catCount: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
  },
  subcatContainer: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: '30px',
    paddingBottom: '8px',
  },
  subcatScroll: {
    display: 'flex',
    gap: '10px',
  },
  subcatTab: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid var(--color-border)',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all var(--transition-fast)',
  },
  productsSection: {
    marginTop: '20px',
  },
  resultBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
  },
  clearFilterLink: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary-hover)',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  emptyCatalog: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--color-text-secondary)',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  productCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all var(--transition-normal)',
  },
  cardImageContainer: {
    height: '220px',
    position: 'relative',
    backgroundColor: '#1b223c',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform var(--transition-slow)',
  },
  brandBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(7, 9, 14, 0.85)',
    border: '1px solid var(--color-border)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardSubcat: {
    fontSize: '0.75rem',
    color: 'var(--color-primary-hover)',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '12px',
    lineHeight: '1.3',
  },
  sizesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '16px',
  },
  sizeItem: {
    fontSize: '0.7rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  cardFooter: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '14px',
  },
  priceTag: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
  },
  viewDetailsBtn: {
    fontSize: '0.8rem',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '500',
  },

  /* Customer Footer business card template */
  footer: {
    padding: '40px 30px',
    marginTop: '60px',
    backgroundColor: 'rgba(15, 19, 32, 0.95)',
  },
  footerMain: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid var(--color-border)',
  },
  footerLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  footerLogo: {
    fontSize: '1.75rem',
    color: '#fff',
    fontFamily: 'var(--font-heading)',
    fontWeight: '800',
  },
  footerArabic: {
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    fontFamily: 'system-ui, sans-serif',
  },
  divider: {
    width: '60px',
    height: '2px',
    backgroundColor: 'var(--color-primary)',
    margin: '16px 0',
  },
  agentBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.02)',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  agentAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentName: {
    fontSize: '0.95rem',
    color: '#fff',
  },
  agentRole: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
  },
  footerRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  contactLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color var(--transition-fast)',
  },
  contactIconCircle: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'rgba(211, 30, 37, 0.1)',
    border: '1px solid rgba(211, 30, 37, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emailText: {
    wordBreak: 'break-all',
  },
  addrText: {
    lineHeight: '1.4',
    fontSize: '0.825rem',
  },
  footerBottom: {
    paddingTop: '20px',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
  },

  /* Product Details Modal */
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '850px',
    backgroundColor: '#0c0f1b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all var(--transition-fast)',
  },
  modalBody: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalImageWrapper: {
    height: '320px',
    backgroundColor: '#1b223c',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  modalDetails: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
  },
  modalBrand: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--color-primary-hover)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  modalTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.2',
    marginBottom: '8px',
  },
  modalDesc: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  specsContainer: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    paddingBottom: '8px',
    marginBottom: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  sizingPicker: {
    marginBottom: '24px',
  },
  sizeTitle: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
    marginBottom: '10px',
  },
  sizesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  sizeButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
  },
  priceContainer: {
    marginBottom: '24px',
  },
  priceLabel: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  priceVal: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    marginTop: '2px',
  },
  whatsappBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
  },

  // Desktop media query overrides
  '@media (min-width: 768px)': {
    modalBody: {
      gridTemplateColumns: '1fr 1.2fr',
      maxHeight: 'none',
    },
    modalImageWrapper: {
      height: '100%',
    },
    footerMain: {
      gridTemplateColumns: '1.2fr 1fr',
    }
  }
};

// Simple media query fallback for React style sheet
if (typeof window !== 'undefined') {
  const applyLayout = () => {
    const isDesktop = window.innerWidth >= 768;
    styles.modalBody.gridTemplateColumns = isDesktop ? '1fr 1.2fr' : '1fr';
    styles.modalImageWrapper.height = isDesktop ? '100%' : '320px';
    styles.footerMain.gridTemplateColumns = isDesktop ? '1.2fr 1fr' : '1fr';
  };
  window.addEventListener('resize', applyLayout);
  applyLayout();
}
