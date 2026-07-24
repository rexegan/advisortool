import { useState } from 'react';
import type { LabSample, Facility, SampleType, LabResult } from '../water-types';

interface Props {
  samples: LabSample[];
  facilities: Facility[];
  onAdd: (s: LabSample) => void;
  onUpdate: (id: string, patch: Partial<LabSample>) => void;
}

const SAMPLE_TYPES: SampleType[] = ['Bacteriological', 'Chemical', 'Nitrate', 'Lead & Copper', 'Radiological', 'Disinfectant'];

const empty = (): Partial<LabSample> => ({
  sampleType: 'Bacteriological', collectionDate: '', labReceivedDate: '',
  location: '', parameter: '', unit: 'presence/absence', status: 'Pending',
  labName: '', certNumber: '', notes: '',
});

export default function LabResults({ samples, facilities, onAdd, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<LabSample>>(empty());
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFacility, setFilterFacility] = useState('');
  const [filterType, setFilterType] = useState('');

  const filtered = samples
    .filter(s => !filterStatus || s.status === filterStatus)
    .filter(s => !filterFacility || s.facilityId === filterFacility)
    .filter(s => !filterType || s.sampleType === filterType)
    .sort((a, b) => b.collectionDate.localeCompare(a.collectionDate));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...empty(), ...form, id: crypto.randomUUID(), facilityId: form.facilityId || facilities[0].id } as LabSample);
    setForm(empty());
    setShowForm(false);
  }

  const fmtDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const overLimit = (s: LabSample) => s.result !== undefined && s.mcl !== undefined && s.result > s.mcl;

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Lab Results & Water Quality</h2>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Log Sample'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={submit}>
          <h3>New Lab Sample</h3>
          <div className="form-grid-3">
            <div className="fg"><label>Facility</label>
              <select value={form.facilityId || ''} onChange={e => setForm(f => ({ ...f, facilityId: e.target.value }))}>
                {facilities.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
              </select>
            </div>
            <div className="fg"><label>Sample Type</label>
              <select value={form.sampleType || ''} onChange={e => setForm(f => ({ ...f, sampleType: e.target.value as SampleType }))}>
                {SAMPLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fg"><label>Parameter</label>
              <input value={form.parameter || ''} onChange={e => setForm(f => ({ ...f, parameter: e.target.value }))} placeholder="e.g. Total Coliform" required />
            </div>
            <div className="fg"><label>Sample Location</label>
              <input value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. EP-01" required />
            </div>
            <div className="fg"><label>Collection Date</label>
              <input type="date" value={form.collectionDate || ''} onChange={e => setForm(f => ({ ...f, collectionDate: e.target.value }))} required />
            </div>
            <div className="fg"><label>Lab Received Date</label>
              <input type="date" value={form.labReceivedDate || ''} onChange={e => setForm(f => ({ ...f, labReceivedDate: e.target.value }))} required />
            </div>
            <div className="fg"><label>Result</label>
              <input type="number" step="any" value={form.result ?? ''} onChange={e => setForm(f => ({ ...f, result: e.target.value ? parseFloat(e.target.value) : undefined }))} placeholder="Leave blank if pending" />
            </div>
            <div className="fg"><label>Unit</label>
              <input value={form.unit || ''} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="mg/L, presence/absence..." />
            </div>
            <div className="fg"><label>MCL</label>
              <input type="number" step="any" value={form.mcl ?? ''} onChange={e => setForm(f => ({ ...f, mcl: e.target.value ? parseFloat(e.target.value) : undefined }))} placeholder="Max Contaminant Level" />
            </div>
            <div className="fg"><label>Lab Name</label>
              <input value={form.labName || ''} onChange={e => setForm(f => ({ ...f, labName: e.target.value }))} required />
            </div>
            <div className="fg"><label>Cert Number</label>
              <input value={form.certNumber || ''} onChange={e => setForm(f => ({ ...f, certNumber: e.target.value }))} />
            </div>
            <div className="fg"><label>Status</label>
              <select value={form.status || 'Pending'} onChange={e => setForm(f => ({ ...f, status: e.target.value as LabResult }))}>
                <option>Pending</option><option>Pass</option><option>Fail</option>
              </select>
            </div>
            <div className="fg full"><label>Notes</label>
              <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
            </div>
          </div>
          <div className="form-actions"><button type="submit" className="btn-primary">Save Sample</button></div>
        </form>
      )}

      <div className="filter-row">
        <select value={filterFacility} onChange={e => setFilterFacility(e.target.value)}>
          <option value="">All Facilities</option>
          {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {SAMPLE_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Results</option>
          <option>Pass</option><option>Fail</option><option>Pending</option>
        </select>
        <span className="filter-count">{filtered.length} samples</span>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Type</th>
              <th>Parameter</th>
              <th>Location</th>
              <th>Collected</th>
              <th>Result</th>
              <th>MCL</th>
              <th>Lab</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className={s.status === 'Fail' ? 'row-fail' : ''}>
                <td>{facilities.find(f => f.id === s.facilityId)?.name}</td>
                <td>{s.sampleType}</td>
                <td className="bold">{s.parameter}</td>
                <td className="muted">{s.location}</td>
                <td className="mono">{fmtDate(s.collectionDate)}</td>
                <td className={`mono ${overLimit(s) ? 'text-danger' : ''}`}>
                  {s.result !== undefined ? `${s.result} ${s.unit}` : '—'}
                </td>
                <td className="mono muted">{s.mcl !== undefined ? `${s.mcl} ${s.unit}` : '—'}</td>
                <td className="muted">{s.labName}</td>
                <td>
                  <select
                    className={`status-select-sm status-${s.status.toLowerCase()}`}
                    value={s.status}
                    onChange={e => onUpdate(s.id, { status: e.target.value as LabResult })}
                  >
                    <option>Pending</option><option>Pass</option><option>Fail</option>
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
