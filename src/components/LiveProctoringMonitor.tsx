import React, { useEffect, useRef } from 'react';
import { Monitor, AlertCircle, RefreshCw, CheckCircle2, XCircle, Clock, ShieldAlert, Shield } from 'lucide-react';
import { ExamAttempt, ProctoringEvent } from '../types';

interface LiveProctoringMonitorProps {
  activeAttempt: ExamAttempt | null;
  onClearLogs: () => void;
  historicalAttempts: ExamAttempt[];
}

export default function LiveProctoringMonitor({
  activeAttempt,
  onClearLogs,
  historicalAttempts
}: LiveProctoringMonitorProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll logs console to bottom on new event
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeAttempt?.proctoringEvents]);

  // If no simulation is active, we can display a mock "Simulated Active Session" so the dashboard is populated and useful.
  const DEFAULT_ATTEMPT: ExamAttempt = {
    id: 'mock-att-1',
    examId: 'exam-2',
    examTitle: 'Data Structures Test',
    studentName: 'Johnathan Doe',
    studentId: 'STU-2024-0158',
    startTime: '2026-07-03T05:00:00Z',
    timeLeft: 2847, // 47 minutes left
    status: 'InProgress',
    answers: {},
    tabSwitches: 0,
    proctoringEvents: [
      { id: '1', timestamp: '12:05:10', type: 'exam_started', message: 'Secured assessment environment locked. Candidate verification successful.', severity: 'info' },
      { id: '2', timestamp: '12:15:32', type: 'system_ok', message: 'Continuous verification: Head posture and eye-tracking baseline locked.', severity: 'info' },
      { id: '3', timestamp: '12:20:45', type: 'tab_switch', message: 'Candidate changed tab focus (deterred by local visual alert).', severity: 'warning' },
      { id: '4', timestamp: '12:28:12', type: 'voice_detected', message: 'Environmental audio spike registered: Human speech patterns parsed.', severity: 'warning' }
    ]
  };

  const currentSession = activeAttempt || DEFAULT_ATTEMPT;

  // Derive integrity metrics based on proctor logs and tab switches
  const totalWarnings = currentSession.proctoringEvents.filter(e => e.severity === 'warning').length;
  const totalCriticals = currentSession.proctoringEvents.filter(e => e.severity === 'critical').length + currentSession.tabSwitches;

  let integrityStatus: 'No Irregularities' | 'FLAGGED' = 'No Irregularities';
  if (totalCriticals > 0 || totalWarnings > 2) {
    integrityStatus = 'FLAGGED';
  }

  // Filmstrip captures
  const captures = [
    { id: 'cap-1', time: '12:05:12', label: 'ID Verified', status: 'pass', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60' },
    { id: 'cap-2', time: '12:15:30', label: 'Face Tracking Locked', status: 'pass', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60' },
    { id: 'cap-3', time: '12:20:46', label: 'Tab Switch Focus Lost', status: 'warn', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60' },
    { id: 'cap-4', time: '12:28:15', label: 'Speech Spike Captured', status: 'warn', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60' }
  ];

  return (
    <div id="proctor-monitor-container" className="space-y-8 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-forest tracking-tight">Proctoring Surveillance</h2>
          <p className="text-xs text-slate/70">Real-time AI behavioral analysis and security checkpoints.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-mono font-bold rounded-full uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE MONITORING
          </span>
          {activeAttempt && (
            <button
              onClick={onClearLogs}
              className="p-1.5 hover:bg-fog text-slate/60 hover:text-slate rounded-lg border border-fog bg-white transition-colors text-xs flex items-center gap-1"
              title="Reset current logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Webcam feed, specs, and ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Webcam feed column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-fog shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-fog pb-3">
              <h3 className="text-sm font-serif font-bold text-forest">Live Camera Feed</h3>
              <span className="text-[10px] bg-slate text-white font-mono px-2 py-0.5 rounded uppercase">
                Node {activeAttempt ? 'STUDENT_FEED' : 'DEMO_STREAM'}
              </span>
            </div>

            {/* Simulated webcam video feed wrapper */}
            <div className="aspect-video w-full bg-forest rounded-lg overflow-hidden border border-slate flex items-center justify-center relative">
              
              {/* If active attempt is available, try to hook into stream, else show avatar placeholder */}
              {activeAttempt ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <p className="text-xs text-greenmist font-mono">Webcam Stream Synchronized in Simulator Tab</p>
                </div>
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                  alt="Candidate Webcam Feed"
                  className="w-full h-full object-cover brightness-[0.85] grayscale-[0.1]"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Bounding box overlay mock */}
              <div className="absolute top-[25%] left-[35%] w-[30%] h-[45%] border-2 border-greenmist/80 rounded-lg flex items-center justify-center">
                <span className="absolute top-0 left-0 bg-greenmist text-forest text-[8px] font-mono px-1 font-bold">
                  98.4% MATCH
                </span>
              </div>

              {/* Status indicators in bottom margins */}
              <div className="absolute bottom-4 left-4 bg-forest/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-greenmist border border-slate">
                1080p // Secure AES Stream
              </div>

              {/* Live pulsing scan line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-greenmist/40 animate-bounce"></div>
            </div>

            {/* Snapshots Filmstrip */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate/70">Capture Infraction Timeline</h4>
              <div className="grid grid-cols-4 gap-3">
                {captures.map((cap) => (
                  <div key={cap.id} className="bg-paper rounded-lg border border-fog overflow-hidden flex flex-col justify-between">
                    <div className="aspect-[4/3] w-full bg-forest relative">
                      <img src={cap.img} alt={cap.label} className="w-full h-full object-cover filter brightness-75" referrerPolicy="no-referrer" />
                      <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${cap.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </div>
                    <div className="p-1.5 text-center font-mono text-[9px] text-slate/60 leading-tight">
                      <div className="font-semibold text-forest truncate">{cap.label}</div>
                      <div>{cap.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar specs and checks */}
        <div className="space-y-6">
          {/* Session details */}
          <div className="bg-white p-5 rounded-xl border border-fog shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-forest border-b border-fog pb-2">Session Details</h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-fog/60 pb-1.5">
                <span className="text-slate/60 font-medium">Exam Name:</span>
                <span className="font-semibold text-forest text-right max-w-[150px] truncate">{currentSession.examTitle}</span>
              </div>
              <div className="flex justify-between border-b border-fog/60 pb-1.5">
                <span className="text-slate/60 font-medium">Student Candidate:</span>
                <span className="font-semibold text-forest">{currentSession.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-fog/60 pb-1.5">
                <span className="text-slate/60 font-medium">Student ID:</span>
                <span className="font-mono font-semibold text-forest">{currentSession.studentId}</span>
              </div>
              <div className="flex justify-between border-b border-fog/60 pb-1.5">
                <span className="text-slate/60 font-medium">Time Elapsed:</span>
                <span className="font-mono font-semibold text-forest">00:14:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate/60 font-medium">Integrity Status:</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                  integrityStatus === 'No Irregularities' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                }`}>
                  {integrityStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Integrity Checklist Indicators */}
          <div className="bg-white p-5 rounded-xl border border-fog shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-forest border-b border-fog pb-2">Integrity Indicators</h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate font-medium">Face Detected</span>
                {totalCriticals > 5 ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate font-medium">Multiple Faces</span>
                {totalWarnings > 4 ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>

              <div className="flex items-center justify-between border-b border-fog/40 pb-2">
                <span className="text-xs text-slate font-medium">Tab Switches Detected</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  currentSession.tabSwitches > 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {currentSession.tabSwitches}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate font-medium">Voice Detection Logged</span>
                {totalWarnings > 2 ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate font-medium">Suspicious Activity Index</span>
                <span className={`font-mono text-xs font-bold ${totalCriticals + totalWarnings > 2 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {totalCriticals + totalWarnings > 2 ? 'High Risk' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proctoring Event Log console */}
      <div className="bg-white p-5 rounded-xl border border-fog shadow-sm">
        <div className="flex items-center justify-between border-b border-fog pb-3 mb-4">
          <h3 className="text-sm font-serif font-bold text-forest flex items-center gap-2">
            <Monitor className="w-4 h-4 text-greenmist" />
            <span>Immutable Surveillance Security Ledger</span>
          </h3>
          <span className="text-[10px] text-slate/40 font-mono">ENCRYPTED AT REST // AES-256</span>
        </div>

        {/* Console ledger body */}
        <div
          ref={scrollRef}
          id="proctor-console-box"
          className="bg-forest text-gray-300 p-4 rounded-lg font-mono text-[11px] leading-relaxed h-52 overflow-y-auto space-y-1.5 border border-slate"
        >
          {currentSession.proctoringEvents.map((evt, idx) => (
            <div key={evt.id || idx} className="flex items-start gap-2 animate-fade-in">
              <span className="text-greenmist font-semibold">[{evt.timestamp}]</span>
              <span className={`font-bold uppercase tracking-wider ${
                evt.severity === 'critical' ? 'text-red-500' : evt.severity === 'warning' ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {evt.type}:
              </span>
              <span className="text-gray-200">{evt.message}</span>
            </div>
          ))}
          {currentSession.proctoringEvents.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">No proctoring events registered.</div>
          )}
        </div>
      </div>
    </div>
  );
}
