import { useState } from 'react';
import type { PublicNotice, Facility, NoticeType, NoticeStatus } from '../water-types';

interface Props {
  notices: PublicNotice[];
  facilities: Facility[];
  onAdd: (n: PublicNotice) => void;
  onUpdate: (id: string, patch: Partial<PublicNotice>) => void;
}

const TYPES: NoticeType[] = ['Boil Water', 'Violation', 'CCR', 'Public Notification'];
const DELIVERY = ['Door hanger', 'Bill insert', 'City website', 'Email to customers', 'Local TV', 'TCEQ online portal', 'Posted in office', 'Newspaper'];

const empty = (): Partial<PublicNotice> => ({
  type: 'Boil Water', title: '', issuedDate: '', status: 'Draft',
  affectedArea: '', deliveryMethods: [], content: '', violationCode: '',
});

export default function PublicNotices({ notices, facilities, onAdd, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<PublicNotice>>(empty());
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = notices
    .filter(n => !filterType || n.type === filterType)
    .filter(n => !filterStatus || n.status === filterStatus)
    .sort((a, b) => b.issuedDate.localeCompare(a.issuedDate));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...empty(), ...form, id: crypto.randomUUID(), facilityId: form.facilityId || facilities[0].id } as PublicNotice);
    setForm(empty());
    setShowForm(false);
  }

  const toggleDelivery = (method: string) => {
    const cur = form.deliveryMethods || [];
    setForm(f => ({ ...f, deliveryMethods: cur.includes(method) ? cur.filter(m => m !== method) : [...cur, method] }));
  };

  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const statusColor: Record<NoticeStatus, string> = { Draft: 'neutral', Issued: 'danger', Rescinded: 'good' };

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Public Notices</h2>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ New Notice'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={submit}>
          <h3>New Public Notice</h3>
          <div className="form-grid-3">
            <div className="fg"><label>Facility</label>
              <select value={form.facilityId || ''} onChange={e => setForm(f => ({ ...f, facilityId: e.target.value }))}>
                {facilities.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
              </select>
            </div>
            <div className="fg"><label>Notice Type</label>
              <select value={form.type || 'Boil Water'} onChange={e => setForm(f => ({ ...f, type: e.target.value as NoticeType }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fg"><label>Status</label>
              <select value={form.status || 'Draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as NoticeStatus }))}>
                <option>Draft</option><option>Issued</option><option>Rescinded</option>
              </select>
            </div>
            <div className="fg full"><label>Title</label>
              <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="fg"><label>Issued Date</label>
              <input type="date" value={form.issuedDate || ''} onChange={e => setForm(f => ({ ...f, issuedDate: e.target.value }))} required />
            </div>
            <div className="fg"><label>Affected Area</label>
              <input value={form.affectedArea || ''} onChange={e => setForm(f => ({ ...f, affectedArea: e.target.value }))} required />
            </div>
            <div className="fg"><label>Violation Code (if applicable)</label>
              <input value={form.violationCode || ''} onChange={e => setForm(f => ({ ...f, violationCode: e.target.value }))} placeholder="e.g. TCR-MON-01" />
            </div>
            <div className="fg full">
              <label>Delivery Methods</label>
              <div className="checkbox-grid">
                {DELIVERY.map(m => (
                  <label key={m} className="checkbox-label">
                    <input type="checkbox" checked={(form.deliveryMethods || []).includes(m)} onChange={() => toggleDelivery(m)} />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div className="fg full"><label>Notice Content</label>
              <textarea value={form.content || ''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} required />
            </div>
          </div>
          <div className="form-actions"><button type="submit" className="btn-primary">Save Notice</button></div>
        </form>
      )}

      <div className="filter-row">
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option>Draft</option><option>Issued</option><option>Rescinded</option>
        </select>
        <span className="filter-count">{filtered.length} notices</span>
      </div>

      <div className="notice-list">
        {filtered.map(n => {
          const fac = facilities.find(f => f.id === n.facilityId);
          const expanded = expandedId === n.id;
          return (
            <div key={n.id} className={`notice-card notice-${n.status.toLowerCase()}`}>
              <div className="notice-header" onClick={() => setExpandedId(expanded ? null : n.id)}>
                <div className="notice-left">
                  <span className={`notice-type-badge type-${n.type.toLowerCase().replace(/[\s&]/g, '-')}`}>{n.type}</span>
                  <div>
                    <div className="notice-title">{n.title}</div>
                    <div className="notice-meta">{fac?.name} &nbsp;·&nbsp; {n.affectedArea} &nbsp;·&nbsp; Issued {fmtDate(n.issuedDate)}</div>
                  </div>
                </div>
                <div className="notice-right">
                  <span className={`status-chip status-${statusColor[n.status]}`}>{n.status}</span>
                  <span className="expand-arrow">{expanded ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded && (
                <div className="notice-detail">
                  <p className="notice-content">{n.content}</p>
                  {n.violationCode && <p className="detail-notes">Violation Code: {n.violationCode}</p>}
                  <div className="delivery-tags">
                    <strong>Delivery:</strong>
                    {n.deliveryMethods.map(m => <span key={m} className="delivery-tag">{m}</span>)}
                  </div>
                  <div className="detail-actions">
                    <label>Update Status:</label>
                    {(['Draft','Issued','Rescinded'] as NoticeStatus[]).map(s => (
                      <button
                        key={s}
                        className={`status-btn ${n.status === s ? 'active' : ''}`}
                        onClick={() => onUpdate(n.id, {
                          status: s,
                          rescindedDate: s === 'Rescinded' ? new Date().toISOString().slice(0,10) : undefined,
                        })}
                      >{s}</button>
                    ))}
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
