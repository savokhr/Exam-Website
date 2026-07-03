import React, { useState, useEffect, useRef } from 'react';
import { Shield, Clock, ChevronRight, CheckSquare, AlertTriangle, Play, HelpCircle, CheckCircle } from 'lucide-react';
import { Exam, Question, ExamAttempt, ProctoringEvent } from '../types';

interface ExamSimulatorProps {
  exams: Exam[];
  activeAttempt: ExamAttempt | null;
  onStartAttempt: (exam: Exam, studentName: string) => void;
  onSaveAnswer: (questionId: string, answer: string) => void;
  onTriggerProctorEvent: (eventType: any, message: string, severity: 'info' | 'warning' | 'critical') => void;
  onSubmitExam: () => void;
  onExit: () => void;
}

export default function ExamSimulator({
  exams,
  activeAttempt,
  onStartAttempt,
  onSaveAnswer,
  onTriggerProctorEvent,
  onSubmitExam,
  onExit
}: ExamSimulatorProps) {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [studentName, setStudentName] = useState('Johnathan Doe');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load active answer when current question changes
  const activeExam = exams.find(e => e.id === activeAttempt?.examId);
  const currentQuestion = activeExam?.questions[currentQIndex];

  useEffect(() => {
    if (activeAttempt && currentQuestion) {
      setSelectedAnswer(activeAttempt.answers[currentQuestion.id] || '');
    }
  }, [currentQIndex, activeAttempt, currentQuestion]);

  // Handle Visibility and Blur for Proctored tab switch detection
  useEffect(() => {
    if (!activeAttempt || activeAttempt.status !== 'InProgress' || !activeExam?.enableProctoring) return;

    let localSwitches = 0;

    const handleFocusLoss = () => {
      localSwitches++;
      const msg = `Tab Visibility loss detected. Student blurred window focus (Trigger #${localSwitches})`;
      
      // Update Proctoring ledger in parent state
      onTriggerProctorEvent('tab_switch', msg, 'warning');
      
      // Show local modal warning to deter
      setWarningMsg(`PROCTOR WARNING: Focus loss / Tab switch detected. This event has been logged to the secure audit ledger. Refrain from navigating away.`);
      setShowWarning(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        localSwitches++;
        const msg = `Tab Visibility loss: Student navigated away from exam tab (hidden).`;
        onTriggerProctorEvent('tab_switch', msg, 'critical');
        setWarningMsg(`PROCTOR CRITICAL: Tab change detected. Navigation outside the ClassForum iframe is highly restricted. All activities are monitored.`);
        setShowWarning(true);
      }
    };

    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeAttempt, activeExam, onTriggerProctorEvent]);

  // Request Webcam Feed for Proctoring stream
  useEffect(() => {
    if (!activeAttempt || activeAttempt.status !== 'InProgress' || !activeExam?.enableProctoring) {
      // Clean up webcam stream if simulation exits
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        onTriggerProctorEvent('system_ok', 'Webcam stream initialized. Dynamic identity surveillance online.', 'info');
      } catch (err) {
        console.warn('Webcam access failed, running fallback simulation: ', err);
        onTriggerProctorEvent('focus_loss', 'Physical camera offline: Student blocked camera permission or no media devices resolved.', 'warning');
      }
    };

    startWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [activeAttempt, activeExam]);

  // Format Time Remaining (HH:MM:SS)
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  };

  const handleNext = () => {
    if (!activeExam || !currentQuestion) return;

    // Save active state to database mock
    if (selectedAnswer) {
      onSaveAnswer(currentQuestion.id, selectedAnswer);
    }

    if (currentQIndex < activeExam.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleClear = () => {
    setSelectedAnswer('');
    if (currentQuestion) {
      onSaveAnswer(currentQuestion.id, '');
    }
  };

  const handleStart = () => {
    const exam = exams.find(e => e.id === selectedExamId);
    if (!exam) return;
    onStartAttempt(exam, studentName);
    setCurrentQIndex(0);
    setSelectedAnswer('');
  };

  // Render Portal Selection screen
  if (!activeAttempt || activeAttempt.status !== 'InProgress') {
    return (
      <div id="simulation-gate-card" className="max-w-md mx-auto bg-white p-8 rounded-xl border border-fog shadow-md space-y-6 animate-fade-in mt-12">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-greenmist/15 border border-greenmist text-greenmist rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-forest">Student Assessment Portal</h3>
          <p className="text-xs text-slate/60">Simulate a high-integrity student test-taking container.</p>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate/70 uppercase mb-1">Select Active Assessment</label>
            <select
              id="select-simulation-exam"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full px-3 py-2 bg-paper border border-fog rounded-lg text-sm text-forest focus:outline-none"
            >
              {exams.filter(e => e.status === 'Active').map(e => (
                <option key={e.id} value={e.id}>{e.title} ({e.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate/70 uppercase mb-1">Student Candidate Name</label>
            <input
              id="input-simulation-candidate"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 bg-paper border border-fog rounded-lg text-sm text-forest focus:outline-none"
              placeholder="e.g. Johnathan Doe"
            />
          </div>

          <div className="p-3.5 bg-paper rounded-lg border border-fog space-y-1.5">
            <h4 className="text-xs font-semibold text-forest flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-greenmist" />
              <span>Surveillance Notice</span>
            </h4>
            <p className="text-[10px] text-slate/50 leading-relaxed">
              Upon launching, webcam capturing initializes (if allowed) and focus-loss detection activates. Exiting the window or switching tabs triggers automatic system infractions.
            </p>
          </div>

          <button
            id="btn-launch-exam"
            onClick={handleStart}
            className="w-full py-2.5 bg-forest hover:bg-slate text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Secured Environment</span>
          </button>
        </div>
      </div>
    );
  }

  // Active testing screen
  return (
    <div id="active-test-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in relative pb-12">
      
      {/* Warning Overlay */}
      {showWarning && (
        <div id="proctor-warning-modal" className="fixed inset-0 bg-forest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl border border-red-200 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-red-900">Security Breach Logged</h3>
            <p className="text-xs text-slate/60 leading-relaxed">{warningMsg}</p>
            <button
              id="btn-close-warning"
              onClick={() => setShowWarning(false)}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Acknowledge and Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* Left 2 Columns: Main question block */}
      <div className="lg:col-span-2 space-y-6">
        {/* Question Header Card */}
        <div className="bg-white p-6 rounded-xl border border-fog shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-fog pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold bg-slate text-white px-2 py-0.5 rounded uppercase">
                Q. {currentQIndex + 1} of {activeExam?.questions.length}
              </span>
              <span className="text-xs font-mono text-slate/50 ml-3">{currentQuestion?.category}</span>
            </div>
            <span className="text-xs font-semibold text-greenmist">{currentQuestion?.points} Points</span>
          </div>

          {/* Question Text */}
          <div className="space-y-4 py-2">
            <h3 id="current-question-text" className="text-base font-medium text-forest leading-relaxed">
              {currentQuestion?.text}
            </h3>

            {/* Answer Layout */}
            {currentQuestion?.type === 'multiple-choice' && (
              <div id="options-radio-group" className="space-y-2.5">
                {currentQuestion.options?.map((opt, oIdx) => (
                  <label
                    key={oIdx}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                      selectedAnswer === opt
                        ? 'bg-greenmist/10 border-greenmist text-forest font-medium'
                        : 'bg-paper/40 border-fog text-slate hover:bg-paper'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q-option"
                      value={opt}
                      checked={selectedAnswer === opt}
                      onChange={() => setSelectedAnswer(opt)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === opt ? 'border-greenmist bg-greenmist' : 'border-slate/30'
                    }`}>
                      {selectedAnswer === opt && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-xs">
                      <span className="font-semibold mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion?.type === 'true-false' && (
              <div className="space-y-2.5">
                {['True', 'False'].map((opt, oIdx) => (
                  <label
                    key={oIdx}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                      selectedAnswer === opt
                        ? 'bg-greenmist/10 border-greenmist text-forest font-medium'
                        : 'bg-paper/40 border-fog text-slate hover:bg-paper'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q-option"
                      value={opt}
                      checked={selectedAnswer === opt}
                      onChange={() => setSelectedAnswer(opt)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === opt ? 'border-greenmist bg-greenmist' : 'border-slate/30'
                    }`}>
                      {selectedAnswer === opt && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-xs font-semibold">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion?.type === 'short-answer' && (
              <div className="space-y-2.5">
                <label className="block text-[10px] font-semibold text-slate/70 uppercase">Write Your Answer Response</label>
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Type exact matched keyphrase..."
                  className="w-full px-3 py-2 bg-paper border border-fog rounded-lg text-sm text-forest focus:outline-none focus:ring-1 focus:ring-greenmist"
                />
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-fog pt-4 mt-6">
            <button
              id="btn-clear-answer"
              onClick={handleClear}
              className="text-xs text-slate/60 hover:text-slate font-semibold"
            >
              Clear Choice
            </button>

            <div className="flex items-center gap-2">
              <button
                id="btn-prev-question"
                onClick={handleBack}
                disabled={currentQIndex === 0}
                className="px-3.5 py-1.5 bg-paper border border-fog hover:bg-fog text-slate disabled:opacity-40 rounded font-semibold text-xs transition-colors"
              >
                Previous
              </button>
              <button
                id="btn-save-next-question"
                onClick={handleNext}
                className="px-4 py-1.5 bg-forest hover:bg-slate text-white font-semibold text-xs rounded transition-colors"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Progress Fraction Bar */}
        <div className="bg-white p-5 rounded-xl border border-fog shadow-sm flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-slate/70 mb-1.5">
              <span>Progress Bar</span>
              <span className="font-mono">{currentQIndex + 1} / {activeExam?.questions.length}</span>
            </div>
            <div className="w-full bg-fog h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-greenmist h-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / (activeExam?.questions.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Timer, Webcam Feed, and Submission card */}
      <div className="space-y-6">
        {/* Ticking Countdown Timer Card */}
        <div id="timer-box-card" className="bg-white p-6 rounded-xl border border-fog shadow-sm text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate/60 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-greenmist" />
            <span>Time Remaining</span>
          </div>
          <h2 id="timer-countdown-text" className="text-4xl font-mono font-bold text-forest tracking-tight">
            {formatTime(activeAttempt.timeLeft)}
          </h2>
          <div className="w-full h-1 bg-fog rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${activeAttempt.timeLeft < 300 ? 'bg-red-500 animate-pulse' : 'bg-greenmist'}`}
              style={{ width: `${(activeAttempt.timeLeft / ((activeExam?.timeLimitMinutes || 30) * 60)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Proctor Camera stream feed */}
        {activeExam?.enableProctoring && (
          <div id="simulation-camera-card" className="bg-white p-6 rounded-xl border border-fog shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>Active Proctor Feed</span>
              </h4>
              <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                Secure
              </span>
            </div>

            {/* Simulated Frame */}
            <div className="aspect-video w-full bg-forest rounded-lg overflow-hidden border border-slate flex items-center justify-center relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]" // mirror effect
              />
              {/* Fallback avatar overlay if video is null or not active */}
              {(!videoRef.current || !videoRef.current.srcObject) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest text-center px-4 space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-slate flex items-center justify-center text-greenmist animate-pulse">
                    <Shield className="w-5 h-5" />
                  </div>
                  <p className="text-[9px] font-mono text-greenmist uppercase tracking-widest leading-none">Fallback stream active</p>
                  <p className="text-[9px] text-gray-400">Secure AES-256 Virtual Feed</p>
                </div>
              )}
              {/* Scanning visual overlay */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-greenmist/40 animate-bounce"></div>
            </div>

            {/* Student Metadata specs */}
            <div className="text-[10px] space-y-1.5 bg-paper p-3 rounded-lg border border-fog font-mono text-slate/70">
              <div className="flex justify-between">
                <span>CANDIDATE:</span>
                <span className="font-semibold text-forest">{activeAttempt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span>STUDENT ID:</span>
                <span className="font-semibold text-forest">{activeAttempt.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span>TAB SW_COUNT:</span>
                <span className="font-semibold text-red-600 font-bold">{activeAttempt.tabSwitches}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button submit */}
        <div className="bg-white p-5 rounded-xl border border-fog shadow-sm space-y-3">
          <button
            id="btn-submit-exam"
            onClick={onSubmitExam}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            Submit Graded Assessment
          </button>
          <button
            id="btn-abort-simulation"
            onClick={onExit}
            className="w-full py-2 bg-paper hover:bg-fog text-slate font-semibold text-xs rounded-lg transition-colors text-center border border-fog block"
          >
            Exit Gate Container
          </button>
        </div>
      </div>
    </div>
  );
}
