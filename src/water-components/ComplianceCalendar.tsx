import { useState } from 'react';
import type { ComplianceDeadline, Facility, ComplianceStatus } from '../water-types';

interface Props {
  deadlines: ComplianceDeadline[];
  facilities: Facility[];
  onUpdate: (id: string, patch: Partial<ComplianceDeadline>) => void;
  onAdd: (d: ComplianceDeadline) => void;
}

const STATUSES: ComplianceStatus[] = ['Current', 'Due Soon', 'Overdue', 'Submitted'];
const CATEGORIES = ['Sampling', 'Reporting', 'Certification', 'Fee', 'Inspection'];

const emptyForm = (): Partial<ComplianceDeadline> => ({
  title: '', description: '', dueDate: '', frequency: 'Monthly',
  category: 'Reporting', status: 'Current', notes: '', tceqFormNumber: '',
});

export default function ComplianceCalendar({ deadlines, facilities, onUpdate, onAdd }: Props) {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFacility, setFilterFacility] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ComplianceDeadline>>(emptyForm());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = deadlines
    .filter(d => !filterStatus || d.status === filterStatus)
    .filter(d => !filterFacility || d.facilityId === filterFacility)
    .filter(d => !filterCategory || d.category === filterCategory)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...emptyForm(), ...form, id: crypto.randomUUID(), facilityId: form.facilityId || facilities[0].id } as ComplianceDeadline);
    setForm(emptyForm());
    setShowForm(false);
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Compliance Calendar</h2>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Add Deadline'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={submitForm}>
          <h3>New Compliance Deadline</h3>
          <div className="form-grid-3">
            <div className="fg"><label>Facility</label>
              <select value={form.facilityId || ''} onChange={e => setForm(f => ({ ...f, facilityId: e.target.value }))}>
                {facilities.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
              </select>
            </div>
            <div className="fg"><label>Title</label>
              <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="fg"><label>Due Date</label>
              <input type="date" value={form.dueDate || ''} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
            </div>
            <div className="fg"><label>Category</label>
              <select value={form.category || 'Reporting'} onChange={e => setForm(f => ({ ...f, category: e.target.value as ComplianceDeadline['category'] }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg"><label>Frequency</label>
              <select value={form.frequency || 'Monthly'} onChange={e => setForm(f => ({ ...f, frequency: e.target.value as ComplianceDeadline['frequency'] }))}>
                {['Monthly','Quarterly','Annual','One-time'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg"><label>TCEQ Form #</label>
              <input value={form.tceqFormNumber || ''} onChange={e => setForm(f => ({ ...f, tceqFormNumber: e.target.value }))} placeholder="e.g. 20181" />
            </div>
            <div className="fg full"><label>Description</label>
              <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
          </div>
          <div className="form-actions"><button type="submit" className="btn-primary">Save Deadline</button></div>
        </form>
      )}

      <div className="filter-row">
        <select value={filterFacility} onChange={e => setFilterFacility(e.target.value)}>
          <option value="">All Facilities</option>
          {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="filter-count">{filtered.length} items</span>
      </div>

      <div className="deadline-list">
        {filtered.map(dl => {
          const facility = facilities.find(f => f.id === dl.facilityId);
          const expanded = expandedId === dl.id;
          return (
            <div key={dl.id} className={`deadline-card deadline-${dl.status.toLowerCase().replace(' ', '-')}`}>
              <div className="deadline-main" onClick={() => setExpandedId(expanded ? null : dl.id)}>
                <div className="deadline-left">
                  <span className={`cat-icon cat-${dl.category.toLowerCase()}`}>{
                    dl.category === 'Sampling' ? '🧪' :
                    dl.category === 'Reporting' ? '📄' :
                    dl.category === 'Certification' ? '🏅' :
                    dl.category === 'Fee' ? '💰' : '🔍'
                  }</span>
                  <div>
                    <div className="deadline-title">{dl.title}</div>
                    <div className="deadline-meta">{facility?.name} &nbsp;·&nbsp; {dl.frequency} &nbsp;{dl.tceqFormNumber ? `· Form ${dl.tceqFormNumber}` : ''}</div>
                  </div>
                </div>
                <div className="deadline-right">
                  <div className="deadline-date">{fmtDate(dl.dueDate)}</div>
                  <span className={`status-chip status-${dl.status.toLowerCase().replace(' ', '-')}`}>{dl.status}</span>
                  <span className="expand-arrow">{expanded ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded && (
                <div className="deadline-detail">
                  <p>{dl.description}</p>
                  {dl.notes && <p className="detail-notes">📝 {dl.notes}</p>}
                  <div className="detail-actions">
                    <label>Update Status:</label>
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        className={`status-btn ${dl.status === s ? 'active' : ''}`}
                        onClick={() => onUpdate(dl.id, { status: s, submittedDate: s === 'Submitted' ? new Date().toISOString().slice(0,10) : undefined })}
                      >{s}</button>
                    ))}
                  </div>
                  <div className="fg" style={{ marginTop: 12 }}>
                    <label>Notes</label>
                    <textarea
                      value={dl.notes}
                      rows={2}
                      onChange={e => onUpdate(dl.id, { notes: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
