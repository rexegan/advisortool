import type { Vendor } from '../types';

interface Props { vendors: Vendor[] }

const TYPE_ICON: Record<string, string> = { 'Testing Lab': '🧪', Engineer: '⚙️', Operator: '👷', 'State Agency': '🏛️', Contractor: '🔧', Supplier: '📦', Consultant: '💼' };

export default function Vendors({ vendors }: Props) {
  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined;
  const expiring = (iso?: string) => iso && new Date(iso) < new Date(Date.now() + 90 * 86400000);

  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Vendors & Labs</h2>
        <button className="bc-btn-primary" disabled>+ Add Vendor</button>
      </div>
      <div className="bc-vendor-grid">
        {vendors.map(v => (
          <div key={v.id} className="bc-vendor-card">
            <div className="bc-vendor-top">
              <span className="bc-vendor-icon">{TYPE_ICON[v.type] || '🤝'}</span>
              <div>
                <div className="bc-vendor-name">{v.name}</div>
                <div className="bc-vendor-type">{v.type}</div>
              </div>
            </div>
            <div className="bc-vendor-contact">
              <div>{v.contactName}</div>
              <div className="bc-muted">{v.email}</div>
              <div className="bc-muted">{v.phone}</div>
              <div className="bc-muted">{v.serviceArea}</div>
            </div>
            {v.certNumber && (
              <div className={`bc-vendor-cert ${expiring(v.certExpiry) ? 'warning' : ''}`}>
                <span>Cert #{v.certNumber}</span>
                {v.certExpiry && <span className="bc-muted"> · Exp {fmtDate(v.certExpiry)}</span>}
                {expiring(v.certExpiry) && <span className="bc-chip bc-chip-warning" style={{ marginLeft: 6 }}>Expiring</span>}
              </div>
            )}
            {v.notes && <p className="bc-vendor-notes">{v.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
