import type { Trade } from '../types';

interface Props { trades: Trade[] }

export default function SummaryBar({ trades }: Props) {
  const executed = trades.filter(t => t.status === 'Executed');
  const pending = trades.filter(t => t.status === 'Pending');
  const buys = executed.filter(t => t.side === 'BUY');
  const sells = executed.filter(t => t.side === 'SELL');
  const buyNotional = buys.reduce((s, t) => s + t.quantity * t.price, 0);
  const sellNotional = sells.reduce((s, t) => s + t.quantity * t.price, 0);
  const netExposure = buyNotional - sellNotional;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

  return (
    <div className="summary-bar">
      <div className="stat">
        <span className="stat-value">{trades.length}</span>
        <span className="stat-label">Total Trades</span>
      </div>
      <div className="stat">
        <span className="stat-value executed">{executed.length}</span>
        <span className="stat-label">Executed</span>
      </div>
      <div className="stat">
        <span className="stat-value pending">{pending.length}</span>
        <span className="stat-label">Pending</span>
      </div>
      <div className="stat">
        <span className="stat-value buy">{fmt(buyNotional)}</span>
        <span className="stat-label">Buy Notional</span>
      </div>
      <div className="stat">
        <span className="stat-value sell">{fmt(sellNotional)}</span>
        <span className="stat-label">Sell Notional</span>
      </div>
      <div className="stat">
        <span className={`stat-value ${netExposure >= 0 ? 'buy' : 'sell'}`}>{fmt(netExposure)}</span>
        <span className="stat-label">Net Exposure</span>
      </div>
    </div>
  );
}
