import { useState } from 'react';
import type { Trade, SortField, SortDir, TradeStatus } from '../types';

interface Props {
  trades: Trade[];
  onStatusChange: (id: string, status: TradeStatus) => void;
  onDelete: (id: string) => void;
}

const STATUSES: TradeStatus[] = ['Pending', 'Executed', 'Cancelled', 'Failed'];

export default function BlotterTable({ trades, onStatusChange, onDelete }: Props) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(field: SortField) {
    if (field === sortField) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  const sorted = [...trades].sort((a, b) => {
    const va = a[sortField] as string | number;
    const vb = b[sortField] as string | number;
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const arrow = (f: SortField) => sortField === f ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US') + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const fmtNum = (n: number) => n.toLocaleString('en-US');

  const notional = (t: Trade) => fmtCurrency(t.quantity * t.price);

  if (trades.length === 0) return (
    <div className="empty-state">No trades match the current filters.</div>
  );

  return (
    <div className="table-wrapper">
      <table className="blotter-table">
        <thead>
          <tr>
            {([
              ['timestamp', 'Time'],
              ['symbol', 'Symbol'],
              ['side', 'Side'],
              ['quantity', 'Qty'],
              ['price', 'Price'],
              ['assetClass', 'Asset Class'],
              ['account', 'Account'],
              ['advisor', 'Advisor'],
            ] as [SortField, string][]).map(([f, label]) => (
              <th key={f} onClick={() => handleSort(f)} className="sortable">
                {label}{arrow(f)}
              </th>
            ))}
            <th>Notional</th>
            <th>Status</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(trade => (
            <tr key={trade.id} className={`row-${trade.status.toLowerCase()}`}>
              <td className="mono">{fmtDate(trade.timestamp)}</td>
              <td className="symbol">{trade.symbol}</td>
              <td>
                <span className={`badge ${trade.side.toLowerCase()}`}>{trade.side}</span>
              </td>
              <td className="mono right">{fmtNum(trade.quantity)}</td>
              <td className="mono right">{fmtCurrency(trade.price)}</td>
              <td>{trade.assetClass}</td>
              <td className="mono">{trade.account}</td>
              <td>{trade.advisor}</td>
              <td className="mono right">{notional(trade)}</td>
              <td>
                <select
                  className={`status-select status-${trade.status.toLowerCase()}`}
                  value={trade.status}
                  onChange={e => onStatusChange(trade.id, e.target.value as TradeStatus)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="notes-cell" title={trade.notes}>{trade.notes}</td>
              <td>
                <button className="btn-delete" onClick={() => onDelete(trade.id)} title="Delete">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
