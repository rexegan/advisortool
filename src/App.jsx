import { useState } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
// Palette sampled from the Client Intake "CatScan" workbook: steel-blue &
// rust section banners, light-blue field labels, cream data rows, serif type.
const C = {
  navy900: "#ffffff",   // page background (white, like the spreadsheet)
  navy800: "#ffffff",   // elevated surfaces / header
  navy700: "#eef4fa",   // subtle panel background (very light blue)
  navy600: "#d8e8f0",   // light-blue field-label fill
  navy500: "#b9cbdd",   // scrollbar / dividers
  accent:  "#407098",   // CatScan steel blue (primary)
  accentHover: "#33597b",
  gold:    "#b8860b",   // dark goldenrod
  green:   "#2e7d32",
  red:     "#b03328",   // CatScan-style red accent
  orange:  "#ae5a24",   // CatScan rust
  purple:  "#6b5b95",
  teal:    "#2c7a7b",
  text:    "#1a1a1a",   // near-black text
  muted:   "#5a6472",
  border:  "rgba(0,0,0,0.22)",   // grid-line style borders
  card:    "#ffffff",
  cardHov: "#f8f0c8",   // cream (data-row highlight)
  // CatScan-specific tokens
  bannerBlue: "#407098",
  bannerRust: "#ae5a24",
  labelBlue:  "#d8e8f0",
  cream:      "#f8f0c8",
};

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Cambria, Georgia, 'Times New Roman', serif; background: ${C.navy900}; color: ${C.text}; min-height: 100vh; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: ${C.navy700}; }
  ::-webkit-scrollbar-thumb { background: ${C.navy500}; border-radius: 2px; }
  input, textarea, select { font-family: Cambria, Georgia, 'Times New Roman', serif; }
  .fade-in { animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  /* CatScan-style full-width section header banner */
  .cat-banner { color: #ffffff; font-weight: 700; letter-spacing: 0.01em; }
  /* Clickable Practice Overview tiles */
  .stat-tile { cursor: pointer; transition: box-shadow 0.12s, transform 0.12s; }
  .stat-tile:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.14); transform: translateY(-2px); }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);

// Format a phone number as (area) prefix-last4, e.g. (800) 421-4120.
// Handles 10-digit, 11-digit (leading 1), and 7-digit numbers; leaves
// anything unexpected (extensions, partial input) untouched.
const fmtPhone = (raw) => {
  if (!raw) return raw;
  const d = String(raw).replace(/\D/g, "");
  const ten = d.length === 11 && d[0] === "1" ? d.slice(1) : d;
  if (ten.length === 10) return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
  if (ten.length === 7) return `${ten.slice(0, 3)}-${ten.slice(3)}`;
  return raw;
};

// Progressive formatter for live typing in phone inputs: reformats digits as
// (area) prefix-last4 while the user types (partial input allowed).
const fmtPhoneInput = (raw) => {
  const d = String(raw || "").replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

// ── Section config ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "wholesalers", label: "Wholesalers & Vendors",      icon: "🤝", color: C.bannerBlue },
  { id: "bd",          label: "Broker Dealer",              icon: "🏦", color: C.bannerBlue },
  { id: "fmo",         label: "FMO / IMO",                  icon: "🌐", color: C.bannerBlue },
  { id: "ce_licenses", label: "CE & Licensing",             icon: "🎓", color: C.bannerBlue },
  { id: "credentials", label: "Credentials & Designations", icon: "🏅", color: C.bannerBlue },
  { id: "contacts",    label: "Key Contacts",               icon: "📞", color: C.bannerBlue },
  { id: "settings",    label: "Settings",                   icon: "⚙️", color: C.bannerBlue },
  { id: "notes",       label: "Advisor Notes",              icon: "📝", color: C.bannerBlue },
  { id: "stats",       label: "Practice Overview",          icon: "📊", color: C.bannerBlue },
];

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED = {
  bd: [
    { id: uid(), name: "LPL Financial", crd: "6413", repCode: "XXXX", contactName: "Home Office Support", phone: "800-558-7567", email: "advisorsupport@lpl.com", website: "https://lpl.com", osj: "Dallas, TX", notes: "Primary clearing & compliance oversight" },
  ],
  fmo: [
    { id: uid(), name: "Life Insurance Company of the Southwest", type: "IMO", contactName: "Regional Director", phone: "800-000-0000", email: "advisor@example.com", website: "", products: "Life, Annuities", contractLevel: "Street", notes: "Primary FMO for life products" },
  ],
  wholesalers: [
    { id: uid(), name: "American Funds", rep: "John Miller", wholesalerType: "External", phones: [{ id: uid(), type: "Direct", number: "800-421-4120" }], email: "jmiller@americanfunds.com", territory: "TX/OK", category: "Mutual Funds", notes: "Primary equity partner" },
    { id: uid(), name: "Nationwide", rep: "Sarah Chen", wholesalerType: "External", phones: [{ id: uid(), type: "Direct", number: "877-245-0763" }, { id: uid(), type: "Cell", number: "214-555-0192" }], email: "schen@nationwide.com", territory: "South", category: "Variable Annuities", notes: "Fixed & variable annuities" },
    { id: uid(), name: "Allianz Life", rep: "Tom Reeves", wholesalerType: "External", phones: [{ id: uid(), type: "Office", number: "763-765-6500" }, { id: uid(), type: "Sales Desk", number: "800-950-5872" }], email: "treeves@allianzlife.com", territory: "TX", category: "Fixed Indexed Annuities", notes: "Index annuities" },
  ],
  ce: [
    { id: uid(), title: "Ethics in Financial Planning", provider: "CFP Board", hours: 2, creditType: "Ethics", completedDate: "2024-03-15", expiresDate: "", certificate: "CFP-ETH-2024" },
    { id: uid(), title: "Annuity Suitability", provider: "NAIC", hours: 4, creditType: "Insurance", completedDate: "2024-06-01", expiresDate: "2026-06-01", certificate: "NAIC-ANS-0601" },
    { id: uid(), title: "Social Security Strategies", provider: "Horsesmouth", hours: 1.5, creditType: "CFP CE", completedDate: "2025-01-10", expiresDate: "", certificate: "" },
  ],
  licenses: [
    { id: uid(), type: "Series 65", number: "TX-65-XXXXX", issuer: "FINRA / Texas State", issued: "2015-08-01", expires: "N/A", status: "Active", notes: "Investment Advisor Rep" },
    { id: uid(), type: "Life & Health", number: "TX-LH-XXXXXXX", issuer: "Texas DOI", issued: "2014-03-20", expires: "2025-09-30", status: "Active", notes: "Renews biennially" },
    { id: uid(), type: "E&O Insurance", number: "EOL-2025-XXXX", issuer: "Arch Insurance", issued: "2025-01-01", expires: "2026-01-01", status: "Active", notes: "1M/3M coverage" },
  ],
  credentials: [
    { id: uid(), designation: "CFP®", fullName: "Certified Financial Planner", issuingBody: "CFP Board", number: "XXXXXX", earned: "2016-11-01", renewalDate: "2026-12-31", ceRequired: 30, notes: "30 CE per 2-year cycle" },
  ],
  contacts: [
    { id: uid(), name: "Compliance Dept", company: "Russell Wealth Group", role: "Compliance", phone: "555-0100", email: "compliance@russellwealthgroup.com", notes: "ADV filings, trade reviews" },
    { id: uid(), name: "Texas DOI", company: "Texas Dept of Insurance", role: "Regulator", phone: "800-252-3439", email: "", notes: "License renewals & complaints" },
    { id: uid(), name: "FINRA BrokerCheck", company: "FINRA", role: "Regulatory", phone: "800-289-9999", email: "", notes: "CRD lookups" },
  ],
  notes: [
    { id: uid(), title: "Q2 2025 Review Checklist", date: "2025-06-01", priority: "high", body: "Complete annual client reviews, update risk tolerance forms, review beneficiary designations." },
    { id: uid(), title: "Compliance Reminder", date: "2025-05-15", priority: "medium", body: "Submit outside business activity disclosure by end of month." },
  ],
  advisorProfile: {
    name: "Rex Russell", title: "Financial Advisor, CFP®", firm: "Russell Wealth Group",
    crd: "", npn: "", npi: "", email: "rex@russellwealthgroup.com",
    phone: "", address: "", city: "Burleson", state: "TX", zip: "",
    website: "", bio: "",
  },
  appSettings: {
    practiceYearStart: "01",
    ceGoalHours: "30", ceGoalPeriod: "2 years",
    defaultPhoneType: "Direct",
    showExpiringDays: "90",
  },
};

// ── Shared components ─────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", placeholder = "", options }) {
  const base = {
    width: "100%", background: C.navy700, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 20,
    outline: "none", transition: "border 0.15s",
  };
  if (options) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 17, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={base}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
  if (type === "textarea") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 17, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...base, resize: "vertical", lineHeight: 1.6 }} />
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 17, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{ fontSize: 17, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
      background: color + "22", color, border: `1px solid ${color}44`, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function ActionBtn({ label, color = C.accent, onClick, small }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? color : color + "22", color: hov ? "#fff" : color,
        border: `1px solid ${color}55`, borderRadius: 7, padding: small ? "4px 10px" : "7px 14px",
        fontSize: small ? 18 : 19, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
      {label}
    </button>
  );
}

function Empty({ label, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: C.muted }}>
      <div style={{ fontSize: 59, marginBottom: 12 }}>📂</div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 19 }}>{sub}</div>
    </div>
  );
}

// ── WHOLESALERS ───────────────────────────────────────────────────────────────
const PHONE_TYPES = ["Office", "Direct", "Cell", "Extension", "Fax", "Department", "Sales", "Marketing", "Sales Desk", "Marketing Desk", "Other"];
const W_CATS = ["Mutual Funds", "Variable Annuities", "Fixed Indexed Annuities", "Fixed Annuities", "Alternative Investments", "Managed Money", "ETFs", "Life Insurance", "Long-Term Care", "Banking", "Other"];

const W_BLANK = {
  name: "", rep: "", wholesalerType: "External", territory: "", category: "Mutual Funds",
  phones: [{ id: uid(), type: "Direct", number: "" }],
  email: "", notes: ""
};

const phoneIcon = (type) => {
  if (["Cell"].includes(type)) return "📱";
  if (["Sales", "Sales Desk", "Marketing", "Marketing Desk", "Department"].includes(type)) return "🏢";
  return "📞";
};

function PhoneEntry({ phone, onChange, onRemove, showRemove }) {
  const base = { background: C.navy800, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 19, outline: "none", padding: "7px 10px" };
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <select value={phone.type} onChange={e => onChange({ ...phone, type: e.target.value })}
        style={{ ...base, width: 148, flexShrink: 0 }}>
        {PHONE_TYPES.map(t => <option key={t}>{t}</option>)}
      </select>
      <input value={phone.number} onChange={e => onChange({ ...phone, number: fmtPhoneInput(e.target.value) })}
        placeholder="Number / ext" style={{ ...base, flex: 1 }} />
      {showRemove && (
        <button onClick={onRemove} style={{ background: C.red + "22", border: `1px solid ${C.red}44`, color: C.red,
          borderRadius: 6, padding: "4px 9px", cursor: "pointer", fontSize: 19, fontWeight: 700, flexShrink: 0 }}>✕</button>
      )}
    </div>
  );
}

function WholesalerCard({ item, onEdit, onDelete }) {
  const cats = {
    "Mutual Funds": C.accent, "Variable Annuities": C.gold, "Fixed Indexed Annuities": C.bannerRust,
    "Fixed Annuities": C.orange, "Alternative Investments": C.purple, "Managed Money": C.teal,
    "ETFs": C.accent, "Life Insurance": C.green, "Long-Term Care": C.bannerBlue, "Banking": C.muted,
  };
  const isInternal = item.wholesalerType === "Internal";
  const phones = item.phones || (item.phone ? [{ id: "legacy", type: "Direct", number: item.phone }] : []);
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${isInternal ? C.green + "44" : C.border}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 24 }}>{item.name}</div>
          <div style={{ color: C.muted, fontSize: 19, marginTop: 2 }}>{item.rep}{item.territory ? ` · ${item.territory}` : ""}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          <Badge label={isInternal ? "Internal" : "External"} color={isInternal ? C.green : C.accent} />
          <Badge label={item.category} color={cats[item.category] || C.accent} />
        </div>
      </div>
      {phones.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
          {phones.filter(p => p.number).map(p => (
            <div key={p.id} style={{ fontSize: 19, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.muted, fontSize: 17, minWidth: 72 }}>{phoneIcon(p.type)} {p.type}</span>
              <a href={`tel:${p.number}`} style={{ color: C.teal, textDecoration: "none" }}>{fmtPhone(p.number)}</a>
            </div>
          ))}
        </div>
      )}
      {item.email && <div style={{ fontSize: 19, marginBottom: 8 }}><a href={`mailto:${item.email}`} style={{ color: C.accent, textDecoration: "none" }}>✉ {item.email}</a></div>}
      {item.notes && <div style={{ fontSize: 19, color: C.muted, marginBottom: 12 }}>{item.notes}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn small label="Edit" onClick={onEdit} />
        <ActionBtn small label="Delete" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function WholesalersSection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(W_BLANK);
  const [catFilter, setCatFilter] = useState("All");
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm({ ...W_BLANK, phones: [{ id: uid(), type: "Direct", number: "" }] }); setEditing("new"); };
  const openEdit = (item) => {
    const phones = item.phones || (item.phone ? [{ id: uid(), type: "Direct", number: item.phone }] : [{ id: uid(), type: "Direct", number: "" }]);
    setForm({ ...item, phones });
    setEditing(item.id);
  };
  const save = () => {
    if (!form.name.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));

  const addPhone = () => setForm(p => ({ ...p, phones: [...p.phones, { id: uid(), type: "Office", number: "" }] }));
  const updatePhone = (idx, val) => setForm(p => { const phones = [...p.phones]; phones[idx] = val; return { ...p, phones }; });
  const removePhone = (idx) => setForm(p => ({ ...p, phones: p.phones.filter((_, i) => i !== idx) }));

  const match = (d) => catFilter === "All" || d.category === catFilter;
  const internal = data.filter(d => d.wholesalerType === "Internal" && match(d));
  const external = data.filter(d => d.wholesalerType !== "Internal" && match(d));
  const shown = internal.length + external.length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Category:</label>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
              style={{ padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: 4, background: "#ffffff",
                color: C.text, fontSize: 20, fontWeight: 600, cursor: "pointer", minWidth: 210 }}>
              <option value="All">All Categories</option>
              {W_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ color: C.muted, fontSize: 20 }}>
            <span style={{ color: C.green, fontWeight: 700 }}>{internal.length} internal</span>
            <span style={{ margin: "0 6px" }}>·</span>
            <span style={{ color: C.accent, fontWeight: 700 }}>{external.length} external</span>
          </div>
        </div>
        <ActionBtn label="+ Add Wholesaler" onClick={openNew} />
      </div>

      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${C.accent}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: C.accent }}>{editing === "new" ? "New Wholesaler / Vendor" : "Edit Wholesaler / Vendor"}</div>

          <div style={{ display: "flex", gap: 0, marginBottom: 16, background: C.navy800, borderRadius: 8, padding: 4, width: "fit-content", border: `1px solid ${C.border}` }}>
            {["External", "Internal"].map(t => {
              const on = form.wholesalerType === t;
              const col = t === "Internal" ? C.green : C.accent;
              return (
                <button key={t} onClick={() => f("wholesalerType")(t)}
                  style={{ padding: "7px 22px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 19,
                    background: on ? col + "33" : "transparent", color: on ? col : C.muted, transition: "all 0.15s" }}>
                  {t}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Field label="Company Name" value={form.name} onChange={f("name")} placeholder="Firm name" />
            <Field label="Rep Name" value={form.rep} onChange={f("rep")} placeholder="Contact person" />
            <Field label="Territory" value={form.territory} onChange={f("territory")} placeholder="TX, South..." />
            <Field label="Category" value={form.category} onChange={f("category")} options={W_CATS} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 17, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Phone Numbers</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {form.phones.map((p, i) => (
                <PhoneEntry key={p.id} phone={p} onChange={(v) => updatePhone(i, v)}
                  onRemove={() => removePhone(i)} showRemove={form.phones.length > 1} />
              ))}
            </div>
            <button onClick={addPhone} style={{ marginTop: 8, background: "transparent", border: `1px dashed ${C.border}`,
              borderRadius: 7, padding: "5px 14px", color: C.muted, fontSize: 18, cursor: "pointer" }}>
              + Add Phone
            </button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Field label="Email" value={form.email} onChange={f("email")} placeholder="rep@firm.com" />
          </div>
          <Field label="Notes" value={form.notes} onChange={f("notes")} type="textarea" placeholder="Notes about this relationship..." />
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}

      {external.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>External Wholesalers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
            {external.map(item => <WholesalerCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
          </div>
        </div>
      )}

      {internal.length > 0 && (
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Internal Wholesalers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
            {internal.map(item => <WholesalerCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
          </div>
        </div>
      )}

      {data.length === 0 && !editing && <Empty label="No wholesalers yet" sub="Add your wholesalers and vendors above" />}
      {data.length > 0 && shown === 0 && !editing && <Empty label={`No wholesalers in “${catFilter}”`} sub="Try a different category or add one above" />}
    </div>
  );
}

// ── CE & EDUCATION ────────────────────────────────────────────────────────────
const CE_BLANK = { title: "", provider: "", hours: "", creditType: "CFP CE", completedDate: today(), expiresDate: "", certificate: "" };
const CE_TYPES = ["CFP CE", "Ethics", "Insurance", "Securities", "State Reg", "Other"];

function CERow({ item, onEdit, onDelete }) {
  const typeColors = { "Ethics": C.red, "CFP CE": C.accent, "Insurance": C.gold, "Securities": C.green, "State Reg": C.teal };
  const isExpired = item.expiresDate && new Date(item.expiresDate) < new Date();
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ minWidth: 48, textAlign: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.accent }}>{item.hours}</div>
        <div style={{ fontSize: 16, color: C.muted, textTransform: "uppercase" }}>hrs</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 3 }}>{item.title}</div>
        <div style={{ color: C.muted, fontSize: 18 }}>{item.provider} · Completed {item.completedDate}</div>
        {item.certificate && <div style={{ color: C.muted, fontSize: 17, marginTop: 2 }}>Cert: {item.certificate}</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <Badge label={item.creditType} color={typeColors[item.creditType] || C.accent} />
        {item.expiresDate && <Badge label={isExpired ? "Expired" : `Exp ${item.expiresDate}`} color={isExpired ? C.red : C.muted} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <ActionBtn small label="Edit" onClick={onEdit} />
        <ActionBtn small label="Del" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function CESection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(CE_BLANK);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm(CE_BLANK); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const save = () => {
    if (!form.title.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));
  const totalHrs = data.reduce((sum, d) => sum + parseFloat(d.hours || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: C.muted, fontSize: 20 }}>{data.length} courses · <span style={{ color: C.gold, fontWeight: 700 }}>{totalHrs.toFixed(1)} total hours</span></div>
        <ActionBtn label="+ Add CE" onClick={openNew} color={C.gold} />
      </div>
      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${C.gold}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: C.gold }}>{editing === "new" ? "Log CE Credit" : "Edit CE Entry"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Course Title" value={form.title} onChange={f("title")} placeholder="Course name" />
            </div>
            <Field label="Provider" value={form.provider} onChange={f("provider")} placeholder="Org that issued CE" />
            <Field label="Credit Type" value={form.creditType} onChange={f("creditType")} options={CE_TYPES} />
            <Field label="Hours" value={form.hours} onChange={f("hours")} type="number" placeholder="0.0" />
            <Field label="Certificate #" value={form.certificate} onChange={f("certificate")} placeholder="Optional" />
            <Field label="Completion Date" value={form.completedDate} onChange={f("completedDate")} type="date" />
            <Field label="Expires Date (if applicable)" value={form.expiresDate} onChange={f("expiresDate")} type="date" />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" color={C.gold} onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map(item => <CERow key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
      </div>
      {data.length === 0 && !editing && <Empty label="No CE records yet" sub="Log your continuing education credits above" />}
    </div>
  );
}

// ── LICENSES ──────────────────────────────────────────────────────────────────
const LIC_BLANK = { type: "", number: "", issuer: "", issued: today(), expires: "", status: "Active", notes: "" };
const LIC_STATUSES = ["Active", "Pending Renewal", "Expired", "Inactive"];

function LicCard({ item, onEdit, onDelete }) {
  const statusColor = { Active: C.green, "Pending Renewal": C.orange, Expired: C.red, Inactive: C.muted }[item.status] || C.muted;
  const expiring = item.expires && item.expires !== "N/A" && new Date(item.expires) < new Date(Date.now() + 90 * 86400000);
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${expiring ? C.orange + "55" : C.border}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>{item.type}</div>
        <Badge label={item.status} color={statusColor} />
      </div>
      <div style={{ fontSize: 19, color: C.muted, marginBottom: 8 }}>
        <span style={{ color: C.text, fontWeight: 500 }}>#{item.number}</span> · {item.issuer}
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 18, color: C.muted, marginBottom: 10 }}>
        <span>Issued {item.issued}</span>
        {item.expires && <span style={{ color: expiring ? C.orange : C.muted }}>Expires {item.expires}{expiring ? " ⚠️" : ""}</span>}
      </div>
      {item.notes && <div style={{ fontSize: 19, color: C.muted, marginBottom: 12 }}>{item.notes}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn small label="Edit" color={C.green} onClick={onEdit} />
        <ActionBtn small label="Delete" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function LicensesSection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(LIC_BLANK);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm(LIC_BLANK); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const save = () => {
    if (!form.type.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: C.muted, fontSize: 20 }}>{data.length} license{data.length !== 1 ? "s" : ""} & E&O records</div>
        <ActionBtn label="+ Add License" color={C.green} onClick={openNew} />
      </div>
      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${C.green}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: C.green }}>{editing === "new" ? "New License / E&O" : "Edit License"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="License Type" value={form.type} onChange={f("type")} placeholder="e.g. Series 65, Life & Health" />
            <Field label="License Number" value={form.number} onChange={f("number")} placeholder="Number / ID" />
            <Field label="Issuing Authority" value={form.issuer} onChange={f("issuer")} placeholder="FINRA, Texas DOI..." />
            <Field label="Status" value={form.status} onChange={f("status")} options={LIC_STATUSES} />
            <Field label="Issue Date" value={form.issued} onChange={f("issued")} type="date" />
            <Field label="Expiration Date" value={form.expires} onChange={f("expires")} placeholder="or 'N/A'" />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes" value={form.notes} onChange={f("notes")} type="textarea" placeholder="Coverage amounts, renewal reminders..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" color={C.green} onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {data.map(item => <LicCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
      </div>
      {data.length === 0 && !editing && <Empty label="No licenses on file" sub="Add your licenses and E&O coverage above" />}
    </div>
  );
}

function CombinedCELicSection({ ceData, setCeData, licData, setLicData }) {
  const [subTab, setSubTab] = useState("ce");
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {[{ id: "ce", label: "📚 CE & Education", color: C.gold }, { id: "lic", label: "📋 Licenses & E&O", color: C.green }].map(t => {
          const on = subTab === t.id;
          return (
            <button key={t.id} onClick={() => setSubTab(t.id)}
              style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${on ? t.color : C.border}`,
                background: on ? t.color + "22" : "transparent", color: on ? t.color : C.muted,
                fontWeight: 600, fontSize: 19, cursor: "pointer", transition: "all 0.15s" }}>
              {t.label}
            </button>
          );
        })}
      </div>
      {subTab === "ce"  && <CESection  data={ceData}  setData={setCeData} />}
      {subTab === "lic" && <LicensesSection data={licData} setData={setLicData} />}
    </div>
  );
}

// ── CREDENTIALS ───────────────────────────────────────────────────────────────
const CRED_BLANK = { designation: "", fullName: "", issuingBody: "", number: "", earned: today(), renewalDate: "", ceRequired: "", notes: "" };

function CredCard({ item, onEdit, onDelete }) {
  const duesSoon = item.renewalDate && new Date(item.renewalDate) < new Date(Date.now() + 180 * 86400000);
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${duesSoon ? C.purple + "55" : C.border}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.purple }}>{item.designation}</div>
        {item.ceRequired && <Badge label={`${item.ceRequired} CE req`} color={C.purple} />}
      </div>
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 4 }}>{item.fullName}</div>
      <div style={{ fontSize: 19, color: C.muted, marginBottom: 8 }}>
        {item.issuingBody}{item.number ? ` · #${item.number}` : ""} · Earned {item.earned}
      </div>
      {item.renewalDate && <div style={{ fontSize: 18, color: duesSoon ? C.orange : C.muted, marginBottom: 10 }}>
        Renewal due {item.renewalDate}{duesSoon ? " ⚠️" : ""}
      </div>}
      {item.notes && <div style={{ fontSize: 19, color: C.muted, marginBottom: 12 }}>{item.notes}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn small label="Edit" color={C.purple} onClick={onEdit} />
        <ActionBtn small label="Delete" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function CredentialsSection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(CRED_BLANK);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm(CRED_BLANK); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const save = () => {
    if (!form.designation.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: C.muted, fontSize: 20 }}>{data.length} designation{data.length !== 1 ? "s" : ""}</div>
        <ActionBtn label="+ Add Credential" color={C.purple} onClick={openNew} />
      </div>
      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${C.purple}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: C.purple }}>{editing === "new" ? "New Credential" : "Edit Credential"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Designation (e.g. CFP®)" value={form.designation} onChange={f("designation")} placeholder="CFP®, ChFC, CLU..." />
            <Field label="Full Name" value={form.fullName} onChange={f("fullName")} placeholder="Certified Financial Planner" />
            <Field label="Issuing Body" value={form.issuingBody} onChange={f("issuingBody")} placeholder="CFP Board, The American College..." />
            <Field label="ID / Number" value={form.number} onChange={f("number")} placeholder="Optional" />
            <Field label="Date Earned" value={form.earned} onChange={f("earned")} type="date" />
            <Field label="Next Renewal Date" value={form.renewalDate} onChange={f("renewalDate")} type="date" />
            <Field label="CE Hours Required" value={form.ceRequired} onChange={f("ceRequired")} type="number" placeholder="30" />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes" value={form.notes} onChange={f("notes")} type="textarea" placeholder="CE cycle details, exam info..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" color={C.purple} onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {data.map(item => <CredCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
      </div>
      {data.length === 0 && !editing && <Empty label="No credentials on file" sub="Add your designations above" />}
    </div>
  );
}

// ── CONTACTS ──────────────────────────────────────────────────────────────────
const CONT_BLANK = { name: "", company: "", role: "", phone: "", email: "", notes: "" };
const CONT_ROLES = ["Compliance", "Operations", "Regulator", "Regulatory", "Custodian", "Attorney", "CPA", "Technology", "Vendor", "Other"];

function ContactCard({ item, onEdit, onDelete }) {
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>{item.name}</div>
          <div style={{ color: C.muted, fontSize: 19 }}>{item.company}</div>
        </div>
        <Badge label={item.role} color={C.teal} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 19, marginBottom: 10 }}>
        {item.phone && <a href={`tel:${item.phone}`} style={{ color: C.teal, textDecoration: "none" }}>📞 {fmtPhone(item.phone)}</a>}
        {item.email && <a href={`mailto:${item.email}`} style={{ color: C.accent, textDecoration: "none" }}>✉ {item.email}</a>}
      </div>
      {item.notes && <div style={{ fontSize: 19, color: C.muted, marginBottom: 12 }}>{item.notes}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn small label="Edit" color={C.teal} onClick={onEdit} />
        <ActionBtn small label="Delete" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function ContactsSection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(CONT_BLANK);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm(CONT_BLANK); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const save = () => {
    if (!form.name.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: C.muted, fontSize: 20 }}>{data.length} key contact{data.length !== 1 ? "s" : ""}</div>
        <ActionBtn label="+ Add Contact" color={C.teal} onClick={openNew} />
      </div>
      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${C.teal}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: C.teal }}>{editing === "new" ? "New Contact" : "Edit Contact"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Name" value={form.name} onChange={f("name")} placeholder="Full name or dept" />
            <Field label="Company / Org" value={form.company} onChange={f("company")} placeholder="Organization" />
            <Field label="Role" value={form.role} onChange={f("role")} options={CONT_ROLES} />
            <Field label="Phone" value={form.phone} onChange={v => f("phone")(fmtPhoneInput(v))} placeholder="Direct line" />
            <Field label="Email" value={form.email} onChange={f("email")} placeholder="email@org.com" />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes" value={form.notes} onChange={f("notes")} type="textarea" placeholder="What this contact is used for..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" color={C.teal} onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
        {data.map(item => <ContactCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
      </div>
      {data.length === 0 && !editing && <Empty label="No contacts yet" sub="Add key contacts above" />}
    </div>
  );
}

// ── NOTES ─────────────────────────────────────────────────────────────────────
const NOTE_BLANK = { title: "", date: today(), priority: "medium", body: "" };
const PRIORITIES = ["low", "medium", "high"];
const PRIO_COLOR = { low: C.muted, medium: C.accent, high: C.red };

function NoteCard({ item, onEdit, onDelete }) {
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${PRIO_COLOR[item.priority]}44`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 22, flex: 1 }}>{item.title}</div>
        <Badge label={item.priority.toUpperCase()} color={PRIO_COLOR[item.priority]} />
      </div>
      <div style={{ fontSize: 18, color: C.muted, marginBottom: 10 }}>{item.date}</div>
      <div style={{ fontSize: 19, color: C.text, lineHeight: 1.6, marginBottom: 14, whiteSpace: "pre-wrap" }}>{item.body}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn small label="Edit" color={C.orange} onClick={onEdit} />
        <ActionBtn small label="Delete" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function NotesSection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(NOTE_BLANK);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm(NOTE_BLANK); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const save = () => {
    if (!form.title.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));

  const sorted = [...data].sort((a, b) => {
    const po = { high: 0, medium: 1, low: 2 };
    return po[a.priority] - po[b.priority] || b.date.localeCompare(a.date);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: C.muted, fontSize: 20 }}>{data.length} note{data.length !== 1 ? "s" : ""}</div>
        <ActionBtn label="+ Add Note" color={C.orange} onClick={openNew} />
      </div>
      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${C.orange}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: C.orange }}>{editing === "new" ? "New Note" : "Edit Note"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Title" value={form.title} onChange={f("title")} placeholder="Note title..." />
            </div>
            <Field label="Date" value={form.date} onChange={f("date")} type="date" />
            <Field label="Priority" value={form.priority} onChange={f("priority")} options={PRIORITIES} />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Body" value={form.body} onChange={f("body")} type="textarea" placeholder="Details..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" color={C.orange} onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {sorted.map(item => <NoteCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
      </div>
      {data.length === 0 && !editing && <Empty label="No notes yet" sub="Capture reminders and checklist items above" />}
    </div>
  );
}

// ── BROKER DEALER ─────────────────────────────────────────────────────────────
const BD_PINK = "#e879f9";
const BD_BLANK = { name: "", crd: "", repCode: "", contactName: "", phone: "", email: "", website: "", osj: "", notes: "" };

function BDCard({ item, onEdit, onDelete }) {
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${BD_PINK}33`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 26 }}>{item.name}</div>
          {item.crd && <div style={{ fontSize: 18, color: C.muted, marginTop: 2 }}>CRD# {item.crd}</div>}
        </div>
        {item.repCode && <Badge label={`Rep Code: ${item.repCode}`} color={BD_PINK} />}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 19, marginBottom: 10 }}>
        {item.contactName && <div><span style={{ color: C.muted }}>Contact: </span>{item.contactName}</div>}
        {item.osj && <div><span style={{ color: C.muted }}>OSJ: </span>{item.osj}</div>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 19, marginBottom: 10 }}>
        {item.phone && <a href={`tel:${item.phone}`} style={{ color: C.teal, textDecoration: "none" }}>📞 {fmtPhone(item.phone)}</a>}
        {item.email && <a href={`mailto:${item.email}`} style={{ color: C.accent, textDecoration: "none" }}>✉ {item.email}</a>}
        {item.website && <a href={item.website} target="_blank" rel="noreferrer" style={{ color: BD_PINK, textDecoration: "none" }}>🔗 Website</a>}
      </div>
      {item.notes && <div style={{ fontSize: 19, color: C.muted, marginBottom: 12 }}>{item.notes}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn small label="Edit" color={BD_PINK} onClick={onEdit} />
        <ActionBtn small label="Delete" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function BDSection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BD_BLANK);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm(BD_BLANK); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const save = () => {
    if (!form.name.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: C.muted, fontSize: 20 }}>{data.length} broker dealer{data.length !== 1 ? "s" : ""} on file</div>
        <ActionBtn label="+ Add Broker Dealer" color={BD_PINK} onClick={openNew} />
      </div>
      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${BD_PINK}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: BD_PINK }}>{editing === "new" ? "New Broker Dealer" : "Edit Broker Dealer"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Broker Dealer Name" value={form.name} onChange={f("name")} placeholder="Firm name" />
            </div>
            <Field label="CRD Number" value={form.crd} onChange={f("crd")} placeholder="FINRA CRD #" />
            <Field label="Rep / Agent Code" value={form.repCode} onChange={f("repCode")} placeholder="Your rep code" />
            <Field label="Primary Contact" value={form.contactName} onChange={f("contactName")} placeholder="Home office contact" />
            <Field label="OSJ Location" value={form.osj} onChange={f("osj")} placeholder="City, ST" />
            <Field label="Phone" value={form.phone} onChange={v => f("phone")(fmtPhoneInput(v))} placeholder="800-000-0000" />
            <Field label="Email" value={form.email} onChange={f("email")} placeholder="support@bd.com" />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Website" value={form.website} onChange={f("website")} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes" value={form.notes} onChange={f("notes")} type="textarea" placeholder="Clearing firm, compliance notes, platform details..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" color={BD_PINK} onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {data.map(item => <BDCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
      </div>
      {data.length === 0 && !editing && <Empty label="No broker dealers on file" sub="Add your BD relationships above" />}
    </div>
  );
}

// ── FMO ───────────────────────────────────────────────────────────────────────
const FMO_BLUE = "#38bdf8";
const FMO_TYPES = ["FMO", "IMO", "NMO", "MGA", "GA", "Direct"];
const FMO_BLANK = { name: "", type: "FMO", contactName: "", phone: "", email: "", website: "", products: "", contractLevel: "", notes: "" };

function FMOCard({ item, onEdit, onDelete }) {
  return (
    <div className="fade-in" style={{ background: C.card, border: `1px solid ${FMO_BLUE}33`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 26 }}>{item.name}</div>
          {item.contactName && <div style={{ fontSize: 19, color: C.muted, marginTop: 2 }}>{item.contactName}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          <Badge label={item.type} color={FMO_BLUE} />
          {item.contractLevel && <Badge label={item.contractLevel} color={C.gold} />}
        </div>
      </div>
      {item.products && (
        <div style={{ fontSize: 19, marginBottom: 8 }}>
          <span style={{ color: C.muted }}>Products: </span><span>{item.products}</span>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 19, marginBottom: 10 }}>
        {item.phone && <a href={`tel:${item.phone}`} style={{ color: C.teal, textDecoration: "none" }}>📞 {fmtPhone(item.phone)}</a>}
        {item.email && <a href={`mailto:${item.email}`} style={{ color: C.accent, textDecoration: "none" }}>✉ {item.email}</a>}
        {item.website && <a href={item.website} target="_blank" rel="noreferrer" style={{ color: FMO_BLUE, textDecoration: "none" }}>🔗 Website</a>}
      </div>
      {item.notes && <div style={{ fontSize: 19, color: C.muted, marginBottom: 12 }}>{item.notes}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn small label="Edit" color={FMO_BLUE} onClick={onEdit} />
        <ActionBtn small label="Delete" color={C.red} onClick={onDelete} />
      </div>
    </div>
  );
}

function FMOSection({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(FMO_BLANK);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setForm(FMO_BLANK); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const save = () => {
    if (!form.name.trim()) return;
    setData(editing === "new"
      ? [...data, { ...form, id: uid() }]
      : data.map(d => d.id === editing ? { ...form, id: editing } : d));
    setEditing(null);
  };
  const del = (id) => setData(data.filter(d => d.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: C.muted, fontSize: 20 }}>{data.length} FMO / IMO relationship{data.length !== 1 ? "s" : ""}</div>
        <ActionBtn label="+ Add FMO / IMO" color={FMO_BLUE} onClick={openNew} />
      </div>
      {editing && (
        <div className="fade-in" style={{ background: C.navy700, border: `1px solid ${FMO_BLUE}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, color: FMO_BLUE }}>{editing === "new" ? "New FMO / IMO" : "Edit FMO / IMO"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Organization Name" value={form.name} onChange={f("name")} placeholder="FMO / IMO name" />
            </div>
            <Field label="Type" value={form.type} onChange={f("type")} options={FMO_TYPES} />
            <Field label="Primary Contact" value={form.contactName} onChange={f("contactName")} placeholder="Rep or account manager" />
            <Field label="Phone" value={form.phone} onChange={v => f("phone")(fmtPhoneInput(v))} placeholder="800-000-0000" />
            <Field label="Email" value={form.email} onChange={f("email")} placeholder="contact@fmo.com" />
            <Field label="Products / Lines" value={form.products} onChange={f("products")} placeholder="Life, Annuities, LTC..." />
            <Field label="Contract Level" value={form.contractLevel} onChange={f("contractLevel")} placeholder="Street, 105%, etc." />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Website" value={form.website} onChange={f("website")} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes" value={form.notes} onChange={f("notes")} type="textarea" placeholder="Carrier appointments, commission details, support contacts..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="Save" color={FMO_BLUE} onClick={save} />
            <ActionBtn label="Cancel" color={C.muted} onClick={() => setEditing(null)} />
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {data.map(item => <FMOCard key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => del(item.id)} />)}
      </div>
      {data.length === 0 && !editing && <Empty label="No FMO / IMO relationships on file" sub="Add your marketing organizations above" />}
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
const SETTINGS_SLATE = "#64748b";
const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const MONTH_NAMES = { "01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December" };

const W_CATS_DEFAULT = ["Mutual Funds", "Variable Annuities", "Fixed Indexed Annuities", "Fixed Annuities", "Alternative Investments", "Managed Money", "ETFs", "Life Insurance", "Long-Term Care", "Banking", "Other"];
const CE_TYPES_DEFAULT = ["CFP CE", "Ethics", "Insurance", "Securities", "State Reg", "Other"];
const LIC_STATUSES_DEFAULT = ["Active", "Pending Renewal", "Expired", "Inactive"];
const CONT_ROLES_DEFAULT = ["Compliance", "Operations", "Regulator", "Regulatory", "Custodian", "Attorney", "CPA", "Technology", "Vendor", "Other"];
const FMO_TYPES_DEFAULT = ["FMO", "IMO", "NMO", "MGA", "GA", "Direct"];

function EditableList({ title, color, icon, items, setItems }) {
  const [newItem, setNewItem] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");

  const add = () => { if (newItem.trim() && !items.includes(newItem.trim())) { setItems([...items, newItem.trim()]); setNewItem(""); } };
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const startEdit = (i) => { setEditIdx(i); setEditVal(items[i]); };
  const saveEdit = () => { if (editVal.trim()) { const next = [...items]; next[editIdx] = editVal.trim(); setItems(next); } setEditIdx(null); };
  const move = (i, dir) => { const next = [...items]; [next[i], next[i + dir]] = [next[i + dir], next[i]]; setItems(next); };

  const inputS = { background: C.navy700, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 11px", color: C.text, fontSize: 19, outline: "none" };

  return (
    <div style={{ background: C.card, border: `1px solid ${color}33`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <span>{icon}</span><span style={{ color }}>{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 18, color: C.muted }}>{items.length} items</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.navy700, borderRadius: 8, padding: "6px 10px" }}>
            {editIdx === i ? (
              <>
                <input value={editVal} onChange={e => setEditVal(e.target.value)} style={{ ...inputS, flex: 1 }}
                  onKeyDown={e => e.key === "Enter" && saveEdit()} autoFocus />
                <ActionBtn small label="✓" color={C.green} onClick={saveEdit} />
                <ActionBtn small label="✕" color={C.muted} onClick={() => setEditIdx(null)} />
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontSize: 19 }}>{item}</span>
                <button onClick={() => move(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, opacity: i === items.length - 1 ? 0.3 : 1 }}>↓</button>
                <ActionBtn small label="Edit" color={color} onClick={() => startEdit(i)} />
                <ActionBtn small label="✕" color={C.red} onClick={() => remove(i)} />
              </>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder={`Add new ${title.toLowerCase().replace(/s$/, "")}...`}
          style={{ ...inputS, flex: 1 }} onKeyDown={e => e.key === "Enter" && add()} />
        <ActionBtn label="+ Add" color={color} onClick={add} />
      </div>
    </div>
  );
}

function SettingsSection({ db, setDb }) {
  const [subTab, setSubTab] = useState("profile");
  const [profile, setProfile] = useState({ ...db.advisorProfile });
  const [appCfg, setAppCfg] = useState({ ...db.appSettings });
  const [saved, setSaved] = useState(false);

  const fp = (k) => (v) => setProfile(p => ({ ...p, [k]: v }));
  const fa = (k) => (v) => setAppCfg(p => ({ ...p, [k]: v }));

  const saveProfile = () => { setDb(p => ({ ...p, advisorProfile: profile })); flash(); };
  const saveApp = () => { setDb(p => ({ ...p, appSettings: appCfg })); flash(); };
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  const inputBase = { width: "100%", background: C.navy700, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 20, outline: "none" };
  const SLabel = ({ children }) => <div style={{ fontSize: 17, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{children}</div>;
  const SRow = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <SLabel>{label}</SLabel>
      {children}
    </div>
  );
  const SInput = ({ value, onChange, placeholder, type = "text" }) => (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputBase} />
  );
  const SSelect = ({ value, onChange, options }) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={inputBase}>
      {options.map(o => <option key={Array.isArray(o) ? o[0] : o} value={Array.isArray(o) ? o[0] : o}>{Array.isArray(o) ? o[1] : o}</option>)}
    </select>
  );
  const STextarea = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ ...inputBase, resize: "vertical", lineHeight: 1.6 }} />
  );
  const SDivider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
      <div style={{ fontSize: 17, color: SETTINGS_SLATE, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );

  const subTabs = [
    { id: "profile",    label: "👤 Advisor Profile" },
    { id: "categories", label: "🏷️ Categories & Lists" },
    { id: "app",        label: "🔧 App Preferences" },
    { id: "data",       label: "💾 Data Management" },
  ];

  return (
    <div className="fade-in">
      {saved && (
        <div style={{ position: "fixed", top: 24, right: 24, background: C.green, color: "#fff", fontWeight: 700,
          padding: "10px 20px", borderRadius: 10, fontSize: 20, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          ✓ Saved
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {subTabs.map(t => {
          const on = subTab === t.id;
          return (
            <button key={t.id} onClick={() => setSubTab(t.id)}
              style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${on ? C.bannerBlue : C.border}`,
                background: on ? C.bannerBlue : "#ffffff", color: on ? "#ffffff" : C.text,
                fontWeight: on ? 700 : 600, fontSize: 19, cursor: "pointer", transition: "all 0.15s" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {subTab === "profile" && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <SDivider label="Identity" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18, marginTop: 14 }}>
            <SRow label="Full Name"><SInput value={profile.name} onChange={fp("name")} placeholder="Your full name" /></SRow>
            <SRow label="Title / Designation"><SInput value={profile.title} onChange={fp("title")} placeholder="e.g. Financial Advisor, CFP®" /></SRow>
            <SRow label="Firm Name"><SInput value={profile.firm} onChange={fp("firm")} placeholder="Russell Wealth Group" /></SRow>
            <SRow label="Website"><SInput value={profile.website} onChange={fp("website")} placeholder="https://..." /></SRow>
          </div>

          <SDivider label="Regulatory IDs" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18, marginTop: 14 }}>
            <SRow label="CRD Number"><SInput value={profile.crd} onChange={fp("crd")} placeholder="FINRA CRD #" /></SRow>
            <SRow label="NPN (Insurance)"><SInput value={profile.npn} onChange={fp("npn")} placeholder="National Producer #" /></SRow>
            <SRow label="NPI (if applicable)"><SInput value={profile.npi} onChange={fp("npi")} placeholder="NPI #" /></SRow>
          </div>

          <SDivider label="Contact Info" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18, marginTop: 14 }}>
            <SRow label="Email"><SInput value={profile.email} onChange={fp("email")} placeholder="you@firm.com" type="email" /></SRow>
            <SRow label="Phone"><SInput value={profile.phone} onChange={v => fp("phone")(fmtPhoneInput(v))} placeholder="Direct line" /></SRow>
            <SRow label="Street Address"><SInput value={profile.address} onChange={fp("address")} placeholder="123 Main St" /></SRow>
            <SRow label="City"><SInput value={profile.city} onChange={fp("city")} placeholder="City" /></SRow>
            <SRow label="State"><SSelect value={profile.state} onChange={fp("state")} options={US_STATES} /></SRow>
            <SRow label="ZIP"><SInput value={profile.zip} onChange={fp("zip")} placeholder="ZIP code" /></SRow>
          </div>

          <SDivider label="Bio / About" />
          <div style={{ marginTop: 14, marginBottom: 20 }}>
            <STextarea value={profile.bio} onChange={fp("bio")} placeholder="Brief professional bio, specialty areas, or notes about your practice..." rows={4} />
          </div>

          <ActionBtn label="Save Profile" color={SETTINGS_SLATE} onClick={saveProfile} />
        </div>
      )}

      {subTab === "categories" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <EditableList title="Wholesaler Categories" color={C.accent} icon="🤝" items={db.wholesalerCategories || W_CATS_DEFAULT} setItems={(v) => setDb(p => ({ ...p, wholesalerCategories: v }))} />
          <EditableList title="Phone Number Types" color={C.teal} icon="📞" items={db.phoneTypes || PHONE_TYPES} setItems={(v) => setDb(p => ({ ...p, phoneTypes: v }))} />
          <EditableList title="CE Credit Types" color={C.gold} icon="🎓" items={db.ceTypes || CE_TYPES_DEFAULT} setItems={(v) => setDb(p => ({ ...p, ceTypes: v }))} />
          <EditableList title="License Statuses" color={C.green} icon="📋" items={db.licenseStatuses || LIC_STATUSES_DEFAULT} setItems={(v) => setDb(p => ({ ...p, licenseStatuses: v }))} />
          <EditableList title="Contact Roles" color={C.teal} icon="👥" items={db.contactRoles || CONT_ROLES_DEFAULT} setItems={(v) => setDb(p => ({ ...p, contactRoles: v }))} />
          <EditableList title="FMO / IMO Types" color={FMO_BLUE} icon="🌐" items={db.fmoTypes || FMO_TYPES_DEFAULT} setItems={(v) => setDb(p => ({ ...p, fmoTypes: v }))} />
        </div>
      )}

      {subTab === "app" && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <SDivider label="CE Tracking" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14, marginBottom: 18 }}>
            <SRow label="CE Goal (Hours)"><SInput value={appCfg.ceGoalHours} onChange={fa("ceGoalHours")} placeholder="30" type="number" /></SRow>
            <SRow label="CE Goal Period"><SSelect value={appCfg.ceGoalPeriod} onChange={fa("ceGoalPeriod")} options={["1 year","2 years","3 years"]} /></SRow>
          </div>

          <SDivider label="Expiration Alerts" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14, marginBottom: 18 }}>
            <SRow label="Warn this many days before expiry">
              <SSelect value={appCfg.showExpiringDays} onChange={fa("showExpiringDays")} options={["30","60","90","120","180"]} />
            </SRow>
            <SRow label="Practice Fiscal Year Start">
              <SSelect value={appCfg.practiceYearStart} onChange={fa("practiceYearStart")} options={MONTHS.map(m => [m, MONTH_NAMES[m]])} />
            </SRow>
          </div>

          <SDivider label="Defaults" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14, marginBottom: 20 }}>
            <SRow label="Default Phone Entry Type">
              <SSelect value={appCfg.defaultPhoneType} onChange={fa("defaultPhoneType")} options={PHONE_TYPES} />
            </SRow>
          </div>

          <ActionBtn label="Save Preferences" color={SETTINGS_SLATE} onClick={saveApp} />
        </div>
      )}

      {subTab === "data" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>📤 Export Data</div>
            <div style={{ fontSize: 19, color: C.muted, marginBottom: 14 }}>Download all your Advisor Toolbox data as a JSON file.</div>
            <ActionBtn label="Download JSON Backup" color={C.accent} onClick={() => {
              const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url;
              a.download = `advisor-toolbox-backup-${today()}.json`; a.click();
              URL.revokeObjectURL(url);
            }} />
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>📥 Import Data</div>
            <div style={{ fontSize: 19, color: C.muted, marginBottom: 14 }}>Restore from a previously exported JSON backup. <span style={{ color: C.red, fontWeight: 600 }}>This will overwrite all current data.</span></div>
            <label style={{ display: "inline-block", background: C.green + "22", border: `1px solid ${C.green}55`, color: C.green,
              padding: "7px 16px", borderRadius: 8, fontSize: 19, fontWeight: 700, cursor: "pointer" }}>
              Choose Backup File
              <input type="file" accept=".json" style={{ display: "none" }} onChange={e => {
                const file = e.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => { try { setDb(JSON.parse(ev.target.result)); flash(); } catch { alert("Invalid backup file."); } };
                reader.readAsText(file);
              }} />
            </label>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.red}33`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: C.red }}>🗑️ Clear Section Data</div>
            <div style={{ fontSize: 19, color: C.muted, marginBottom: 16 }}>Permanently delete all records from a specific section. Cannot be undone.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                ["Wholesalers", "wholesalers", []],
                ["Broker Dealers", "bd", []],
                ["FMOs", "fmo", []],
                ["CE Records", "ce", []],
                ["Licenses", "licenses", []],
                ["Credentials", "credentials", []],
                ["Contacts", "contacts", []],
                ["Notes", "notes", []],
              ].map(([label, key, empty]) => (
                <button key={key} onClick={() => {
                  if (window.confirm(`Clear ALL ${label}? This cannot be undone.`)) setDb(p => ({ ...p, [key]: empty }));
                }} style={{ background: C.red + "15", border: `1px solid ${C.red}44`, color: C.red,
                  padding: "6px 14px", borderRadius: 7, fontSize: 18, fontWeight: 600, cursor: "pointer" }}>
                  Clear {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STATS / PRACTICE OVERVIEW ─────────────────────────────────────────────────
function StatsSection({ db, onNavigate }) {
  const totalCE = db.ce.reduce((s, c) => s + parseFloat(c.hours || 0), 0);
  const expLic = db.licenses.filter(l => l.expires && l.expires !== "N/A" && new Date(l.expires) < new Date(Date.now() + 90 * 86400000));
  const expCred = db.credentials.filter(c => c.renewalDate && new Date(c.renewalDate) < new Date(Date.now() + 180 * 86400000));
  const intW = db.wholesalers.filter(w => w.wholesalerType === "Internal").length;
  const extW = db.wholesalers.filter(w => w.wholesalerType !== "Internal").length;

  const cards = [
    { label: "Total Wholesalers & Vendors", to: "wholesalers", value: db.wholesalers.length, sub: `${intW} internal · ${extW} external`, color: C.bannerBlue, icon: "🤝" },
    { label: "Broker Dealers", to: "bd", value: db.bd.length, sub: "on file", color: C.bannerBlue, icon: "🏦" },
    { label: "FMO / IMO Relationships", to: "fmo", value: db.fmo.length, sub: "marketing orgs", color: C.bannerBlue, icon: "🌐" },
    { label: "CE Hours Logged", to: "ce_licenses", value: totalCE.toFixed(1), sub: `${db.ce.length} course${db.ce.length !== 1 ? "s" : ""}`, color: C.bannerBlue, icon: "🎓" },
    { label: "Licenses & E&O", to: "ce_licenses", value: db.licenses.length, sub: db.licenses.filter(l => l.status === "Active").length + " active", color: C.bannerBlue, icon: "📋" },
    { label: "Designations", to: "credentials", value: db.credentials.length, sub: "credentials on file", color: C.bannerBlue, icon: "🏅" },
    { label: "Key Contacts", to: "contacts", value: db.contacts.length, sub: "saved contacts", color: C.bannerBlue, icon: "📞" },
    { label: "Advisor Notes", to: "notes", value: db.notes.length, sub: db.notes.filter(n => n.priority === "high").length + " high priority", color: C.bannerBlue, icon: "📝" },
  ];

  const alerts = [
    ...expLic.map(l => ({ type: "License", name: l.type, date: l.expires, color: C.red })),
    ...expCred.map(c => ({ type: "Credential Renewal", name: c.designation, date: c.renewalDate, color: C.orange })),
  ];

  return (
    <div className="fade-in">
      {alerts.length > 0 && (
        <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: C.orange, marginBottom: 10, fontSize: 20 }}>⚠️ Attention Required</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 19, color: C.text }}>
                <span><Badge label={a.type} color={a.color} /> <span style={{ marginLeft: 8 }}>{a.name}</span></span>
                <span style={{ color: a.color, fontWeight: 600 }}>Expires {a.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {cards.map(s => (
          <div key={s.label} className="stat-tile" onClick={() => onNavigate && onNavigate(s.to)}
            role="button" tabIndex={0}
            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && onNavigate) { e.preventDefault(); onNavigate(s.to); } }}
            title={`Go to ${s.label}`}
            style={{ background: C.card, border: `1px solid ${s.color}55`, borderTop: `3px solid ${s.color}`, borderRadius: 8, padding: "20px 18px" }}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.text, marginTop: 6 }}>{s.label}</div>
            <div style={{ fontSize: 17, color: C.muted, marginTop: 3 }}>{s.sub}</div>
            <div style={{ fontSize: 18, color: s.color, marginTop: 10, fontWeight: 700 }}>Open →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function AdvisorToolbox() {
  const [active, setActive] = useState("wholesalers");
  const [db, setDb] = useState(SEED);
  const setSection = (sec) => (val) => setDb(p => ({ ...p, [sec]: val }));

  const activeSection = SECTIONS.find(s => s.id === active);

  return (
    <div style={{ minHeight: "100vh", background: C.navy900 }}>
      <style>{styles}</style>

      <div style={{ background: C.navy800, borderBottom: `3px solid ${C.accent}`, padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.accent, letterSpacing: "0", lineHeight: 1.1 }}>Russell Wealth Group</div>
          <div style={{ fontSize: 19, color: C.text, fontWeight: 700, marginTop: 4, letterSpacing: "0.08em" }}>ADVISOR TOOLBOX</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 17, color: C.muted }}>Last updated</div>
          <div style={{ fontSize: 19, color: C.text, fontWeight: 500, marginTop: 2 }}>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
        </div>
      </div>

      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "28px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginBottom: 26, background: C.navy800, border: `1px solid ${C.border}` }}>
          {SECTIONS.map(s => {
            const isActive = active === s.id;
            const shortLabels = {
              wholesalers: "Wholesalers & Vendors", bd: "Broker Dealer", fmo: "FMO / IMO",
              ce_licenses: "CE & Licensing", credentials: "Credentials",
              contacts: "Contacts", settings: "Settings", notes: "Notes", stats: "Overview"
            };
            return (
              <button key={s.id} onClick={() => setActive(s.id)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "14px 8px", border: `1px solid ${C.border}`, cursor: "pointer", fontWeight: 700, fontSize: 20,
                  background: isActive ? s.color : "#ffffff",
                  color: isActive ? "#ffffff" : C.text,
                  transition: "all 0.12s", lineHeight: 1.3, textAlign: "center" }}>
                <span style={{ fontSize: 36 }}>{s.icon}</span>
                <span>{shortLabels[s.id]}</span>
              </button>
            );
          })}
        </div>

        <div className="cat-banner" style={{ marginBottom: 20, background: activeSection.color, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 34, boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }}>
          <span>{activeSection.icon}</span>
          <span>{activeSection.label}</span>
        </div>

        {active === "wholesalers"  && <WholesalersSection  data={db.wholesalers}  setData={setSection("wholesalers")} />}
        {active === "bd"           && <BDSection           data={db.bd}           setData={setSection("bd")} />}
        {active === "fmo"          && <FMOSection          data={db.fmo}          setData={setSection("fmo")} />}
        {active === "ce_licenses"  && <CombinedCELicSection ceData={db.ce} setCeData={setSection("ce")} licData={db.licenses} setLicData={setSection("licenses")} />}
        {active === "credentials"  && <CredentialsSection  data={db.credentials}  setData={setSection("credentials")} />}
        {active === "contacts"     && <ContactsSection     data={db.contacts}     setData={setSection("contacts")} />}
        {active === "settings"     && <SettingsSection     db={db}                setDb={setDb} />}
        {active === "notes"        && <NotesSection        data={db.notes}        setData={setSection("notes")} />}
        {active === "stats"        && <StatsSection        db={db} onNavigate={setActive} />}
      </div>
    </div>
  );
}
