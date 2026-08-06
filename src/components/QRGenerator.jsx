import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, Download, Phone, Mail, MapPin, Share2 } from 'lucide-react';

export default function QRGenerator({ onNotify }) {
  const { settings } = useData();
  const cardRef = useRef(null);

  // Encode catalog URL
  const getCatalogUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}?view=catalog`;
    }
    return 'https://zactek.com?view=catalog';
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
      <div style={styles.header} className="no-print">
        <div>
          <h2 style={styles.title}>QR Card Generator</h2>
          <p style={styles.subtitle}>
            Scan this QR code to view the wholesale catalogue. Share or print this card for meetings with shop owners.
          </p>
        </div>
        <div style={styles.btnRow}>
          <button onClick={handleCopyLink} className="btn btn-secondary">
            <Share2 size={16} /> Copy URL
          </button>
          <button onClick={handleDownloadQR} className="btn btn-secondary">
            <Download size={16} /> Download QR Only
          </button>
          <button onClick={handlePrintCard} className="btn btn-primary">
            <Printer size={16} /> Print Card
          </button>
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Instruction guide */}
        <div style={styles.guideCard} className="glass-panel no-print">
          <h3>How to use:</h3>
          <ol style={styles.list}>
            <li>Verify manager and phone settings are correct.</li>
            <li>Press the <strong>Print Card</strong> button.</li>
            <li>It will open the system print prompt configured to print this premium circular sticker or card.</li>
            <li>Shop owners scan the QR code using their phones. They are immediately taken to your live garments catalogue to see all products (Polo t-shirts, vests, etc.).</li>
          </ol>

          <div style={styles.infoBox}>
            <strong>Encoded Link:</strong>
            <code style={styles.code}>{catalogUrl}</code>
          </div>
        </div>

        {/* The Card Rendering (ZacTEK Business Card Style) */}
        <div style={styles.cardContainer}>
          <div id="zactek-business-card" ref={cardRef} style={styles.circularCard}>
            {/* Left curved panel */}
            <div style={styles.leftHalf}>
              {/* Profile icon */}
              <div style={styles.profileCircle}>
                <div style={styles.userIconBg}>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{color: '#fff'}}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>

              {/* Manager info */}
              <h2 style={styles.cardName}>{settings.managerName}</h2>
              <div style={styles.cardRole}>{settings.managerRole}</div>
              <div style={styles.cardLine}></div>

              {/* Contact lists */}
              <div style={styles.contactItem}>
                <div style={styles.iconCircle}><Phone size={11} fill="#fff" color="#D31E25" /></div>
                <div style={styles.contactText}>{settings.phone}</div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.iconCircle}><Mail size={11} fill="#fff" color="#D31E25" /></div>
                <div style={styles.contactText}>{settings.email}</div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.iconCircle}><MapPin size={11} fill="#fff" color="#D31E25" /></div>
                <div style={styles.contactTextAddress}>{settings.address}</div>
              </div>
            </div>

            {/* Right clean panel */}
            <div style={styles.rightHalf}>
              {/* ZacTEK Logo representation */}
              <div style={styles.logoRow}>
                <div style={styles.logoIcon}>
                  <span style={styles.logoC}>C</span>
                  <span style={styles.logoDots}></span>
                </div>
                <div style={styles.logoText}>ZacTEK</div>
              </div>

              <div style={styles.arabicName}>{settings.companyArabic}</div>
              <div style={styles.englishName}>{settings.companyName}</div>

              {/* QR Code Container */}
              <div style={styles.qrFrame}>
                <QRCodeCanvas
                  id="zactek-qr-canvas"
                  value={catalogUrl}
                  size={120}
                  level={"H"}
                  includeMargin={false}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                />
              </div>

              {/* Partners/Logos section */}
              <div style={styles.partnerRow}>
                <span style={styles.partnerM}>M</span>
                <span style={styles.partnerRedCircle}></span>
                <span style={styles.partnerSea}>sea shark</span>
              </div>
            </div>

            {/* Slogan details at bottom */}
            <div style={styles.footerSlogan}>
              <div style={styles.sloganSmall}>CONNECTING SOLUTIONS</div>
              <div style={styles.sloganLarge}>DELIVERING <span style={{color: '#d31e25'}}>TRUST</span></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Specific CSS Stylesheet injection */}
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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
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
  btnRow: {
    display: 'flex',
    gap: '8px',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '30px',
  },
  guideCard: {
    padding: '24px',
    height: 'fit-content',
  },
  list: {
    paddingLeft: '20px',
    marginBottom: '20px',
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.8',
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  code: {
    fontSize: '0.75rem',
    color: 'var(--color-primary-hover)',
    wordBreak: 'break-all',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 0',
  },

  /* CIRCULAR CARD DESIGN (based on the user provided business card) */
  circularCard: {
    width: '480px',
    height: '480px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    fontFamily: "'Inter', sans-serif",
    color: '#000000',
    border: '10px solid #FFFFFF',
  },

  /* Left Half: Dark / Charcoal arc shape */
  leftHalf: {
    flex: '0 0 52%',
    backgroundColor: '#0F111A',
    color: '#FFFFFF',
    padding: '40px 10px 40px 30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    borderRight: '12px solid #D31E25',
    borderTopRightRadius: '240px 480px',
    borderBottomRightRadius: '240px 480px',
    zIndex: 2,
    boxShadow: '8px 0 15px rgba(0, 0, 0, 0.2)',
  },

  profileCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '3px solid #D31E25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    position: 'relative',
  },
  userIconBg: {
    width: '38px',
    height: '38px',
    backgroundColor: '#D31E25',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: '1',
    margin: '4px 0 2px 0',
    fontFamily: "'Outfit', sans-serif",
  },
  cardRole: {
    fontSize: '0.85rem',
    color: '#B0B3BE',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  cardLine: {
    width: '80px',
    height: '3px',
    backgroundColor: '#D31E25',
    margin: '10px 0 16px 0',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginVertical: '6px',
    width: '90%',
  },
  iconCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#D31E25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactText: {
    fontSize: '0.75rem',
    color: '#FFFFFF',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  contactTextAddress: {
    fontSize: '0.625rem',
    color: '#D1D5DB',
    lineHeight: '1.3',
    maxHeight: '40px',
    overflow: 'hidden',
  },

  /* Right Half: Clean White */
  rightHalf: {
    flex: '1',
    backgroundColor: '#FFFFFF',
    padding: '50px 30px 40px 10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  logoIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoC: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#000000',
    fontFamily: "'Outfit', sans-serif",
  },
  logoDots: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#D31E25',
    display: 'inline-block',
    marginLeft: '2px',
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#D31E25',
    fontFamily: "'Outfit', sans-serif",
  },
  arabicName: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  englishName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '16px',
    textAlign: 'center',
  },
  qrFrame: {
    padding: '8px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #000000',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
  },
  partnerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  partnerM: {
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    color: '#003366',
  },
  partnerRedCircle: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#D31E25',
  },
  partnerSea: {
    fontSize: '0.6rem',
    fontWeight: 'bold',
    color: '#003366',
    textTransform: 'lowercase',
  },

  /* Slogan Center bottom */
  footerSlogan: {
    position: 'absolute',
    bottom: '24px',
    width: '100%',
    textAlign: 'center',
    zIndex: 3,
    color: '#000000',
  },
  sloganSmall: {
    fontSize: '0.55rem',
    letterSpacing: '2px',
    color: '#666',
    fontWeight: '500',
  },
  sloganLarge: {
    fontSize: '0.7rem',
    letterSpacing: '1px',
    fontWeight: '800',
    marginTop: '2px',
  },

  // Responsive layout
  '@media (min-width: 992px)': {
    mainLayout: {
      gridTemplateColumns: '320px 1fr',
    }
  }
};

// Simple media query fallback for React style sheet
if (typeof window !== 'undefined') {
  const applyLayout = () => {
    const isDesktop = window.innerWidth >= 992;
    styles.mainLayout.gridTemplateColumns = isDesktop ? '320px 1fr' : '1fr';
  };
  window.addEventListener('resize', applyLayout);
  applyLayout();
}
