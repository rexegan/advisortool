import { useState, useMemo } from 'react';
import type { AppView, ComplianceTask, Sample, Violation, PublicNotice } from './types';
import { systems as seedSystems, tasks as seedTasks, samples as seedSamples, violations as seedViolations, notices as seedNotices, assets as seedAssets, documents as seedDocuments, vendors as seedVendors } from './data/seed';
import { calcComplianceScore } from './utils/compliance';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ComplianceCalendar from './components/ComplianceCalendar';
import Sampling from './components/Sampling';
import Violations from './components/Violations';
import PublicNotifications from './components/PublicNotifications';
import DocumentVault from './components/DocumentVault';
import Vendors from './components/Vendors';
import AuditMode from './components/AuditMode';
import SystemsView from './components/SystemsView';
import './BlueCheck.css';

export default function BlueCheck() {
  const [view, setView] = useState<AppView>('dashboard');
  const systems = seedSystems;
  const [tasks, setTasks] = useState<ComplianceTask[]>(seedTasks);
  const [samples, setSamples] = useState<Sample[]>(seedSamples);
  const [violations, setViolations] = useState<Violation[]>(seedViolations);
  const [notices, setNotices] = useState<PublicNotice[]>(seedNotices);

  const score = useMemo(() => calcComplianceScore(tasks, samples, violations), [tasks, samples, violations]);
  const overdueCount = tasks.filter(t => t.status === 'Overdue').length;
  const violationCount = violations.filter(v => v.status === 'Open' || v.status === 'In Resolution').length;

  const updateTask = (id: string, patch: Partial<ComplianceTask>) => setTasks(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  const updateSample = (id: string, patch: Partial<Sample>) => setSamples(ss => ss.map(s => s.id === id ? { ...s, ...patch } : s));
  const updateViolation = (id: string, patch: Partial<Violation>) => setViolations(vs => vs.map(v => v.id === id ? { ...v, ...patch } : v));
  const updateNotice = (id: string, patch: Partial<PublicNotice>) => setNotices(ns => ns.map(n => n.id === id ? { ...n, ...patch } : n));

  return (
    <Layout active={view} onNav={setView} overdueCount={overdueCount} violationCount={violationCount}>
      {view === 'dashboard' && (
        <Dashboard tasks={tasks} samples={samples} violations={violations} notices={notices} systems={systems} score={score} onNav={v => setView(v as AppView)} />
      )}
      {view === 'calendar' && (
        <ComplianceCalendar tasks={tasks} systems={systems} onUpdate={updateTask} onAdd={t => setTasks(ts => [t, ...ts])} />
      )}
      {view === 'sampling' && (
        <Sampling samples={samples} systems={systems} onAdd={s => setSamples(ss => [s, ...ss])} onUpdate={updateSample} />
      )}
      {view === 'violations' && (
        <Violations violations={violations} systems={systems} onAdd={v => setViolations(vs => [v, ...vs])} onUpdate={updateViolation} />
      )}
      {view === 'notifications' && (
        <PublicNotifications notices={notices} systems={systems} onAdd={n => setNotices(ns => [n, ...ns])} onUpdate={updateNotice} />
      )}
      {view === 'vault' && <DocumentVault documents={seedDocuments} systems={systems} />}
      {view === 'vendors' && <Vendors vendors={seedVendors} />}
      {view === 'audit' && <AuditMode tasks={tasks} samples={samples} notices={notices} documents={seedDocuments} violations={violations} systems={systems} />}
      {view === 'systems' && <SystemsView systems={systems} tasks={tasks} violations={violations} />}
      {view === 'treatment' && (
        <div className="bc-view">
          <div className="bc-page-header"><h2>Water Treatment</h2></div>
          <div className="bc-coming-soon">
            <div className="bc-cs-icon">⚗️</div>
            <h3>Treatment Asset Manager</h3>
            <p>Track wells, surface intakes, treatment plants, chemical feed systems, chlorination, turbidity, filters, and residual testing.</p>
            <div className="bc-cs-assets">
              {seedAssets.map(a => (
                <div key={a.id} className="bc-cs-asset">
                  <div className="bc-cs-asset-name">{a.name}</div>
                  <div className="bc-cs-asset-type">{a.type}</div>
                  <span className={`bc-chip bc-chip-${a.operationalStatus === 'Online' ? 'good' : 'warning'}`}>{a.operationalStatus}</span>
                  {a.chemicalFeeds.length > 0 && <div className="bc-cs-feeds">{a.chemicalFeeds.join(' · ')}</div>}
                </div>
              ))}
            </div>
            <p className="bc-cs-note">Full chemical feed tracking, daily logs, and turbidity reporting in next release.</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
