import { useState } from 'react';
import type { Violation, WaterSystem, ViolationType, ViolationStatus, NotificationLevel } from '../types';

interface Props {
  violations: Violation[];
  systems: WaterSystem[];
  onAdd: (v: Violation) => void;
  onUpdate: (id: string, patch: Partial<Violation>) => void;
}

const TYPES: ViolationType[] = ['MCL', 'MRDL', 'TT', 'Monitoring', 'Reporting', 'Public Notification'];
const STATUSES: ViolationStatus[] = ['Open', 'In Resolution', 'Resolved', 'Referred'];
const LEVELS: NotificationLevel[] = ['Tier 1 (24-Hour)', 'Tier 2 (30-Day)', 'Tier 3 (Annual)'];

const TYPE_COLOR: Record<ViolationType, string> = { MCL: 'danger', MRDL: 'danger', TT: 'warning', Monitoring: 'warning', Reporting: 'info', 'Public Notification': 'info' };
const STATUS_COLOR: Record<ViolationStatus, string> = { Open: 'danger', 'In Resolution': 'warning', Resolved: 'good', Referred: 'info' };

export default function Violations({ violations, systems, onAdd, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSystem, setFilterSystem] = useState('');
  const [form, setForm] = useState<Partial<Violation>>({ type: 'MCL', status: 'Open', notificationLevel: 'Tier 2 (30-Day)', documents: [], notes: '', resolutionPlan: '', repeatViolation: false, finePaid: false });

  const filtered = violations
    .filter(v => !filterStatus || v.status === filterStatus)
    .filter(v => !filterSystem || v.systemId === filterSystem)
    .sort((a, b) => b.detectedDate.localeCompare(a.detectedDate));

  const unpaid = violations.filter(v => v.fineAmount && !v.finePaid).reduce((s, v) => s + (v.fineAmount || 0), 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...form, id: crypto.randomUUID(), systemId: form.systemId || systems[0].id, documents: [], notes: form.notes || '', resolutionPlan: form.resolutionPlan || '', repeatViolation: false, finePaid: false } as Violation);
    setForm({ type: 'MCL', status: 'Open', notificationLevel: 'Tier 2 (30-Day)', documents: [], notes: '', resolutionPlan: '', repeatViolation: false, finePaid: false });
    setShowForm(false);
  }

  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const fmtMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Violations</h2>
        <button className="bc-btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Log Violation'}
        </button>
      </div>

      {/* Summary chips */}
      <div className="bc-violation-summary">
        <div className="bc-vsummary-chip danger">
          <span>{violations.filter(v => v.status === 'Open').length}</span> Open
        </div>
        <div className="bc-vsummary-chip warning">
          <span>{violations.filter(v => v.status === 'In Resolution').length}</span> In Resolution
        </div>
        <div className="bc-vsummary-chip good">
          <span>{violations.filter(v => v.status === 'Resolved').length}</span> Resolved
        </div>
        {unpaid > 0 && (
          <div className="bc-vsummary-chip danger">
            <span>{fmtMoney(unpaid)}</span> Fines Unpaid
          </div>
        )}
      </div>

      {showForm && (
        <form className="bc-form" onSubmit={submit}>
          <h3>Log New Violation</h3>
          <div className="bc-form-grid">
            <div className="bc-fg"><label>System</label>
              <select value={form.systemId || ''} onChange={e => setForm(f => ({ ...f, systemId: e.target.value }))}>
                {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Violation Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ViolationType }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Parameter / Issue</label>
              <input value={form.parameter || ''} onChange={e => setForm(f => ({ ...f, parameter: e.target.value }))} required placeholder="e.g. Free Chlorine, Total Coliform" />
            </div>
            <div className="bc-fg"><label>Date Detected</label>
              <input type="date" value={form.detectedDate || ''} onChange={e => setForm(f => ({ ...f, detectedDate: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Notification Level</label>
              <select value={form.notificationLevel} onChange={e => setForm(f => ({ ...f, notificationLevel: e.target.value as NotificationLevel }))}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Fine Amount ($)</label>
              <input type="number" value={form.fineAmount || ''} onChange={e => setForm(f => ({ ...f, fineAmount: parseFloat(e.target.value) || undefined }))} placeholder="0" />
            </div>
            <div className="bc-fg bc-fg-full"><label>Resolution Plan</label>
              <textarea value={form.resolutionPlan || ''} onChange={e => setForm(f => ({ ...f, resolutionPlan: e.target.value }))} rows={2} />
            </div>
            <div className="bc-fg bc-fg-full"><label>Notes</label>
              <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
            </div>
          </div>
          <div className="bc-form-actions"><button type="submit" className="bc-btn-primary">Save Violation</button></div>
        </form>
      )}

      <div className="bc-toolbar">
        <div className="bc-filters">
          <select value={filterSystem} onChange={e => setFilterSystem(e.target.value)}>
            <option value="">All Systems</option>
            {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="bc-count">{filtered.length} violations</span>
        </div>
      </div>

      <div className="bc-violation-list">
        {filtered.map(v => {
          const sys = systems.find(s => s.id === v.systemId);
          const expanded = expandedId === v.id;
          return (
            <div key={v.id} className={`bc-violation-card`}>
              <div className="bc-violation-header" onClick={() => setExpandedId(expanded ? null : v.id)}>
                <div className="bc-violation-left">
                  <span className={`bc-chip bc-chip-type bc-chip-${TYPE_COLOR[v.type]}`}>{v.type}</span>
                  <div>
                    <div className="bc-violation-param">{v.parameter}</div>
                    <div className="bc-violation-meta">{sys?.name} · Detected {fmtDate(v.detectedDate)} · {v.notificationLevel}</div>
                  </div>
                </div>
                <div className="bc-violation-right">
                  {v.fineAmount && <span className="bc-fine">{fmtMoney(v.fineAmount)}{v.finePaid ? ' ✓' : ' unpaid'}</span>}
                  <span className={`bc-chip bc-chip-${STATUS_COLOR[v.status]}`}>{v.status}</span>
                  <span className="bc-expand">{expanded ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded && (
                <div className="bc-violation-detail">
                  {v.resolutionPlan && <div className="bc-resolution"><strong>Resolution Plan:</strong> {v.resolutionPlan}</div>}
                  {v.resolutionDueDate && <div className="bc-detail-note">📅 Resolution due: {fmtDate(v.resolutionDueDate)}</div>}
                  {v.resolvedDate && <div className="bc-detail-note">✅ Resolved: {fmtDate(v.resolvedDate)}</div>}
                  {v.notes && <div className="bc-detail-note">📝 {v.notes}</div>}
                  <div className="bc-detail-actions">
                    <span className="bc-detail-label">Update status:</span>
                    {STATUSES.map(s => (
                      <button key={s} className={`bc-status-btn ${v.status === s ? 'active' : ''}`}
                        onClick={() => onUpdate(v.id, { status: s, resolvedDate: s === 'Resolved' ? new Date().toISOString().slice(0,10) : undefined })}>
                        {s}
                      </button>
                    ))}
                    {v.fineAmount && !v.finePaid && (
                      <button className="bc-status-btn" onClick={() => onUpdate(v.id, { finePaid: true })}>
                        Mark Fine Paid
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bc-empty">
            <div className="bc-empty-icon">✅</div>
            <div>No violations match the current filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
