import type { ActiveView } from '../water-types';

interface Props {
  active: ActiveView;
  onNav: (v: ActiveView) => void;
  overdueCount: number;
}

const NAV: { view: ActiveView; label: string; icon: string }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { view: 'calendar', label: 'Compliance Calendar', icon: '📅' },
  { view: 'lab', label: 'Lab Results', icon: '🧪' },
  { view: 'usage', label: 'Water Usage', icon: '💧' },
  { view: 'notices', label: 'Public Notices', icon: '📢' },
  { view: 'facilities', label: 'Facilities', icon: '🏗️' },
];

export default function Sidebar({ active, onNav, overdueCount }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">💧</span>
        <div>
          <div className="brand-name">AquaComply TX</div>
          <div className="brand-sub">TCEQ Compliance Manager</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ view, label, icon }) => (
          <button
            key={view}
            className={`nav-item ${active === view ? 'active' : ''}`}
            onClick={() => onNav(view)}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
            {view === 'calendar' && overdueCount > 0 && (
              <span className="nav-badge">{overdueCount}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <a href="/" className="sidebar-back-link">← Trade Blotter</a>
        <div className="tceq-badge">
          <span>TCEQ Regulated</span>
          <span className="tceq-link">Texas Region</span>
        </div>
      </div>
    </aside>
  );
}
