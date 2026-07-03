import React, { useState, useEffect } from 'react';
import { Shield, Eye, FileCode, Landmark, HelpCircle, Palette, MonitorPlay, Sparkles, AlertTriangle, GraduationCap, Layout, ShieldCheck, Heart } from 'lucide-react';

import { Exam, ExamAttempt, ProctoringEvent } from './types';
import { INITIAL_EXAMS } from './data';

// Component imports
import Sidebar from './components/Sidebar';
import OverviewDashboard from './components/OverviewDashboard';
import ExamCreator from './components/ExamCreator';
import ExamSimulator from './components/ExamSimulator';
import LiveProctoringMonitor from './components/LiveProctoringMonitor';
import AnalyticsView from './components/AnalyticsView';
import DocsHub from './components/DocsHub';

export default function App() {
  const [viewMode, setViewMode] = useState<'app' | 'brand'>('app');
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(false);
  const [showExamCreator, setShowExamCreator] = useState<boolean>(false);

  // Prepopulate completed attempts for Reports & Analytics view
  const [historicalAttempts, setHistoricalAttempts] = useState<ExamAttempt[]>([
    {
      id: 'att-past-1',
      examId: 'exam-1',
      examTitle: 'Computer Networks Quiz',
      studentName: 'Emma Watson',
      studentId: 'STU-2024-0125',
      startTime: '2026-07-01T10:15:00Z',
      timeLeft: 0,
      status: 'Completed',
      answers: {},
      tabSwitches: 0,
      proctoringEvents: [],
      score: 92,
      passed: true
    },
    {
      id: 'att-past-2',
      examId: 'exam-2',
      examTitle: 'Data Structures Test',
      studentName: 'Liam Neeson',
      studentId: 'STU-2024-0098',
      startTime: '2026-07-02T14:30:00Z',
      timeLeft: 0,
      status: 'Completed',
      answers: {},
      tabSwitches: 1,
      proctoringEvents: [
        { id: 'p1', timestamp: '14:45:00', type: 'tab_switch', message: 'Candidate changed active window tab focus.', severity: 'warning' }
      ],
      score: 81,
      passed: true
    },
    {
      id: 'att-past-3',
      examId: 'exam-3',
      examTitle: 'Midterm Examination',
      studentName: 'Robert Downey',
      studentId: 'STU-2024-0231',
      startTime: '2026-06-25T09:00:00Z',
      timeLeft: 0,
      status: 'Flagged',
      answers: {},
      tabSwitches: 3,
      proctoringEvents: [
        { id: 'p2', timestamp: '09:12:00', type: 'tab_switch', message: 'Candidate changed window focus.', severity: 'warning' },
        { id: 'p3', timestamp: '09:30:15', type: 'tab_switch', message: 'Candidate changed active tab focus (multiple breaches).', severity: 'critical' },
        { id: 'p4', timestamp: '10:05:30', type: 'voice_detected', message: 'Environment speech spikes detected.', severity: 'warning' }
      ],
      score: 52,
      passed: false
    }
  ]);

  // Current active assessment attempt state
  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(null);

  // Countdown timer effect for active testing
  useEffect(() => {
    if (!activeAttempt || activeAttempt.status !== 'InProgress') return;

    const interval = setInterval(() => {
      setActiveAttempt(prev => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          // Auto submit on time exhaustion
          setTimeout(() => handleAutoSubmitExam(), 100);
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAttempt?.id, activeAttempt?.status]);

  // Handle auto-submission
  const handleAutoSubmitExam = () => {
    alert('Security Notice: Time limit exhausted. Submitting graded assessment now.');
    handleSubmitExam();
  };

  // Create Exam Action
  const handleAddExam = (newExam: Exam) => {
    setExams([newExam, ...exams]);
    setShowExamCreator(false);
    setActiveTab('exams');
    setIsSimulatorActive(false);
  };

  // Launch Testing simulation
  const handleStartAttempt = (exam: Exam, studentName: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const attempt: ExamAttempt = {
      id: `att-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      studentName: studentName || 'Candidate Taker',
      studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      startTime: new Date().toISOString(),
      timeLeft: exam.timeLimitMinutes * 60,
      status: 'InProgress',
      answers: {},
      tabSwitches: 0,
      proctoringEvents: [
        {
          id: `p-${Date.now()}-start`,
          timestamp,
          type: 'exam_started',
          message: `Assessment session initial check successful. Candidate "${studentName}" registered.`,
          severity: 'info'
        }
      ]
    };

    setActiveAttempt(attempt);
    setIsSimulatorActive(true);
    setShowExamCreator(false);
  };

  // Answer saving
  const handleSaveAnswer = (questionId: string, answer: string) => {
    if (!activeAttempt) return;
    setActiveAttempt({
      ...activeAttempt,
      answers: {
        ...activeAttempt.answers,
        [questionId]: answer
      }
    });
  };

  // Trigger Proctor infraction
  const handleTriggerProctorEvent = (
    eventType: any,
    message: string,
    severity: 'info' | 'warning' | 'critical'
  ) => {
    if (!activeAttempt) return;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newEvent: ProctoringEvent = {
      id: `pevt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      type: eventType,
      message,
      severity
    };

    const isTabSwitch = eventType === 'tab_switch';
    const updatedSwitches = isTabSwitch ? activeAttempt.tabSwitches + 1 : activeAttempt.tabSwitches;

    setActiveAttempt({
      ...activeAttempt,
      tabSwitches: updatedSwitches,
      proctoringEvents: [...activeAttempt.proctoringEvents, newEvent]
    });
  };

  // Submit and absolute Server-side grading logic mock
  const handleSubmitExam = () => {
    if (!activeAttempt) return;

    const activeExam = exams.find(e => e.id === activeAttempt.examId);
    if (!activeExam) return;

    let totalPointsPossible = 0;
    let totalPointsEarned = 0;

    // Server-side correction
    activeExam.questions.forEach((q) => {
      totalPointsPossible += q.points;
      const candidateAnswer = activeAttempt.answers[q.id];
      if (candidateAnswer && candidateAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        totalPointsEarned += q.points;
      }
    });

    const calculatedScore = totalPointsPossible > 0 
      ? Math.round((totalPointsEarned / totalPointsPossible) * 100)
      : 100;

    // Determine status (Breach or normal)
    const wasFlagged = activeAttempt.tabSwitches > 1 || activeAttempt.proctoringEvents.filter(e => e.severity === 'critical').length > 1;
    const finalStatus = wasFlagged ? 'Flagged' : 'Completed';
    const finalPassed = calculatedScore >= 70 && !wasFlagged;

    const completed: ExamAttempt = {
      ...activeAttempt,
      status: finalStatus,
      timeLeft: 0,
      score: calculatedScore,
      passed: finalPassed,
      proctoringEvents: [
        ...activeAttempt.proctoringEvents,
        {
          id: `p-${Date.now()}-end`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: 'exam_submitted',
          message: `Candidate voluntarily finalized assessment score. Security checks concluded with ${activeAttempt.tabSwitches} tab breaches.`,
          severity: 'info'
        }
      ]
    };

    // Update historical lists
    setHistoricalAttempts([completed, ...historicalAttempts]);

    // Update participants count in exam listing
    setExams(exams.map(e => {
      if (e.id === activeAttempt.examId) {
        return { ...e, participantsCount: e.participantsCount + 1 };
      }
      return e;
    }));

    // Clear active container
    setActiveAttempt(null);
    setIsSimulatorActive(false);

    // Redirect to Reports so they can print their Certificate!
    setActiveTab('reports');
    alert(`Assessment graded successfully. Final Score: ${calculatedScore}%. Status: ${finalPassed ? 'PASSED' : 'FAILED'}. Certificate generated in Reports ledger.`);
  };

  const handleClearLogs = () => {
    if (activeAttempt) {
      setActiveAttempt({
        ...activeAttempt,
        tabSwitches: 0,
        proctoringEvents: []
      });
    }
  };

  // Compute live average integrity index
  const allCompleted = [...historicalAttempts];
  if (activeAttempt) allCompleted.push(activeAttempt);

  const totalTabSwitches = allCompleted.reduce((acc, curr) => acc + curr.tabSwitches, 0);
  const totalEventsLogged = allCompleted.reduce((acc, curr) => acc + curr.proctoringEvents.length, 0);

  // Integrity Index scales down as violations occur
  const integrityPercentage = Math.max(75, 100 - (totalTabSwitches * 3) - (totalEventsLogged * 0.5));
  const totalAttemptsCount = historicalAttempts.length + (activeAttempt ? 1 : 0);

  return (
    <div id="classforum-main-wrapper" className="min-h-screen bg-paper flex flex-col font-sans select-none antialiased">
      
      {/* Top Universal Mode Switcher Header */}
      <header className="bg-forest border-b border-slate text-white px-6 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-greenmist animate-pulse" />
          <span className="font-serif font-semibold text-sm tracking-wide">ClassForum System Suite</span>
          <span className="text-[9px] bg-slate px-1.5 py-0.5 rounded font-mono border border-greenmist text-greenmist font-bold">
            v2.8.5 SECURE
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-mode-app"
            onClick={() => setViewMode('app')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              viewMode === 'app'
                ? 'bg-greenmist text-forest font-bold'
                : 'text-gray-300 hover:bg-slate/50 hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Interactive Platform</span>
          </button>
          
          <button
            id="btn-mode-brand"
            onClick={() => setViewMode('brand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              viewMode === 'brand'
                ? 'bg-greenmist text-forest font-bold'
                : 'text-gray-300 hover:bg-slate/50 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Brand System Specs</span>
          </button>
        </div>
      </header>

      {/* Main body depending on viewMode */}
      {viewMode === 'app' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsSimulatorActive(false);
              setShowExamCreator(false);
            }}
            isSimulatorActive={isSimulatorActive}
            onEnterSimulator={() => {
              setIsSimulatorActive(true);
              setShowExamCreator(false);
            }}
          />

          {/* Right main canvas frame */}
          <main className="flex-1 bg-paper overflow-y-auto p-8 relative">
            
            {/* If Student Simulator is Active */}
            {isSimulatorActive ? (
              <ExamSimulator
                exams={exams}
                activeAttempt={activeAttempt}
                onStartAttempt={handleStartAttempt}
                onSaveAnswer={handleSaveAnswer}
                onTriggerProctorEvent={handleTriggerProctorEvent}
                onSubmitExam={handleSubmitExam}
                onExit={() => {
                  setActiveAttempt(null);
                  setIsSimulatorActive(false);
                }}
              />
            ) : showExamCreator ? (
              <ExamCreator
                onAddExam={handleAddExam}
                onCancel={() => setShowExamCreator(false)}
              />
            ) : (
              /* Administrative Workspaces */
              <>
                {activeTab === 'dashboard' && (
                  <OverviewDashboard
                    exams={exams}
                    activeAttempt={activeAttempt}
                    onEnterSimulator={(examId) => {
                      const exam = exams.find(e => e.id === examId) || exams[0];
                      handleStartAttempt(exam, 'Johnathan Doe');
                    }}
                    onNavigateToTab={(tab) => {
                      setActiveTab(tab);
                      setIsSimulatorActive(false);
                    }}
                    onCreateExamClick={() => setShowExamCreator(true)}
                    integrityPercentage={Math.round(integrityPercentage)}
                    totalAttempts={totalAttemptsCount}
                  />
                )}

                {activeTab === 'exams' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-forest tracking-tight">Active Assessments</h2>
                        <p className="text-xs text-slate/70">Create, deploy, and manage secure exam configurations.</p>
                      </div>
                      <button
                        onClick={() => setShowExamCreator(true)}
                        className="px-4 py-2 bg-forest hover:bg-slate text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <span>Create Assessment</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {exams.map((exam) => (
                        <div
                          key={exam.id}
                          className="bg-white p-6 rounded-xl border border-fog shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] uppercase font-mono bg-paper border border-fog px-2 py-0.5 rounded text-slate">
                                {exam.type}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${exam.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate/40'}`}></span>
                            </div>
                            <h3 className="font-serif font-bold text-base text-forest mb-1.5">{exam.title}</h3>
                            <div className="space-y-1.5 text-xs text-slate/60 font-mono mb-4">
                              <div>Questions: <span className="font-sans font-bold text-forest">{exam.questionsCount}</span></div>
                              <div>Time Limit: <span className="font-sans font-bold text-forest">{exam.timeLimitMinutes} Mins</span></div>
                              <div>Participants: <span className="font-sans font-bold text-forest">{exam.participantsCount}</span></div>
                              <div className="flex items-center gap-1">
                                <span>Surveillance:</span>
                                <span className={exam.enableProctoring ? 'text-greenmist font-semibold font-sans' : 'text-slate font-sans'}>
                                  {exam.enableProctoring ? 'ENABLED' : 'DISABLED'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-fog flex gap-2">
                            {exam.status === 'Active' ? (
                              <button
                                onClick={() => handleStartAttempt(exam, 'Johnathan Doe')}
                                className="flex-1 text-center py-2 bg-paper hover:bg-fog border border-fog text-forest font-semibold text-xs rounded transition-colors"
                              >
                                Simulate Attempt
                              </button>
                            ) : (
                              <span className="text-center py-2 text-slate/40 font-semibold text-xs rounded block w-full italic">
                                Assessment Archival Locked
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'proctoring' && (
                  <LiveProctoringMonitor
                    activeAttempt={activeAttempt}
                    onClearLogs={handleClearLogs}
                    historicalAttempts={historicalAttempts}
                  />
                )}

                {activeTab === 'reports' && (
                  <AnalyticsView
                    attempts={historicalAttempts}
                    exams={exams}
                  />
                )}

                {activeTab === 'security-docs' && <DocsHub />}
              </>
            )}
          </main>
        </div>
      ) : (
        /* Brand Moodboard Specifications rendering page */
        <div id="brand-moodboard-specs" className="flex-1 bg-paper overflow-y-auto p-12 max-w-6xl mx-auto space-y-12 animate-fade-in">
          
          {/* Main Title branding banner */}
          <div className="text-center space-y-3 pb-8 border-b border-fog">
            <div className="w-14 h-14 bg-slate border border-greenmist rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8 text-greenmist" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-forest tracking-tight">ClassForum Brand & Design System</h1>
            <p className="text-sm text-slate/70 max-w-xl mx-auto">
              "Secure Assessments. Trusted Results." An academic identity conveying gravity, transparency, and integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Column 1: Left specs pillar panel */}
            <div className="space-y-6 md:col-span-1 bg-forest text-white p-8 rounded-xl border border-slate flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-6 h-6 text-greenmist" />
                  <span className="font-serif font-bold text-lg">ClassForum</span>
                </div>
                <h2 className="text-2xl font-serif font-bold leading-tight tracking-tight mb-4">
                  SECURE ASSESSMENTS.<br />TRUSTED RESULTS.
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed mb-8">
                  ClassForum is a secure assessment platform that empowers educators to create quizzes, tests, and exams with confidence. Built to uphold integrity and deliver fair, malpractice-free evaluations every time.
                </p>

                <div className="space-y-4 text-xs">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-4 h-4 text-greenmist flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">Integrity by Design</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Every feature is built to prevent malpractice and protect exam integrity.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck className="w-4 h-4 text-greenmist flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">Secure & Private</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Advanced proctoring, data encryption, and role-based access control.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck className="w-4 h-4 text-greenmist flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">Reliable Platform</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">High availability, performance, and accuracy you can depend on.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate/50 pt-4 mt-8 font-mono text-[9px] text-greenmist uppercase tracking-widest text-center">
                Design System v1.0
              </div>
            </div>

            {/* Column 2 & 3: Color palette, UI Specs and typography */}
            <div className="md:col-span-2 space-y-10">
              
              {/* Color Palette Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate/50 uppercase tracking-wider">Color Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { hex: '#0F1F1A', name: 'Deep Forest', usage: 'Primary dark surface (sidebar, main panels)' },
                    { hex: '#2A3D37', name: 'Slate', usage: 'Secondary dark surfaces, dark card backgrounds' },
                    { hex: '#5E7F73', name: 'Green Mist', usage: 'Active status highlights, checks, visual focus' },
                    { hex: '#E6DCC6', name: 'Sand', usage: 'Warm accent, borders, rare highlight features' },
                    { hex: '#F7F6F3', name: 'Paper', usage: 'Clean off-white primary workspace background' },
                    { hex: '#ECEDEF', name: 'Fog', usage: 'Subtle separators, borders, disabled items' },
                  ].map((color) => (
                    <div key={color.hex} className="bg-white rounded-lg border border-fog overflow-hidden shadow-sm flex flex-col">
                      <div className="h-16 w-full" style={{ backgroundColor: color.hex }}></div>
                      <div className="p-3 space-y-1">
                        <h4 className="font-serif font-bold text-xs text-forest">{color.name}</h4>
                        <div className="font-mono text-[10px] text-greenmist font-semibold">{color.hex}</div>
                        <p className="text-[9px] text-slate/50 leading-tight">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography specs */}
              <div className="space-y-4 border-t border-fog pt-8">
                <h3 className="text-sm font-semibold text-slate/50 uppercase tracking-wider">Typography & Scaling</h3>
                <div className="p-5 bg-white rounded-lg border border-fog space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl font-serif text-forest">Aa</span>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-forest">IBM Plex Serif (Headings)</h4>
                      <p className="text-xs text-slate/50 leading-relaxed mt-0.5">
                        Conveys authority, academic trust, and security gravity. Applied to headlines, statistics, and high-fidelity certification moments.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 border-t border-fog/60 pt-4">
                    <span className="text-4xl font-sans text-forest">Aa</span>
                    <div>
                      <h4 className="font-sans font-bold text-sm text-forest">Inter (Body & Interface)</h4>
                      <p className="text-xs text-slate/50 leading-relaxed mt-0.5">
                        Clean, neutral sans-serif optimized for highly structured, data-dense assessments. Used for questions, tabular data, and controls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* UI Elements Specs */}
              <div className="space-y-4 border-t border-fog pt-8">
                <h3 className="text-sm font-semibold text-slate/50 uppercase tracking-wider">UI Elements Language</h3>
                <div className="p-5 bg-white rounded-lg border border-fog grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate/50 uppercase tracking-wider">Buttons</h4>
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-forest text-white text-xs font-semibold rounded-lg text-center cursor-default">
                        Primary Solid (Deep Forest)
                      </button>
                      <button className="px-4 py-2 border border-slate text-slate text-xs font-semibold rounded-lg text-center bg-transparent cursor-default">
                        Secondary Outlined (Slate)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate/50 uppercase tracking-wider">State Indicators</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-xs text-slate font-medium">
                        <div className="w-4 h-4 bg-greenmist text-white flex items-center justify-center rounded-sm">
                          ✓
                        </div>
                        <span>Check Selected (Green Mist)</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate font-medium">
                        <div className="w-4 h-4 border border-slate/30 rounded-sm"></div>
                        <span>Check Unselected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Bottom Footer holding the Brand Design Principles exactly as shown in moodboard */}
      <footer className="bg-forest border-t border-slate text-gray-400 py-6 px-8 text-center mt-auto z-40">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-serif text-white font-bold tracking-wide">ClassForum</span>
            <span className="text-slate/60">//</span>
            <span className="text-[10px] font-mono text-greenmist">DESIGN PRINCIPLES</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-gray-300">
            <span>Security First</span>
            <span className="text-slate/50">•</span>
            <span>Clarity in Complexity</span>
            <span className="text-slate/50">•</span>
            <span>Calm & Focused</span>
            <span className="text-slate/50">•</span>
            <span>Trust through Transparency</span>
            <span className="text-slate/50">•</span>
            <span>Performance you can rely on</span>
          </div>

          <div className="text-[9px] font-mono text-slate/50">
            © 2026 ClassForum Secure assessment Platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
