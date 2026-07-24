import type { Facility } from '../water-types';

interface Props { facilities: Facility[] }

export default function FacilitiesView({ facilities }: Props) {
  const fmtPop = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Managed Facilities</h2>
        <span className="page-sub">{facilities.length} facilities registered</span>
      </div>
      <div className="facility-grid">
        {facilities.map(f => (
          <div key={f.id} className="facility-card">
            <div className="facility-top">
              <div>
                <div className="facility-name">{f.name}</div>
                <div className="facility-type-badge">{f.type}</div>
              </div>
              <div className="pws-id">PWS ID<br /><strong>{f.pwsId}</strong></div>
            </div>
            <div className="facility-stats">
              <div className="fstat"><span>{fmtPop(f.populationServed)}</span><span>Population Served</span></div>
              <div className="fstat"><span>{fmtPop(f.serviceConnections)}</span><span>Service Connections</span></div>
            </div>
            <div className="facility-contact">
              <div><strong>{f.contactName}</strong></div>
              <div className="muted">{f.contactEmail}</div>
              <div className="muted">{f.contactPhone}</div>
              <div className="muted">{f.county} County</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
