import { useState, useMemo } from "react";
import type { ReactNode } from "react";

// ── Design tokens — light & bright ────────────────────────────────────────────
const C = {
  bg:        "#f4f6fb",
  surface:   "#ffffff",
  surfaceAlt:"#f8fafd",
  border:    "#dde3ef",
  navy:      "#1a3260",
  navyLight: "#2a4a8a",
  accent:    "#2563eb",
  accentLt:  "#eff4ff",
  text:      "#111827",
  textMid:   "#374151",
  muted:     "#6b7280",
  green:     "#16a34a",
  greenLt:   "#f0fdf4",
  red:       "#dc2626",
  redLt:     "#fef2f2",
  gold:      "#b45309",
  goldLt:    "#fffbeb",
  purple:    "#7c3aed",
  purpleLt:  "#f5f3ff",
  sky:       "#0284c7",
  skyLt:     "#f0f9ff",
  orange:    "#ea580c",
  orangeLt:  "#fff7ed",
  teal:      "#0d9488",
  tealLt:    "#f0fdfa",
};

// ── Types ──────────────────────────────────────────────────────────────────────
type ProductType =
  | "Mutual Fund" | "Variable Annuity" | "Fixed Index Annuity"
  | "Fixed Annuity" | "Life Insurance" | "Stock / ETF" | "Bond"
  | "REIT" | "Oil & Gas" | "Alternative Investment" | "Other";

type TxType =
  | "Purchase" | "Sale" | "1035 Exchange" | "Rollover / Transfer"
  | "Surrender" | "Death Benefit" | "Systematic Withdrawal"
  | "Premium Payment" | "Reallocation" | "Other";

type TxStatus =
  | "Pending" | "Submitted" | "In Review" | "Approved"
  | "Issued / Funded" | "Declined" | "Cancelled";

interface Trade {
  id: string;
  client: string;
  account: string;
  carrier: string;
  product: string;
  productType: ProductType;
  txType: TxType;
  amount: string;
  submittedDate: string;
  status: TxStatus;
  advisor: string;
  notes: string;
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const SEED: Trade[] = [
  { id: uid(), client: "Johnson, Michael & Karen", account: "IRA-4821", carrier: "Allianz Life", product: "222+ Accumulation FIA", productType: "Fixed Index Annuity", txType: "Purchase", amount: "$250,000", submittedDate: "2025-06-10", status: "Issued / Funded", advisor: "Rex Russell", notes: "IRA rollover from Fidelity. 10-yr surrender." },
  { id: uid(), client: "Williams, David", account: "NQ-3302", carrier: "Pacific Life", product: "Pacific Index Choice", productType: "Variable Annuity", txType: "Purchase", amount: "$175,000", submittedDate: "2025-06-18", status: "In Review", advisor: "Rex Russell", notes: "Non-qualified funds. Waiting on suitability approval." },
  { id: uid(), client: "Martinez, Rosa", account: "ROTH-0091", carrier: "American Funds", product: "Growth Fund of America", productType: "Mutual Fund", txType: "Purchase", amount: "$50,000", submittedDate: "2025-06-20", status: "Issued / Funded", advisor: "Rex Russell", notes: "Roth IRA contribution + rollover." },
  { id: uid(), client: "Thompson, James", account: "BROK-7741", carrier: "Nationwide", product: "New Heights 9 FIA", productType: "Fixed Index Annuity", txType: "1035 Exchange", amount: "$320,000", submittedDate: "2025-06-22", status: "Submitted", advisor: "Rex Russell", notes: "1035 from old Lincoln annuity. Surrender charge waiver applied." },
  { id: uid(), client: "Lee, Susan", account: "IRA-5509", carrier: "North American", product: "10-Year MYG Annuity", productType: "Fixed Annuity", txType: "Rollover / Transfer", amount: "$95,000", submittedDate: "2025-06-25", status: "Approved", advisor: "Rex Russell", notes: "Direct rollover from 401(k)." },
  { id: uid(), client: "Garcia, Robert & Linda", account: "TRUST-1183", carrier: "Transamerica", product: "20-Year Term Life", productType: "Life Insurance", txType: "Purchase", amount: "$2,500/yr", submittedDate: "2025-07-01", status: "In Review", advisor: "Rex Russell", notes: "$2M face amount. Paramedical exam scheduled." },
  { id: uid(), client: "Chen, William", account: "IRA-8842", carrier: "Hines Real Estate", product: "Hines Real Estate Income Trust", productType: "REIT", txType: "Purchase", amount: "$100,000", submittedDate: "2025-07-05", status: "Pending", advisor: "Rex Russell", notes: "Alternative allocation. Accredited investor confirmed." },
  { id: uid(), client: "Anderson, Patricia", account: "NQ-6614", carrier: "American Equity", product: "AssetShield 10", productType: "Fixed Index Annuity", txType: "Purchase", amount: "$200,000", submittedDate: "2025-07-08", status: "Submitted", advisor: "Rex Russell", notes: "CDSC-free. Income rider elected." },
  { id: uid(), client: "Wilson, Thomas", account: "BROK-3390", carrier: "Parker Drilling Partners", product: "2025 Oil & Gas Program", productType: "Oil & Gas", txType: "Purchase", amount: "$50,000", submittedDate: "2025-07-10", status: "Pending", advisor: "Rex Russell", notes: "Tax deduction strategy. Accredited investor." },
  { id: uid(), client: "Davis, Margaret", account: "IRA-2278", carrier: "Vanguard", product: "Total Stock Market Index", productType: "Mutual Fund", txType: "Reallocation", amount: "$130,000", submittedDate: "2025-07-12", status: "Issued / Funded", advisor: "Rex Russell", notes: "Portfolio rebalance — shifted from bonds to equity." },
];

const PRODUCT_TYPES: ProductType[] = [
  "Mutual Fund","Variable Annuity","Fixed Index Annuity","Fixed Annuity",
  "Life Insurance","Stock / ETF","Bond","REIT","Oil & Gas","Alternative Investment","Other"
];
const TX_TYPES: TxType[] = [
  "Purchase","Sale","1035 Exchange","Rollover / Transfer","Surrender",
  "Death Benefit","Systematic Withdrawal","Premium Payment","Reallocation","Other"
];
const STATUSES: TxStatus[] = [
  "Pending","Submitted","In Review","Approved","Issued / Funded","Declined","Cancelled"
];

// ── Badges ─────────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<TxStatus, { bg: string; color: string }> = {
  "Pending":         { bg: C.goldLt,   color: C.gold   },
  "Submitted":       { bg: C.skyLt,    color: C.sky    },
  "In Review":       { bg: C.purpleLt, color: C.purple },
  "Approved":        { bg: C.accentLt, color: C.accent },
  "Issued / Funded": { bg: C.greenLt,  color: C.green  },
  "Declined":        { bg: C.redLt,    color: C.red    },
  "Cancelled":       { bg: "#f3f4f6",  color: C.muted  },
};

const PRODUCT_COLORS: Partial<Record<ProductType, { bg: string; color: string }>> = {
  "Mutual Fund":           { bg: C.accentLt,  color: C.accent   },
  "Variable Annuity":      { bg: C.purpleLt,  color: C.purple   },
  "Fixed Index Annuity":   { bg: C.skyLt,     color: C.sky      },
  "Fixed Annuity":         { bg: C.tealLt,    color: C.teal     },
  "Life Insurance":        { bg: C.greenLt,   color: C.green    },
  "Stock / ETF":           { bg: C.accentLt,  color: C.navyLight},
  "Bond":                  { bg: "#f3f4f6",   color: C.textMid  },
  "REIT":                  { bg: C.orangeLt,  color: C.orange   },
  "Oil & Gas":             { bg: C.goldLt,    color: C.gold     },
  "Alternative Investment":{ bg: C.redLt,     color: "#9f1239"  },
  "Other":                 { bg: "#f3f4f6",   color: C.muted    },
};

function Badge({ children, bg, color }: { children: ReactNode; bg: string; color: string }) {
  return (
    <span style={{ background: bg, color, borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: TxStatus }) {
  const s = STATUS_COLORS[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {status}
    </span>
  );
}

// ── Summary stats ─────────────────────────────────────────────────────────────
function SummaryBar({ trades }: { trades: Trade[] }) {
  const by = (s: TxStatus) => trades.filter(t => t.status === s).length;
  const stats = [
    { label: "Total",            value: trades.length,                                            color: C.navy   },
    { label: "Issued / Funded",  value: by("Issued / Funded"),                                   color: C.green  },
    { label: "In Progress",      value: by("Submitted") + by("In Review") + by("Approved"),      color: C.accent },
    { label: "Pending",          value: by("Pending"),                                            color: C.gold   },
    { label: "Declined / Cancelled", value: by("Declined") + by("Cancelled"),                    color: C.red    },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", borderTop: `3px solid ${s.color}` }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Add / Edit modal ───────────────────────────────────────────────────────────
const BLANK: Omit<Trade, "id"> = {
  client: "", account: "", carrier: "", product: "",
  productType: "Mutual Fund", txType: "Purchase",
  amount: "", submittedDate: new Date().toISOString().slice(0, 10),
  status: "Pending", advisor: "Rex Russell", notes: "",
};

function TradeModal({ trade, onSave, onClose }: { trade: Partial<Trade>; onSave: (t: Trade) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Trade, "id">>({ ...BLANK, ...trade });
  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const inp: React.CSSProperties = {
    width: "100%", padding: "8px 12px", border: `1.5px solid ${C.border}`,
    borderRadius: 7, fontSize: 14, color: C.text, background: C.surface,
    outline: "none", fontFamily: "inherit",
  };
  const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 4, display: "block" };

  const Row = ({ children }: { children: ReactNode }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>
  );
  const F = ({ label, children }: { label: string; children: ReactNode }) => (
    <div><label style={lbl}>{label}</label>{children}</div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.surface, borderRadius: 14, width: 680, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: C.navy }}>{(trade as Trade).id ? "Edit Transaction" : "New Transaction"}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <Row>
            <F label="Client Name"><input style={inp} value={form.client} onChange={set("client")} placeholder="Last, First" /></F>
            <F label="Account #"><input style={inp} value={form.account} onChange={set("account")} placeholder="IRA-XXXX" /></F>
          </Row>
          <Row>
            <F label="Carrier / Company"><input style={inp} value={form.carrier} onChange={set("carrier")} placeholder="e.g. Allianz, Vanguard" /></F>
            <F label="Product Name"><input style={inp} value={form.product} onChange={set("product")} placeholder="e.g. 222+ FIA" /></F>
          </Row>
          <Row>
            <F label="Product Type">
              <select style={inp} value={form.productType} onChange={set("productType")}>
                {PRODUCT_TYPES.map(p => <option key={p}>{p}</option>)}
              </select>
            </F>
            <F label="Transaction Type">
              <select style={inp} value={form.txType} onChange={set("txType")}>
                {TX_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </F>
          </Row>
          <Row>
            <F label="Amount / Premium"><input style={inp} value={form.amount} onChange={set("amount")} placeholder="$0" /></F>
            <F label="Date Submitted"><input style={inp} type="date" value={form.submittedDate} onChange={set("submittedDate")} /></F>
          </Row>
          <Row>
            <F label="Status">
              <select style={inp} value={form.status} onChange={set("status")}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </F>
            <F label="Advisor"><input style={inp} value={form.advisor} onChange={set("advisor")} /></F>
          </Row>
          <F label="Notes">
            <textarea style={{ ...inp, height: 72, resize: "vertical" }} value={form.notes} onChange={set("notes")} />
          </F>
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "8px 20px", borderRadius: 7, border: `1.5px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
          <button onClick={() => onSave({ ...form, id: (trade as Trade).id || uid() })}
            style={{ padding: "8px 22px", borderRadius: 7, border: "none", background: C.accent, color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function TradeBlotter() {
  const [trades, setTrades] = useState<Trade[]>(SEED);
  const [modal, setModal] = useState<Partial<Trade> | null>(null);
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTx, setFilterTx] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => trades.filter(t => {
    const q = search.toLowerCase();
    if (q && ![t.client, t.carrier, t.product, t.account].some(v => v.toLowerCase().includes(q))) return false;
    if (filterProduct && t.productType !== filterProduct) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterTx && t.txType !== filterTx) return false;
    return true;
  }), [trades, search, filterProduct, filterStatus, filterTx]);

  const save = (t: Trade) => {
    setTrades(ts => ts.some(x => x.id === t.id) ? ts.map(x => x.id === t.id ? t : x) : [t, ...ts]);
    setModal(null);
  };
  const del = (id: string) => { if (confirm("Delete this transaction?")) setTrades(ts => ts.filter(t => t.id !== id)); };

  const sel: React.CSSProperties = {
    padding: "7px 12px", border: `1.5px solid ${C.border}`, borderRadius: 7,
    fontSize: 13, color: C.textMid, background: C.surface, cursor: "pointer", fontFamily: "inherit",
  };

  const cols = "1.8fr 0.9fr 1.5fr 1.4fr 1fr 1fr 1.2fr 80px";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: C.text }}>

      {/* Header */}
      <header style={{ background: C.navy, color: "#fff", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: C.accent, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Transaction Blotter</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Russell Financial Group</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, opacity: 0.7 }}>{filtered.length} of {trades.length} transactions</span>
          <button onClick={() => setModal({})} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + New Transaction
          </button>
        </div>
      </header>

      <main style={{ padding: "28px 32px", maxWidth: 1500, margin: "0 auto" }}>
        <SummaryBar trades={trades} />

        {/* Filters */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search client, carrier, product, account..."
            style={{ ...sel, flex: "1 1 240px" }} />
          <select style={sel} value={filterProduct} onChange={e => setFilterProduct(e.target.value)}>
            <option value="">All Product Types</option>
            {PRODUCT_TYPES.map(p => <option key={p}>{p}</option>)}
          </select>
          <select style={sel} value={filterTx} onChange={e => setFilterTx(e.target.value)}>
            <option value="">All Transaction Types</option>
            {TX_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select style={sel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          {(search || filterProduct || filterStatus || filterTx) && (
            <button onClick={() => { setSearch(""); setFilterProduct(""); setFilterStatus(""); setFilterTx(""); }}
              style={{ ...sel, color: C.red, borderColor: C.red, background: C.redLt }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "grid", gridTemplateColumns: cols, padding: "10px 18px", background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>Client / Account</span><span>Date</span><span>Carrier / Product</span>
            <span>Product Type</span><span>Tx Type</span><span>Amount</span><span>Status</span><span></span>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: "52px 0", textAlign: "center", color: C.muted, fontSize: 15 }}>No transactions found.</div>
          )}

          {filtered.map((t, i) => {
            const pc = PRODUCT_COLORS[t.productType] ?? { bg: "#f3f4f6", color: C.muted };
            const expanded = expandedId === t.id;
            return (
              <div key={t.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div
                  style={{ display: "grid", gridTemplateColumns: cols, padding: "13px 18px", alignItems: "center", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.surfaceAlt)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={() => setExpandedId(expanded ? null : t.id)}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{t.client}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{t.account}</div>
                  </div>
                  <div style={{ fontSize: 13, color: C.textMid }}>{t.submittedDate}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.carrier}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{t.product}</div>
                  </div>
                  <div><Badge bg={pc.bg} color={pc.color}>{t.productType}</Badge></div>
                  <div style={{ fontSize: 12, color: C.textMid }}>{t.txType}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{t.amount}</div>
                  <div><StatusBadge status={t.status} /></div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setModal(t)} style={{ background: C.accentLt, color: C.accent, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Edit</button>
                    <button onClick={() => del(t.id)} style={{ background: C.redLt, color: C.red, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
                  </div>
                </div>

                {expanded && (
                  <div style={{ padding: "12px 18px 16px", background: C.surfaceAlt, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: t.notes ? 10 : 0 }}>
                      {[["ADVISOR", t.advisor], ["TX TYPE", t.txType], ["PRODUCT", t.product]].map(([label, val]) => (
                        <div key={label}><div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>{label}</div><div style={{ fontSize: 13, marginTop: 3 }}>{val}</div></div>
                      ))}
                    </div>
                    {t.notes && (
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 12px", fontSize: 13, color: C.textMid }}>{t.notes}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: C.muted, textAlign: "right" }}>
          For advisor use only &nbsp;·&nbsp; Not for client distribution &nbsp;·&nbsp; Russell Financial Group
        </div>
      </main>

      {modal && <TradeModal trade={modal} onSave={save} onClose={() => setModal(null)} />}
    </div>
  );
}
