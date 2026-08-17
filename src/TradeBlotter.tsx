import { useState } from "react";
import type { CSSProperties } from "react";

// ── shadcn/ui-style design tokens (zinc palette) ──────────────────────────────
const BG       = "#ffffff";
const SIDEBAR  = "#fafafa";
const CARD     = "#ffffff";
const FG       = "#09090b";   // zinc-950
const MUTED    = "#71717a";   // zinc-500
const MUTED_BG = "#f4f4f5";   // zinc-100
const BORDER   = "#e4e4e7";   // zinc-200
const PRIMARY  = "#18181b";   // zinc-900
const SUCCESS  = "#16a34a";   // green-600
const DANGER   = "#dc2626";   // red-600
const SANS     = "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";

// Group colors — shadcn-style muted chips
const GRP_META = {
  client:  { color: "#3f3f46", bg: "#f4f4f5", label: "Client Info",           icon: "👤" },
  current: { color: "#1d4ed8", bg: "#eff6ff", label: "Current Investment",    icon: "💼" },
  new:     { color: "#6d28d9", bg: "#f5f3ff", label: "New Investment",        icon: "📈" },
  post:    { color: "#15803d", bg: "#f0fdf4", label: "Settlement & Tracking", icon: "✅" },
} as const;

// Base input style
const IS: CSSProperties = {
  background: "transparent",
  border: "none",
  outline: "none",
  width: "100%",
  height: "100%",
  padding: "0 10px",
  fontSize: 13,
  fontWeight: 400,
  color: FG,
  fontFamily: SANS,
  boxSizing: "border-box",
};

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
  { key: "ticker",              label: "Ticker",                 group: "new",     type: "text",     w: 90  },
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

type Row = { id: string } & Record<string, string>;
const uid      = () => Math.random().toString(36).slice(2, 9);
const parseCur = (s: string) => parseFloat((s || "").replace(/[$,]/g, "")) || 0;
const fmtCur   = (n: number) =>
  n === 0 ? "—" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const blankRow = (): Row => {
  const r: Row = { id: uid() };
  for (const c of COLS) r[c.key] = "";
  r.entryDate = new Date().toISOString().slice(0, 10);
  return r;
};

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

export default function TradeBlotter() {
  const [rows, setRows] = useState<Row[]>(SEED);
  const [open, setOpen] = useState(true);

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
          style={{ ...IS, cursor: "pointer", appearance: "none" }}>
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
        style={IS}
      />
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: SANS, color: FG }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .b-input:focus { background: #f4f4f5 !important; }
        .b-row:hover td { background: #fafafa !important; }

        .b-del {
          background: none; border: none; color: #a1a1aa; cursor: pointer;
          font-size: 16px; padding: 2px 7px; border-radius: 4px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
        }
        .b-del:hover { color: ${DANGER}; background: #fef2f2; }

        .b-add {
          display: block; width: 100%; text-align: left; background: none; border: none;
          padding: 9px 12px; font-size: 13px; font-weight: 500; color: ${MUTED};
          cursor: pointer; font-family: ${SANS};
        }
        .b-add:hover { background: ${MUTED_BG}; color: ${FG}; }

        .side-btn {
          display: flex; align-items: center; gap: 8px; width: 100%; text-align: left;
          background: transparent; border: none; color: ${MUTED}; border-radius: 6px;
          padding: 6px 8px; margin-bottom: 1px; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: ${SANS};
        }
        .side-btn:hover { background: ${MUTED_BG}; color: ${FG}; }

        .btn-primary {
          background: ${PRIMARY}; color: #fafafa; border: none; border-radius: 6px;
          padding: 8px 14px; font-size: 13px; font-weight: 500; cursor: pointer;
          font-family: ${SANS}; width: 100%; margin-top: 6px;
          transition: background 0.15s;
        }
        .btn-primary:hover { background: #27272a; }

        .b-th1 {
          position: sticky; top: 0; z-index: 3;
          padding: 7px 10px; text-align: left;
          border-right: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER};
          white-space: nowrap; user-select: none; height: 34px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.01em;
        }
        .b-th2 {
          position: sticky; top: 34px; z-index: 2;
          padding: 6px 10px; text-align: left;
          border-right: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER};
          white-space: nowrap; user-select: none;
          font-size: 10px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: ${MUTED}; background: ${MUTED_BG};
        }
        .b-td {
          padding: 0; border-right: 1px solid ${BORDER};
          border-bottom: 1px solid ${BORDER};
          height: 36px; vertical-align: middle;
        }

        .chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 7px; border-radius: 9999px;
          font-size: 11px; font-weight: 500; line-height: 1.4;
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 220, flexShrink: 0, background: SIDEBAR,
        borderRight: `1px solid ${BORDER}`,
        position: "sticky", top: 0, height: "100vh",
        overflowY: "auto", padding: "16px 12px",
      }}>
        {/* Brand */}
        <div style={{ padding: "4px 4px 16px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: FG, letterSpacing: "-0.01em" }}>
            Russell Financial
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Transaction Blotter</div>
        </div>

        {/* Column Groups nav */}
        <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 4px", marginBottom: 6 }}>
          Views
        </div>

        {(Object.keys(GRP_META) as Group[]).map(g => {
          const m = GRP_META[g];
          return (
            <button key={g} className="side-btn">
              <span style={{
                width: 22, height: 22, borderRadius: 5, background: m.bg, color: m.color,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, flexShrink: 0,
              }}>
                {m.icon}
              </span>
              <span>{m.label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ margin: "14px 0", borderTop: `1px solid ${BORDER}` }} />

        {/* Summary stats */}
        <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 4px", marginBottom: 10 }}>
          Summary
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>Monthly Drafts</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: SUCCESS }}>{fmtCur(monthlyTotal)}</div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>YTD New Money</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: FG }}>{fmtCur(ytdTotal)}</div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>Transactions</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: FG }}>{rows.length}</div>
        </div>

        <button className="btn-primary" onClick={addRow}>+ New Transaction</button>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, minWidth: 0, overflowX: "hidden", background: BG }}>
        <div style={{ padding: "28px 28px 48px" }}>

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em", color: FG }}>
                Transaction Blotter
              </h1>
              <span className="chip" style={{ background: MUTED_BG, color: MUTED, border: `1px solid ${BORDER}` }}>
                Active
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: MUTED }}>
              Russell Financial Group &mdash; {today}
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
          }}>
            {/* Card header */}
            <div
              onClick={() => setOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "13px 16px", cursor: "pointer", userSelect: "none",
                borderBottom: open ? `1px solid ${BORDER}` : "none",
                background: CARD,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: FG, flex: 1 }}>
                All Transactions
                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, color: MUTED }}>
                  {rows.length} records
                </span>
              </span>
              <span style={{ color: MUTED, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
            </div>

            {open && (
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  borderCollapse: "collapse", tableLayout: "fixed",
                  minWidth: tableWidth, background: CARD,
                }}>
                  <colgroup>
                    {COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}
                    <col style={{ width: 44 }} />
                  </colgroup>

                  <thead>
                    {/* Group header row */}
                    <tr>
                      {GROUP_SPANS.map((gs, i) => {
                        const m = GRP_META[gs.group];
                        return (
                          <th key={i} colSpan={gs.count} className="b-th1" style={{
                            background: m.bg, color: m.color,
                            textAlign: "left",
                          }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <span>{m.icon}</span>
                              {m.label}
                            </span>
                          </th>
                        );
                      })}
                      <th className="b-th1" style={{ background: MUTED_BG, width: 44 }} />
                    </tr>

                    {/* Column label row */}
                    <tr>
                      {COLS.map(col => (
                        <th key={col.key} className="b-th2">{col.label}</th>
                      ))}
                      <th className="b-th2" />
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map(row => (
                      <tr key={row.id} className="b-row" style={{ background: CARD }}>
                        {COLS.map(col => (
                          <td key={col.key} className="b-td">{renderCell(row, col)}</td>
                        ))}
                        <td className="b-td" style={{ textAlign: "center" }}>
                          <button className="b-del" onClick={() => delRow(row.id)} title="Delete">×</button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={COLS.length + 1} style={{ padding: 0, borderTop: `1px solid ${BORDER}` }}>
                        <button className="b-add" onClick={addRow}>+ Add transaction</button>
                      </td>
                    </tr>
                  </tbody>

                  <tfoot>
                    <tr style={{ background: MUTED_BG, borderTop: `1px solid ${BORDER}` }}>
                      {COLS.map((col, i) => {
                        const isMo = col.key === "monthlyAmount";
                        const isOp = col.key === "openingAmount";
                        return (
                          <td key={col.key} className="b-td" style={{
                            padding: "8px 10px", fontWeight: 600, background: MUTED_BG,
                            fontSize: 12,
                            color: isMo ? SUCCESS : isOp ? FG : MUTED,
                          }}>
                            {i === 0 ? (
                              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: MUTED }}>
                                Totals
                              </span>
                            ) : isMo ? fmtCur(monthlyTotal) : isOp ? fmtCur(ytdTotal) : ""}
                          </td>
                        );
                      })}
                      <td className="b-td" style={{ background: MUTED_BG }} />
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
