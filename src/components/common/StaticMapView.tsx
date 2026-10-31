import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navigation, X, Star, MapPin, ZoomIn, ZoomOut, Locate, Route } from 'lucide-react';
import { Item } from '../../types';
import './StaticMapView.css';

// ── Map geographic bounds (Dehradun) ─────────────────────────────
const BOUNDS = { latMin: 30.290, latMax: 30.385, lngMin: 78.000, lngMax: 78.090 };
const USER_LAT = 30.3165;
const USER_LNG = 78.0322;

// Convert lat/lng → percentage position inside the SVG canvas
function toX(lng: number) {
  return ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * 100;
}
function toY(lat: number) {
  return ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * 100;
}

// Haversine distance (km)
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Category → border colour
const CAT_COLOR: Record<string, string> = {
  camping:     '#2D6A4F',
  tools:       '#7C5228',
  electronics: '#1A3A5C',
  sports:      '#D4522A',
  kitchen:     '#8B1A1A',
  events:      '#6A1F78',
  books:       '#2E6080',
};
const pinColor = (cat: string) => CAT_COLOR[cat] ?? '#183A2B';

// ── Props ─────────────────────────────────────────────────────────
interface StaticMapViewProps {
  items: Item[];
  activeItem: Item | null;
  onItemSelect: (item: Item | null) => void;
  onItemOpen: (item: Item) => void;
}

// ── Component ─────────────────────────────────────────────────────
export const StaticMapView: React.FC<StaticMapViewProps> = ({
  items, activeItem, onItemSelect, onItemOpen,
}) => {
  const [zoom, setZoom]         = useState(1.0);
  const [pan, setPan]           = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart]   = useState({ x: 0, y: 0 });
  const [showNav, setShowNav]     = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Mouse-wheel zoom ──────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.75, Math.min(5, z - e.deltaY * 0.0012)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Drag to pan ───────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.smv-pin, .smv-info-card, .smv-controls, .smv-nav-panel')) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ ...pan });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: panStart.x + (e.clientX - dragStart.x), y: panStart.y + (e.clientY - dragStart.y) });
  };
  const onMouseUp = () => setDragging(false);

  const zoomIn  = () => setZoom(z => Math.min(5, +(z + 0.3).toFixed(2)));
  const zoomOut = () => setZoom(z => Math.max(0.75, +(z - 0.3).toFixed(2)));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); setShowNav(false); };

  // ── Navigate action ───────────────────────────────────────────
  const handleNavigate = () => {
    setShowNav(true);
  };
  const openGoogleMaps = () => {
    if (!activeItem?.lat || !activeItem?.lng) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${USER_LAT},${USER_LNG}` +
      `&destination=${activeItem.lat},${activeItem.lng}&travelmode=driving`,
      '_blank'
    );
  };

  // Distance & ETA for selected item
  const navDist = activeItem?.lat && activeItem?.lng
    ? haversine(USER_LAT, USER_LNG, activeItem.lat, activeItem.lng)
    : null;
  const navEta = navDist ? Math.round((navDist / 25) * 60) : null; // ~25 km/h city avg

  // SVG user and item positions (in %)
  const userX = toX(USER_LNG);
  const userY = toY(USER_LAT);

  return (
    <div
      ref={containerRef}
      className="smv-container"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      onClick={() => { if (!dragging) onItemSelect(null); }}
    >
      {/* ── Zoomable / pannable canvas ── */}
      <div
        className="smv-canvas"
        style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}
      >
        {/* ── SVG base map ── */}
        <svg
          className="smv-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Land background */}
          <rect width="100" height="100" fill="#ede8dc" />

          {/* ── Green zones / parks ── */}
          {/* FRI forest campus (large NW) */}
          <polygon points="3,5 18,3 21,8 19,22 14,28 5,26 2,18" fill="#c8dbb8" opacity="0.75" />
          {/* Botanical Survey east */}
          <polygon points="60,5 70,3 72,12 67,16 59,12" fill="#c8dbb8" opacity="0.70" />
          {/* Sahastradhara park (NE) */}
          <ellipse cx="88" cy="18" rx="5" ry="4" fill="#c8dbb8" opacity="0.65" />
          {/* Race Course green */}
          <ellipse cx="51" cy="69" rx="4" ry="2.5" fill="#c8dbb8" opacity="0.60" />
          {/* Gandhi park */}
          <ellipse cx="46" cy="62" rx="2.5" ry="2" fill="#cddec6" opacity="0.85" />
          {/* Malsi Reserve (north) */}
          <polygon points="30,0 45,0 47,8 42,12 33,10 28,6" fill="#c8dbb8" opacity="0.70" />
          {/* Survey of India open ground */}
          <ellipse cx="22" cy="53" rx="3" ry="2" fill="#cddec6" opacity="0.60" />

          {/* ── Water ── */}
          {/* Rispana River – right side, N→S */}
          <path d="M 86 0 C 85 10 84 22 83 35 S 81 55 82 70 L 83 100"
                fill="none" stroke="#9ec3d4" strokeWidth="1.4" strokeLinecap="round" />
          {/* Bindal River – centre, N→S */}
          <path d="M 61 0 C 61 18 60 36 60 55 S 60 75 61 100"
                fill="none" stroke="#9ec3d4" strokeWidth="0.8" strokeLinecap="round" />
          {/* Song River – bottom, E→W */}
          <path d="M 0 97 Q 30 95 55 96 Q 78 97 100 95"
                fill="none" stroke="#9ec3d4" strokeWidth="1.1" strokeLinecap="round" />

          {/* ── Road network (drawn back to front) ── */}
          {/* --- Outlines first (slightly wider, darker) --- */}
          {/* Rajpur Road outline */}
          <path d="M 38 86 L 49 61 Q 63 37 78 8"
                fill="none" stroke="#d4c28a" strokeWidth="2.2" strokeLinecap="round" />
          {/* Chakrata Road outline */}
          <path d="M 49 61 Q 30 46 10 16"
                fill="none" stroke="#d4c28a" strokeWidth="1.8" strokeLinecap="round" />
          {/* Haridwar Road outline */}
          <path d="M 49 61 Q 52 79 57 97"
                fill="none" stroke="#d4c28a" strokeWidth="1.8" strokeLinecap="round" />
          {/* Mussoorie Diversion */}
          <path d="M 78 8 Q 88 5 96 3"
                fill="none" stroke="#d4c28a" strokeWidth="1.5" strokeLinecap="round" />

          {/* --- Road fills --- */}
          {/* Rajpur Road (main highway, amber/yellow) */}
          <path d="M 38 86 L 49 61 Q 63 37 78 8"
                fill="none" stroke="#f5d98a" strokeWidth="1.6" strokeLinecap="round" />
          {/* Center line */}
          <path d="M 38 86 L 49 61 Q 63 37 78 8"
                fill="none" stroke="#e8c55a" strokeWidth="0.25"
                strokeLinecap="round" strokeDasharray="1.5 1.2" />

          {/* Chakrata Road (highway) */}
          <path d="M 49 61 Q 30 46 10 16"
                fill="none" stroke="#f5d98a" strokeWidth="1.3" strokeLinecap="round" />

          {/* Haridwar Road (highway) */}
          <path d="M 49 61 Q 52 79 57 97"
                fill="none" stroke="#f5d98a" strokeWidth="1.3" strokeLinecap="round" />

          {/* Mussoorie Diversion */}
          <path d="M 78 8 Q 88 5 96 3"
                fill="none" stroke="#f5d98a" strokeWidth="1.1" strokeLinecap="round" />

          {/* EC Road (E–W, white) */}
          <path d="M 18 64 Q 38 62 72 61"
                fill="none" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />
          {/* Subhash Road */}
          <path d="M 26 58 Q 44 56 62 57"
                fill="none" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" />
          {/* Race Course Road */}
          <path d="M 33 70 Q 52 68 67 66"
                fill="none" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" />
          {/* Saharanpur Road */}
          <path d="M 49 61 Q 42 76 36 95"
                fill="none" stroke="#ffffff" strokeWidth="0.75" strokeLinecap="round" />
          {/* Kishanpur connector */}
          <path d="M 78 8 Q 82 22 80 38 Q 78 50 75 62"
                fill="none" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" />
          {/* Rajpur spur east */}
          <path d="M 63 37 Q 72 42 76 55"
                fill="none" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" />
          {/* Ballupur / Vasant Vihar connector */}
          <path d="M 14 42 Q 22 50 30 55 Q 38 60 44 62"
                fill="none" stroke="#ffffff" strokeWidth="0.55" strokeLinecap="round" />
          {/* Dharampur connector */}
          <path d="M 42 78 Q 52 76 58 72"
                fill="none" stroke="#ffffff" strokeWidth="0.55" strokeLinecap="round" />
          {/* North local roads */}
          <path d="M 10 16 Q 20 12 30 8 Q 40 4 49 2"
                fill="none" stroke="#ffffff" strokeWidth="0.5" strokeLinecap="round" />
          <path d="M 49 61 Q 52 44 55 28 Q 58 15 61 5"
                fill="none" stroke="#ffffff" strokeWidth="0.5" strokeLinecap="round" />
          {/* Jakhan area roads */}
          <path d="M 78 8 Q 84 15 86 28"
                fill="none" stroke="#ffffff" strokeWidth="0.5" strokeLinecap="round" />

          {/* ── Direction line (when nav active) ── */}
          {showNav && activeItem?.lat && activeItem?.lng && (
            <line
              x1={userX} y1={userY}
              x2={toX(activeItem.lng)} y2={toY(activeItem.lat)}
              stroke="#183A2B"
              strokeWidth="0.6"
              strokeDasharray="1.4 0.8"
              strokeLinecap="round"
              opacity="0.85"
            />
          )}

          {/* ── Neighbourhood labels ── */}
          <text x="11" y="16"  fontSize="2"   fill="#4a7040" fontWeight="700" textAnchor="middle" fontFamily="Inter,sans-serif">Chakrata Rd</text>
          <text x="10" y="37"  fontSize="1.8" fill="#73776f" textAnchor="middle" fontFamily="Inter,sans-serif">Ballupur</text>
          <text x="63" y="33"  fontSize="2"   fill="#4a7040" fontWeight="700" textAnchor="middle" fontFamily="Inter,sans-serif">Rajpur Rd</text>
          <text x="80" y="13"  fontSize="1.8" fill="#73776f" textAnchor="middle" fontFamily="Inter,sans-serif">Jakhan</text>
          <text x="51" y="67"  fontSize="1.7" fill="#73776f" textAnchor="middle" fontFamily="Inter,sans-serif">Race Course</text>
          <text x="57" y="62"  fontSize="1.7" fill="#73776f" textAnchor="middle" fontFamily="Inter,sans-serif">Dalanwala</text>
          <text x="52" y="79"  fontSize="1.7" fill="#73776f" textAnchor="middle" fontFamily="Inter,sans-serif">Dharampur</text>
          <text x="14" y="57"  fontSize="1.7" fill="#73776f" textAnchor="middle" fontFamily="Inter,sans-serif">Vasant Vihar</text>
          <text x="84" y="48"  fontSize="1.6" fill="#9ec3d4" textAnchor="middle" fontFamily="Inter,sans-serif" transform="rotate(-80,84,48)">Rispana</text>
          <text x="9"  y="11"  fontSize="1.8" fill="#4a7040" fontWeight="600" textAnchor="start"  fontFamily="Inter,sans-serif">FRI Campus</text>
          <text x="64" y="10"  fontSize="1.7" fill="#4a7040" textAnchor="middle" fontFamily="Inter,sans-serif">Botanical Surv.</text>

          {/* Clock Tower landmark dot */}
          <circle cx="49" cy="61" r="0.8" fill="#10291f" opacity="0.5" />
          <text x="49" y="64.5" fontSize="1.4" fill="#10291f" opacity="0.7" textAnchor="middle" fontFamily="Inter,sans-serif">Clock Tower</text>
        </svg>

        {/* ── User location dot ── */}
        <div
          className="smv-user-dot"
          style={{ left: `${userX}%`, top: `${userY}%` }}
          title="Your location"
        >
          <div className="smv-user-dot__pulse" />
          <div className="smv-user-dot__core" />
          <span className="smv-user-dot__label">You</span>
        </div>

        {/* ── Item pins ── */}
        {items
          .filter(item => item.lat && item.lng)
          .map(item => {
            const isActive = activeItem?.id === item.id;
            const color = pinColor(item.category);
            return (
              <button
                key={item.id}
                className={`smv-pin ${isActive ? 'smv-pin--active' : ''}`}
                style={{
                  left: `${toX(item.lng!)}%`,
                  top: `${toY(item.lat!)}%`,
                  '--pin-color': color,
                } as React.CSSProperties}
                onClick={e => { e.stopPropagation(); onItemSelect(item); }}
                title={item.title}
              >
                <div className="smv-pin__ring" />
                <img src={item.imageUrl} alt={item.title} className="smv-pin__img" />
                <span className="smv-pin__price">₹{item.pricePerDay}</span>
              </button>
            );
          })}
      </div>

      {/* ── Zoom controls (fixed, not panned) ── */}
      <div className="smv-controls" onClick={e => e.stopPropagation()}>
        <button className="smv-ctrl-btn" onClick={zoomIn}   title="Zoom in">
          <ZoomIn size={15} />
        </button>
        <div className="smv-ctrl-divider" />
        <button className="smv-ctrl-btn" onClick={zoomOut}  title="Zoom out">
          <ZoomOut size={15} />
        </button>
        <div className="smv-ctrl-divider" />
        <button className="smv-ctrl-btn" onClick={resetView} title="Reset view">
          <Locate size={15} />
        </button>
      </div>

      {/* ── Item info card (fixed at bottom) ── */}
      {activeItem && (
        <div
          className={`smv-info-card ${showNav ? 'smv-info-card--nav-open' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          <img src={activeItem.imageUrl} alt={activeItem.title} className="smv-info-card__img" />
          <div className="smv-info-card__body">
            <div className="smv-info-card__top">
              <p className="smv-info-card__title">{activeItem.title}</p>
              <button
                className="smv-info-card__close"
                onClick={() => { onItemSelect(null); setShowNav(false); }}
              >
                <X size={13} />
              </button>
            </div>
            <div className="smv-info-card__meta">
              <span className="smv-info-card__price">₹{activeItem.pricePerDay}/day</span>
              <span className="smv-info-card__rating">
                <Star size={11} fill="#D5B98C" stroke="#D5B98C" />
                {activeItem.rating}
              </span>
              <span className="smv-info-card__avail" data-available={activeItem.isAvailable}>
                {activeItem.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p className="smv-info-card__loc">
              <MapPin size={11} /> {activeItem.location}
            </p>
            <div className="smv-info-card__actions">
              <button
                className="smv-info-card__btn smv-info-card__btn--primary"
                onClick={() => onItemOpen(activeItem)}
              >
                View Details
              </button>
              <button
                className={`smv-info-card__btn smv-info-card__btn--nav ${showNav ? 'smv-info-card__btn--nav-active' : ''}`}
                onClick={handleNavigate}
              >
                <Route size={12} /> Navigate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation panel ── */}
      {showNav && activeItem && navDist !== null && (
        <div className="smv-nav-panel" onClick={e => e.stopPropagation()}>
          <div className="smv-nav-panel__info">
            <Navigation size={18} color="#183A2B" />
            <div className="smv-nav-panel__text">
              <p className="smv-nav-panel__dest">{activeItem.title}</p>
              <p className="smv-nav-panel__summary">
                {navDist < 1
                  ? `${Math.round(navDist * 1000)} m away`
                  : `${navDist.toFixed(1)} km away`}
                {' · '}~{navEta} min drive
              </p>
            </div>
          </div>
          <div className="smv-nav-panel__actions">
            <button className="smv-nav-panel__open-btn" onClick={openGoogleMaps}>
              Open in Maps ↗
            </button>
            <button className="smv-nav-panel__close-btn" onClick={() => setShowNav(false)}>
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div className="smv-legend" onClick={e => e.stopPropagation()}>
        {Object.entries(CAT_COLOR).map(([cat, color]) => (
          <span key={cat} className="smv-legend__item">
            <span className="smv-legend__dot" style={{ background: color }} />
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
};
