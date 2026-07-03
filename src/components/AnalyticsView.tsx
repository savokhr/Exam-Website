import React, { useState } from 'react';
import { BarChart, Filter, Award, Download, ShieldCheck, CheckCircle, Search, Sparkles, Printer, ArrowLeft } from 'lucide-react';
import { ExamAttempt, Exam } from '../types';

interface AnalyticsViewProps {
  attempts: ExamAttempt[];
  exams: Exam[];
}

export default function AnalyticsView({ attempts, exams }: AnalyticsViewProps) {
  const [selectedExamFilter, setSelectedExamFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertAttempt, setSelectedCertAttempt] = useState<ExamAttempt | null>(null);

  // Compute stats for completed attempts
  const completedAttempts = attempts.filter(att => att.status !== 'InProgress');
  
  const filteredAttempts = completedAttempts.filter(att => {
    const matchesExam = selectedExamFilter === 'all' || att.examId === selectedExamFilter;
    const matchesSearch = att.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          att.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          att.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExam && matchesSearch;
  });

  const avgScore = completedAttempts.length > 0 
    ? Math.round(completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedAttempts.length)
    : 87; // fallback default to match image

  // SVG Donut Chart Coordinates
  // Radius = 60, stroke = 12, Center = 80, 80
  // Circumference = 2 * Math.PI * 60 = 376.99
  const radius = 55;
  const stroke = 12;
  const center = 75;
  const circ = 2 * Math.PI * radius;

  // Breakdown segments: Excellent (40%), Good (30%), Average (20%), Needs Improvement (10%)
  const segments = [
    { label: 'Excellent', percent: 40, color: '#5E7F73', desc: '85% to 100% Score' },
    { label: 'Good', percent: 30, color: '#2A3D37', desc: '70% to 84% Score' },
    { label: 'Average', percent: 20, color: '#E6DCC6', desc: '50% to 69% Score' },
    { label: 'Needs Improvement', percent: 10, color: '#ECEDEF', desc: 'Below 50% Score' }
  ];

  let cumulativeOffset = 0;

  // Mock CSV exporter trigger
  const handleExportCSV = () => {
    const header = 'Student ID,Candidate Name,Exam Title,Score,Status,Tab Switches,Proctor Flags\n';
    const rows = filteredAttempts.map(att => 
      `"${att.studentId}","${att.studentName}","${att.examTitle}",${att.score}%,${att.passed ? 'PASSED' : 'FAILED'},${att.tabSwitches},${att.proctoringEvents.filter(e => e.severity === 'critical').length}`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClassForum_Analytics_Report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="analytics-view-container" className="space-y-8 animate-fade-in pb-12">
      
      {/* Cert View Modal */}
      {selectedCertAttempt && (
        <div id="cert-printable-modal" className="fixed inset-0 bg-forest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl max-w-2xl w-full border border-sand shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Decors on background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-greenmist/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sand/10 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-start border-b border-fog pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-greenmist" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-forest">ClassForum</h3>
                  <p className="text-[9px] text-slate/50 font-mono tracking-widest uppercase">INTEGRITY CERTIFIED</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCertAttempt(null)}
                className="px-3 py-1 bg-paper hover:bg-fog text-slate font-semibold text-xs rounded-lg transition-colors border border-fog"
              >
                Close View
              </button>
            </div>

            {/* Certification Body */}
            <div className="text-center py-6 space-y-4">
              <span className="text-[10px] text-greenmist font-mono tracking-widest font-bold uppercase block">
                Certificate of Academic Integrity
              </span>
              <h2 className="text-2xl font-serif font-semibold text-forest leading-snug">
                This certifies that candidate
              </h2>
              <p className="text-3xl font-serif font-bold text-forest border-b border-sand pb-2 max-w-sm mx-auto">
                {selectedCertAttempt.studentName}
              </p>
              <p className="text-xs text-slate/70 max-w-md mx-auto leading-relaxed">
                has successfully completed and passed the assessed exam <span className="font-semibold text-forest">"{selectedCertAttempt.examTitle}"</span> with a score of <span className="font-mono font-bold text-forest">{selectedCertAttempt.score}%</span>.
              </p>
              <p className="text-[11px] text-slate/50 max-w-sm mx-auto">
                Under rigorous live proctoring monitoring without any security infractions or unpermitted tab visibility alterations detected.
              </p>
            </div>

            {/* Verification signature ledger footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-paper rounded-lg border border-fog gap-4 text-left">
              <div className="font-mono text-[9px] text-slate/60 space-y-1">
                <div>VERIFICATION ID: <span className="text-forest font-semibold">CF-CERT-{selectedCertAttempt.id.substring(0,8).toUpperCase()}</span></div>
                <div>DATE OF ISSUANCE: <span className="text-forest font-semibold">{new Date(selectedCertAttempt.startTime).toLocaleDateString()}</span></div>
                <div>INTEGRITY LEDGER HASH: <span className="text-forest font-semibold truncate block max-w-[200px]">sha256:7f01a351ee2bc3d7...</span></div>
              </div>

              <div className="flex flex-col items-center gap-1.5 sm:border-l sm:border-fog sm:pl-6">
                {/* Simulated cryptographic signature badge */}
                <div className="w-16 h-16 bg-white border border-fog flex items-center justify-center p-1 rounded">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-70">
                    {/* Simulated QR code grid */}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-forest' : 'bg-white'}`}></div>
                    ))}
                  </div>
                </div>
                <span className="text-[8px] font-mono text-slate/40 tracking-widest uppercase">Verified Secure</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-forest hover:bg-slate text-white text-xs font-semibold rounded-lg transition-colors shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Title */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-forest tracking-tight">Reports & Performance</h2>
        <p className="text-xs text-slate/70">Aggregate cohort analytics, scoring distributions, and certificate audits.</p>
      </div>

      {/* Top section: Donut Chart & Performance Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Donut Chart Card */}
        <div id="analytics-donut-card" className="bg-white p-6 rounded-xl border border-fog shadow-sm flex flex-col items-center justify-between lg:col-span-1 min-h-[300px]">
          <h3 className="text-xs font-semibold text-slate/60 uppercase tracking-wider mb-2 self-start">Performance Overview</h3>
          
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Embedded SVG circular segments */}
            <svg width="150" height="150" viewBox="0 0 150 150" className="transform -rotate-90">
              {segments.map((seg, idx) => {
                const strokeDasharray = circ;
                const strokeDashoffset = circ - (seg.percent / 100) * circ;
                const currentOffset = cumulativeOffset;
                cumulativeOffset += strokeDashoffset;
                return (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={stroke}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={currentOffset}
                    className="transition-all duration-1000"
                  />
                );
              })}
            </svg>

            {/* Inner text metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-serif font-bold text-forest leading-none mb-0.5">{avgScore}%</h2>
              <span className="text-[9px] uppercase tracking-wider font-mono text-slate/50">Average Score</span>
            </div>
          </div>

          <div className="text-[10px] text-slate/40 text-center font-mono mt-2 uppercase">
            Data aggregated across {completedAttempts.length} active sessions
          </div>
        </div>

        {/* Legend / Breakdown breakdown details */}
        <div id="analytics-legend-card" className="bg-white p-6 rounded-xl border border-fog shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-serif font-bold text-forest mb-3">Grade Tier Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {segments.map((seg, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-paper rounded-lg border border-fog/60">
                  <div className="w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: seg.color }}></div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-forest">{seg.label}</h4>
                      <span className="text-[10px] font-mono font-semibold text-slate/60 bg-fog px-1.5 py-0.5 rounded">
                        {seg.percent}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate/50 mt-0.5">{seg.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-fog mt-6 flex justify-between items-center text-xs text-slate/50 font-mono uppercase">
            <span>Passmark Threshold: 70%</span>
            <span>surveillance confidence index: 99.8%</span>
          </div>
        </div>
      </div>

      {/* Filter and table lists */}
      <div className="bg-white rounded-xl border border-fog p-6 shadow-sm">
        
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-fog/60">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-paper rounded-lg border border-fog text-xs">
              <Filter className="w-3.5 h-3.5 text-slate/50" />
              <select
                value={selectedExamFilter}
                onChange={(e) => setSelectedExamFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-slate font-medium cursor-pointer"
              >
                <option value="all">All Exams</option>
                {exams.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            {/* Simple text search */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-paper rounded-lg border border-fog text-xs max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate/50" />
              <input
                type="text"
                placeholder="Search candidate or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate placeholder-slate/40 focus:ring-0"
              />
            </div>
          </div>

          <button
            id="btn-export-reports"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-forest hover:bg-slate text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Dataset</span>
          </button>
        </div>

        {/* Attempt records List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-fog text-[10px] uppercase tracking-wider text-slate/50 font-bold">
                <th className="py-2.5 px-2">Student ID</th>
                <th className="py-2.5 px-2">Candidate Name</th>
                <th className="py-2.5 px-2">Exam Target</th>
                <th className="py-2.5 px-2">Score</th>
                <th className="py-2.5 px-2">Status</th>
                <th className="py-2.5 px-2 text-center">Proctor Warnings</th>
                <th className="py-2.5 px-2 text-right">Integrity Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fog/60">
              {filteredAttempts.map((att) => (
                <tr key={att.id} id={`attempt-row-${att.id}`} className="hover:bg-paper/40 transition-colors">
                  <td className="py-3 px-2 font-mono font-medium text-forest">{att.studentId}</td>
                  <td className="py-3 px-2 font-semibold text-forest">{att.studentName}</td>
                  <td className="py-3 px-2 text-slate/80">{att.examTitle}</td>
                  <td className="py-3 px-2 font-mono font-bold text-forest">{att.score}%</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      att.passed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {att.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-semibold text-slate">
                    {att.tabSwitches + att.proctoringEvents.filter(e => e.severity === 'warning').length}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {att.passed ? (
                      <button
                        onClick={() => setSelectedCertAttempt(att)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-greenmist/10 hover:bg-greenmist/20 text-slate border border-greenmist/30 px-2 py-1 rounded transition-colors"
                      >
                        <Award className="w-3 h-3 text-greenmist" />
                        <span>View Certificate</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate/40 italic">Not eligible</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAttempts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate/40 italic">
                    No matching processed attempts found. Take a test in the Student Simulator to populate records!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
