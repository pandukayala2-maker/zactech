import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, Download, Phone, Mail, MapPin, Link as LinkIcon, Copy, Info } from 'lucide-react';

export default function QRGenerator({ onNotify }) {
  const { settings } = useData();
  const cardRef = useRef(null);

  // Encode catalog URL
  const getCatalogUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/?view=catalog`;
    }
    return 'https://zactek.com/catalog';
  };

  const catalogUrl = getCatalogUrl();

  const handleDownloadQR = () => {
    const canvas = document.getElementById('zactek-qr-canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `zactek-catalog-qr.png`;
    link.href = url;
    link.click();
    onNotify('success', 'QR code image downloaded successfully!');
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(catalogUrl);
    onNotify('success', 'Catalog link copied to clipboard!');
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      
      {/* 1. Header & Top Buttons */}
      <div style={styles.header} className="no-print">
        <div>
          <h2 style={styles.title}>QR Card Generator</h2>
          <p style={styles.subtitle}>
            Scan this QR code to view the wholesale catalogue. Share or print this card for meetings with shop owners.
          </p>
        </div>
        <div style={styles.btnRow}>
          <button onClick={handleCopyLink} className="btn btn-secondary" style={styles.actionBtn}>
            <LinkIcon size={16} /> Copy URL
          </button>
          <button onClick={handleDownloadQR} className="btn btn-secondary" style={styles.actionBtn}>
            <Download size={16} /> Download QR Only
          </button>
          <button onClick={handlePrintCard} className="btn btn-primary" style={styles.actionBtn}>
            <Printer size={16} /> Print Card
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Grid Layout */}
      <div style={styles.mainGrid}>
        
        {/* Left Column: Instruction Guide Panel */}
        <div style={styles.guideCard} className="glass-panel no-print">
          <h3 style={styles.guideTitle}>
            <span style={styles.infoBadge}>i</span> How to use:
          </h3>
          
          <div style={styles.stepsList}>
            {/* Step 1 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#8b5cf6' }}>1</div>
              <div style={styles.stepText}>Verify manager and phone settings are correct.</div>
            </div>

            {/* Step 2 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#3b82f6' }}>2</div>
              <div style={styles.stepText}>Press the <strong>Print Card</strong> button.</div>
            </div>

            {/* Step 3 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#10b981' }}>3</div>
              <div style={styles.stepText}>
                It will open the system print prompt configured to print this premium circular sticker or card.
              </div>
            </div>

            {/* Step 4 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#f97316' }}>4</div>
              <div style={styles.stepText}>
                Shop owners scan the QR code using their phones. They are immediately taken to your live garments catalogue to see all products (Polo t-shirts, vests, etc.).
              </div>
            </div>
          </div>

          {/* Encoded Link Box */}
          <div style={styles.linkBox}>
            <div style={styles.linkHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>
                <LinkIcon size={14} /> Encoded Link
              </div>
              <button onClick={handleCopyLink} style={styles.copyIconBtn} title="Copy Link">
                <Copy size={14} />
              </button>
            </div>
            <a href={catalogUrl} target="_blank" rel="noopener noreferrer" style={styles.urlLink}>
              {catalogUrl}
            </a>
          </div>
        </div>

        {/* Right Column: Premium Circular Business Card Preview */}
        <div style={styles.cardWrapper}>
          <div id="zactek-business-card" ref={cardRef} style={styles.circularCard}>
            
            {/* Left Curved Dark Panel */}
            <div style={styles.leftHalf}>
              {/* Profile Avatar Icon */}
              <div style={styles.avatarCircle}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ color: '#fff' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {/* Manager Info */}
              <h2 style={styles.cardName}>{settings?.managerName || 'Kumar'}</h2>
              <div style={styles.cardRole}>{settings?.managerRole || 'Marketing Manager'}</div>
              <div style={styles.cardDivider}></div>

              {/* Contact Details */}
              <div style={styles.contactRow}>
                <div style={styles.contactIconCircle}><Phone size={10} fill="#fff" color="#d31e25" /></div>
                <span style={styles.contactText}>{settings?.phone || '+965 60607922'}</span>
              </div>

              <div style={styles.contactRow}>
                <div style={styles.contactIconCircle}><Mail size={10} fill="#fff" color="#d31e25" /></div>
                <span style={styles.contactText}>{settings?.email || 'zactekaccouts@gmail.com'}</span>
              </div>

              <div style={styles.contactRow}>
                <div style={styles.contactIconCircle}><MapPin size={10} fill="#fff" color="#d31e25" /></div>
                <span style={styles.addressText}>{settings?.address || 'Abdulla Al-Mubarak Al-Sabah St Sharq, Kuwait City, Kuwait'}</span>
              </div>
            </div>

            {/* Right White Panel */}
            <div style={styles.rightHalf}>
              {/* Brand Header */}
              <div style={styles.brandHeader}>
                <span style={styles.brandLogoSymbol}>C • </span>
                <span style={styles.brandName}>ZacTEK</span>
              </div>

              <div style={styles.arabicTitle}>{settings?.companyArabic || 'شركة زاك تيك ذ.م.م'}</div>
              <div style={styles.englishTitle}>{settings?.companyName || 'ZacTEK Corp W.L.L'}</div>

              {/* QR Code Container */}
              <div style={styles.qrFrame}>
                <QRCodeCanvas
                  id="zactek-qr-canvas"
                  value={catalogUrl}
                  size={135}
                  level={"H"}
                  includeMargin={false}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                />
              </div>

              {/* Social Icons Row */}
              <div style={styles.socialRow}>
                {/* Facebook */}
                <div style={{ ...styles.socialCircle, backgroundColor: '#1877f2' }}>
                  <span style={styles.socialIconText}>f</span>
                </div>
                {/* Instagram */}
                <div style={{ ...styles.socialCircle, background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                  <span style={styles.socialIconText}>📷</span>
                </div>
                {/* LinkedIn */}
                <div style={{ ...styles.socialCircle, backgroundColor: '#0a66c2' }}>
                  <span style={styles.socialIconText}>in</span>
                </div>
              </div>

              {/* Bottom Tagline Slogan */}
              <div style={styles.sloganFooter}>
                <div style={styles.sloganSmall}>CONNECTING SOLUTIONS</div>
                <div style={styles.sloganLarge}>DELIVERING <span style={{ color: '#d31e25' }}>TRUST</span></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Print stylesheet injection */}
      <style>{`
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          #zactek-business-card {
            border: 2px solid #ccc !important;
            margin: 40px auto !important;
            box-shadow: none !important;
            transform: scale(1.1) !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '40px',
    textAlign: 'left',
  },
  header: {
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
  btnRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    fontSize: '0.85rem',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '30px',
    alignItems: 'start',
  },
  guideCard: {
    padding: '24px',
  },
  guideTitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoBadge: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#d31e25',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontStyle: 'italic',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  stepItem: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  stepText: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  linkBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '16px',
  },
  linkHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  copyIconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    padding: '4px',
  },
  urlLink: {
    color: '#ff4d54',
    fontSize: '0.85rem',
    textDecoration: 'none',
    wordBreak: 'break-all',
  },
  cardWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Circular Card Container matching mockup */
  circularCard: {
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
    display: 'flex',
    fontFamily: "'Inter', sans-serif",
    color: '#000000',
    border: '6px solid #FFFFFF',
  },

  /* Left Curved Dark Panel */
  leftHalf: {
    flex: '0 0 52%',
    backgroundColor: '#090B12',
    color: '#FFFFFF',
    padding: '40px 14px 40px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    borderRight: '14px solid #d31e25',
    borderTopRightRadius: '250px 500px',
    borderBottomRightRadius: '250px 500px',
    zIndex: 2,
  },
  avatarCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: '#d31e25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  cardName: {
    fontSize: '2.1rem',
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: '1.1',
    margin: '4px 0 2px 0',
  },
  cardRole: {
    fontSize: '0.85rem',
    color: '#a0aec0',
    marginBottom: '8px',
  },
  cardDivider: {
    width: '40px',
    height: '2px',
    backgroundColor: '#d31e25',
    marginBottom: '16px',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  contactIconCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#d31e25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactText: {
    fontSize: '0.75rem',
    color: '#e2e8f0',
    fontWeight: '500',
  },
  addressText: {
    fontSize: '0.65rem',
    color: '#cbd5e1',
    lineHeight: '1.3',
  },

  /* Right White Panel */
  rightHalf: {
    flex: '0 0 48%',
    backgroundColor: '#FFFFFF',
    padding: '30px 20px 30px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    zIndex: 1,
  },
  brandHeader: {
    fontSize: '1.4rem',
    fontWeight: '800',
    marginBottom: '2px',
    color: '#000',
  },
  brandLogoSymbol: {
    color: '#d31e25',
  },
  brandName: {
    color: '#d31e25',
  },
  arabicTitle: {
    fontSize: '0.75rem',
    color: '#4a5568',
    fontWeight: '600',
  },
  englishTitle: {
    fontSize: '0.75rem',
    color: '#1a202c',
    fontWeight: '700',
    marginBottom: '12px',
  },
  qrFrame: {
    padding: '6px',
    borderRadius: '12px',
    border: '2px solid #000',
    backgroundColor: '#fff',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  socialCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  socialIconText: {
    fontSize: '0.65rem',
    fontWeight: '700',
    lineHeight: '1',
  },
  sloganFooter: {
    marginTop: '4px',
  },
  sloganSmall: {
    fontSize: '0.55rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    color: '#4a5568',
  },
  sloganLarge: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#000',
  }
};
