import type { ComplianceTask, Sample, PublicNotice, VaultDocument, WaterSystem, Violation } from '../types';

interface Props {
  tasks: ComplianceTask[];
  samples: Sample[];
  notices: PublicNotice[];
  documents: VaultDocument[];
  violations: Violation[];
  systems: WaterSystem[];
}

export default function AuditMode({ tasks, samples, notices, documents, violations, systems }: Props) {
  const completed = tasks.filter(t => t.status === 'Completed');
  const auditScore = Math.round((completed.length / Math.max(tasks.length, 1)) * 100);

  const sections = [
    { label: 'Compliance Tasks', icon: '📅', count: tasks.length, completed: completed.length, color: 'good' as const },
    { label: 'Lab Samples', icon: '🧪', count: samples.length, completed: samples.filter(s => s.status === 'Results Received').length, color: 'info' as const },
    { label: 'Public Notices', icon: '📢', count: notices.length, completed: notices.filter(n => n.proofOfDelivery).length, color: 'warning' as const },
    { label: 'Violations', icon: '⚠️', count: violations.length, completed: violations.filter(v => v.status === 'Resolved').length, color: 'danger' as const },
    { label: 'Documents', icon: '🗂️', count: documents.length, completed: documents.length, color: 'good' as const },
  ];

  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Audit Mode</h2>
        <button className="bc-btn-primary" disabled>Export Audit Package</button>
      </div>

      <div className="bc-audit-hero">
        <div className="bc-audit-icon">🔍</div>
        <div>
          <h3>Regulatory Audit Readiness</h3>
          <p>When a regulator requests records, you can instantly produce every sample, report, notice, certificate, inspection, and communication — no digging through filing cabinets.</p>
        </div>
        <div className="bc-audit-score-wrap">
          <div className="bc-audit-score">{auditScore}%</div>
          <div className="bc-audit-score-label">Audit Ready</div>
        </div>
      </div>

      <div className="bc-audit-sections">
        {sections.map(sec => (
          <div key={sec.label} className="bc-audit-section">
            <div className="bc-audit-sec-icon">{sec.icon}</div>
            <div className="bc-audit-sec-body">
              <div className="bc-audit-sec-label">{sec.label}</div>
              <div className="bc-audit-sec-stats">{sec.completed} of {sec.count} documented</div>
              <div className="bc-audit-bar-track">
                <div className="bc-audit-bar-fill" style={{ width: `${sec.count ? (sec.completed / sec.count) * 100 : 0}%`, background: sec.color === 'danger' ? '#dc2626' : sec.color === 'warning' ? '#d97706' : '#0369a1' }} />
              </div>
            </div>
            <span className={`bc-chip bc-chip-${sec.color}`}>{sec.count ? Math.round((sec.completed / sec.count) * 100) : 0}%</span>
          </div>
        ))}
      </div>

      <div className="bc-audit-checklist">
        <h3>Instant Regulator Package Would Include:</h3>
        <div className="bc-checklist-grid">
          {[
            ['Every lab sample result', samples.length],
            ['Every compliance report', tasks.filter(t => t.category === 'Reporting').length],
            ['Every public notice issued', notices.filter(n => n.status === 'Issued').length],
            ['Every certificate on file', documents.filter(d => d.category === 'Certificate').length],
            ['Every inspection record', documents.filter(d => d.category === 'Inspection').length],
            ['Every violation & resolution', violations.length],
            ['Chain of custody records', samples.filter(s => s.chainOfCustody === 'Lab Received').length],
            ['Audit trail entries', tasks.reduce((s, t) => s + t.auditTrail.length, 0)],
          ].map(([label, count]) => (
            <div key={label as string} className="bc-checklist-item">
              <span className="bc-checklist-check">✓</span>
              <span>{label as string}</span>
              <span className="bc-checklist-count">{count as number}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bc-audit-systems">
        <h3>Records by System</h3>
        {systems.map(sys => {
          const sysTasks = tasks.filter(t => t.systemId === sys.id);
          const sysCompleted = sysTasks.filter(t => t.status === 'Completed').length;
          const sysViolations = violations.filter(v => v.systemId === sys.id);
          const sysReady = sysTasks.length ? Math.round((sysCompleted / sysTasks.length) * 100) : 100;
          return (
            <div key={sys.id} className="bc-audit-sys-row">
              <div>
                <div className="bc-audit-sys-name">{sys.name}</div>
                <div className="bc-muted">{sys.pwsId} · {sys.county} County</div>
              </div>
              <div className="bc-audit-sys-bar">
                <div className="bc-audit-bar-track" style={{ width: 200 }}>
                  <div className="bc-audit-bar-fill" style={{ width: `${sysReady}%`, background: sysReady >= 80 ? '#0369a1' : '#d97706' }} />
                </div>
              </div>
              <div className="bc-audit-sys-stats">
                <span>{sysCompleted}/{sysTasks.length} tasks</span>
                {sysViolations.length > 0 && <span className="bc-chip bc-chip-danger">{sysViolations.length} violation{sysViolations.length > 1 ? 's' : ''}</span>}
              </div>
              <span className={`bc-chip ${sysReady >= 80 ? 'bc-chip-info' : 'bc-chip-warning'}`}>{sysReady}% ready</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
