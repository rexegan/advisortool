import type { ComplianceDeadline, LabSample, PublicNotice, WaterUsageRecord, Facility } from '../water-types';

interface Props {
  deadlines: ComplianceDeadline[];
  samples: LabSample[];
  notices: PublicNotice[];
  usage: WaterUsageRecord[];
  facilities: Facility[];
  onNav: (v: string) => void;
}

export default function Dashboard({ deadlines, samples, notices, usage, facilities, onNav }: Props) {
  const overdue = deadlines.filter(d => d.status === 'Overdue');
  const dueSoon = deadlines.filter(d => d.status === 'Due Soon');
  const failing = samples.filter(s => s.status === 'Fail');
  const activeNotices = notices.filter(n => n.status === 'Issued' && n.type === 'Boil Water');
  const totalUsage = usage.reduce((s, r) => s + r.distributedGallons, 0);
  const totalNRW = usage.reduce((s, r) => s + r.nonRevenueWater, 0);
  const nrwPct = totalUsage > 0 ? ((totalNRW / (totalUsage + totalNRW)) * 100).toFixed(1) : '0';

  const fmtGal = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M gal` : `${(n / 1000).toFixed(0)}K gal`;

  const recentDeadlines = [...deadlines]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>System Overview</h2>
        <p className="page-sub">{facilities.length} facilities &nbsp;·&nbsp; {deadlines.length} compliance items tracked</p>
      </div>

      {/* Alert banner */}
      {(overdue.length > 0 || activeNotices.length > 0 || failing.length > 0) && (
        <div className="alert-banner">
          {activeNotices.map(n => (
            <div key={n.id} className="alert alert-critical">
              <span className="alert-icon">🚨</span>
              <div>
                <strong>Active Boil Water Notice</strong>
                <p>{n.title} — {n.affectedArea}</p>
              </div>
            </div>
          ))}
          {overdue.map(d => (
            <div key={d.id} className="alert alert-warning">
              <span className="alert-icon">⚠️</span>
              <div>
                <strong>Overdue:</strong> {d.title}
                <p>Was due {fmtDate(d.dueDate)} &nbsp;·&nbsp; {facilities.find(f => f.id === d.facilityId)?.name}</p>
              </div>
            </div>
          ))}
          {failing.map(s => (
            <div key={s.id} className="alert alert-warning">
              <span className="alert-icon">⚠️</span>
              <div>
                <strong>Lab Failure:</strong> {s.parameter} at {s.location}
                <p>{facilities.find(f => f.id === s.facilityId)?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI row */}
      <div className="kpi-row">
        <div className="kpi kpi-danger" onClick={() => onNav('calendar')}>
          <div className="kpi-value">{overdue.length}</div>
          <div className="kpi-label">Overdue Items</div>
        </div>
        <div className="kpi kpi-warning" onClick={() => onNav('calendar')}>
          <div className="kpi-value">{dueSoon.length}</div>
          <div className="kpi-label">Due This Week</div>
        </div>
        <div className="kpi kpi-danger" onClick={() => onNav('lab')}>
          <div className="kpi-value">{failing.length}</div>
          <div className="kpi-label">Lab Failures</div>
        </div>
        <div className="kpi kpi-neutral" onClick={() => onNav('usage')}>
          <div className="kpi-value">{fmtGal(totalUsage)}</div>
          <div className="kpi-label">Total Distributed</div>
        </div>
        <div className={`kpi ${parseFloat(nrwPct) > 15 ? 'kpi-warning' : 'kpi-good'}`} onClick={() => onNav('usage')}>
          <div className="kpi-value">{nrwPct}%</div>
          <div className="kpi-label">Non-Revenue Water</div>
        </div>
        <div className="kpi kpi-info" onClick={() => onNav('notices')}>
          <div className="kpi-value">{activeNotices.length}</div>
          <div className="kpi-label">Active Boil Water Notices</div>
        </div>
      </div>

      {/* Bottom panels */}
      <div className="dash-panels">
        <div className="panel">
          <div className="panel-header">
            <h3>Upcoming Deadlines</h3>
            <button className="panel-link" onClick={() => onNav('calendar')}>View all →</button>
          </div>
          <table className="mini-table">
            <thead><tr><th>Item</th><th>Facility</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              {recentDeadlines.map(dl => (
                <tr key={dl.id}>
                  <td>{dl.title}</td>
                  <td className="muted">{facilities.find(f => f.id === dl.facilityId)?.name}</td>
                  <td className="mono">{fmtDate(dl.dueDate)}</td>
                  <td><span className={`status-chip status-${dl.status.toLowerCase().replace(' ', '-')}`}>{dl.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Recent Lab Results</h3>
            <button className="panel-link" onClick={() => onNav('lab')}>View all →</button>
          </div>
          <table className="mini-table">
            <thead><tr><th>Parameter</th><th>Location</th><th>Result</th><th>Status</th></tr></thead>
            <tbody>
              {samples.slice(0, 5).map(s => (
                <tr key={s.id}>
                  <td>{s.parameter}</td>
                  <td className="muted">{s.location}</td>
                  <td className="mono">{s.result !== undefined ? `${s.result} ${s.unit}` : '—'}</td>
                  <td><span className={`status-chip status-${s.status.toLowerCase()}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
