import { useState, useRef } from "react";

const COLORS = {
  bg: "#0d1f3c",
  bgCard: "#0f1d38",
  bgInput: "#162a4a",
  bgRow: "#0a1628",
  bgRowAlt: "#0d1f3c",
  border: "#1e3a5f",
  accent: "#3b82f6",
  accentHover: "#2563eb",
  accentGold: "#f59e0b",
  accentGreen: "#10b981",
  accentRed: "#ef4444",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textLabel: "#cbd5e1",
};

const ACCOUNT_TYPES = ["Select...", "Individual", "Joint", "IRA", "Roth IRA", "SEP IRA", "SIMPLE IRA", "401(k)", "403(b)", "457(b)", "Pension", "Trust", "Corporate", "Custodial (UTMA)", "529 Plan", "HSA"];
const TRADE_TYPES = ["Select...", "Buy", "Sell", "Buy to Open", "Sell to Close", "Buy to Cover", "Sell Short", "Exchange", "Rebalance", "Rollover", "Transfer In", "Transfer Out", "Dividend Reinvestment"];
const ASSET_CLASSES = ["Select...", "Equity – Domestic", "Equity – International", "Equity – Emerging Markets", "Fixed Income – Treasury", "Fixed Income – Corporate", "Fixed Income – Municipal", "Fixed Income – High Yield", "Cash & Equivalents", "Real Estate (REIT)", "Commodities", "Alternative Investments", "Cryptocurrency", "Options", "ETF", "Mutual Fund", "Annuity – Variable", "Annuity – Fixed", "Annuity – Indexed"];
const ORDER_TYPES = ["Select...", "Market", "Limit", "Stop", "Stop-Limit", "Trailing Stop", "Market on Close", "Limit on Close", "Fill or Kill", "All or None", "Good Till Canceled (GTC)", "Day Order", "Immediate or Cancel (IOC)"];
const TIME_IN_FORCE = ["Select...", "Day", "Good Till Canceled (GTC)", "Good Till Date", "Immediate or Cancel (IOC)", "Fill or Kill (FOK)", "On Open", "On Close"];
const CUSTODIANS = ["Select...", "Schwab", "Fidelity", "TD Ameritrade", "Pershing", "LPL Financial", "Raymond James", "Ameriprise", "Edward Jones", "Vanguard", "BlackRock", "Merrill Lynch", "Morgan Stanley", "UBS", "Wells Fargo Advisors", "Other"];
const SETTLEMENT = ["Select...", "T+1", "T+2", "T+3", "Same Day", "Cash"];
const STATUS = ["Pending", "Submitted", "Filled", "Partially Filled", "Cancelled", "Rejected", "Expired", "On Hold"];
const RISK_LEVELS = ["Select...", "Conservative", "Moderately Conservative", "Moderate", "Moderately Aggressive", "Aggressive"];
const SOLICITED = ["Select...", "Solicited", "Unsolicited"];
const DISCRETION = ["Select...", "Discretionary", "Non-Discretionary"];
const TAX_LOT = ["Select...", "FIFO", "LIFO", "Specific Lot", "Average Cost", "Highest Cost", "Lowest Cost"];

const PRODUCT_TYPES = [
  "Select...",
  "Fixed Annuity",
  "Fixed Indexed Annuity (FIA)",
  "Variable Annuity",
  "RILA – Registered Index-Linked Annuity",
  "Immediate Annuity (SPIA)",
  "Deferred Income Annuity (DIA)",
  "Multi-Year Guaranteed Annuity (MYGA)",
  "Long-Term Care Insurance",
  "Life Insurance – Term",
  "Life Insurance – Whole Life",
  "Life Insurance – Universal Life",
  "Life Insurance – Indexed Universal Life (IUL)",
  "Life Insurance – Variable Universal Life (VUL)",
  "Disability Income Insurance",
  "Medicare Supplement",
  "Mutual Fund",
  "ETF (Exchange-Traded Fund)",
  "Individual Stock – Equity",
  "Individual Bond – Fixed Income",
  "Alternative Investment",
  "Real Estate Investment Trust (REIT)",
  "Oil & Gas – Direct Participation",
  "Oil & Gas – MLP",
  "Private Equity",
  "Hedge Fund",
  "Structured Product",
  "Certificate of Deposit (CD)",
  "Money Market",
  "529 College Savings Plan",
  "Other",
];

const CARRIER_MAP: Record<string, string[]> = {
  "Fixed Annuity": ["Allianz Life", "American Equity", "American National", "Athene Annuity", "AIG / American General", "Fidelity & Guaranty Life (FGL)", "Global Atlantic", "Great Plains Energy", "Lincoln Financial", "Midland National", "Minnesota Life", "Mutual of Omaha", "National Western Life", "North American Company", "Pacific Life", "Principal Financial", "Protective Life", "Puritan Life", "Sagicor Life", "Sentinel Security Life", "Symetra", "Transamerica", "Other"],
  "Fixed Indexed Annuity (FIA)": ["Allianz Life", "American Equity", "American National", "Athene Annuity", "AIG / American General", "Fidelity & Guaranty Life (FGL)", "Global Atlantic", "Jackson National Life", "Lincoln Financial", "Midland National", "Minnesota Life", "Mutual of Omaha", "National Western Life", "North American Company", "Pacific Life", "Principal Financial", "Protective Life", "Sammons Financial", "Symetra", "Transamerica", "Other"],
  "Variable Annuity": ["AIG / American General", "Allianz Life", "Brighthouse Financial", "Equitable (AXA)", "Global Atlantic", "Jackson National Life", "John Hancock", "Lincoln Financial", "Minnesota Life", "Nationwide", "Pacific Life", "Principal Financial", "Protective Life", "Prudential", "Transamerica", "Other"],
  "RILA – Registered Index-Linked Annuity": ["Allianz Life", "Brighthouse Financial", "Equitable (AXA)", "Global Atlantic", "Lincoln Financial", "Pacific Life", "Principal Financial", "Protective Life", "Prudential", "Transamerica", "Other"],
  "Immediate Annuity (SPIA)": ["American General", "American National", "Athene Annuity", "Guardian Life", "Lincoln Financial", "MassMutual", "Mutual of Omaha", "New York Life", "Pacific Life", "Principal Financial", "Protective Life", "Transamerica", "Other"],
  "Deferred Income Annuity (DIA)": ["American General", "Guardian Life", "Lincoln Financial", "MassMutual", "New York Life", "Pacific Life", "Principal Financial", "Protective Life", "Transamerica", "Other"],
  "Multi-Year Guaranteed Annuity (MYGA)": ["Allianz Life", "American Equity", "American National", "Athene Annuity", "Fidelity & Guaranty Life (FGL)", "Global Atlantic", "Midland National", "Mutual of Omaha", "National Western Life", "North American Company", "Pacific Life", "Protective Life", "Sagicor Life", "Symetra", "Transamerica", "Other"],
  "Long-Term Care Insurance": ["Brighthouse Financial", "Genworth Financial", "Global Atlantic", "John Hancock", "Lincoln Financial", "MassMutual", "Mutual of Omaha", "National Guardian Life", "New York Life", "Northwestern Mutual", "Pacific Life", "Principal Financial", "Protective Life", "Securian Financial", "Transamerica", "Other"],
  "Life Insurance – Term": ["AIG / American General", "Banner Life", "Foresters Financial", "Guardian Life", "John Hancock", "Legal & General America", "Lincoln Financial", "MassMutual", "Minnesota Life", "Mutual of Omaha", "New York Life", "Northwestern Mutual", "Pacific Life", "Principal Financial", "Protective Life", "Prudential", "Sagicor Life", "Symetra", "Transamerica", "Other"],
  "Life Insurance – Whole Life": ["Guardian Life", "MassMutual", "Mutual of Omaha", "New York Life", "Northwestern Mutual", "Ohio National", "Pacific Life", "Penn Mutual", "Principal Financial", "Securian Financial", "State Farm", "Other"],
  "Life Insurance – Universal Life": ["AIG / American General", "Allianz Life", "Columbus Life", "Guardian Life", "John Hancock", "Lincoln Financial", "MassMutual", "Minnesota Life", "Mutual of Omaha", "National Western Life", "Pacific Life", "Penn Mutual", "Principal Financial", "Protective Life", "Prudential", "Securian Financial", "Symetra", "Transamerica", "Other"],
  "Life Insurance – Indexed Universal Life (IUL)": ["AIG / American General", "Allianz Life", "American National", "Columbus Life", "Global Atlantic", "John Hancock", "Lincoln Financial", "Minnesota Life", "Mutual of Omaha", "National Western Life", "North American Company", "Pacific Life", "Penn Mutual", "Principal Financial", "Protective Life", "Sammons Financial", "Securian Financial", "Symetra", "Transamerica", "Other"],
  "Life Insurance – Variable Universal Life (VUL)": ["AIG / American General", "Brighthouse Financial", "Equitable (AXA)", "John Hancock", "Lincoln Financial", "MassMutual", "Minnesota Life", "Pacific Life", "Principal Financial", "Protective Life", "Prudential", "Securian Financial", "Transamerica", "Other"],
  "Disability Income Insurance": ["Guardian Life", "MassMutual", "Mutual of Omaha", "Northwestern Mutual", "Principal Financial", "Standard Insurance", "Sun Life", "Transamerica", "Unum", "Other"],
  "Medicare Supplement": ["AARP / UnitedHealthcare", "Aetna", "Anthem Blue Cross", "Blue Cross Blue Shield", "Cigna", "Humana", "Mutual of Omaha", "State Farm", "Transamerica", "United American Insurance", "Other"],
  "Mutual Fund": ["American Funds (Capital Group)", "BlackRock", "Columbia Threadneedle", "Dimensional Fund Advisors (DFA)", "Fidelity Investments", "Franklin Templeton", "Goldman Sachs Asset Mgmt", "Invesco", "JPMorgan Asset Management", "Lord Abbett", "MFS Investment Management", "Neuberger Berman", "Nuveen", "PIMCO", "Putnam Investments", "T. Rowe Price", "Vanguard", "Victory Capital", "Other"],
  "ETF (Exchange-Traded Fund)": ["BlackRock (iShares)", "Fidelity Investments", "Invesco", "JPMorgan Asset Management", "PIMCO", "Schwab Asset Management", "State Street (SPDR)", "T. Rowe Price", "Vanguard", "WisdomTree", "Other"],
  "Individual Stock – Equity": ["Direct / Brokerage", "Other"],
  "Individual Bond – Fixed Income": ["Direct / Brokerage", "Treasury Direct", "Other"],
  "Alternative Investment": ["Blackstone", "Blue Owl Capital", "Brookfield Asset Management", "Carlyle Group", "Griffin-American Healthcare", "KKR", "NexPoint", "Oaktree Capital", "Owl Rock", "PIMCO", "Starwood Capital", "Other"],
  "Real Estate Investment Trust (REIT)": ["American Realty Capital", "Blackstone REIT", "Broadstone Net Lease", "CIM Real Estate", "Griffin-American Healthcare REIT", "Hines Real Estate", "KBS Real Estate", "NexPoint Real Estate", "Starwood Real Estate", "Other"],
  "Oil & Gas – Direct Participation": ["Canaan Energy", "Concho Resources", "Devon Energy", "Pioneer Natural Resources", "Viper Energy", "Other"],
  "Oil & Gas – MLP": ["Enterprise Products Partners", "Energy Transfer", "Magellan Midstream", "Plains All American", "Other"],
  "Private Equity": ["Apollo Global Management", "Blackstone", "Carlyle Group", "Goldman Sachs Private Equity", "KKR", "TPG Capital", "Other"],
  "Hedge Fund": ["Direct / Advisor Access", "Other"],
  "Structured Product": ["Direct / Brokerage", "Other"],
  "Certificate of Deposit (CD)": ["Bank / Credit Union", "Brokered CD", "Other"],
  "Money Market": ["Fidelity Investments", "Schwab Asset Management", "T. Rowe Price", "Vanguard", "Other"],
  "529 College Savings Plan": ["American Funds (CollegeAmerica)", "Fidelity Investments", "ScholarShare (Fidelity)", "T. Rowe Price", "Utah Educational Savings Plan", "Vanguard", "Other"],
  "Other": ["Other"],
};

const PRODUCT_TO_PREFERRED_KEY: Record<string, string> = {
  "Fixed Annuity": "preferredFixedAnnuities",
  "Fixed Indexed Annuity (FIA)": "preferredFIAs",
  "Variable Annuity": "preferredVariableAnnuities",
  "RILA – Registered Index-Linked Annuity": "preferredRILAs",
  "Immediate Annuity (SPIA)": "preferredFixedAnnuities",
  "Deferred Income Annuity (DIA)": "preferredFixedAnnuities",
  "Multi-Year Guaranteed Annuity (MYGA)": "preferredMYGAs",
  "Long-Term Care Insurance": "preferredLTC",
  "Life Insurance – Term": "preferredLifeInsurance",
  "Life Insurance – Whole Life": "preferredLifeInsurance",
  "Life Insurance – Universal Life": "preferredLifeInsurance",
  "Life Insurance – Indexed Universal Life (IUL)": "preferredLifeInsurance",
  "Life Insurance – Variable Universal Life (VUL)": "preferredLifeInsurance",
  "Disability Income Insurance": "preferredLifeInsurance",
  "Medicare Supplement": "preferredLTC",
  "Mutual Fund": "preferredMutualFunds",
  "ETF (Exchange-Traded Fund)": "preferredETFs",
  "Alternative Investment": "preferredAlts",
  "Real Estate Investment Trust (REIT)": "preferredAlts",
  "Oil & Gas – Direct Participation": "preferredAlts",
  "Oil & Gas – MLP": "preferredAlts",
  "Private Equity": "preferredAlts",
};

const STATUS_COLORS: Record<string, string> = {
  "Pending": COLORS.accentGold,
  "Submitted": COLORS.accent,
  "Filled": COLORS.accentGreen,
  "Partially Filled": "#a78bfa",
  "Cancelled": COLORS.accentRed,
  "Rejected": "#f97316",
  "Expired": COLORS.textMuted,
  "On Hold": "#ec4899",
};

const TRADE_COLORS: Record<string, string> = {
  "Buy": COLORS.accentGreen,
  "Sell": COLORS.accentRed,
  "Exchange": COLORS.accent,
  "Rebalance": "#a78bfa",
};

// ── Interfaces ──────────────────────────────────────────────────────────────

interface Advisor {
  name: string;
  crd: string;
  email: string;
  phone: string;
  title: string;
}

interface StaffMember {
  name: string;
  title: string;
  email: string;
  phone: string;
}

interface Settings {
  firmName: string;
  firmCRD: string;
  firmAddress: string;
  firmCity: string;
  firmState: string;
  firmZip: string;
  firmPhone: string;
  firmEmail: string;
  firmWebsite: string;
  bdName: string;
  bdCRD: string;
  bdOSJAddress: string;
  bdComplianceContact: string;
  bdCompliancePhone: string;
  bdComplianceEmail: string;
  bdClearingFirm: string;
  advisors: Advisor[];
  supportStaff: StaffMember[];
  preferredMutualFunds: string[];
  preferredVariableAnnuities: string[];
  preferredFixedAnnuities: string[];
  preferredFIAs: string[];
  preferredRILAs: string[];
  preferredMYGAs: string[];
  preferredLifeInsurance: string[];
  preferredLTC: string[];
  preferredETFs: string[];
  preferredAlts: string[];
  preferredCustodians: string[];
  complianceNotes: string;
  generalNotes: string;
}

interface TradeRecord {
  id: number;
  tradeDate: string;
  settlementDate: string;
  accountNumber: string;
  clientName: string;
  accountType: string;
  custodian: string;
  tradeType: string;
  assetClass: string;
  ticker: string;
  securityName: string;
  quantity: string;
  price: string;
  totalAmount: string;
  orderType: string;
  limitPrice: string;
  stopPrice: string;
  timeInForce: string;
  settlement: string;
  taxLot: string;
  riskLevel: string;
  productType: string;
  carrier: string;
  solicited: string;
  discretion: string;
  status: string;
  advisor: string;
  notes: string;
}

type FormState = Omit<TradeRecord, "id">;

// ── Helpers ──────────────────────────────────────────────────────────────────

const getCarriers = (productType: string, settings: Settings | null): string[] => {
  if (!productType || productType === "Select...") return ["Select..."];
  const all = CARRIER_MAP[productType] || ["Other"];
  if (!settings) return ["Select...", ...all];
  const prefKey = PRODUCT_TO_PREFERRED_KEY[productType];
  const preferred = prefKey
    ? ((settings[prefKey as keyof Settings] as string[]) || []).filter((p) => all.includes(p))
    : [];
  if (preferred.length === 0) return ["Select...", ...all];
  const rest = all.filter((c) => !preferred.includes(c));
  return ["Select...", "── Preferred ──", ...preferred, "── All Carriers ──", ...rest];
};

// ── Initial state ─────────────────────────────────────────────────────────────

const initialForm: FormState = {
  tradeDate: new Date().toISOString().split("T")[0],
  settlementDate: "",
  accountNumber: "",
  clientName: "",
  accountType: "Select...",
  custodian: "Select...",
  tradeType: "Select...",
  assetClass: "Select...",
  ticker: "",
  securityName: "",
  quantity: "",
  price: "",
  totalAmount: "",
  orderType: "Select...",
  limitPrice: "",
  stopPrice: "",
  timeInForce: "Select...",
  settlement: "Select...",
  taxLot: "Select...",
  riskLevel: "Select...",
  productType: "Select...",
  carrier: "Select...",
  solicited: "Select...",
  discretion: "Select...",
  status: "Pending",
  advisor: "",
  notes: "",
};

let nextId = 1;

const SAMPLE_TRADES: TradeRecord[] = [
  { id: nextId++, tradeDate: "2026-06-17", settlementDate: "", clientName: "Thompson, Robert & Linda", accountNumber: "RWG-10042", accountType: "Joint", custodian: "Schwab", tradeType: "Buy", assetClass: "Equity – Domestic", ticker: "AAPL", securityName: "Apple Inc.", quantity: "100", price: "192.45", totalAmount: "19,245.00", orderType: "Market", limitPrice: "", stopPrice: "", timeInForce: "Day", settlement: "T+1", taxLot: "Select...", status: "Filled", advisor: "Rex Russell", riskLevel: "Moderate", productType: "Select...", carrier: "Select...", solicited: "Solicited", discretion: "Discretionary", notes: "" },
  { id: nextId++, tradeDate: "2026-06-17", settlementDate: "", clientName: "Martinez, Carlos", accountNumber: "RWG-10087", accountType: "IRA", custodian: "Fidelity", tradeType: "Sell", assetClass: "Fixed Income – Corporate", ticker: "LQD", securityName: "iShares iBoxx $ Investment Grade Corp Bond ETF", quantity: "250", price: "107.22", totalAmount: "26,805.00", orderType: "Limit", limitPrice: "107.50", stopPrice: "", timeInForce: "GTC", settlement: "T+2", taxLot: "Select...", status: "Submitted", advisor: "Rex Russell", riskLevel: "Moderately Conservative", productType: "Select...", carrier: "Select...", solicited: "Solicited", discretion: "Non-Discretionary", notes: "Client requested exit before rate announcement" },
  { id: nextId++, tradeDate: "2026-06-16", settlementDate: "", clientName: "Johnson, Patricia", accountNumber: "RWG-10031", accountType: "Roth IRA", custodian: "Schwab", tradeType: "Buy", assetClass: "ETF", ticker: "VTI", securityName: "Vanguard Total Stock Market ETF", quantity: "50", price: "234.10", totalAmount: "11,705.00", orderType: "Market", limitPrice: "", stopPrice: "", timeInForce: "Day", settlement: "T+1", taxLot: "Select...", status: "Filled", advisor: "Rex Russell", riskLevel: "Aggressive", productType: "Select...", carrier: "Select...", solicited: "Unsolicited", discretion: "Discretionary", notes: "" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}

function SelectField({ label, value, onChange, options, required }: SelectFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}{required && <span style={{ color: COLORS.accentRed, marginLeft: 2 }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => { if (!e.target.value.startsWith("──")) onChange(e.target.value); }}
        style={{
          background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6,
          color: value === "Select..." ? COLORS.textMuted : COLORS.text,
          padding: "8px 10px", fontSize: 13, outline: "none", width: "100%", appearance: "none",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o} disabled={o.startsWith("──")}
            style={{ color: o.startsWith("──") ? "#f59e0b" : "#fff", fontWeight: o.startsWith("──") ? 700 : 400, background: "#0d1f3c" }}
          >{o}</option>
        ))}
      </select>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

function InputField({ label, value, onChange, placeholder, type = "text", required }: InputFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}{required && <span style={{ color: COLORS.accentRed, marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6,
          color: COLORS.text, padding: "8px 10px", fontSize: 13, outline: "none", width: "100%",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, background: color + "22", color, border: `1px solid ${color}44`,
      letterSpacing: "0.04em",
    }}>
      {label}
    </span>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.accent }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function SettingsCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: COLORS.bgRow, padding: "12px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.accentGold }}>{title}</span>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function SGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
      {children}
    </div>
  );
}

interface SInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function SInput({ label, value, onChange, placeholder }: SInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        style={{
          background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6,
          color: COLORS.text, padding: "8px 10px", fontSize: 13, outline: "none",
          width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TradeBlotter() {
  const [trades, setTrades] = useState<TradeRecord[]>(SAMPLE_TRADES);
  const [form, setForm] = useState<FormState>(initialForm);
  const [view, setView] = useState<"blotter" | "entry" | "settings">("blotter");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [editId, setEditId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<Settings>({
    firmName: "Russell Wealth Group",
    firmCRD: "", firmAddress: "", firmCity: "", firmState: "", firmZip: "",
    firmPhone: "", firmEmail: "", firmWebsite: "",
    bdName: "", bdCRD: "", bdOSJAddress: "", bdComplianceContact: "",
    bdCompliancePhone: "", bdComplianceEmail: "", bdClearingFirm: "",
    advisors: [{ name: "Rex Russell", crd: "", email: "", phone: "", title: "Financial Advisor" }],
    supportStaff: [{ name: "", title: "", email: "", phone: "" }],
    preferredMutualFunds: ["American Funds (Capital Group)", "Franklin Templeton", "Lord Abbett"],
    preferredVariableAnnuities: ["Jackson National Life", "Lincoln Financial"],
    preferredFixedAnnuities: ["Athene Annuity", "North American Company"],
    preferredFIAs: ["Allianz Life", "American Equity", "Midland National"],
    preferredRILAs: ["Allianz Life", "Brighthouse Financial"],
    preferredMYGAs: ["Athene Annuity", "Fidelity & Guaranty Life (FGL)"],
    preferredLifeInsurance: ["Lincoln Financial", "Pacific Life", "North American Company"],
    preferredLTC: ["Mutual of Omaha", "Nationwide"],
    preferredETFs: ["BlackRock (iShares)", "Vanguard", "State Street (SPDR)"],
    preferredAlts: [],
    preferredCustodians: ["Schwab", "Fidelity"],
    complianceNotes: "", generalNotes: "",
  });

  const setSetting = <K extends keyof Settings>(k: K) => (v: Settings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const updateAdvisor = (i: number, field: keyof Advisor, val: string) =>
    setSettings((s) => {
      const advisors = [...s.advisors];
      advisors[i] = { ...advisors[i], [field]: val };
      return { ...s, advisors };
    });
  const addAdvisor = () =>
    setSettings((s) => ({ ...s, advisors: [...s.advisors, { name: "", crd: "", email: "", phone: "", title: "" }] }));
  const removeAdvisor = (i: number) =>
    setSettings((s) => ({ ...s, advisors: s.advisors.filter((_, idx) => idx !== i) }));

  const updateStaff = (i: number, field: keyof StaffMember, val: string) =>
    setSettings((s) => {
      const supportStaff = [...s.supportStaff];
      supportStaff[i] = { ...supportStaff[i], [field]: val };
      return { ...s, supportStaff };
    });
  const addStaff = () =>
    setSettings((s) => ({ ...s, supportStaff: [...s.supportStaff, { name: "", title: "", email: "", phone: "" }] }));
  const removeStaff = (i: number) =>
    setSettings((s) => ({ ...s, supportStaff: s.supportStaff.filter((_, idx) => idx !== i) }));

  const togglePreferred = (key: keyof Settings, item: string) =>
    setSettings((s) => {
      const list = (s[key] as string[]) || [];
      return { ...s, [key]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item] };
    });

  const setField = (k: keyof FormState) => (v: string) => {
    setForm((f) => {
      const updated: FormState = { ...f, [k]: v };
      if (k === "productType") updated.carrier = "Select...";
      if ((k === "quantity" || k === "price") && updated.quantity && updated.price) {
        const total = parseFloat(updated.quantity) * parseFloat(updated.price);
        updated.totalAmount = isNaN(total)
          ? ""
          : total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      return updated;
    });
  };

  const showToast = (msg: string, color = COLORS.accentGreen) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const handleSave = () => {
    if (!form.clientName || !form.ticker || form.tradeType === "Select..." || form.accountType === "Select...") {
      showToast("Please fill in all required fields.", COLORS.accentRed);
      return;
    }
    if (editId !== null) {
      setTrades((ts) => ts.map((t) => (t.id === editId ? { ...form, id: editId } : t)));
      showToast("Trade updated successfully.");
    } else {
      setTrades((ts) => [{ ...form, id: nextId++ }, ...ts]);
      showToast("Trade entered successfully.");
    }
    setForm(initialForm);
    setEditId(null);
    setView("blotter");
  };

  const handleEdit = (trade: TradeRecord) => {
    const { id: _id, ...rest } = trade;
    void _id;
    setForm(rest);
    setEditId(trade.id);
    setView("entry");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDelete = (id: number) => {
    setTrades((ts) => ts.filter((t) => t.id !== id));
    showToast("Trade removed.", COLORS.accentRed);
  };

  const handleStatusChange = (id: number, status: string) => {
    setTrades((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const filtered = trades.filter((t) => {
    const matchSearch =
      !search ||
      [t.clientName, t.ticker, t.accountNumber, t.securityName]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    const matchType = filterType === "All" || t.tradeType === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const totalValue = filtered.reduce((sum, t) => {
    const n = parseFloat(t.totalAmount?.replace(/,/g, "") || "0");
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const custodianOptions = (() => {
    const all = CUSTODIANS.slice(1);
    const pref = (settings.preferredCustodians || []).filter((c) => all.includes(c));
    const rest = all.filter((c) => !pref.includes(c));
    return pref.length > 0
      ? ["Select...", "── Preferred ──", ...pref, "── All Custodians ──", ...rest]
      : ["Select...", ...all];
  })();

  const navBtn = (label: string, thisView: typeof view, color?: string) => {
    const active = view === thisView;
    const bg = active ? (color || COLORS.accent) : "transparent";
    const fg = active ? (color === COLORS.accentGold ? "#000" : "#fff") : COLORS.textMuted;
    const bd = active ? (color || COLORS.accent) : COLORS.border;
    return (
      <button
        onClick={() => { setView(thisView); if (thisView !== "entry") { setForm(initialForm); setEditId(null); } }}
        style={{ padding: "8px 18px", borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: "pointer", background: bg, color: fg, border: `1px solid ${bd}` }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 14 }}>

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: toast.color, color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "fadeIn 0.2s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>RW</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.01em" }}>Russell Wealth Group</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.06em" }}>TRADE BLOTTER</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {navBtn("📋 BD Blotter", "blotter")}
            <button
              onClick={() => { setView("entry"); setForm(initialForm); setEditId(null); }}
              style={{ padding: "8px 18px", borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: "pointer", background: view === "entry" ? COLORS.accent : "transparent", color: view === "entry" ? "#fff" : COLORS.textMuted, border: `1px solid ${view === "entry" ? COLORS.accent : COLORS.border}` }}
            >+ New Trade</button>
            <button
              onClick={() => setView("settings")}
              style={{ padding: "8px 18px", borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: "pointer", background: view === "settings" ? COLORS.accentGold : "transparent", color: view === "settings" ? "#000" : COLORS.textMuted, border: `1px solid ${view === "settings" ? COLORS.accentGold : COLORS.border}` }}
            >⚙️ Settings</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px" }}>

        {/* Summary Cards */}
        {view === "blotter" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total Trades", value: filtered.length, color: COLORS.accent },
              { label: "Total Value", value: "$" + totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), color: COLORS.accentGold },
              { label: "Filled", value: trades.filter((t) => t.status === "Filled").length, color: COLORS.accentGreen },
              { label: "Pending / Submitted", value: trades.filter((t) => ["Pending", "Submitted"].includes(t.status)).length, color: "#a78bfa" },
              { label: "Cancelled / Rejected", value: trades.filter((t) => ["Cancelled", "Rejected"].includes(t.status)).length, color: COLORS.accentRed },
            ].map((c) => (
              <div key={c.label} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── BLOTTER VIEW ── */}
        {view === "blotter" && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <input
                placeholder="🔍  Search client, ticker, account..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "8px 12px", fontSize: 13, outline: "none", width: 280 }}
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "8px 10px", fontSize: 13, outline: "none", cursor: "pointer" }}>
                <option value="All">All Statuses</option>
                {STATUS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "8px 10px", fontSize: 13, outline: "none", cursor: "pointer" }}>
                <option value="All">All Trade Types</option>
                {TRADE_TYPES.slice(1).map((t) => <option key={t}>{t}</option>)}
              </select>
              <div style={{ marginLeft: "auto", fontSize: 12, color: COLORS.textMuted }}>
                {filtered.length} trade{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
                  <thead>
                    <tr style={{ background: COLORS.bgRow, borderBottom: `2px solid ${COLORS.border}` }}>
                      {["Date", "Client / Account", "Type", "Security", "Qty", "Price", "Total", "Order", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={10} style={{ padding: "40px", textAlign: "center", color: COLORS.textMuted }}>No trades found. Click <strong style={{ color: COLORS.accent }}>+ New Trade</strong> to add one.</td></tr>
                    ) : filtered.map((t, i) => (
                      <tr key={t.id}
                        style={{ background: i % 2 === 0 ? COLORS.bgRowAlt : COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}33` } as React.CSSProperties}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "#162a4a"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? COLORS.bgRowAlt : COLORS.bgCard; }}
                      >
                        <td style={{ padding: "10px 14px", whiteSpace: "nowrap", fontSize: 12, color: COLORS.textLabel }}>{t.tradeDate}</td>
                        <td style={{ padding: "10px 14px", minWidth: 160 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{t.clientName}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.accountNumber} · {t.accountType}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.custodian}</div>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <Badge label={t.tradeType} color={TRADE_COLORS[t.tradeType] || COLORS.accent} />
                        </td>
                        <td style={{ padding: "10px 14px", minWidth: 160 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.accentGold }}>{t.ticker}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.securityName}</div>
                          <div style={{ fontSize: 10, color: COLORS.accent }}>{t.productType && t.productType !== "Select..." ? t.productType : t.assetClass}</div>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>{t.quantity}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>${t.price}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.accentGreen }}>${t.totalAmount}</td>
                        <td style={{ padding: "10px 14px", whiteSpace: "nowrap", fontSize: 12 }}>
                          <div>{t.orderType}</div>
                          <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{t.timeInForce}</div>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <select
                            value={t.status}
                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                            style={{ background: (STATUS_COLORS[t.status] || COLORS.accent) + "22", border: `1px solid ${(STATUS_COLORS[t.status] || COLORS.accent)}44`, borderRadius: 20, color: STATUS_COLORS[t.status] || COLORS.accent, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer", outline: "none" }}
                          >
                            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                          <button onClick={() => handleEdit(t)} style={{ background: COLORS.accent + "22", border: `1px solid ${COLORS.accent}44`, borderRadius: 5, color: COLORS.accent, padding: "4px 10px", fontSize: 11, cursor: "pointer", marginRight: 6, fontWeight: 600 }}>Edit</button>
                          <button onClick={() => handleDelete(t.id)} style={{ background: COLORS.accentRed + "22", border: `1px solid ${COLORS.accentRed}44`, borderRadius: 5, color: COLORS.accentRed, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── ENTRY FORM ── */}
        {view === "entry" && (
          <div ref={formRef} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: COLORS.bgRow, padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{editId !== null ? "Edit Trade" : "New Trade Entry"}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 28 }}>

              <Section title="Trade Details" icon="📅">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <InputField label="Trade Date" value={form.tradeDate} onChange={setField("tradeDate")} type="date" required />
                  <InputField label="Settlement Date" value={form.settlementDate} onChange={setField("settlementDate")} type="date" />
                  <SelectField label="Settlement Type" value={form.settlement} onChange={setField("settlement")} options={SETTLEMENT} />
                  <SelectField label="Status" value={form.status} onChange={setField("status")} options={STATUS} />
                </div>
              </Section>

              <Section title="Client & Account" icon="👤">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <InputField label="Client Name" value={form.clientName} onChange={setField("clientName")} placeholder="Last, First" required />
                  <InputField label="Account Number" value={form.accountNumber} onChange={setField("accountNumber")} placeholder="" required />
                  <SelectField label="Account Type" value={form.accountType} onChange={setField("accountType")} options={ACCOUNT_TYPES} required />
                  {/* Custodian with preferred grouping */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>Custodian<span style={{ color: COLORS.accentRed, marginLeft: 2 }}>*</span></label>
                    <select
                      value={form.custodian}
                      onChange={(e) => { if (!e.target.value.startsWith("──")) setField("custodian")(e.target.value); }}
                      style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: form.custodian === "Select..." ? COLORS.textMuted : COLORS.text, padding: "8px 10px", fontSize: 13, outline: "none", width: "100%", appearance: "none", cursor: "pointer" }}
                    >
                      {custodianOptions.map((o) => (
                        <option key={o} value={o} disabled={o.startsWith("──")}
                          style={{ color: o.startsWith("──") ? "#f59e0b" : "#fff", fontWeight: o.startsWith("──") ? 700 : 400, background: "#0d1f3c" }}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <SelectField label="Risk Profile" value={form.riskLevel} onChange={setField("riskLevel")} options={RISK_LEVELS} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>Advisor</label>
                    <select
                      value={form.advisor}
                      onChange={(e) => setField("advisor")(e.target.value)}
                      style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: form.advisor ? COLORS.text : COLORS.textMuted, padding: "8px 10px", fontSize: 13, outline: "none", width: "100%", appearance: "none", cursor: "pointer" }}
                    >
                      <option value="">Select advisor...</option>
                      {settings.advisors.filter((a) => a.name).map((a) => (
                        <option key={a.name} value={a.name}>{a.name}{a.title ? ` – ${a.title}` : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Section>

              <Section title="Security & Product" icon="📊">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <SelectField label="Trade Type" value={form.tradeType} onChange={setField("tradeType")} options={TRADE_TYPES} required />
                  <SelectField label="Asset Class" value={form.assetClass} onChange={setField("assetClass")} options={ASSET_CLASSES} required />
                  <SelectField label="Product Type" value={form.productType} onChange={setField("productType")} options={PRODUCT_TYPES} required />
                  <SelectField label="Carrier / Fund Family" value={form.carrier} onChange={setField("carrier")} options={getCarriers(form.productType, settings)} />
                  <InputField label="Ticker / Symbol / Policy #" value={form.ticker} onChange={setField("ticker")} placeholder="e.g. AAPL or Policy #" />
                  <InputField label="Security / Product Name" value={form.securityName} onChange={setField("securityName")} placeholder="e.g. Allianz 222 FIA" />
                </div>
              </Section>

              <Section title="Execution" icon="⚡">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <InputField label="Quantity / Shares" value={form.quantity} onChange={setField("quantity")} placeholder="0" type="number" required />
                  <InputField label="Price Per Share" value={form.price} onChange={setField("price")} placeholder="0.00" type="number" required />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Amount</label>
                    <div style={{ background: COLORS.bgRow, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.accentGreen, padding: "8px 10px", fontSize: 15, fontWeight: 700 }}>
                      ${form.totalAmount || "0.00"}
                    </div>
                  </div>
                  <SelectField label="Order Type" value={form.orderType} onChange={setField("orderType")} options={ORDER_TYPES} required />
                  <InputField label="Limit Price" value={form.limitPrice} onChange={setField("limitPrice")} placeholder="0.00" type="number" />
                  <InputField label="Stop Price" value={form.stopPrice} onChange={setField("stopPrice")} placeholder="0.00" type="number" />
                  <SelectField label="Time in Force" value={form.timeInForce} onChange={setField("timeInForce")} options={TIME_IN_FORCE} />
                  <div />
                </div>
              </Section>

              <Section title="Compliance & Tax" icon="🛡️">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <SelectField label="Solicited / Unsolicited" value={form.solicited} onChange={setField("solicited")} options={SOLICITED} required />
                  <SelectField label="Discretion" value={form.discretion} onChange={setField("discretion")} options={DISCRETION} required />
                  <SelectField label="Tax Lot Method" value={form.taxLot} onChange={setField("taxLot")} options={TAX_LOT} />
                  <div />
                </div>
              </Section>

              <Section title="Notes & Suitability" icon="📝">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>Trade Notes / Rationale</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setField("notes")(e.target.value)}
                    placeholder="Document trade rationale, client instructions, suitability notes, or compliance remarks..."
                    rows={4}
                    style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
                  />
                </div>
              </Section>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${COLORS.border}` }}>
                <button onClick={() => { setForm(initialForm); setEditId(null); setView("blotter"); }}
                  style={{ padding: "10px 24px", borderRadius: 7, fontWeight: 600, fontSize: 14, cursor: "pointer", background: "transparent", color: COLORS.textMuted, border: `1px solid ${COLORS.border}` }}>
                  Cancel
                </button>
                <button onClick={() => setForm(initialForm)}
                  style={{ padding: "10px 24px", borderRadius: 7, fontWeight: 600, fontSize: 14, cursor: "pointer", background: COLORS.bgInput, color: COLORS.textLabel, border: `1px solid ${COLORS.border}` }}>
                  Clear Form
                </button>
                <button onClick={handleSave}
                  style={{ padding: "10px 28px", borderRadius: 7, fontWeight: 700, fontSize: 14, cursor: "pointer", background: COLORS.accent, color: "#fff", border: "none", boxShadow: `0 2px 10px ${COLORS.accent}55` }}>
                  {editId !== null ? "💾 Update Trade" : "✅ Submit Trade"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS VIEW ── */}
        {view === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <SettingsCard title="Firm Information" icon="🏢">
              <SGrid>
                <SInput label="Firm Name" value={settings.firmName} onChange={setSetting("firmName")} />
                <SInput label="Firm CRD #" value={settings.firmCRD} onChange={setSetting("firmCRD")} />
                <SInput label="Address" value={settings.firmAddress} onChange={setSetting("firmAddress")} />
                <SInput label="City" value={settings.firmCity} onChange={setSetting("firmCity")} />
                <SInput label="State" value={settings.firmState} onChange={setSetting("firmState")} />
                <SInput label="ZIP" value={settings.firmZip} onChange={setSetting("firmZip")} />
                <SInput label="Phone" value={settings.firmPhone} onChange={setSetting("firmPhone")} />
                <SInput label="Email" value={settings.firmEmail} onChange={setSetting("firmEmail")} />
                <SInput label="Website" value={settings.firmWebsite} onChange={setSetting("firmWebsite")} />
              </SGrid>
            </SettingsCard>

            <SettingsCard title="Broker-Dealer Details" icon="🏦">
              <SGrid>
                <SInput label="Broker-Dealer Name" value={settings.bdName} onChange={setSetting("bdName")} />
                <SInput label="BD CRD #" value={settings.bdCRD} onChange={setSetting("bdCRD")} />
                <SInput label="Clearing Firm" value={settings.bdClearingFirm} onChange={setSetting("bdClearingFirm")} />
                <SInput label="OSJ / Branch Address" value={settings.bdOSJAddress} onChange={setSetting("bdOSJAddress")} />
                <SInput label="Compliance Contact" value={settings.bdComplianceContact} onChange={setSetting("bdComplianceContact")} />
                <SInput label="Compliance Phone" value={settings.bdCompliancePhone} onChange={setSetting("bdCompliancePhone")} />
                <SInput label="Compliance Email" value={settings.bdComplianceEmail} onChange={setSetting("bdComplianceEmail")} />
              </SGrid>
            </SettingsCard>

            <SettingsCard title="Registered Advisors" icon="👔">
              {settings.advisors.map((a, i) => (
                <div key={i} style={{ background: COLORS.bgRow, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent }}>Advisor {i + 1}</span>
                    {settings.advisors.length > 1 && (
                      <button onClick={() => removeAdvisor(i)} style={{ background: COLORS.accentRed + "22", border: `1px solid ${COLORS.accentRed}44`, borderRadius: 5, color: COLORS.accentRed, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Remove</button>
                    )}
                  </div>
                  <SGrid>
                    <SInput label="Full Name" value={a.name} onChange={(v) => updateAdvisor(i, "name", v)} />
                    <SInput label="Title" value={a.title} onChange={(v) => updateAdvisor(i, "title", v)} />
                    <SInput label="CRD #" value={a.crd} onChange={(v) => updateAdvisor(i, "crd", v)} />
                    <SInput label="Phone" value={a.phone} onChange={(v) => updateAdvisor(i, "phone", v)} />
                    <SInput label="Email" value={a.email} onChange={(v) => updateAdvisor(i, "email", v)} />
                  </SGrid>
                </div>
              ))}
              <button onClick={addAdvisor} style={{ background: COLORS.accent + "22", border: `1px solid ${COLORS.accent}44`, borderRadius: 6, color: COLORS.accent, padding: "8px 18px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>+ Add Advisor</button>
            </SettingsCard>

            <SettingsCard title="Support Staff" icon="🧑‍💼">
              {settings.supportStaff.map((s, i) => (
                <div key={i} style={{ background: COLORS.bgRow, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.accentGold }}>Staff Member {i + 1}</span>
                    <button onClick={() => removeStaff(i)} style={{ background: COLORS.accentRed + "22", border: `1px solid ${COLORS.accentRed}44`, borderRadius: 5, color: COLORS.accentRed, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Remove</button>
                  </div>
                  <SGrid>
                    <SInput label="Full Name" value={s.name} onChange={(v) => updateStaff(i, "name", v)} />
                    <SInput label="Title / Role" value={s.title} onChange={(v) => updateStaff(i, "title", v)} />
                    <SInput label="Phone" value={s.phone} onChange={(v) => updateStaff(i, "phone", v)} />
                    <SInput label="Email" value={s.email} onChange={(v) => updateStaff(i, "email", v)} />
                  </SGrid>
                </div>
              ))}
              <button onClick={addStaff} style={{ background: COLORS.accentGold + "22", border: `1px solid ${COLORS.accentGold}44`, borderRadius: 6, color: COLORS.accentGold, padding: "8px 18px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>+ Add Staff Member</button>
            </SettingsCard>

            <SettingsCard title="Preferred Products & Carriers" icon="⭐">
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {([
                  { key: "preferredMutualFunds" as keyof Settings, label: "Mutual Funds", options: CARRIER_MAP["Mutual Fund"] },
                  { key: "preferredFIAs" as keyof Settings, label: "Fixed Indexed Annuities (FIA)", options: CARRIER_MAP["Fixed Indexed Annuity (FIA)"] },
                  { key: "preferredFixedAnnuities" as keyof Settings, label: "Fixed Annuities", options: CARRIER_MAP["Fixed Annuity"] },
                  { key: "preferredVariableAnnuities" as keyof Settings, label: "Variable Annuities", options: CARRIER_MAP["Variable Annuity"] },
                  { key: "preferredRILAs" as keyof Settings, label: "RILAs / Registered Index-Linked", options: CARRIER_MAP["RILA – Registered Index-Linked Annuity"] },
                  { key: "preferredMYGAs" as keyof Settings, label: "MYGAs / Multi-Year Guaranteed", options: CARRIER_MAP["Multi-Year Guaranteed Annuity (MYGA)"] },
                  { key: "preferredLifeInsurance" as keyof Settings, label: "Life Insurance (IUL / UL / Term)", options: CARRIER_MAP["Life Insurance – Indexed Universal Life (IUL)"] },
                  { key: "preferredLTC" as keyof Settings, label: "Long-Term Care Insurance", options: CARRIER_MAP["Long-Term Care Insurance"] },
                  { key: "preferredETFs" as keyof Settings, label: "ETFs", options: CARRIER_MAP["ETF (Exchange-Traded Fund)"] },
                  { key: "preferredAlts" as keyof Settings, label: "Alternative Investments", options: CARRIER_MAP["Alternative Investment"] },
                  { key: "preferredCustodians" as keyof Settings, label: "Custodians", options: CUSTODIANS.slice(1) },
                ] as { key: keyof Settings; label: string; options: string[] }[]).map(({ key, label, options }) => (
                  <div key={String(key)}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {options.filter((o) => o !== "Other").map((opt) => {
                        const selected = ((settings[key] as string[]) || []).includes(opt);
                        return (
                          <button key={opt} onClick={() => togglePreferred(key, opt)}
                            style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontWeight: 600, background: selected ? COLORS.accent : COLORS.bgInput, color: selected ? "#fff" : COLORS.textMuted, border: `1px solid ${selected ? COLORS.accent : COLORS.border}`, transition: "all 0.15s" }}>
                            {selected ? "✓ " : ""}{opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard title="Notes & Compliance Reminders" icon="📝">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Compliance Notes</div>
                  <textarea value={settings.complianceNotes} onChange={(e) => setSetting("complianceNotes")(e.target.value)}
                    rows={3} placeholder="Compliance reminders, regulatory notes, supervision requirements..."
                    style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textLabel, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>General Notes</div>
                  <textarea value={settings.generalNotes} onChange={(e) => setSetting("generalNotes")(e.target.value)}
                    rows={3} placeholder="Practice notes, workflow reminders, team instructions..."
                    style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>
            </SettingsCard>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 24 }}>
              <button onClick={() => showToast("Settings saved successfully.")}
                style={{ padding: "12px 32px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", background: COLORS.accentGold, color: "#000", border: "none", boxShadow: `0 2px 12px ${COLORS.accentGold}55` }}>
                💾 Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        input[type=date] { text-align: left !important; direction: ltr; }
        input[type=date]::-webkit-date-and-time-value { text-align: left; }
        input[type=date]::-webkit-inner-spin-button { display: none; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.75) !important; }
        select option { background: #0d1f3c; color: #fff; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        tr { transition: background 0.1s; }
        button:hover { opacity: 0.88; }
      `}</style>
    </div>
  );
}
