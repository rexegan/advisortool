import { useState } from 'react';
import type { WaterUsageRecord, Facility } from '../water-types';

interface Props {
  records: WaterUsageRecord[];
  facilities: Facility[];
  onAdd: (r: WaterUsageRecord) => void;
}

const empty = (): Partial<WaterUsageRecord> => ({
  month: '', productionGallons: 0, purchasedGallons: 0,
  distributedGallons: 0, billableConnections: 0,
  nonRevenueWater: 0, avgDailyGallons: 0, notes: '',
});

export default function WaterUsage({ records, facilities, onAdd }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<WaterUsageRecord>>(empty());
  const [filterFacility, setFilterFacility] = useState('');

  const filtered = records
    .filter(r => !filterFacility || r.facilityId === filterFacility)
    .sort((a, b) => b.month.localeCompare(a.month));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ ...empty(), ...form, id: crypto.randomUUID(), facilityId: form.facilityId || facilities[0].id } as WaterUsageRecord);
    setForm(empty());
    setShowForm(false);
  }

  const fmtGal = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(3)}M` : `${(n / 1000).toFixed(1)}K`;

  const nrwPct = (r: WaterUsageRecord) => {
    const total = r.distributedGallons + r.nonRevenueWater;
    return total > 0 ? ((r.nonRevenueWater / total) * 100).toFixed(1) + '%' : '—';
  };

  const num = (key: keyof WaterUsageRecord) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: parseInt(e.target.value) || 0 }));

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Water Usage & Production</h2>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Add Monthly Record'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={submit}>
          <h3>New Monthly Record</h3>
          <div className="form-grid-3">
            <div className="fg"><label>Facility</label>
              <select value={form.facilityId || ''} onChange={e => setForm(f => ({ ...f, facilityId: e.target.value }))}>
                {facilities.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
              </select>
            </div>
            <div className="fg"><label>Month (YYYY-MM)</label>
              <input type="month" value={form.month || ''} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} required />
            </div>
            <div className="fg"><label>Production (gal)</label>
              <input type="number" value={form.productionGallons || ''} onChange={num('productionGallons')} placeholder="0 if purchased" />
            </div>
            <div className="fg"><label>Purchased (gal)</label>
              <input type="number" value={form.purchasedGallons || ''} onChange={num('purchasedGallons')} placeholder="0 if self-produced" />
            </div>
            <div className="fg"><label>Distributed (gal)</label>
              <input type="number" value={form.distributedGallons || ''} onChange={num('distributedGallons')} required />
            </div>
            <div className="fg"><label>Non-Revenue Water (gal)</label>
              <input type="number" value={form.nonRevenueWater || ''} onChange={num('nonRevenueWater')} />
            </div>
            <div className="fg"><label>Avg Daily (gal/day)</label>
              <input type="number" value={form.avgDailyGallons || ''} onChange={num('avgDailyGallons')} />
            </div>
            <div className="fg"><label>Billable Connections</label>
              <input type="number" value={form.billableConnections || ''} onChange={num('billableConnections')} />
            </div>
            <div className="fg full"><label>Notes</label>
              <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
            </div>
          </div>
          <div className="form-actions"><button type="submit" className="btn-primary">Save Record</button></div>
        </form>
      )}

      <div className="filter-row">
        <select value={filterFacility} onChange={e => setFilterFacility(e.target.value)}>
          <option value="">All Facilities</option>
          {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <span className="filter-count">{filtered.length} records</span>
      </div>

      {/* Usage cards */}
      <div className="usage-grid">
        {filtered.map(r => {
          const fac = facilities.find(f => f.id === r.facilityId);
          const pct = parseFloat(nrwPct(r));
          const nrwBad = pct > 15;
          return (
            <div key={r.id} className="usage-card">
              <div className="usage-card-header">
                <div>
                  <div className="usage-facility">{fac?.name}</div>
                  <div className="usage-month">{new Date(r.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                </div>
                <span className={`nrw-badge ${nrwBad ? 'nrw-bad' : 'nrw-good'}`}>NRW {nrwPct(r)}</span>
              </div>
              <div className="usage-stats">
                <div className="ustat">
                  <div className="ustat-val">{fmtGal(r.productionGallons + r.purchasedGallons)} gal</div>
                  <div className="ustat-lbl">Total Supply</div>
                </div>
                <div className="ustat">
                  <div className="ustat-val">{fmtGal(r.distributedGallons)} gal</div>
                  <div className="ustat-lbl">Distributed</div>
                </div>
                <div className="ustat">
                  <div className="ustat-val">{fmtGal(r.avgDailyGallons)} gal/day</div>
                  <div className="ustat-lbl">Avg Daily</div>
                </div>
                <div className="ustat">
                  <div className="ustat-val">{r.billableConnections.toLocaleString()}</div>
                  <div className="ustat-lbl">Connections</div>
                </div>
              </div>
              {/* NRW bar */}
              <div className="nrw-bar-wrap">
                <div className="nrw-bar-track">
                  <div className="nrw-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: nrwBad ? '#dc2626' : '#16a34a' }} />
                </div>
                <span className="nrw-label">{fmtGal(r.nonRevenueWater)} gal non-revenue</span>
              </div>
              {r.notes && <p className="usage-notes">{r.notes}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
