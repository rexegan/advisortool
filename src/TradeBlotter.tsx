import { useState } from "react";
import type { CSSProperties } from "react";

// ── Design tokens — matched to Client Intake (clientintake-eta.vercel.app) ──
const PAGE_BG     = "#f4f6f9";
const NAV         = "#ffffff";
const SURFACE     = "#ffffff";
const SURFACE_ALT = "#f9fafb";
const INK         = "#151b28";
const MUTED       = "#697180";
const BORDER      = "#e1e4ea";
const INPUT_BDR   = "#cfd5de";
const ACCENT      = "#2f3a4a";
const SUCCESS     = "#2fa76f";
const BRAND_NAVY  = "#2e3d66";
const SERIF       = "Georgia, 'Times New Roman', serif";
const SANS        = "'DM Sans', 'Inter', system-ui, -apple-system, sans-serif";

// Group colors — kept from original blotter, palette lightened to match CI energy
const GRP = {
  client:  { banner: BRAND_NAVY, bannerText: "#ffffff", colHdr: "#374b6d", colHdrText: "#e8ecf6" },
  current: { banner: "#dbeafe",  bannerText: "#1e40af", colHdr: "#bfdbfe", colHdrText: "#1e3a8a" },
  new:     { banner: "#ede9fe",  bannerText: "#5b21b6", colHdr: "#ddd6fe", colHdrText: "#4c1d95" },
  post:    { banner: "#d1fae5",  bannerText: "#065f46", colHdr: "#a7f3d0", colHdrText: "#064e3b" },
} as const;

// ── Russell brand SVG ─────────────────────────────────────────────────────────
function AcornMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M20.5 22.5C14 23.5 8.5 21 5.5 15.5C8.8 14.9 10.2 13.2 9.8 10.6C12.8 11.4 15 10.6 16.2 8.2C18.4 10 20.6 10.2 22.8 8.8C23.2 11.4 24.6 13 27 13.4C25.2 16.6 24.6 19.6 25.2 22.4Z" fill={BRAND_NAVY} opacity="0.92" />
      <path d="M20 23C16.5 26.5 14.5 30.5 14 35" stroke={BRAND_NAVY} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M25.5 21.5C25.8 16.8 29.6 13.6 34.4 13.9C39.2 14.2 42.6 17.8 42.3 22.5C42.25 23.4 41.6 23.9 40.7 23.85L27 23C26.1 22.95 25.45 22.4 25.5 21.5Z" fill={BRAND_NAVY} />
      <path d="M34.8 13.8C35.4 11.6 36.6 10.2 38.5 9.4" stroke={BRAND_NAVY} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M26.5 25.3L41.6 26.2C41.2 32 37.8 37.4 33.6 39.5C29.6 36.9 26.6 31.2 26.5 25.3Z" fill={BRAND_NAVY} />
    </svg>
  );
}

function BrandLockup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <AcornMark size={38} />
      <div>
        <div style={{ fontFamily: SERIF, fontSize: 17, letterSpacing: "0.2em", color: BRAND_NAVY, lineHeight: 1.1, fontWeight: 400 }}>RUSSELL</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
          <span style={{ flex: "0 0 16px", height: 1, background: BRAND_NAVY, opacity: 0.45 }} />
          <span style={{ fontFamily: SERIF, fontSize: 8, letterSpacing: "0.28em", color: BRAND_NAVY, whiteSpace: "nowrap", opacity: 0.8 }}>FINANCIAL GROUP</span>
          <span style={{ flex: "0 0 16px", height: 1, background: BRAND_NAVY, opacity: 0.45 }} />
        </div>
      </div>
    </div>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────
type Group    = "client" | "current" | "new" | "post";
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
  { key: "entryDate",           label: "Date",                   group: "client",  type: "date",     w: 128 },
  { key: "lastName",            label: "Last Name",              group: "client",  type: "text",     w: 112 },
  { key: "mi",                  label: "MI",                     group: "client",  type: "text",     w: 40  },
  { key: "firstName",           label: "First Name",             group: "client",  type: "text",     w: 100 },
  // Current Investment Information
  { key: "fundsFrom",           label: "Funds Coming From",      group: "current", type: "text",     w: 155 },
  { key: "curAcctType",         label: "Account Type",           group: "current", type: "text",     w: 118 },
  { key: "assetClass",          label: "Asset Class",            group: "current", type: "text",     w: 128 },
  { key: "curPolicyNum",        label: "Policy / Acct #",        group: "current", type: "text",     w: 138 },
  // New Investment
  { key: "receivingFirm",       label: "Receiving Firm",         group: "new",     type: "text",     w: 145 },
  { key: "product",             label: "Product",                group: "new",     type: "text",     w: 145 },
  { key: "ticker",              label: "Ticker Symbol",          group: "new",     type: "text",     w: 90  },
  { key: "newAcctType",         label: "Account Type",           group: "new",     type: "text",     w: 118 },
  { key: "fundingMethod",       label: "Funding Method",         group: "new",     type: "text",     w: 138 },
  { key: "checkNum",            label: "Check #",                group: "new",     type: "text",     w: 84  },
  { key: "fboCheck",            label: "FBO Check",              group: "new",     type: "text",     w: 128 },
  { key: "dateSubmitted",       label: "Date Submitted",         group: "new",     type: "date",     w: 130 },
  { key: "docsReceived",        label: "Docs Received",          group: "new",     type: "date",     w: 122 },
  { key: "overnightTracking",   label: "Overnight Tracking #",   group: "new",     type: "text",     w: 162 },
  { key: "followUp",            label: "Follow-Up",              group: "new",     type: "text",     w: 128 },
  // Settlement & Tracking
  { key: "dateFunded",          label: "Date Funded",            group: "post",    type: "date",     w: 122 },
  { key: "newPolicyNum",        label: "New Policy / Acct #",    group: "post",    type: "text",     w: 152 },
  { key: "bankDraft",           label: "Bank Draft",             group: "post",    type: "select",   w: 90,  opts: ["", "Yes", "No"] },
  { key: "startDate",           label: "Start Date",             group: "post",    type: "date",     w: 112 },
  { key: "monthlyAmount",       label: "Monthly $",              group: "post",    type: "currency", w: 102 },
  { key: "datePolicyDelivered", label: "Date Policy Delivered",  group: "post",    type: "date",     w: 148 },
  { key: "commissionPaidDate",  label: "Commission Paid Date",   group: "post",    type: "date",     w: 152 },
  { key: "crmUpdated",          label: "CRM Updated",            group: "post",    type: "date",     w: 120 },
  { key: "openingAmount",       label: "Opening $ Amount",       group: "post",    type: "currency", w: 136 },
];

// ── Row helpers ───────────────────────────────────────────────────────────────
type Row = { id: string } & Record<string, string>;

const uid = () => Math.random().toString(36).slice(2, 9);

const blankRow = (): Row => {
  const r: Row = { id: uid() };
  for (const c of COLS) r[c.key] = "";
  r.entryDate = new Date().toISOString().slice(0, 10);
  return r;
};

const parseCur = (s: string) => parseFloat((s || "").replace(/[$,]/g, "")) || 0;
const fmtCur   = (n: number) =>
  n === 0 ? "—" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

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

// ── Group span computation ────────────────────────────────────────────────────
interface Span { group: Group; count: number }
const GROUP_SPANS: Span[] = [];
let cur: Span = { group: COLS[0].group, count: 1 };
for (let i = 1; i < COLS.length; i++) {
  if (COLS[i].group === cur.group) cur.count++;
  else { GROUP_SPANS.push(cur); cur = { group: COLS[i].group, count: 1 }; }
}
GROUP_SPANS.push(cur);

// ── Table cell base styles ────────────────────────────────────────────────────
const TH_BASE: CSSProperties = {
  position: "sticky", top: 0, zIndex: 3,
  padding: "8px 9px", textAlign: "left",
  borderRight: `1px solid rgba(0,0,0,0.10)`,
  borderBottom: `1px solid rgba(0,0,0,0.10)`,
  whiteSpace: "nowrap", userSelect: "none",
};
const TH2_BASE: CSSProperties = {
  ...TH_BASE, top: 36, zIndex: 2,
  fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
};
const TD_BASE: CSSProperties = {
  padding: 0,
  borderRight: `1px solid ${BORDER}`,
  borderBottom: `1px solid ${BORDER}`,
  height: 34, verticalAlign: "middle",
};
const INPUT_BASE: CSSProperties = {
  width: "100%", height: "100%", padding: "5px 9px",
  border: "none", background: "transparent",
  fontSize: 12.5, color: INK, fontFamily: SANS, outline: "none",
  boxSizing: "border-box",
};

// ── Main component ────────────────────────────────────────────────────────────
export default function TradeBlotter() {
  const [rows, setRows] = useState<Row[]>(SEED);

  const update = (id: string, key: string, val: string) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, [key]: val } : r));
  const addRow = () => setRows(rs => [...rs, blankRow()]);
  const delRow = (id: string) => {
    if (confirm("Delete this transaction?")) setRows(rs => rs.filter(r => r.id !== id));
  };

  const monthlyTotal = rows.reduce((s, r) => s + parseCur(r.monthlyAmount), 0);
  const ytdTotal     = rows.reduce((s, r) => s + parseCur(r.openingAmount), 0);
  const tableWidth   = COLS.reduce((s, c) => s + c.w, 0) + 44;

  const renderCell = (row: Row, col: Col) => {
    const val = row[col.key] ?? "";
    if (col.type === "select") {
      return (
        <select
          value={val}
          onChange={e => update(row.id, col.key, e.target.value)}
          style={{ ...INPUT_BASE, cursor: "pointer" }}
        >
          {(col.opts ?? []).map(o => <option key={o} value={o}>{o || "—"}</option>)}
        </select>
      );
    }
    return (
      <input
        type={col.type === "date" ? "date" : "text"}
        value={val}
        onChange={e => update(row.id, col.key, e.target.value)}
        className="blotter-input"
        style={INPUT_BASE}
      />
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, fontFamily: SANS, color: INK }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .blotter-input:focus { background: #eff6ff !important; outline: none !important; }
        .blotter-row:hover td { background: #f1f5fb !important; }

        .blotter-del-btn { color: #c4cad4; background: none; border: none; cursor: pointer; font-size: 17px; line-height: 1; padding: 4px 8px; border-radius: 4px; }
        .blotter-del-btn:hover { color: #d64545; background: #fff1f1; }

        .blotter-add-row { color: ${ACCENT}; font-weight: 500; font-size: 13px; cursor: pointer; background: none; border: none; padding: 10px 16px; width: 100%; text-align: left; }
        .blotter-add-row:hover { background: #f0f4f8; color: ${BRAND_NAVY}; }

        .new-tx-btn { background: ${BRAND_NAVY}; color: #fff; border: none; border-radius: 8px; padding: 8px 20px; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .new-tx-btn:hover { background: #243660; }
      `}</style>

      {/* ── App header — white, like Client Intake nav ── */}
      <header style={{
        background: NAV, borderBottom: `1px solid ${BORDER}`,
        padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(21,27,40,0.06)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <BrandLockup />
          <div style={{ width: 1, height: 36, background: BORDER }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15.5, color: INK, lineHeight: 1.1 }}>Transaction Blotter</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{rows.length} transaction{rows.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
        <button className="new-tx-btn" onClick={addRow}>+ New Transaction</button>
      </header>

      {/* ── Totals bar ── */}
      <div style={{
        background: SURFACE, borderBottom: `1px solid ${BORDER}`,
        padding: "12px 28px",
        display: "flex", gap: 40, alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em" }}>Monthly Draft Total</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: SUCCESS, marginTop: 2 }}>{fmtCur(monthlyTotal)}</div>
        </div>
        <div style={{ width: 1, height: 38, background: BORDER }} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em" }}>YTD New Money</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: BRAND_NAVY, marginTop: 2 }}>{fmtCur(ytdTotal)}</div>
        </div>
      </div>

      {/* ── Scrollable blotter table ── */}
      <div style={{ overflowX: "auto", padding: "20px 20px 40px" }}>
        <table style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          minWidth: tableWidth,
          background: SURFACE,
          boxShadow: "0 1px 6px rgba(21,27,40,0.07), 0 0 0 1px rgba(21,27,40,0.05)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <colgroup>
            {COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}
            <col style={{ width: 44 }} />
          </colgroup>

          <thead>
            {/* Row 1 — group banner */}
            <tr>
              {GROUP_SPANS.map((gs, i) => {
                const g = GRP[gs.group];
                return (
                  <th key={i} colSpan={gs.count} style={{
                    ...TH_BASE,
                    background: g.banner, color: g.bannerText,
                    fontSize: gs.group === "client" ? 12.5 : 11,
                    fontWeight: 700,
                    textAlign: gs.group === "client" ? "left" : "center",
                    letterSpacing: "0.025em",
                    height: 36,
                  }}>
                    {gs.group === "client"
                      ? "Russell Financial Group — Transaction Blotter"
                      : gs.group === "current" ? "Current Investment Information"
                      : gs.group === "new"     ? "New Investment"
                      : "Settlement & Tracking"}
                  </th>
                );
              })}
              <th style={{ ...TH_BASE, background: GRP.client.banner, width: 44 }} />
            </tr>

            {/* Row 2 — column labels */}
            <tr>
              {COLS.map(col => {
                const g = GRP[col.group];
                return (
                  <th key={col.key} style={{
                    ...TH2_BASE,
                    background: g.colHdr,
                    color: g.colHdrText,
                  }}>
                    {col.label}
                  </th>
                );
              })}
              <th style={{ ...TH2_BASE, background: "#f1f5f9", color: MUTED }} />
            </tr>
          </thead>

          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.id} className="blotter-row" style={{ background: ri % 2 === 0 ? SURFACE : SURFACE_ALT }}>
                {COLS.map(col => (
                  <td key={col.key} style={TD_BASE}>
                    {renderCell(row, col)}
                  </td>
                ))}
                <td style={{ ...TD_BASE, textAlign: "center", background: "inherit" }}>
                  <button className="blotter-del-btn" onClick={() => delRow(row.id)} title="Delete transaction">×</button>
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={COLS.length + 1} style={{ borderTop: `1px solid ${BORDER}`, padding: 0 }}>
                <button className="blotter-add-row" onClick={addRow}>+ Add Transaction</button>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr style={{ background: "#f1f5f9", borderTop: `2px solid ${INPUT_BDR}` }}>
              {COLS.map((col, i) => {
                const isMonthly = col.key === "monthlyAmount";
                const isOpening = col.key === "openingAmount";
                return (
                  <td key={col.key} style={{
                    ...TD_BASE,
                    padding: "8px 9px",
                    fontWeight: 700,
                    fontSize: isMonthly || isOpening ? 13 : 11,
                    color: isMonthly ? SUCCESS : isOpening ? BRAND_NAVY : MUTED,
                    textTransform: i === 0 ? "uppercase" : undefined,
                    letterSpacing: i === 0 ? "0.07em" : undefined,
                  }}>
                    {i === 0 ? "Totals" : isMonthly ? fmtCur(monthlyTotal) : isOpening ? fmtCur(ytdTotal) : ""}
                  </td>
                );
              })}
              <td style={{ ...TD_BASE, background: "#f1f5f9" }} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
