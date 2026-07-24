import { useState } from 'react';
import type { ComplianceTask, WaterSystem, TaskFrequency, TaskCategory, TaskStatus } from '../types';
import { daysUntil } from '../utils/compliance';

interface Props {
  tasks: ComplianceTask[];
  systems: WaterSystem[];
  onUpdate: (id: string, patch: Partial<ComplianceTask>) => void;
  onAdd: (t: ComplianceTask) => void;
}

const FREQUENCIES: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual', '3-Year', '9-Year', 'One-Time'];
const CATEGORIES: TaskCategory[] = ['Sampling', 'Reporting', 'Treatment', 'Inspection', 'Certification', 'Fee', 'Public Notification', 'Training'];
const STATUSES: TaskStatus[] = ['Upcoming', 'Due Soon', 'In Progress', 'Overdue', 'Completed', 'Waived'];

const FREQ_ORDER: Record<TaskFrequency, number> = { Daily: 0, Weekly: 1, Monthly: 2, Quarterly: 3, Annual: 4, 'One-Time': 5, '3-Year': 6, '9-Year': 7 };

const CAT_ICON: Record<TaskCategory, string> = {
  Sampling: '🧪', Reporting: '📄', Treatment: '⚗️', Inspection: '🔍',
  Certification: '🏅', Fee: '💰', 'Public Notification': '📢', Training: '📚',
};

export default function ComplianceCalendar({ tasks, systems, onUpdate, onAdd }: Props) {
  const [groupBy, setGroupBy] = useState<'frequency' | 'status' | 'system'>('frequency');
  const [filterSystem, setFilterSystem] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ComplianceTask>>({ frequency: 'Monthly', category: 'Reporting', status: 'Upcoming', documents: [], auditTrail: [], notes: '', responsiblePerson: '' });

  const filtered = tasks
    .filter(t => !filterSystem || t.systemId === filterSystem)
    .filter(t => !filterCategory || t.category === filterCategory)
    .filter(t => !filterStatus || t.status === filterStatus);

  // Group tasks
  const grouped: Record<string, ComplianceTask[]> = {};
  if (groupBy === 'frequency') {
    FREQUENCIES.forEach(f => {
      const items = filtered.filter(t => t.frequency === f).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      if (items.length) grouped[f] = items;
    });
  } else if (groupBy === 'status') {
    STATUSES.forEach(s => {
      const items = filtered.filter(t => t.status === s).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      if (items.length) grouped[s] = items;
    });
  } else {
    systems.forEach(sys => {
      const items = filtered.filter(t => t.systemId === sys.id).sort((a, b) => FREQ_ORDER[a.frequency] - FREQ_ORDER[b.frequency]);
      if (items.length) grouped[sys.name] = items;
    });
  }

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtDays = (iso: string) => { const d = daysUntil(iso); return d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? 'Today' : `in ${d}d`; };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...form, id: crypto.randomUUID(), systemId: form.systemId || systems[0].id, documents: [], auditTrail: [], notes: form.notes || '', responsiblePerson: form.responsiblePerson || '' } as ComplianceTask);
    setForm({ frequency: 'Monthly', category: 'Reporting', status: 'Upcoming', documents: [], auditTrail: [], notes: '', responsiblePerson: '' });
    setShowForm(false);
  }

  const markComplete = (t: ComplianceTask) => {
    onUpdate(t.id, {
      status: 'Completed',
      completedDate: new Date().toISOString().slice(0, 10),
      auditTrail: [...t.auditTrail, { timestamp: new Date().toISOString(), actor: 'User', action: 'Marked Completed' }],
    });
  };

  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Compliance Calendar</h2>
        <button className="bc-btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form className="bc-form" onSubmit={submit}>
          <h3>New Compliance Task</h3>
          <div className="bc-form-grid">
            <div className="bc-fg"><label>System</label>
              <select value={form.systemId || ''} onChange={e => setForm(f => ({ ...f, systemId: e.target.value }))}>
                {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Title</label>
              <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as TaskCategory }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Frequency</label>
              <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value as TaskFrequency }))}>
                {FREQUENCIES.map(fr => <option key={fr}>{fr}</option>)}
              </select>
            </div>
            <div className="bc-fg"><label>Due Date</label>
              <input type="date" value={form.dueDate || ''} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
            </div>
            <div className="bc-fg"><label>Responsible Person</label>
              <input value={form.responsiblePerson || ''} onChange={e => setForm(f => ({ ...f, responsiblePerson: e.target.value }))} />
            </div>
            <div className="bc-fg"><label>TCEQ Rule Ref</label>
              <input value={form.tceqRuleRef || ''} onChange={e => setForm(f => ({ ...f, tceqRuleRef: e.target.value }))} placeholder="e.g. 30 TAC §290.109" />
            </div>
            <div className="bc-fg"><label>TCEQ Form #</label>
              <input value={form.tceqFormNumber || ''} onChange={e => setForm(f => ({ ...f, tceqFormNumber: e.target.value }))} />
            </div>
            <div className="bc-fg bc-fg-full"><label>Description</label>
              <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
          </div>
          <div className="bc-form-actions"><button type="submit" className="bc-btn-primary">Save Task</button></div>
        </form>
      )}

      {/* Controls */}
      <div className="bc-toolbar">
        <div className="bc-group-tabs">
          {(['frequency', 'status', 'system'] as const).map(g => (
            <button key={g} className={`bc-tab ${groupBy === g ? 'active' : ''}`} onClick={() => setGroupBy(g)}>
              {g === 'frequency' ? 'By Frequency' : g === 'status' ? 'By Status' : 'By System'}
            </button>
          ))}
        </div>
        <div className="bc-filters">
          <select value={filterSystem} onChange={e => setFilterSystem(e.target.value)}>
            <option value="">All Systems</option>
            {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="bc-count">{filtered.length} tasks</span>
        </div>
      </div>

      {/* Groups */}
      <div className="bc-calendar-groups">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="bc-cal-group">
            <div className="bc-cal-group-header">
              <span className="bc-cal-group-label">{group}</span>
              <span className="bc-cal-group-count">{items.length}</span>
            </div>
            <div className="bc-task-list">
              {items.map(task => {
                const sys = systems.find(s => s.id === task.systemId);
                const expanded = expandedId === task.id;
                const days = daysUntil(task.dueDate);
                return (
                  <div key={task.id} className={`bc-task-card bc-task-${task.status.toLowerCase().replace(/ /g, '-')}`}>
                    <div className="bc-task-main" onClick={() => setExpandedId(expanded ? null : task.id)}>
                      <span className="bc-task-cat-icon">{CAT_ICON[task.category]}</span>
                      <div className="bc-task-body">
                        <div className="bc-task-title">{task.title}</div>
                        <div className="bc-task-meta">
                          {sys?.name} · {task.category}
                          {task.tceqRuleRef && <span className="bc-rule-ref"> · {task.tceqRuleRef}</span>}
                          {task.responsiblePerson && <span> · {task.responsiblePerson}</span>}
                        </div>
                      </div>
                      <div className="bc-task-right">
                        <div className="bc-task-date">{fmtDate(task.dueDate)}</div>
                        <div className={`bc-task-days ${days < 0 ? 'danger' : days <= 7 ? 'warning' : 'muted'}`}>{fmtDays(task.dueDate)}</div>
                        <span className={`bc-chip bc-chip-${task.status.toLowerCase().replace(/ /g, '-')}`}>{task.status}</span>
                        <span className="bc-expand">{expanded ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expanded && (
                      <div className="bc-task-detail">
                        {task.description && <p className="bc-task-desc">{task.description}</p>}
                        {task.notes && <p className="bc-detail-note">📝 {task.notes}</p>}
                        {task.windowStart && <p className="bc-detail-note">📆 Collection window: {fmtDate(task.windowStart)} – {fmtDate(task.windowEnd!)}</p>}
                        <div className="bc-detail-actions">
                          <span className="bc-detail-label">Update status:</span>
                          {STATUSES.map(s => (
                            <button key={s} className={`bc-status-btn ${task.status === s ? 'active' : ''}`}
                              onClick={() => s === 'Completed' ? markComplete(task) : onUpdate(task.id, { status: s })}>
                              {s}
                            </button>
                          ))}
                        </div>
                        {task.auditTrail.length > 0 && (
                          <div className="bc-audit-trail">
                            {task.auditTrail.map((e, i) => (
                              <div key={i} className="bc-audit-item">
                                <span className="bc-audit-time">{new Date(e.timestamp).toLocaleDateString()}</span>
                                <span>{e.actor} — {e.action}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
