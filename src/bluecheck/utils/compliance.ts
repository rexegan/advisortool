import type { ComplianceTask, Sample, Violation, ComplianceScore } from '../types';

export function calcComplianceScore(
  tasks: ComplianceTask[],
  _samples: Sample[],
  violations: Violation[],
): ComplianceScore {
  const pct = (done: number, total: number) => total === 0 ? 100 : Math.round((done / total) * 100);

  const reportingTasks = tasks.filter(t => t.category === 'Reporting' || t.category === 'Certification' || t.category === 'Fee');
  const completedReporting = reportingTasks.filter(t => t.status === 'Completed' || t.status === 'Waived');
  const reportingScore = pct(completedReporting.length, reportingTasks.length);

  const samplingTasks = tasks.filter(t => t.category === 'Sampling');
  const completedSampling = samplingTasks.filter(t => t.status === 'Completed');
  const sampleScore = pct(completedSampling.length, samplingTasks.length);

  const activeViolations = violations.filter(v => v.status === 'Open' || v.status === 'In Resolution');
  const violationScore = Math.max(0, 100 - activeViolations.length * 20);

  const notifTasks = tasks.filter(t => t.category === 'Public Notification');
  const completedNotif = notifTasks.filter(t => t.status === 'Completed');
  const notifScore = pct(completedNotif.length, notifTasks.length);

  const treatmentTasks = tasks.filter(t => t.category === 'Treatment' || t.category === 'Inspection');
  const completedTreatment = treatmentTasks.filter(t => t.status === 'Completed');
  const treatmentScore = pct(completedTreatment.length, treatmentTasks.length);

  const overall = Math.round(
    sampleScore * 0.3 +
    reportingScore * 0.25 +
    violationScore * 0.25 +
    notifScore * 0.1 +
    treatmentScore * 0.1
  );

  return {
    overall,
    breakdown: {
      sampling: sampleScore,
      reporting: reportingScore,
      violations: violationScore,
      notifications: notifScore,
      treatment: treatmentScore,
    },
  };
}

export function scoreColor(score: number): string {
  if (score >= 90) return '#16a34a';
  if (score >= 70) return '#d97706';
  return '#dc2626';
}

export function scoreLabel(score: number): string {
  if (score >= 90) return 'Compliant';
  if (score >= 70) return 'At Risk';
  return 'Non-Compliant';
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

export function taskStatusFromDate(dueDate: string, completed: boolean): import('../types').TaskStatus {
  if (completed) return 'Completed';
  const days = daysUntil(dueDate);
  if (days < 0) return 'Overdue';
  if (days <= 7) return 'Due Soon';
  return 'Upcoming';
}
