import type { ComplianceTask, Sample, Violation, PublicNotice, WaterSystem, ComplianceScore } from '../types';
import { scoreColor, scoreLabel, daysUntil } from '../utils/compliance';

interface Props {
  tasks: ComplianceTask[];
  samples: Sample[];
  violations: Violation[];
  notices: PublicNotice[];
  systems: WaterSystem[];
  score: ComplianceScore;
  onNav: (v: string) => void;
}

export default function Dashboard({ tasks, samples, violations, notices, systems, score, onNav }: Props) {
  const overdue = tasks.filter(t => t.status === 'Overdue');
  const dueSoon = tasks.filter(t => t.status === 'Due Soon');
  const activeViolations = violations.filter(v => v.status === 'Open' || v.status === 'In Resolution');
  const activeBoilWater = notices.filter(n => n.type === 'Boil Water' && n.status === 'Issued');
  const pendingNotices = notices.filter(n => n.status === 'Draft' || n.status === 'Pending Review');
  const upcomingTasks = [...tasks].filter(t => t.status === 'Upcoming').sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 6);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fmtDays = (iso: string) => { const d = daysUntil(iso); return d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? 'Today' : `in ${d}d`; };

  const sc = score.overall;
  const color = scoreColor(sc);
  const label = scoreLabel(sc);

  // Gauge arc
  const r = 54;
  const circ = Math.PI * r;
  const pct = sc / 100;
  const dash = pct * circ;
  const gap = circ - dash;

  return (
    <div className="bc-dashboard">
      <div className="bc-page-header">
        <h2>Compliance Dashboard</h2>
        <p className="bc-page-sub">{systems.length} water systems · {tasks.length} compliance items</p>
      </div>

      {/* Active alerts */}
      {(activeBoilWater.length > 0 || overdue.length > 0 || activeViolations.length > 0) && (
        <div className="bc-alerts">
          {activeBoilWater.map(n => (
            <div key={n.id} className="bc-alert bc-alert-critical">
              <span>🚨</span>
              <div><strong>Active Boil Water Notice</strong><p>{n.title} — {n.affectedArea}</p></div>
            </div>
          ))}
          {activeViolations.map(v => (
            <div key={v.id} className="bc-alert bc-alert-warning">
              <span>⚠️</span>
              <div><strong>Active Violation: {v.type}</strong><p>{v.parameter} · {systems.find(s => s.id === v.systemId)?.name}</p></div>
            </div>
          ))}
        </div>
      )}

      {/* 4 Key Questions */}
      <div className="bc-four-questions">
        {/* Compliance Score / Am I compliant? */}
        <div className="bc-question-card bc-score-card" onClick={() => onNav('calendar')}>
          <div className="bc-q-label">✅ Am I compliant today?</div>
          <div className="bc-gauge">
            <svg width="130" height="70" viewBox="0 0 130 70">
              <path d="M 10 65 A 55 55 0 0 1 120 65" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
              <path d="M 10 65 A 55 55 0 0 1 120 65" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${dash} ${gap}`} strokeDashoffset="0"
                style={{ transformOrigin: '65px 65px', transform: 'rotate(0deg)' }}
              />
              <text x="65" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill={color}>{sc}</text>
            </svg>
          </div>
          <div className="bc-score-label" style={{ color }}>{label}</div>
          <div className="bc-score-subs">
            {Object.entries(score.breakdown).map(([k, v]) => (
              <div key={k} className="bc-score-sub">
                <span>{k}</span>
                <span style={{ color: scoreColor(v) }}>{v}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* What is due next */}
        <div className="bc-question-card" onClick={() => onNav('calendar')}>
          <div className="bc-q-label">⚠️ What is due next?</div>
          <div className="bc-due-list">
            {dueSoon.slice(0, 4).map(t => (
              <div key={t.id} className="bc-due-item">
                <div className="bc-due-title">{t.title}</div>
                <div className="bc-due-meta">{systems.find(s => s.id === t.systemId)?.name}</div>
                <div className="bc-due-date warning">{fmtDate(t.dueDate)} · {fmtDays(t.dueDate)}</div>
              </div>
            ))}
            {dueSoon.length === 0 && <div className="bc-empty-msg">No items due in the next 7 days.</div>}
          </div>
        </div>

        {/* What is overdue */}
        <div className="bc-question-card bc-overdue-card" onClick={() => onNav('calendar')}>
          <div className="bc-q-label">🔴 What is overdue?</div>
          <div className="bc-overdue-count">{overdue.length}</div>
          <div className="bc-overdue-label">overdue item{overdue.length !== 1 ? 's' : ''}</div>
          <div className="bc-due-list" style={{ marginTop: 12 }}>
            {overdue.map(t => (
              <div key={t.id} className="bc-due-item bc-due-item-overdue">
                <div className="bc-due-title">{t.title}</div>
                <div className="bc-due-meta">{systems.find(s => s.id === t.systemId)?.name}</div>
                <div className="bc-due-date danger">{fmtDate(t.dueDate)} · {fmtDays(t.dueDate)}</div>
              </div>
            ))}
            {overdue.length === 0 && <div className="bc-empty-msg" style={{ color: '#16a34a' }}>✓ Nothing overdue right now.</div>}
          </div>
        </div>

        {/* Compliance Score breakdown (stats) */}
        <div className="bc-question-card" onClick={() => onNav('calendar')}>
          <div className="bc-q-label">📈 System at a Glance</div>
          <div className="bc-stats-grid">
            <div className="bc-stat"><span className="bc-stat-n">{tasks.filter(t=>t.status==='Completed').length}</span><span>Completed</span></div>
            <div className="bc-stat"><span className="bc-stat-n warning">{dueSoon.length}</span><span>Due Soon</span></div>
            <div className="bc-stat"><span className="bc-stat-n danger">{overdue.length}</span><span>Overdue</span></div>
            <div className="bc-stat"><span className="bc-stat-n danger">{activeViolations.length}</span><span>Violations</span></div>
            <div className="bc-stat"><span className="bc-stat-n warning">{pendingNotices.length}</span><span>Pending Notices</span></div>
            <div className="bc-stat"><span className="bc-stat-n">{samples.filter(s=>s.status==='Scheduled').length}</span><span>Samples Queued</span></div>
          </div>
        </div>
      </div>

      {/* Upcoming tasks table */}
      <div className="bc-panel">
        <div className="bc-panel-header">
          <h3>Upcoming Compliance Items</h3>
          <button className="bc-link-btn" onClick={() => onNav('calendar')}>View full calendar →</button>
        </div>
        <table className="bc-table">
          <thead><tr><th>Task</th><th>System</th><th>Category</th><th>Frequency</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>
            {upcomingTasks.map(t => (
              <tr key={t.id}>
                <td className="bc-bold">{t.title}</td>
                <td className="bc-muted">{systems.find(s => s.id === t.systemId)?.name}</td>
                <td>{t.category}</td>
                <td className="bc-muted">{t.frequency}</td>
                <td className="bc-mono">{fmtDate(t.dueDate)}</td>
                <td><span className={`bc-chip bc-chip-${t.status.toLowerCase().replace(' ','-')}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
