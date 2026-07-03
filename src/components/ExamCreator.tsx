import React, { useState } from 'react';
import { Plus, Trash, HelpCircle, Save, X, ArrowLeft } from 'lucide-react';
import { Exam, Question, QuestionType } from '../types';

interface ExamCreatorProps {
  onAddExam: (exam: Exam) => void;
  onCancel: () => void;
}

export default function ExamCreator({ onAddExam, onCancel }: ExamCreatorProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Quiz' | 'Test' | 'Exam'>('Quiz');
  const [timeLimit, setTimeLimit] = useState(30);
  const [enableProctoring, setEnableProctoring] = useState(true);
  
  // Custom questions setup
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'custom-q-1',
      category: 'General',
      type: 'multiple-choice',
      text: 'Which architectural model organizes services into independent, loosely coupled deployments?',
      options: ['Monolithic Architecture', 'Microservices Architecture', 'Serverless Architecture', 'Shared Database Model'],
      correctAnswer: 'Microservices Architecture',
      points: 5
    }
  ]);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('multiple-choice');
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(['', '', '', '']);
  const [newQuestionCorrectOption, setNewQuestionCorrectOption] = useState<number>(0);
  const [newQuestionCorrectText, setNewQuestionCorrectText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('Core concepts');
  const [newQuestionPoints, setNewQuestionPoints] = useState(5);

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;

    let correctAnswer = '';
    let options: string[] | undefined = undefined;

    if (newQuestionType === 'multiple-choice') {
      options = newQuestionOptions.filter(opt => opt.trim() !== '');
      if (options.length < 2) {
        alert('Please provide at least 2 options for multiple-choice questions.');
        return;
      }
      correctAnswer = options[newQuestionCorrectOption] || options[0];
    } else if (newQuestionType === 'true-false') {
      options = ['True', 'False'];
      correctAnswer = newQuestionCorrectOption === 0 ? 'True' : 'False';
    } else {
      correctAnswer = newQuestionCorrectText.trim();
      if (!correctAnswer) {
        alert('Please specify the expected correct answer.');
        return;
      }
    }

    const question: Question = {
      id: `custom-q-${Date.now()}`,
      category: newQuestionCategory || 'General',
      type: newQuestionType,
      text: newQuestionText,
      options,
      correctAnswer,
      points: newQuestionPoints
    };

    setQuestions([...questions, question]);
    setNewQuestionText('');
    setNewQuestionOptions(['', '', '', '']);
    setNewQuestionCorrectText('');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please fill in the exam title.');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question to the exam.');
      return;
    }

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title,
      type,
      questionsCount: questions.length,
      participantsCount: 0,
      status: 'Active',
      timeLimitMinutes: timeLimit,
      questions,
      enableProctoring,
      createdAt: new Date().toISOString()
    };

    onAddExam(newExam);
  };

  return (
    <div id="exam-creator-container" className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-fog text-slate rounded-lg transition-colors"
          title="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-serif font-bold text-forest tracking-tight">Create Assessment</h2>
          <p className="text-xs text-slate/70">Configure your parameters, security proctoring, and question bank.</p>
        </div>
      </div>

      <form onSubmit={handleCreateExam} className="space-y-6">
        {/* Core Parameters Card */}
        <div className="bg-white p-6 rounded-xl border border-fog shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-forest border-b border-fog pb-2">1. Assessment Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate/70 uppercase mb-1.5">Exam Title</label>
              <input
                id="input-exam-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Final Semester Examination"
                className="w-full px-3 py-2 bg-paper border border-fog rounded-lg text-sm text-forest placeholder-slate/40 focus:outline-none focus:ring-1 focus:ring-greenmist"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate/70 uppercase mb-1.5">Type</label>
              <select
                id="select-exam-type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-paper border border-fog rounded-lg text-sm text-forest focus:outline-none focus:ring-1 focus:ring-greenmist"
              >
                <option value="Quiz">Quiz</option>
                <option value="Test">Test</option>
                <option value="Exam">Exam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate/70 uppercase mb-1.5">Time Limit (Minutes)</label>
              <input
                id="input-exam-duration"
                type="number"
                min="1"
                max="300"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-paper border border-fog rounded-lg text-sm text-forest focus:outline-none focus:ring-1 focus:ring-greenmist font-mono"
                required
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-paper rounded-lg border border-fog mt-3.5">
              <div>
                <h4 className="text-xs font-semibold text-forest">Enable Proctoring</h4>
                <p className="text-[10px] text-slate/50">Active webcam monitoring and visibility checks.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-proctoring"
                  type="checkbox"
                  checked={enableProctoring}
                  onChange={(e) => setEnableProctoring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-greenmist"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Question Bank Config */}
        <div className="bg-white p-6 rounded-xl border border-fog shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-forest border-b border-fog pb-2">2. Manage Questions ({questions.length})</h3>

          {/* Added Questions List */}
          {questions.length > 0 ? (
            <div className="space-y-3.5">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-start justify-between p-4 bg-paper/60 border border-fog rounded-lg gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-slate text-white px-1.5 py-0.5 rounded uppercase">
                        Q.{index + 1} {q.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate/50">{q.category}</span>
                      <span className="text-[10px] font-mono text-greenmist font-semibold">({q.points} pts)</span>
                    </div>
                    <p className="text-sm font-medium text-forest">{q.text}</p>
                    {q.options && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
                        {q.options.map((opt, oIdx) => (
                          <li 
                            key={oIdx} 
                            className={`text-xs px-2.5 py-1 rounded border ${
                              opt === q.correctAnswer 
                                ? 'bg-greenmist/10 border-greenmist text-slate font-medium' 
                                : 'bg-white border-fog text-slate/70'
                            }`}
                          >
                            <span className="font-semibold mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                    {!q.options && (
                      <p className="text-xs text-slate/60 pt-1">
                        Expected Answer: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-fog font-medium">{q.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="p-1 hover:bg-red-50 text-slate hover:text-red-600 rounded transition-colors flex-shrink-0"
                    title="Remove question"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate/40 border border-dashed border-fog rounded-lg text-sm">
              No questions added yet. Construct your questions below.
            </div>
          )}

          {/* Form to Add New Question */}
          <div className="bg-paper/40 p-5 rounded-lg border border-fog space-y-4">
            <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-greenmist" />
              <span>Add Question Element</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold text-slate/60 uppercase mb-1">Question Type</label>
                <div className="flex gap-2">
                  {(['multiple-choice', 'true-false', 'short-answer'] as QuestionType[]).map((qt) => (
                    <button
                      key={qt}
                      type="button"
                      onClick={() => setNewQuestionType(qt)}
                      className={`flex-1 py-1.5 rounded text-xs font-semibold border transition-all ${
                        newQuestionType === qt
                          ? 'bg-forest border-forest text-white shadow-sm'
                          : 'bg-white border-fog text-slate/70 hover:bg-paper'
                      }`}
                    >
                      {qt === 'multiple-choice' && 'Multiple Choice'}
                      {qt === 'true-false' && 'True / False'}
                      {qt === 'short-answer' && 'Short Answer'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate/60 uppercase mb-1">Points</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newQuestionPoints}
                  onChange={(e) => setNewQuestionPoints(parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 bg-white border border-fog rounded text-xs text-forest focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate/60 uppercase mb-1">Question Prompt Text</label>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="e.g. Which of the following is an idempotent HTTP operation?"
                className="w-full px-3 py-2 bg-white border border-fog rounded-lg text-xs text-forest focus:outline-none h-16 resize-none"
              />
            </div>

            {/* Config depends on type */}
            {newQuestionType === 'multiple-choice' && (
              <div className="space-y-2.5">
                <label className="block text-[10px] font-semibold text-slate/60 uppercase">Multiple Choice Options</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {newQuestionOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate/50">{String.fromCharCode(65 + idx)}:</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newQuestionOptions];
                          updated[idx] = e.target.value;
                          setNewQuestionOptions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-fog rounded text-xs text-forest focus:outline-none"
                      />
                      <input
                        type="radio"
                        name="correct-option"
                        checked={newQuestionCorrectOption === idx}
                        onChange={() => setNewQuestionCorrectOption(idx)}
                        className="accent-greenmist cursor-pointer"
                        title="Mark as correct answer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newQuestionType === 'true-false' && (
              <div>
                <label className="block text-[10px] font-semibold text-slate/60 uppercase mb-1.5">Correct Truth Value</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="tf-correct"
                      checked={newQuestionCorrectOption === 0}
                      onChange={() => setNewQuestionCorrectOption(0)}
                      className="accent-greenmist"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="tf-correct"
                      checked={newQuestionCorrectOption === 1}
                      onChange={() => setNewQuestionCorrectOption(1)}
                      className="accent-greenmist"
                    />
                    <span>False</span>
                  </label>
                </div>
              </div>
            )}

            {newQuestionType === 'short-answer' && (
              <div>
                <label className="block text-[10px] font-semibold text-slate/60 uppercase mb-1">Expected Correct Answer Text (Exact/fuzzy matched)</label>
                <input
                  type="text"
                  value={newQuestionCorrectText}
                  onChange={(e) => setNewQuestionCorrectText(e.target.value)}
                  placeholder="e.g. GET"
                  className="w-full px-3 py-2 bg-white border border-fog rounded-lg text-xs text-forest focus:outline-none"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-1.5 bg-slate hover:bg-forest text-white text-xs font-semibold rounded transition-colors"
              >
                Insert to Question List
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-fog">
          <button
            id="btn-creator-cancel"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-fog hover:bg-paper text-slate text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-creator-save"
            type="submit"
            className="px-5 py-2 bg-forest hover:bg-slate text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
}
