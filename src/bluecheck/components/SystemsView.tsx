import type { WaterSystem, ComplianceTask, Violation } from '../types';
import { calcComplianceScore, scoreColor, scoreLabel } from '../utils/compliance';

interface Props {
  systems: WaterSystem[];
  tasks: ComplianceTask[];
  violations: Violation[];
}

const CAT_COLOR: Record<string, string> = {
  'Municipal Water System': '#0369a1', 'Rural Water District': '#0891b2',
  'Apartment Community': '#7c3aed', 'Hotel / Resort': '#d97706',
  'Mobile Home Park': '#ea580c', 'School / University': '#16a34a',
  'Hospital / Nursing Home': '#dc2626', 'Church / Camp': '#059669',
  'HOA – Private System': '#6d28d9', 'Commercial Building': '#1d4ed8',
  'Industrial Facility': '#92400e', 'Manufactured Housing Community': '#b45309',
};

export default function SystemsView({ systems, tasks, violations }: Props) {
  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Water Systems</h2>
        <button className="bc-btn-primary" disabled>+ Add System</button>
      </div>
      <div className="bc-systems-grid">
        {systems.map(sys => {
          const sysTasks = tasks.filter(t => t.systemId === sys.id);
          const sysViolations = violations.filter(v => v.systemId === sys.id);
          const score = calcComplianceScore(sysTasks, [], sysViolations);
          const color = scoreColor(score.overall);
          return (
            <div key={sys.id} className="bc-system-card">
              <div className="bc-system-top">
                <div>
                  <div className="bc-system-name">{sys.name}</div>
                  <span className="bc-system-cat" style={{ background: CAT_COLOR[sys.category] + '22', color: CAT_COLOR[sys.category] }}>{sys.category}</span>
                </div>
                <div className="bc-system-score-wrap">
                  <div className="bc-system-score" style={{ color }}>{score.overall}</div>
                  <div className="bc-system-score-label" style={{ color }}>{scoreLabel(score.overall)}</div>
                </div>
              </div>
              <div className="bc-system-ids">
                <span className="bc-id-label">PWS ID</span> <span className="bc-id-val">{sys.pwsId}</span>
                <span className="bc-id-label">Class</span> <span className="bc-id-val">{sys.systemClass}</span>
                <span className="bc-id-label">Source</span> <span className="bc-id-val">{sys.sourceType}</span>
              </div>
              <div className="bc-system-stats">
                <div className="bc-sys-stat"><span>{sys.populationServed.toLocaleString()}</span><span>Population</span></div>
                <div className="bc-sys-stat"><span>{sys.serviceConnections.toLocaleString()}</span><span>Connections</span></div>
                <div className="bc-sys-stat"><span className={sysViolations.filter(v => v.status !== 'Resolved').length > 0 ? 'danger' : ''}>{sysViolations.filter(v => v.status !== 'Resolved').length}</span><span>Active Violations</span></div>
                <div className="bc-sys-stat"><span>{sysTasks.filter(t => t.status === 'Overdue').length > 0 ? <span className="danger">{sysTasks.filter(t => t.status === 'Overdue').length}</span> : 0}</span><span>Overdue</span></div>
              </div>
              <div className="bc-system-contact">
                <strong>{sys.contactName}</strong>
                <span className="bc-muted">{sys.contactEmail}</span>
                <span className="bc-muted">{sys.contactPhone} · {sys.county} County</span>
              </div>
              {sys.operatorLicense && (
                <div className="bc-sys-license">Operator: {sys.operatorLicense}{sys.operatorExpiry ? ` · Exp ${new Date(sys.operatorExpiry).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
