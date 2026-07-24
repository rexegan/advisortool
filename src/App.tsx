import { useState, useMemo } from 'react';
import type { Trade, TradeStatus } from './types';
import { sampleTrades } from './sampleData';
import TradeForm from './components/TradeForm';
import BlotterTable from './components/BlotterTable';
import SummaryBar from './components/SummaryBar';
import Filters, { type FilterState } from './components/Filters';
import { exportCsv } from './utils/exportCsv';
import './App.css';

const defaultFilters: FilterState = { search: '', side: '', assetClass: '', status: '', account: '' };

export default function App() {
  const [trades, setTrades] = useState<Trade[]>(sampleTrades);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filtered = useMemo(() => trades.filter(t => {
    const q = filters.search.toLowerCase();
    if (q && !t.symbol.toLowerCase().includes(q) && !t.advisor.toLowerCase().includes(q) && !t.notes.toLowerCase().includes(q)) return false;
    if (filters.side && t.side !== filters.side) return false;
    if (filters.assetClass && t.assetClass !== filters.assetClass) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.account && t.account !== filters.account) return false;
    return true;
  }), [trades, filters]);

  const addTrade = (t: Trade) => setTrades(ts => [t, ...ts]);
  const updateStatus = (id: string, status: TradeStatus) =>
    setTrades(ts => ts.map(t => t.id === id ? { ...t, status } : t));
  const deleteTrade = (id: string) =>
    setTrades(ts => ts.filter(t => t.id !== id));

  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <div>
              <h1>Trade Blotter</h1>
              <p className="subtitle">Financial Advisor Portal</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <a href="/water" className="btn-ghost-link">💧 AquaComply TX</a>
          <span className="trade-count">{filtered.length} of {trades.length} trades</span>
          <button className="btn-secondary" onClick={() => exportCsv(filtered)}>
            ↓ Export CSV
          </button>
        </div>
      </header>

      <main className="app-main">
        <SummaryBar trades={filtered} />

        <div className="controls">
          <TradeForm onAdd={addTrade} />
          <div className="filter-section">
            <Filters filters={filters} trades={trades} onChange={setFilters} />
            {activeFilters > 0 && (
              <button className="btn-ghost" onClick={() => setFilters(defaultFilters)}>
                Clear filters ({activeFilters})
              </button>
            )}
          </div>
        </div>

        <BlotterTable trades={filtered} onStatusChange={updateStatus} onDelete={deleteTrade} />
      </main>

      <footer className="app-footer">
        <span>Trade Blotter v1.0 &nbsp;·&nbsp; For advisor use only &nbsp;·&nbsp; Not for client distribution</span>
      </footer>
    </div>
  );
}
