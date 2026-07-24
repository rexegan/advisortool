import type { AppView } from '../types';

interface Props {
  active: AppView;
  onNav: (v: AppView) => void;
  overdueCount: number;
  violationCount: number;
  children: React.ReactNode;
}

const NAV: { view: AppView; icon: string; label: string }[] = [
  { view: 'dashboard', icon: '✅', label: 'Dashboard' },
  { view: 'calendar', icon: '📅', label: 'Compliance Calendar' },
  { view: 'sampling', icon: '🧪', label: 'Sampling' },
  { view: 'testing', icon: '📊', label: 'Testing & Results' },
  { view: 'violations', icon: '⚠️', label: 'Violations' },
  { view: 'notifications', icon: '📢', label: 'Public Notifications' },
  { view: 'treatment', icon: '🏗️', label: 'Water Treatment' },
  { view: 'vault', icon: '🗂️', label: 'Document Vault' },
  { view: 'vendors', icon: '🤝', label: 'Vendors & Labs' },
  { view: 'audit', icon: '🔍', label: 'Audit Mode' },
  { view: 'systems', icon: '🏢', label: 'Water Systems' },
];

export default function Layout({ active, onNav, overdueCount, violationCount, children }: Props) {
  return (
    <div className="bc-app">
      {/* Sidebar */}
      <aside className="bc-sidebar">
        <div className="bc-brand">
          <div className="bc-logo">
            <span className="bc-check">✓</span>
          </div>
          <div>
            <div className="bc-brand-name">Blue Check</div>
            <div className="bc-brand-tag">Water Compliance. Simplified.</div>
          </div>
        </div>

        <nav className="bc-nav">
          {NAV.map(({ view, icon, label }) => {
            const badge = view === 'calendar' ? overdueCount : view === 'violations' ? violationCount : 0;
            return (
              <button
                key={view}
                className={`bc-nav-item ${active === view ? 'active' : ''}`}
                onClick={() => onNav(view)}
              >
                <span className="bc-nav-icon">{icon}</span>
                <span className="bc-nav-label">{label}</span>
                {badge > 0 && <span className="bc-badge">{badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="bc-sidebar-footer">
          <a href="/" className="bc-back-link">← Back to Advisor Tools</a>
          <div className="bc-reg-note">TCEQ Regulated · Texas</div>
        </div>
      </aside>

      {/* Main */}
      <main className="bc-main">{children}</main>
    </div>
  );
}
