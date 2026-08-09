import { useState } from "react";
import type { CSSProperties } from "react";

// ── Design tokens — exact match to Client Intake (clientintake-eta.vercel.app) ──
const PAGE_BG    = "#f4f6f9";
const NAV        = "#ffffff";
const CARD       = "#ffffff";
const INK        = "#151b28";
const MUTED      = "#697180";
const BORDER     = "#e1e4ea";
const INPUT_BDR  = "#cfd5de";
const ACCENT     = "#2f3a4a";
const SUCCESS    = "#2fa76f";
const DANGER     = "#d64545";
const BRAND_NAVY = "#2e3d66";
const SERIF      = "Georgia, 'Times New Roman', serif";
const SANS       = "'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

// Input style — exact match to Client Intake IS constant
const IS: CSSProperties = {
  background: CARD, border: `1px solid ${INPUT_BDR}`, borderRadius: 8,
  padding: "5px 9px", color: INK, fontSize: 13, fontWeight: 500,
  width: "100%", boxSizing: "border-box", fontFamily: SANS,
  boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
  outline: "none",
};

// ── Column group color chips — mirror CI section-meta colors ─────────────────
const GRP_META = {
  client:  { color: BRAND_NAVY, bg: "#eef2ff", label: "Client Info",                icon: "👤" },
  current: { color: "#1d4ed8",  bg: "#eff6ff", label: "Current Investment",         icon: "💼" },
  new:     { color: "#7c3aed",  bg: "#f5f3ff", label: "New Investment",             icon: "📈" },
  post:    { color: "#047857",  bg: "#f0fdf4", label: "Settlement & Tracking",      icon: "✅" },
} as const;

// ── Russell brand components (identical to Client Intake) ─────────────────────
function AcornMark({ size = 42 }: { size?: number }) {
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
    <div style={{ textAlign: "center" }}>
      <AcornMark size={42} />
      <div style={{ fontFamily: SERIF, fontSize: 18, letterSpacing: "0.2em", marginLeft: "0.2em", color: BRAND_NAVY, marginTop: 2, lineHeight: 1.1 }}>RUSSELL</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 4 }}>
        <span style={{ flex: "0 0 20px", height: 1, background: BRAND_NAVY, opacity: 0.5 }} />
        <span style={{ fontFamily: SERIF, fontSize: 8.5, letterSpacing: "0.3em", marginLeft: "0.3em", color: BRAND_NAVY, whiteSpace: "nowrap" }}>FINANCIAL GROUP</span>
        <span style={{ flex: "0 0 20px", height: 1, background: BRAND_NAVY, opacity: 0.5 }} />
      </div>
    </div>
  );
}

function GroupChip({ group, size = 28 }: { group: keyof typeof GRP_META; size?: number }) {
  const m = GRP_META[group];
  return (
    <span style={{ width: size, height: size, borderRadius: 7, background: m.bg, color: m.color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: size * 0.45 }}>
      {m.icon}
    </span>
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
  { key: "entryDate",           label: "Date",                   group: "client",  type: "date",     w: 128 },
  { key: "lastName",            label: "Last Name",              group: "client",  type: "text",     w: 112 },
  { key: "mi",                  label: "MI",                     group: "client",  type: "text",     w: 40  },
  { key: "firstName",           label: "First Name",             group: "client",  type: "text",     w: 100 },
  { key: "fundsFrom",           label: "Funds Coming From",      group: "current", type: "text",     w: 155 },
  { key: "curAcctType",         label: "Account Type",           group: "current", type: "text",     w: 118 },
  { key: "assetClass",          label: "Asset Class",            group: "current", type: "text",     w: 128 },
  { key: "curPolicyNum",        label: "Policy / Acct #",        group: "current", type: "text",     w: 138 },
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

// ── Helpers ───────────────────────────────────────────────────────────────────
type Row = { id: string } & Record<string, string>;

const uid       = () => Math.random().toString(36).slice(2, 9);
const parseCur  = (s: string) => parseFloat((s || "").replace(/[$,]/g, "")) || 0;
const fmtCur    = (n: number) =>
  n === 0 ? "—" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const blankRow = (): Row => {
  const r: Row = { id: uid() };
  for (const c of COLS) r[c.key] = "";
  r.entryDate = new Date().toISOString().slice(0, 10);
  return r;
};

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

// ── Group spans ───────────────────────────────────────────────────────────────
interface Span { group: Group; count: number }
const GROUP_SPANS: Span[] = [];
{
  let cur: Span = { group: COLS[0].group, count: 1 };
  for (let i = 1; i < COLS.length; i++) {
    if (COLS[i].group === cur.group) cur.count++;
    else { GROUP_SPANS.push(cur); cur = { group: COLS[i].group, count: 1 }; }
  }
  GROUP_SPANS.push(cur);
}

const tableWidth = COLS.reduce((s, c) => s + c.w, 0) + 44;

// ── Main component ────────────────────────────────────────────────────────────
export default function TradeBlotter() {
  const [rows, setRows]   = useState<Row[]>(SEED);
  const [open, setOpen]   = useState(true);

  const update = (id: string, key: string, val: string) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, [key]: val } : r));
  const addRow = () => setRows(rs => [...rs, blankRow()]);
  const delRow = (id: string) => {
    if (confirm("Delete this transaction?")) setRows(rs => rs.filter(r => r.id !== id));
  };

  const monthlyTotal = rows.reduce((s, r) => s + parseCur(r.monthlyAmount), 0);
  const ytdTotal     = rows.reduce((s, r) => s + parseCur(r.openingAmount), 0);
  const today        = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const renderCell = (row: Row, col: Col) => {
    const val = row[col.key] ?? "";
    if (col.type === "select") {
      return (
        <select value={val} onChange={e => update(row.id, col.key, e.target.value)}
          style={{ ...IS, height: "100%", borderRadius: 0, border: "none", boxShadow: "none", background: "transparent", cursor: "pointer", padding: "5px 8px" }}>
          {(col.opts ?? []).map(o => <option key={o} value={o}>{o || "—"}</option>)}
        </select>
      );
    }
    return (
      <input
        type={col.type === "date" ? "date" : "text"}
        value={val}
        onChange={e => update(row.id, col.key, e.target.value)}
        className="b-input"
        style={{ ...IS, height: "100%", borderRadius: 0, border: "none", boxShadow: "none", background: "transparent", padding: "5px 9px" }}
      />
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: PAGE_BG, fontFamily: SANS, color: INK }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .b-input:focus { background: #eff6ff !important; outline: none; }
        .b-row:hover td { background: #f8fafc !important; }

        .b-del { background: none; border: none; color: #c4cad4; cursor: pointer; font-size: 18px; line-height: 1; padding: 4px 8px; border-radius: 5px; }
        .b-del:hover { color: ${DANGER}; background: #fff1f1; }

        .b-add { display: block; width: 100%; text-align: left; background: none; border: none; padding: 10px 18px; font-size: 13px; font-weight: 500; color: ${ACCENT}; cursor: pointer; font-family: ${SANS}; }
        .b-add:hover { background: #f4f6f9; color: ${BRAND_NAVY}; }

        .side-btn { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; background: transparent; border: none; color: #39414f; border-radius: 9px; padding: 6px 8px; margin-bottom: 2px; font-size: 12.5px; font-weight: 500; cursor: pointer; line-height: 1.3; font-family: ${SANS}; }
        .side-btn:hover { background: rgba(47,58,74,0.08); color: ${INK}; }

        .new-tx { background: ${BRAND_NAVY}; color: #fff; border: none; border-radius: 7px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: ${SANS}; width: 100%; margin-top: 8px; }
        .new-tx:hover { background: #243660; }
      `}</style>

      {/* ── SIDEBAR — identical structure to Client Intake ── */}
      <aside style={{
        width: 226, flexShrink: 0, background: NAV,
        borderRight: `1px solid ${BORDER}`,
        position: "sticky", top: 0, height: "100vh",
        overflowY: "auto", boxSizing: "border-box",
        padding: "18px 10px",
      }}>
        {/* Brand lockup — centered, same as CI */}
        <div style={{ padding: "8px 6px 14px" }}>
          <BrandLockup />
          <div style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 7 }}>Transaction Blotter</div>
        </div>

        {/* Section label */}
        <div style={{ padding: "0 6px", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Column Groups</span>
        </div>

        {/* Group nav — mirror CI's sidebar buttons */}
        {(Object.keys(GRP_META) as Group[]).map(g => {
          const m = GRP_META[g];
          return (
            <button key={g} className="side-btn">
              <GroupChip group={g} size={24} />
              <span style={{ flex: 1 }}>{m.label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ margin: "16px 6px", borderTop: `1px solid ${BORDER}` }} />

        {/* Totals — displayed in sidebar like CI's stat cards */}
        <div style={{ padding: "0 6px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Summary</div>

          <div style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Monthly Drafts</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: SUCCESS, marginTop: 3 }}>{fmtCur(monthlyTotal)}</div>
          </div>

          <div style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>YTD New Money</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: BRAND_NAVY, marginTop: 3 }}>{fmtCur(ytdTotal)}</div>
          </div>

          <div style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Transactions</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: INK, marginTop: 3 }}>{rows.length}</div>
          </div>

          <button className="new-tx" onClick={addRow}>+ New Transaction</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT — same structure as CI's main-col ── */}
      <div style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        <div style={{ padding: "28px 28px 44px" }}>

          {/* Page title area — mirrors CI's h1 + subtitle + date */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}>Transaction Blotter</h1>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: BRAND_NAVY, border: `1px solid ${BRAND_NAVY}`, borderRadius: 5, padding: "2px 8px" }}>
                Active
              </span>
            </div>
            <div style={{ fontSize: 14, color: MUTED, marginTop: 6, lineHeight: 1.6 }}>
              Russell Financial Group · Confidential
              <br />
              {today}
            </div>
          </div>

          {/* Panel card — exact Panel component from Client Intake */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14,
            marginBottom: 20, overflow: "hidden",
            boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
          }}>
            {/* Panel header */}
            <div
              onClick={() => setOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "15px 22px", cursor: "pointer", userSelect: "none", borderBottom: open ? `1px solid ${BORDER}` : "none" }}
            >
              <GroupChip group="client" size={28} />
              <div style={{ fontSize: 15, fontWeight: 600, color: INK, flex: 1 }}>
                All Transactions
                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: MUTED }}>({rows.length} records)</span>
              </div>
              <span style={{ color: MUTED, fontSize: 12, lineHeight: 1 }}>{open ? "▲" : "▼"}</span>
            </div>

            {/* Scrollable table */}
            {open && (
              <div style={{ overflowX: "auto" }}>
                <style>{`
                  .b-th1 { position: sticky; top: 0; z-index: 3; padding: 8px 9px; text-align: left; border-right: 1px solid rgba(0,0,0,0.09); border-bottom: 1px solid rgba(0,0,0,0.09); white-space: nowrap; user-select: none; height: 36px; }
                  .b-th2 { position: sticky; top: 36px; z-index: 2; padding: 7px 9px; text-align: left; border-right: 1px solid rgba(0,0,0,0.07); border-bottom: 1px solid ${BORDER}; white-space: nowrap; user-select: none; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
                  .b-td  { padding: 0; border-right: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER}; height: 34px; vertical-align: middle; }
                `}</style>
                <table style={{ borderCollapse: "collapse", tableLayout: "fixed", minWidth: tableWidth, background: CARD }}>
                  <colgroup>
                    {COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}
                    <col style={{ width: 44 }} />
                  </colgroup>

                  <thead>
                    {/* Row 1 — group banner headers */}
                    <tr>
                      {GROUP_SPANS.map((gs, i) => {
                        const m = GRP_META[gs.group];
                        return (
                          <th key={i} colSpan={gs.count} className="b-th1" style={{
                            background: m.bg, color: m.color,
                            fontSize: gs.group === "client" ? 12 : 11,
                            fontWeight: 700,
                            textAlign: gs.group === "client" ? "left" : "center",
                            letterSpacing: "0.02em",
                          }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <span style={{ fontSize: 12 }}>{m.icon}</span>
                              {gs.group === "client" ? "Client Info" : m.label}
                            </span>
                          </th>
                        );
                      })}
                      <th className="b-th1" style={{ background: GRP_META.client.bg, width: 44 }} />
                    </tr>

                    {/* Row 2 — column labels */}
                    <tr>
                      {COLS.map(col => {
                        const m = GRP_META[col.group];
                        return (
                          <th key={col.key} className="b-th2" style={{
                            background: "#f8fafc", color: MUTED,
                            borderLeft: `3px solid ${m.color}`,
                          }}>
                            {col.label}
                          </th>
                        );
                      })}
                      <th className="b-th2" style={{ background: "#f8fafc" }} />
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, ri) => (
                      <tr key={row.id} className="b-row" style={{ background: ri % 2 === 0 ? CARD : "#fafbfc" }}>
                        {COLS.map(col => (
                          <td key={col.key} className="b-td">{renderCell(row, col)}</td>
                        ))}
                        <td className="b-td" style={{ textAlign: "center" }}>
                          <button className="b-del" onClick={() => delRow(row.id)} title="Delete">×</button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={COLS.length + 1} style={{ borderTop: `1px solid ${BORDER}`, padding: 0 }}>
                        <button className="b-add" onClick={addRow}>+ Add Transaction</button>
                      </td>
                    </tr>
                  </tbody>

                  <tfoot>
                    <tr style={{ background: PAGE_BG, borderTop: `2px solid ${INPUT_BDR}` }}>
                      {COLS.map((col, i) => {
                        const isMo = col.key === "monthlyAmount";
                        const isOp = col.key === "openingAmount";
                        return (
                          <td key={col.key} className="b-td" style={{
                            padding: "8px 9px", fontWeight: 700, background: PAGE_BG,
                            fontSize: isMo || isOp ? 13 : 11,
                            color: isMo ? SUCCESS : isOp ? BRAND_NAVY : MUTED,
                            textTransform: i === 0 ? "uppercase" : undefined,
                            letterSpacing: i === 0 ? "0.07em" : undefined,
                          }}>
                            {i === 0 ? "Totals" : isMo ? fmtCur(monthlyTotal) : isOp ? fmtCur(ytdTotal) : ""}
                          </td>
                        );
                      })}
                      <td className="b-td" style={{ background: PAGE_BG }} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
