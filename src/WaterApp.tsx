import { useState } from 'react';
import type { ActiveView, ComplianceDeadline, LabSample, WaterUsageRecord, PublicNotice } from './water-types';
import { facilities as seedFacilities, deadlines as seedDeadlines, labSamples as seedLab, usageRecords as seedUsage, notices as seedNotices } from './water-data/seed';
import Sidebar from './water-components/Sidebar';
import Dashboard from './water-components/Dashboard';
import ComplianceCalendar from './water-components/ComplianceCalendar';
import LabResults from './water-components/LabResults';
import WaterUsage from './water-components/WaterUsage';
import PublicNotices from './water-components/PublicNotices';
import FacilitiesView from './water-components/FacilitiesView';
import './WaterApp.css';

export default function WaterApp() {
  const [view, setView] = useState<ActiveView>('dashboard');
  const [facilities] = useState(seedFacilities);
  const [deadlines, setDeadlines] = useState<ComplianceDeadline[]>(seedDeadlines);
  const [samples, setSamples] = useState<LabSample[]>(seedLab);
  const [usage, setUsage] = useState<WaterUsageRecord[]>(seedUsage);
  const [notices, setNotices] = useState<PublicNotice[]>(seedNotices);

  const overdueCount = deadlines.filter(d => d.status === 'Overdue').length;

  const updateDeadline = (id: string, patch: Partial<ComplianceDeadline>) =>
    setDeadlines(ds => ds.map(d => d.id === id ? { ...d, ...patch } : d));

  const updateSample = (id: string, patch: Partial<LabSample>) =>
    setSamples(ss => ss.map(s => s.id === id ? { ...s, ...patch } : s));

  const updateNotice = (id: string, patch: Partial<PublicNotice>) =>
    setNotices(ns => ns.map(n => n.id === id ? { ...n, ...patch } : n));

  return (
    <div className="water-app">
      <Sidebar active={view} onNav={v => setView(v as ActiveView)} overdueCount={overdueCount} />
      <div className="water-main">
        {view === 'dashboard' && (
          <Dashboard
            deadlines={deadlines} samples={samples} notices={notices}
            usage={usage} facilities={facilities} onNav={v => setView(v as ActiveView)}
          />
        )}
        {view === 'calendar' && (
          <ComplianceCalendar
            deadlines={deadlines} facilities={facilities}
            onUpdate={updateDeadline} onAdd={d => setDeadlines(ds => [d, ...ds])}
          />
        )}
        {view === 'lab' && (
          <LabResults
            samples={samples} facilities={facilities}
            onUpdate={updateSample} onAdd={s => setSamples(ss => [s, ...ss])}
          />
        )}
        {view === 'usage' && (
          <WaterUsage
            records={usage} facilities={facilities}
            onAdd={r => setUsage(us => [r, ...us])}
          />
        )}
        {view === 'notices' && (
          <PublicNotices
            notices={notices} facilities={facilities}
            onAdd={n => setNotices(ns => [n, ...ns])} onUpdate={updateNotice}
          />
        )}
        {view === 'facilities' && <FacilitiesView facilities={facilities} />}
      </div>
    </div>
  );
}
