import { useState } from "react";

const C = {
  bg:          "#f4f6fb",
  surface:     "#ffffff",
  surfaceAlt:  "#f9fafb",
  border:      "#dde3ef",
  borderMid:   "#c8d0e0",
  navy:        "#1a3260",
  navyHdr:     "#1e3a70",
  accent:      "#2563eb",
  text:        "#111827",
  textMid:     "#374151",
  muted:       "#6b7280",
  green:       "#16a34a",
  red:         "#dc2626",
  // Group header colors
  curBg:       "#dbeafe",  curText: "#1e40af",   // Current Investment — blue
  newBg:       "#ede9fe",  newText: "#5b21b6",   // New Investment — purple
  postBg:      "#d1fae5",  postText: "#065f46",  // Settlement — green
};

// ── Column definitions ────────────────────────────────────────────────────────
type Group = "client" | "current" | "new" | "post";
type CellType = "date" | "text" | "select" | "currency";

interface Col {
  key:   string;
  label: string;
  group: Group;
  type:  CellType;
  w:     number;
  opts?: string[];
}

const COLS: Col[] = [
  // Client identity
  { key: "entryDate",           label: "Date",                  group: "client",  type: "date",     w: 128 },
  { key: "lastName",            label: "Last Name",             group: "client",  type: "text",     w: 112 },
  { key: "mi",                  label: "MI",                    group: "client",  type: "text",     w: 40  },
  { key: "firstName",           label: "First Name",            group: "client",  type: "text",     w: 100 },
  // Current Investment Information
  { key: "fundsFrom",           label: "Funds Coming From",     group: "current", type: "text",     w: 155 },
  { key: "curAcctType",         label: "Account Type",          group: "current", type: "text",     w: 118 },
  { key: "assetClass",          label: "Asset Class",           group: "current", type: "text",     w: 128 },
  { key: "curPolicyNum",        label: "Policy / Acct #",       group: "current", type: "text",     w: 138 },
  // New Investment
  { key: "receivingFirm",       label: "Receiving Firm",        group: "new",     type: "text",     w: 145 },
  { key: "product",             label: "Product",               group: "new",     type: "text",     w: 145 },
  { key: "ticker",              label: "Ticker Symbol",         group: "new",     type: "text",     w: 90  },
  { key: "newAcctType",         label: "Account Type",          group: "new",     type: "text",     w: 118 },
  { key: "fundingMethod",       label: "Funding Method",        group: "new",     type: "text",     w: 138 },
  { key: "checkNum",            label: "Check #",               group: "new",     type: "text",     w: 84  },
  { key: "fboCheck",            label: "FBO Check",             group: "new",     type: "text",     w: 128 },
  { key: "dateSubmitted",       label: "Date Submitted",        group: "new",     type: "date",     w: 130 },
  { key: "docsReceived",        label: "Docs Received",         group: "new",     type: "date",     w: 122 },
  { key: "overnightTracking",   label: "Overnight Tracking #",  group: "new",     type: "text",     w: 162 },
  { key: "followUp",            label: "Follow-Up",             group: "new",     type: "text",     w: 128 },
  // Settlement & Tracking
  { key: "dateFunded",          label: "Date Funded",           group: "post",    type: "date",     w: 122 },
  { key: "newPolicyNum",        label: "New Policy / Acct #",   group: "post",    type: "text",     w: 152 },
  { key: "bankDraft",           label: "Bank Draft",            group: "post",    type: "select",   w: 90,  opts: ["", "Yes", "No"] },
  { key: "startDate",           label: "Start Date",            group: "post",    type: "date",     w: 112 },
  { key: "monthlyAmount",       label: "Monthly $",             group: "post",    type: "currency", w: 102 },
  { key: "datePolicyDelivered", label: "Date Policy Delivered", group: "post",    type: "date",     w: 148 },
  { key: "commissionPaidDate",  label: "Commission Paid Date",  group: "post",    type: "date",     w: 152 },
  { key: "crmUpdated",          label: "CRM Updated",           group: "post",    type: "date",     w: 120 },
  { key: "openingAmount",       label: "Opening $ Amount",      group: "post",    type: "currency", w: 136 },
];

const GROUP_META: Record<Group, { label: string; bg: string; color: string; hdrBg: string }> = {
  client:  { label: "",                            bg: C.navyHdr,  color: "#fff",      hdrBg: "#1a3260" },
  current: { label: "Current Investment Information", bg: C.curBg, color: C.curText,   hdrBg: "#bfdbfe" },
  new:     { label: "New Investment",              bg: C.newBg,    color: C.newText,   hdrBg: "#ddd6fe" },
  post:    { label: "Settlement & Tracking",       bg: C.postBg,   color: C.postText,  hdrBg: "#a7f3d0" },
};

// ── Row type & helpers ────────────────────────────────────────────────────────
type Row = { id: string } & Record<string, string>;

const uid = () => Math.random().toString(36).slice(2, 9);

const blankRow = (): Row => {
  const r: Row = { id: uid() };
  for (const c of COLS) r[c.key] = "";
  r.entryDate = new Date().toISOString().slice(0, 10);
  return r;
};

const parseCur = (s: string) => parseFloat((s || "").replace(/[$,]/g, "")) || 0;
const fmtCur = (n: number) =>
  n === 0 ? "" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED: Row[] = [
  {
    id: uid(), entryDate: "2025-06-10",
    lastName: "Johnson", mi: "A", firstName: "Michael",
    fundsFrom: "Fidelity 401(k)", curAcctType: "Traditional IRA", assetClass: "Mutual Funds", curPolicyNum: "FID-482-1921",
    receivingFirm: "Allianz Life", product: "222+ Accumulation FIA", ticker: "", newAcctType: "IRA Rollover",
    fundingMethod: "Direct Rollover", checkNum: "", fboCheck: "Michael A. Johnson IRA",
    dateSubmitted: "2025-06-10", docsReceived: "2025-06-12", overnightTracking: "1Z9F7V380314683874", followUp: "",
    dateFunded: "2025-06-18", newPolicyNum: "ALZ-2025-443821", bankDraft: "No", startDate: "",
    monthlyAmount: "", datePolicyDelivered: "2025-06-20", commissionPaidDate: "2025-07-01",
    crmUpdated: "2025-06-20", openingAmount: "250000",
  },
  {
    id: uid(), entryDate: "2025-06-18",
    lastName: "Williams", mi: "D", firstName: "David",
    fundsFrom: "Bank of America", curAcctType: "Non-Qualified", assetClass: "Money Market", curPolicyNum: "",
    receivingFirm: "Pacific Life", product: "Pacific Index Choice VA", ticker: "", newAcctType: "Non-Qualified Annuity",
    fundingMethod: "Personal Check", checkNum: "4421", fboCheck: "Pacific Life / David D. Williams",
    dateSubmitted: "2025-06-18", docsReceived: "2025-06-19", overnightTracking: "", followUp: "Awaiting suitability",
    dateFunded: "", newPolicyNum: "", bankDraft: "", startDate: "",
    monthlyAmount: "", datePolicyDelivered: "", commissionPaidDate: "",
    crmUpdated: "2025-06-19", openingAmount: "175000",
  },
  {
    id: uid(), entryDate: "2025-07-05",
    lastName: "Garcia", mi: "R", firstName: "Robert",
    fundsFrom: "Edward Jones Brokerage", curAcctType: "Brokerage Account", assetClass: "Stocks / ETFs", curPolicyNum: "EJ-330-7741",
    receivingFirm: "American Funds", product: "Growth Fund of America", ticker: "AGTHX", newAcctType: "Traditional IRA",
    fundingMethod: "ACAT Transfer", checkNum: "", fboCheck: "",
    dateSubmitted: "2025-07-05", docsReceived: "2025-07-06", overnightTracking: "", followUp: "",
    dateFunded: "2025-07-14", newPolicyNum: "AF-IRA-20250714", bankDraft: "Yes", startDate: "2025-08-01",
    monthlyAmount: "500", datePolicyDelivered: "", commissionPaidDate: "2025-07-22",
    crmUpdated: "2025-07-14", openingAmount: "95000",
  },
  {
    id: uid(), entryDate: "2025-07-10",
    lastName: "Anderson", mi: "P", firstName: "Patricia",
    fundsFrom: "Nationwide Annuity", curAcctType: "Non-Qualified Annuity", assetClass: "Fixed Annuity", curPolicyNum: "NW-8821-Q",
    receivingFirm: "American Equity", product: "AssetShield 10 FIA", ticker: "", newAcctType: "Non-Qualified Annuity",
    fundingMethod: "1035 Exchange", checkNum: "", fboCheck: "American Equity / Patricia P. Anderson",
    dateSubmitted: "2025-07-10", docsReceived: "2025-07-11", overnightTracking: "796887878920", followUp: "Surrender charge waiver",
    dateFunded: "", newPolicyNum: "", bankDraft: "Yes", startDate: "2025-09-01",
    monthlyAmount: "250", datePolicyDelivered: "", commissionPaidDate: "",
    crmUpdated: "2025-07-11", openingAmount: "200000",
  },
];

// ── Compute group spans for header row 1 ──────────────────────────────────────
interface Span { group: Group; start: number; count: number }
const GROUP_SPANS: Span[] = [];
let cur: Span = { group: COLS[0].group, start: 0, count: 1 };
for (let i = 1; i < COLS.length; i++) {
  if (COLS[i].group === cur.group) cur.count++;
  else { GROUP_SPANS.push(cur); cur = { group: COLS[i].group, start: i, count: 1 }; }
}
GROUP_SPANS.push(cur);

// ── Styles ────────────────────────────────────────────────────────────────────
const TH: React.CSSProperties = {
  position: "sticky", top: 0, zIndex: 3,
  padding: "7px 8px", textAlign: "left",
  borderRight: `1px solid ${C.borderMid}`, borderBottom: `1px solid ${C.borderMid}`,
  whiteSpace: "nowrap", userSelect: "none",
};
const TH2: React.CSSProperties = {
  ...TH, top: 34, zIndex: 2,
  fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
};
const TD: React.CSSProperties = {
  padding: 0, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
  height: 34, verticalAlign: "middle",
};
const INPUT_BASE: React.CSSProperties = {
  width: "100%", height: "100%", padding: "5px 8px",
  border: "none", background: "transparent",
  fontSize: 12, color: C.text, fontFamily: "inherit", outline: "none",
  boxSizing: "border-box",
};

// ── Main component ────────────────────────────────────────────────────────────
export default function TradeBlotter() {
  const [rows, setRows] = useState<Row[]>(SEED);

  const update = (id: string, key: string, val: string) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, [key]: val } : r));
  const addRow = () => setRows(rs => [...rs, blankRow()]);
  const delRow = (id: string) => {
    if (confirm("Delete this row?")) setRows(rs => rs.filter(r => r.id !== id));
  };

  const monthlyTotal = rows.reduce((s, r) => s + parseCur(r.monthlyAmount), 0);
  const ytdTotal = rows.reduce((s, r) => s + parseCur(r.openingAmount), 0);
  const tableWidth = COLS.reduce((s, c) => s + c.w, 0) + 44;

  const renderCell = (row: Row, col: Col) => {
    const val = row[col.key] ?? "";
    if (col.type === "select") {
      return (
        <select value={val} onChange={e => update(row.id, col.key, e.target.value)}
          style={{ ...INPUT_BASE, cursor: "pointer" }}>
          {(col.opts ?? []).map(o => <option key={o} value={o}>{o || "—"}</option>)}
        </select>
      );
    }
    return (
      <input
        type={col.type === "date" ? "date" : "text"}
        value={val}
        onChange={e => update(row.id, col.key, e.target.value)}
        style={INPUT_BASE}
      />
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>

      {/* App header */}
      <header style={{ background: C.navy, color: "#fff", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: C.accent, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📋</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Transaction Blotter</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Russell Financial Group</div>
          </div>
        </div>
        <button onClick={addRow} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 7, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + New Transaction
        </button>
      </header>

      {/* Totals bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "11px 24px", display: "flex", gap: 40, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Monthly Draft Total</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.green, marginTop: 1 }}>{fmtCur(monthlyTotal) || "—"}</div>
        </div>
        <div style={{ width: 1, height: 36, background: C.border }} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>YTD New Money</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginTop: 1 }}>{fmtCur(ytdTotal) || "—"}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>{rows.length} transaction{rows.length !== 1 ? "s" : ""}</div>
      </div>

      {/* Scrollable table */}
      <div style={{ overflowX: "auto", padding: "16px 16px 32px" }}>
        <style>{`
          .blotter-input:focus { background: #eff6ff !important; }
          .blotter-row:hover td { background: #f0f7ff !important; }
        `}</style>
        <table style={{ borderCollapse: "collapse", tableLayout: "fixed", minWidth: tableWidth, background: C.surface, boxShadow: "0 1px 8px rgba(0,0,0,0.07)", borderRadius: 10, overflow: "hidden" }}>
          <colgroup>
            {COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}
            <col style={{ width: 44 }} />
          </colgroup>

          <thead>
            {/* Row 1: group banners */}
            <tr>
              {GROUP_SPANS.map((gs, i) => {
                const m = GROUP_META[gs.group];
                return (
                  <th key={i} colSpan={gs.count} style={{
                    ...TH, background: m.bg, color: m.color,
                    fontSize: gs.group === "client" ? 12 : 11,
                    fontWeight: 700, textAlign: gs.group === "client" ? "left" : "center",
                    letterSpacing: "0.02em", height: 34,
                  }}>
                    {gs.group === "client" ? "Russell Financial Group — Transaction Blotter" : m.label}
                  </th>
                );
              })}
              <th style={{ ...TH, background: C.navyHdr, width: 44 }} />
            </tr>

            {/* Row 2: column labels */}
            <tr>
              {COLS.map(col => {
                const m = GROUP_META[col.group];
                return (
                  <th key={col.key} style={{
                    ...TH2, background: m.hdrBg, color: m.color,
                  }}>
                    {col.label}
                  </th>
                );
              })}
              <th style={{ ...TH2, background: "#f1f5f9" }} />
            </tr>
          </thead>

          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.id} className="blotter-row" style={{ background: ri % 2 === 0 ? C.surface : C.surfaceAlt }}>
                {COLS.map(col => (
                  <td key={col.key} style={TD}>
                    {renderCell(row, col)}
                  </td>
                ))}
                <td style={{ ...TD, textAlign: "center" }}>
                  <button onClick={() => delRow(row.id)} title="Delete row"
                    style={{ background: "none", border: "none", color: "#d1d5db", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "4px 8px", borderRadius: 4 }}>
                    ×
                  </button>
                </td>
              </tr>
            ))}

            {/* Add row */}
            <tr>
              <td colSpan={COLS.length + 1} onClick={addRow}
                style={{ padding: "10px 16px", textAlign: "center", color: C.accent, fontSize: 13, cursor: "pointer", borderTop: `1px solid ${C.border}`, fontWeight: 500 }}>
                + Add Transaction
              </td>
            </tr>
          </tbody>

          {/* Totals footer */}
          <tfoot>
            <tr style={{ background: "#f1f5f9", borderTop: `2px solid ${C.borderMid}` }}>
              {COLS.map((col, i) => {
                const isMonthly = col.key === "monthlyAmount";
                const isOpening = col.key === "openingAmount";
                return (
                  <td key={col.key} style={{
                    ...TD,
                    padding: "8px",
                    fontWeight: 700,
                    fontSize: isMonthly || isOpening ? 13 : 11,
                    color: isMonthly ? C.green : isOpening ? C.navy : C.muted,
                    textTransform: i === 0 ? "uppercase" : undefined,
                    letterSpacing: i === 0 ? "0.06em" : undefined,
                  }}>
                    {i === 0 ? "Totals" : isMonthly ? fmtCur(monthlyTotal) : isOpening ? fmtCur(ytdTotal) : ""}
                  </td>
                );
              })}
              <td style={TD} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
