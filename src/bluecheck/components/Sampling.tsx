import { useState } from 'react';
import type { Sample, WaterSystem, ContaminantGroup, SampleStatus } from '../types';

interface Props {
  samples: Sample[];
  systems: WaterSystem[];
  onAdd: (s: Sample) => void;
  onUpdate: (id: string, patch: Partial<Sample>) => void;
}

const GROUPS: ContaminantGroup[] = ['Bacteriological', 'Chemical', 'Nitrate/Nitrite', 'Lead & Copper', 'Radiological', 'Disinfectant Residual', 'DBP', 'Surface Water Treatment'];
const STATUSES: SampleStatus[] = ['Scheduled', 'Collected', 'In Transit', 'At Lab', 'Results Received', 'Violation Triggered'];
const STATUS_COLOR: Record<SampleStatus, string> = { Scheduled: 'info', Collected: 'info', 'In Transit': 'warning', 'At Lab': 'warning', 'Results Received': 'good', 'Violation Triggered': 'danger' };

export default function Sampling({ samples, systems, onAdd, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [filterSystem, setFilterSystem] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Sample>>({ contaminantGroup: 'Bacteriological', status: 'Scheduled', chainOfCustody: 'Not Started', collectionRequired: true, requiredFrequency: 'Monthly', unit: 'presence/absence', violation: false, repeatSampleRequired: false, notes: '' });

  const filtered = samples
    .filter(s => !filterSystem || s.systemId === filterSystem)
    .filter(s => !filterGroup || s.contaminantGroup === filterGroup)
    .filter(s => !filterStatus || s.status === filterStatus)
    .sort((a, b) => b.collectionWindowStart.localeCompare(a.collectionWindowStart));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...form, id: crypto.randomUUID(), systemId: form.systemId || systems[0].id, violation: false, repeatSampleRequired: false, chainOfCustody: 'Not Started', notes: form.notes || '' } as Sample);
    setForm({ contaminantGroup: 'Bacteriological', status: 'Scheduled', chainOfCustody: 'Not Started', collectionRequired: true, requiredFrequency: 'Monthly', unit: 'presence/absence', violation: false, repeatSampleRequired: false, notes: '' });
    setShowForm(false);
  }

  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const overLimit = (s: Sample) => s.result !== undefined && s.mcl !== undefined && s.result > s.mcl;
  const overAction = (s: Sample) => s.result !== undefined && s.actionLevel !== undefined && s.result > s.actionLevel;

  const pending = samples.filter(s => s.status === 'Scheduled' || s.status === 'Collected' || s.status === 'At Lab');
  const violations = samples.filter(s => s.violation);

  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Sampling</h2>
        <button className="bc-btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Schedule Sample'}
        </button>
      </div>

      {/* Stats */}
      <div className="bc-sampling-stats">
        <div className="bc-sstat"><span>{samples.length}</span><span>Total Samples</span></div>
        <div className="bc-sstat warning"><span>{pending.length}</span><span>In Progress</span></div>
        <div className="bc-sstat danger"><span>{violations.length}</span><span>Violations Triggered</span></div>
        <div className="bc-sstat good"><span>{samples.filter(s => s.status === 'Results Received' && !s.violation).length}</span><span>Passed</span></div>
      </div>

      {showForm && (
        <form className="bc-form" onSubmit={submit}>
          <h3>Schedule New Sample</h3>
          <div className="bc-form-grid">
            <div className="bc-fg"><label>System</label>
              <select value={form.systemId || ''} onChange={e => setForm(f => ({ ...f, systemId: e.target.value }))}>
                {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Contaminant Group</label>
              <select value={form.contaminantGroup} onChange={e => setForm(f => ({ ...f, contaminantGroup: e.target.value as ContaminantGroup }))}>
                {GROUPS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Parameter</label>
              <input value={form.parameter || ''} onChange={e => setForm(f => ({ ...f, parameter: e.target.value }))} required placeholder="e.g. Total Coliform" />
            </div>
            <div className="bc-fg"><label>Collection Location</label>
              <input value={form.collectionLocation || ''} onChange={e => setForm(f => ({ ...f, collectionLocation: e.target.value }))} required placeholder="e.g. EP-01" />
            </div>
            <div className="bc-fg"><label>Window Start</label>
              <input type="date" value={form.collectionWindowStart || ''} onChange={e => setForm(f => ({ ...f, collectionWindowStart: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Window End</label>
              <input type="date" value={form.collectionWindowEnd || ''} onChange={e => setForm(f => ({ ...f, collectionWindowEnd: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Unit</label>
              <input value={form.unit || ''} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            </div>
            <div className="bc-fg"><label>MCL</label>
              <input type="number" step="any" value={form.mcl ?? ''} onChange={e => setForm(f => ({ ...f, mcl: e.target.value ? parseFloat(e.target.value) : undefined }))} />
            </div>
            <div className="bc-fg"><label>Action Level</label>
              <input type="number" step="any" value={form.actionLevel ?? ''} onChange={e => setForm(f => ({ ...f, actionLevel: e.target.value ? parseFloat(e.target.value) : undefined }))} />
            </div>
            <div className="bc-fg"><label>Collector Name</label>
              <input value={form.collectorName || ''} onChange={e => setForm(f => ({ ...f, collectorName: e.target.value }))} />
            </div>
            <div className="bc-fg bc-fg-full"><label>Notes</label>
              <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
            </div>
          </div>
          <div className="bc-form-actions"><button type="submit" className="bc-btn-primary">Save Sample</button></div>
        </form>
      )}

      <div className="bc-toolbar">
        <div className="bc-filters">
          <select value={filterSystem} onChange={e => setFilterSystem(e.target.value)}>
            <option value="">All Systems</option>
            {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
            <option value="">All Groups</option>
            {GROUPS.map(g => <option key={g}>{g}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="bc-count">{filtered.length} samples</span>
        </div>
      </div>

      <div className="bc-table-card">
        <table className="bc-table">
          <thead>
            <tr><th>System</th><th>Group</th><th>Parameter</th><th>Location</th><th>Window</th><th>Collector</th><th>Chain of Custody</th><th>Result</th><th>MCL/AL</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className={s.violation ? 'bc-row-violation' : ''} onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} style={{ cursor: 'pointer' }}>
                <td className="bc-muted">{systems.find(sys => sys.id === s.systemId)?.name}</td>
                <td>{s.contaminantGroup}</td>
                <td className="bc-bold">{s.parameter}</td>
                <td className="bc-muted">{s.collectionLocation}</td>
                <td className="bc-mono">{fmtDate(s.collectionWindowStart)} – {fmtDate(s.collectionWindowEnd)}</td>
                <td className="bc-muted">{s.collectorName || '—'}</td>
                <td>
                  <select className="bc-coc-select" value={s.chainOfCustody} onClick={e => e.stopPropagation()}
                    onChange={e => onUpdate(s.id, { chainOfCustody: e.target.value as Sample['chainOfCustody'] })}>
                    <option>Not Started</option><option>Collector Signed</option><option>Lab Received</option>
                  </select>
                </td>
                <td className={`bc-mono ${overLimit(s) || overAction(s) ? 'bc-text-danger' : ''}`}>
                  {s.result !== undefined ? `${s.result} ${s.unit}` : '—'}
                </td>
                <td className="bc-mono bc-muted">
                  {s.mcl !== undefined ? `MCL: ${s.mcl}` : s.actionLevel !== undefined ? `AL: ${s.actionLevel}` : '—'}
                </td>
                <td>
                  <select className={`bc-status-select bc-ss-${STATUS_COLOR[s.status]}`} value={s.status} onClick={e => e.stopPropagation()}
                    onChange={e => onUpdate(s.id, { status: e.target.value as SampleStatus })}>
                    {STATUSES.map(st => <option key={st}>{st}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
