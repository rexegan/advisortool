import { useState } from 'react';
import type { VaultDocument, WaterSystem, DocCategory } from '../types';

interface Props { documents: VaultDocument[]; systems: WaterSystem[] }

const CATS: DocCategory[] = ['Permit', 'Contract', 'Lab Report', 'Engineering Report', 'Inspection', 'CCR', 'Certificate', 'Photo', 'Correspondence', 'Other'];
const CAT_ICON: Record<DocCategory, string> = { Permit: '📜', Contract: '📋', 'Lab Report': '🧪', 'Engineering Report': '⚙️', Inspection: '🔍', CCR: '📰', Certificate: '🏅', Photo: '📷', Correspondence: '✉️', Other: '📁' };

export default function DocumentVault({ documents, systems }: Props) {
  const [filterSystem, setFilterSystem] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');

  const filtered = documents
    .filter(d => !filterSystem || d.systemId === filterSystem)
    .filter(d => !filterCat || d.category === filterCat)
    .filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.includes(search.toLowerCase())))
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));

  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const expiring = documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 90 * 86400000));

  return (
    <div className="bc-view">
      <div className="bc-page-header">
        <h2>Document Vault</h2>
        <button className="bc-btn-primary" disabled title="Upload coming soon">↑ Upload Document</button>
      </div>

      {expiring.length > 0 && (
        <div className="bc-alert bc-alert-warning" style={{ marginBottom: 16 }}>
          <span>⚠️</span>
          <div><strong>{expiring.length} document(s) expiring within 90 days</strong>
            <p>{expiring.map(d => d.name).join(', ')}</p>
          </div>
        </div>
      )}

      <div className="bc-vault-cats">
        {CATS.map(c => {
          const count = documents.filter(d => d.category === c).length;
          return (
            <button key={c} className={`bc-vault-cat ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(filterCat === c ? '' : c)}>
              <span>{CAT_ICON[c]}</span>
              <span>{c}</span>
              <span className="bc-vault-cat-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="bc-toolbar">
        <div className="bc-filters">
          <input className="bc-search" placeholder="Search documents…" value={search} onChange={e => setSearch(e.target.value)} />
          <select value={filterSystem} onChange={e => setFilterSystem(e.target.value)}>
            <option value="">All Systems</option>
            {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <span className="bc-count">{filtered.length} documents</span>
        </div>
      </div>

      <div className="bc-vault-list">
        {filtered.map(doc => {
          const sys = systems.find(s => s.id === doc.systemId);
          const expired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
          const expiringSoon = doc.expiryDate && !expired && new Date(doc.expiryDate) < new Date(Date.now() + 90 * 86400000);
          return (
            <div key={doc.id} className="bc-vault-doc">
              <div className="bc-doc-icon">{CAT_ICON[doc.category]}</div>
              <div className="bc-doc-info">
                <div className="bc-doc-name">{doc.name}</div>
                <div className="bc-doc-meta">{sys?.name} · {doc.category} · {doc.fileSize} · Uploaded by {doc.uploadedBy}</div>
                <div className="bc-doc-tags">{doc.tags.map(t => <span key={t} className="bc-tag">{t}</span>)}</div>
              </div>
              <div className="bc-doc-right">
                <div className="bc-doc-date">Uploaded {fmtDate(doc.uploadDate)}</div>
                {doc.expiryDate && (
                  <div className={`bc-doc-expiry ${expired ? 'danger' : expiringSoon ? 'warning' : 'muted'}`}>
                    {expired ? '⚠️ Expired' : 'Expires'} {fmtDate(doc.expiryDate)}
                  </div>
                )}
                <button className="bc-doc-btn" disabled>View</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="bc-empty"><div className="bc-empty-icon">🗂️</div><div>No documents found.</div></div>}
      </div>
    </div>
  );
}
