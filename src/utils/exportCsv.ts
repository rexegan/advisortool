import type { Trade } from '../types';

export function exportCsv(trades: Trade[]) {
  const headers = ['ID', 'Timestamp', 'Symbol', 'Side', 'Quantity', 'Price', 'Notional', 'Asset Class', 'Account', 'Advisor', 'Status', 'Notes'];
  const rows = trades.map(t => [
    t.id, t.timestamp, t.symbol, t.side,
    t.quantity, t.price, (t.quantity * t.price).toFixed(2),
    t.assetClass, t.account, t.advisor, t.status,
    `"${t.notes.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trade-blotter-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
