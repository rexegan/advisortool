import React, { useState } from 'react';
import type { Trade, Side, AssetClass, TradeStatus } from '../types';

interface Props {
  onAdd: (trade: Trade) => void;
}

const defaultForm = {
  symbol: '',
  side: 'BUY' as Side,
  quantity: '',
  price: '',
  assetClass: 'Equity' as AssetClass,
  account: '',
  advisor: '',
  status: 'Pending' as TradeStatus,
  notes: '',
};

export default function TradeForm({ onAdd }: Props) {
  const [form, setForm] = useState(defaultForm);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.symbol.trim()) e.symbol = 'Required';
    if (!form.account.trim()) e.account = 'Required';
    if (!form.advisor.trim()) e.advisor = 'Required';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      e.quantity = 'Must be > 0';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Must be > 0';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      symbol: form.symbol.toUpperCase().trim(),
      side: form.side,
      quantity: Number(form.quantity),
      price: Number(form.price),
      assetClass: form.assetClass,
      account: form.account.trim(),
      advisor: form.advisor.trim(),
      status: form.status,
      notes: form.notes.trim(),
    });
    setForm(defaultForm);
    setErrors({});
    setOpen(false);
  }

  const field = (label: string, key: keyof typeof defaultForm, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key] as string}
        onChange={ev => setForm(f => ({ ...f, [key]: ev.target.value }))}
        className={errors[key] ? 'error' : ''}
      />
      {errors[key] && <span className="err-msg">{errors[key]}</span>}
    </div>
  );

  const select = (label: string, key: keyof typeof defaultForm, options: string[]) => (
    <div className="form-group">
      <label>{label}</label>
      <select value={form[key] as string} onChange={ev => setForm(f => ({ ...f, [key]: ev.target.value }))}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="trade-form-container">
      <button className="btn-primary" onClick={() => setOpen(o => !o)}>
        {open ? '✕ Cancel' : '+ New Trade'}
      </button>
      {open && (
        <form className="trade-form" onSubmit={handleSubmit}>
          <h3>Enter Trade</h3>
          <div className="form-grid">
            {field('Symbol', 'symbol', 'text', 'e.g. AAPL')}
            {select('Side', 'side', ['BUY', 'SELL'])}
            {field('Quantity', 'quantity', 'number', '0')}
            {field('Price ($)', 'price', 'number', '0.00')}
            {select('Asset Class', 'assetClass', ['Equity', 'Fixed Income', 'ETF', 'Option', 'Mutual Fund', 'Cash'])}
            {field('Account', 'account', 'text', 'ACC-XXXX')}
            {field('Advisor', 'advisor', 'text', 'Name')}
            {select('Status', 'status', ['Pending', 'Executed', 'Cancelled', 'Failed'])}
          </div>
          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={ev => setForm(f => ({ ...f, notes: ev.target.value }))}
              rows={2}
              placeholder="Optional notes..."
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Submit Trade</button>
          </div>
        </form>
      )}
    </div>
  );
}
