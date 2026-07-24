import { useState } from 'react';
import type { PublicNotice, WaterSystem, NoticeType, NoticeStatus, DeliveryMethod } from '../types';

interface Props {
  notices: PublicNotice[];
  systems: WaterSystem[];
  onAdd: (n: PublicNotice) => void;
  onUpdate: (id: string, patch: Partial<PublicNotice>) => void;
}

const TYPES: NoticeType[] = ['Boil Water', 'MCL Violation', 'Monitoring Violation', 'CCR', 'Public Education', 'Health Advisory'];
const DELIVERY_OPTIONS: DeliveryMethod[] = ['Direct Mail', 'Door Hanger', 'Bill Insert', 'Email', 'Website', 'Local TV/Radio', 'Newspaper', 'Posted Notice', 'TCEQ Portal'];
const LEVEL_COLOR: Record<string, string> = { 'Tier 1 (24-Hour)': 'danger', 'Tier 2 (30-Day)': 'warning', 'Tier 3 (Annual)': 'info' };

export default function PublicNotifications({ notices, systems, onAdd, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState<Partial<PublicNotice>>({ type: 'MCL Violation', status: 'Draft', deliveryMethods: [], content: '', affectedArea: '', estimatedAffected: 0, proofOfDelivery: false, certificateGenerated: false });

  const filtered = notices
    .filter(n => !filterType || n.type === filterType)
    .filter(n => !filterStatus || n.status === filterStatus)
    .sort((a, b) => b.deadlineDate.localeCompare(a.deadlineDate));

  const toggleDelivery = (m: DeliveryMethod) => {
    const cur = form.deliveryMethods || [];
    setForm(f => ({ ...f, deliveryMethods: cur.includes(m) ? cur.filter(x => x !== m) : [...cur, m] }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...form, id: crypto.randomUUID(), systemId: form.systemId || systems[0].id, deliveryMethods: form.deliveryMethods || [], proofOfDelivery: false, certificateGenerated: false } as PublicNotice);
    setForm({ type: 'MCL Violation', status: 'Draft', deliveryMethods: [], content: '', affectedArea: '', estimatedAffected: 0, proofOfDelivery: false, certificateGenerated: false });
    setShowForm(false);
  }

  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const STATUS_COLOR: Record<NoticeStatus, string> = { Draft: 'muted', 'Pending Review': 'warning', Issued: 'danger', Rescinded: 'good' };

  const tier1 = notices.filter(n => n.notificationLevel === 'Tier 1 (24-Hour)' && n.status !== 'Rescinded');

  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Public Notifications</h2>
        <button className="bc-btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ New Notice'}
        </button>
      </div>

      {tier1.length > 0 && (
        <div className="bc-tier1-alert">
          🚨 <strong>Tier 1 Alert:</strong> {tier1.length} notice(s) require public notification within 24 hours.
        </div>
      )}

      {/* Notice type explanation */}
      <div className="bc-tier-guide">
        <div className="bc-tier-card tier1">
          <div className="bc-tier-name">Tier 1</div>
          <div className="bc-tier-window">24 Hours</div>
          <div className="bc-tier-desc">Acute health risk — Immediate notification via broadcast media, posting, hand delivery</div>
        </div>
        <div className="bc-tier-card tier2">
          <div className="bc-tier-name">Tier 2</div>
          <div className="bc-tier-window">30 Days</div>
          <div className="bc-tier-desc">Non-acute violation — Mail, bill insert, or other broad distribution required</div>
        </div>
        <div className="bc-tier-card tier3">
          <div className="bc-tier-name">Tier 3</div>
          <div className="bc-tier-window">Annual (CCR)</div>
          <div className="bc-tier-desc">Include in annual Consumer Confidence Report distributed to all customers</div>
        </div>
      </div>

      {showForm && (
        <form className="bc-form" onSubmit={submit}>
          <h3>New Public Notice</h3>
          <div className="bc-form-grid">
            <div className="bc-fg"><label>System</label>
              <select value={form.systemId || ''} onChange={e => setForm(f => ({ ...f, systemId: e.target.value }))}>
                {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Notice Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as NoticeType }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as NoticeStatus }))}>
                <option>Draft</option><option>Pending Review</option><option>Issued</option>
              </select>
            </div>
            <div className="bc-fg bc-fg-full"><label>Title</label>
              <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Notification Deadline</label>
              <input type="date" value={form.deadlineDate || ''} onChange={e => setForm(f => ({ ...f, deadlineDate: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Affected Area</label>
              <input value={form.affectedArea || ''} onChange={e => setForm(f => ({ ...f, affectedArea: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Est. People Affected</label>
              <input type="number" value={form.estimatedAffected || ''} onChange={e => setForm(f => ({ ...f, estimatedAffected: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="bc-fg bc-fg-full">
              <label>Delivery Methods</label>
              <div className="bc-checkbox-row">
                {DELIVERY_OPTIONS.map(m => (
                  <label key={m} className="bc-checkbox">
                    <input type="checkbox" checked={(form.deliveryMethods || []).includes(m)} onChange={() => toggleDelivery(m)} />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div className="bc-fg bc-fg-full"><label>Notice Content</label>
              <textarea value={form.content || ''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5} required />
            </div>
          </div>
          <div className="bc-form-actions"><button type="submit" className="bc-btn-primary">Save Notice</button></div>
        </form>
      )}

      <div className="bc-toolbar">
        <div className="bc-filters">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option>Draft</option><option>Pending Review</option><option>Issued</option><option>Rescinded</option>
          </select>
          <span className="bc-count">{filtered.length} notices</span>
        </div>
      </div>

      <div className="bc-notice-list">
        {filtered.map(n => {
          const sys = systems.find(s => s.id === n.systemId);
          const expanded = expandedId === n.id;
          return (
            <div key={n.id} className={`bc-notice-card bc-notice-${n.status.toLowerCase().replace(/ /g, '-')}`}>
              <div className="bc-notice-hdr" onClick={() => setExpandedId(expanded ? null : n.id)}>
                <div className="bc-notice-left">
                  <span className={`bc-chip bc-chip-notice-${n.type.toLowerCase().replace(/[\s/]/g, '-')}`}>{n.type}</span>
                  {n.notificationLevel && <span className={`bc-chip bc-chip-${LEVEL_COLOR[n.notificationLevel]}`}>{n.notificationLevel}</span>}
                  <div>
                    <div className="bc-notice-title">{n.title || `${n.type} — ${n.affectedArea}`}</div>
                    <div className="bc-notice-meta">{sys?.name} · {n.affectedArea} · Deadline: {fmtDate(n.deadlineDate)}</div>
                  </div>
                </div>
                <div className="bc-notice-right">
                  <span className={`bc-chip bc-chip-${STATUS_COLOR[n.status]}`}>{n.status}</span>
                  {n.proofOfDelivery && <span className="bc-chip bc-chip-good">Proof ✓</span>}
                  <span className="bc-expand">{expanded ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded && (
                <div className="bc-notice-detail">
                  <p className="bc-notice-content">{n.content}</p>
                  <div className="bc-delivery-row">
                    <strong>Delivery:</strong>
                    {n.deliveryMethods.length ? n.deliveryMethods.map(m => <span key={m} className="bc-delivery-tag">{m}</span>) : <span className="bc-muted">None selected</span>}
                  </div>
                  {n.estimatedAffected > 0 && <p className="bc-detail-note">👥 {n.estimatedAffected.toLocaleString()} people affected</p>}
                  <div className="bc-detail-actions">
                    <span className="bc-detail-label">Actions:</span>
                    {(['Draft','Pending Review','Issued','Rescinded'] as NoticeStatus[]).map(s => (
                      <button key={s} className={`bc-status-btn ${n.status === s ? 'active' : ''}`}
                        onClick={() => onUpdate(n.id, { status: s, issuedDate: s === 'Issued' ? new Date().toISOString().slice(0,10) : undefined, rescindedDate: s === 'Rescinded' ? new Date().toISOString().slice(0,10) : undefined })}>
                        {s}
                      </button>
                    ))}
                    {!n.proofOfDelivery && n.status === 'Issued' && (
                      <button className="bc-status-btn bc-btn-proof" onClick={() => onUpdate(n.id, { proofOfDelivery: true, certificateGenerated: true })}>
                        ✓ Mark Delivered & Generate Certificate
                      </button>
                    )}
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
