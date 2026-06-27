import type { Trade } from '../types';

export interface FilterState {
  search: string;
  side: string;
  assetClass: string;
  status: string;
  account: string;
}

interface Props {
  filters: FilterState;
  trades: Trade[];
  onChange: (f: FilterState) => void;
}

export default function Filters({ filters, trades, onChange }: Props) {
  const accounts = Array.from(new Set(trades.map(t => t.account))).sort();
  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="filters">
      <input
        className="search-input"
        placeholder="Search symbol, advisor, notes..."
        value={filters.search}
        onChange={set('search')}
      />
      <select value={filters.side} onChange={set('side')}>
        <option value="">All Sides</option>
        <option>BUY</option>
        <option>SELL</option>
      </select>
      <select value={filters.assetClass} onChange={set('assetClass')}>
        <option value="">All Asset Classes</option>
        {['Equity', 'Fixed Income', 'ETF', 'Option', 'Mutual Fund', 'Cash'].map(a => (
          <option key={a}>{a}</option>
        ))}
      </select>
      <select value={filters.status} onChange={set('status')}>
        <option value="">All Statuses</option>
        {['Pending', 'Executed', 'Cancelled', 'Failed'].map(s => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <select value={filters.account} onChange={set('account')}>
        <option value="">All Accounts</option>
        {accounts.map(a => <option key={a}>{a}</option>)}
      </select>
    </div>
  );
}
