import React from 'react';
import { FileSpreadsheet, Plus, GraduationCap, MonitorPlay, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Exam, ExamAttempt } from '../types';

interface OverviewDashboardProps {
  exams: Exam[];
  activeAttempt: ExamAttempt | null;
  onEnterSimulator: (examId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onCreateExamClick: () => void;
  integrityPercentage: number;
  totalAttempts: number;
}

export default function OverviewDashboard({
  exams,
  activeAttempt,
  onEnterSimulator,
  onNavigateToTab,
  onCreateExamClick,
  integrityPercentage,
  totalAttempts
}: OverviewDashboardProps) {
  
  // High-fidelity Stats Cards
  const stats = [
    {
      id: 'exams-created',
      title: 'Exams Created',
      value: exams.length + 8, // total including historically archived
      subtitle: '8 active, 4 completed',
      icon: FileSpreadsheet,
    },
    {
      id: 'tests-taken',
      title: 'Tests Taken',
      value: totalAttempts,
      subtitle: '+18 this morning',
      icon: GraduationCap,
    },
    {
      id: 'average-integrity',
      title: 'Average Integrity',
      value: `${integrityPercentage}%`,
      subtitle: '99.2% expected baseline',
      icon: ShieldCheck,
      isAlert: integrityPercentage < 95,
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: '87%',
      subtitle: 'Avg duration 48 mins',
      icon: CheckCircle2,
    }
  ];

  return (
    <div id="overview-dashboard-container" className="space-y-8 animate-fade-in">
      {/* Upper Welcomer and Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-forest tracking-tight">System Dashboard</h2>
          <p className="text-sm text-slate/70">Secure Assessments. Real-time integrity surveillance operational.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="btn-quick-create-exam"
            onClick={onCreateExamClick}
            className="flex items-center gap-2 px-4 py-2 bg-forest hover:bg-slate text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Exam</span>
          </button>
          <button
            id="btn-demo-take-exam"
            onClick={() => onEnterSimulator('exam-2')} // default to Data Structures
            className="flex items-center gap-2 px-4 py-2 border border-greenmist hover:bg-greenmist/10 text-slate text-xs font-semibold rounded-lg transition-all duration-200"
          >
            <GraduationCap className="w-4 h-4 text-greenmist" />
            <span>Simulate Active Exam</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div id="dashboard-metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              id={`stat-card-${stat.id}`}
              className="bg-white p-5 rounded-xl border border-fog shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate/60 uppercase tracking-wider">{stat.title}</span>
                <div className="w-8 h-8 rounded-lg bg-paper border border-fog flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${stat.isAlert ? 'text-red-500' : 'text-greenmist'}`} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold text-forest leading-none mb-1">{stat.value}</h3>
                <p className="text-[10px] text-slate/50">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Active Proctoring Alert banner if active */}
      {activeAttempt && activeAttempt.status === 'InProgress' && (
        <div 
          id="active-session-banner"
          className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
            <div>
              <h4 className="text-sm font-semibold text-red-900">Live Proctoring Session Active</h4>
              <p className="text-xs text-red-700">
                Student <span className="font-mono font-bold">{activeAttempt.studentName}</span> is currently completing <span className="font-medium">"{activeAttempt.examTitle}"</span>.
              </p>
            </div>
          </div>
          <button
            id="btn-goto-monitor"
            onClick={() => onNavigateToTab('proctoring')}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Open Proctoring Surveillance</span>
          </button>
        </div>
      )}

      {/* Main Grid: Recent Exams & Quick Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Exams Table */}
        <div id="recent-exams-card" className="bg-white rounded-xl border border-fog p-6 lg:col-span-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-forest">Recent Exams</h3>
            <button 
              onClick={() => onNavigateToTab('exams')} 
              className="text-xs text-greenmist hover:text-slate font-medium"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fog text-[11px] uppercase tracking-wider text-slate/50 font-semibold">
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Questions</th>
                  <th className="py-3 px-2">Participants</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fog/60">
                {exams.map((exam) => (
                  <tr 
                    key={exam.id} 
                    id={`exam-row-${exam.id}`}
                    className="hover:bg-paper/40 transition-colors"
                  >
                    <td className="py-3.5 px-2 font-medium text-forest">{exam.title}</td>
                    <td className="py-3.5 px-2 text-slate/70">
                      <span className="text-xs px-2 py-0.5 bg-fog text-slate rounded font-medium">
                        {exam.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-slate/70">{exam.questionsCount}</td>
                    <td className="py-3.5 px-2 font-mono text-slate/70">{exam.participantsCount}</td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        exam.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate/10 text-slate border border-fog'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${exam.status === 'Active' ? 'bg-emerald-500' : 'bg-slate/50'}`}></span>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Surveillance Panel */}
        <div id="quick-surveillance-card" className="bg-white rounded-xl border border-fog p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-forest mb-2">Surveillance Engine</h3>
            <p className="text-xs text-slate/60 mb-4">ClassForum employs continuous AI proctoring checkpoints to protect exam validity.</p>
            
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 bg-paper rounded-lg border border-fog">
                <div className="w-8 h-8 rounded-full bg-greenmist/10 flex items-center justify-center text-greenmist mt-0.5 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-forest">Focus Surveillance</h4>
                  <p className="text-[10px] text-slate/50">Triggers log alerts when candidates blur focus, minimize pages, or change active tabs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-paper rounded-lg border border-fog">
                <div className="w-8 h-8 rounded-full bg-greenmist/10 flex items-center justify-center text-greenmist mt-0.5 flex-shrink-0">
                  <MonitorPlay className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-forest">Webcam Identity Check</h4>
                  <p className="text-[10px] text-slate/50">Randomized facial snapshots verify identity and look for second-party presence.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-fog mt-6">
            <button
              id="btn-dashboard-view-audit"
              onClick={() => onNavigateToTab('proctoring')}
              className="w-full text-center py-2.5 bg-paper hover:bg-fog text-forest border border-fog text-xs font-semibold rounded-lg transition-colors"
            >
              View Active Audit Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
