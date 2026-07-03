import React from 'react';
import { ShieldAlert, BarChart3, LayoutDashboard, FileSpreadsheet, KeyRound, MonitorCheck, HelpCircle, GraduationCap, Shield } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulatorActive: boolean;
  onEnterSimulator: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isSimulatorActive, onEnterSimulator }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'Exams', icon: FileSpreadsheet },
    { id: 'proctoring', label: 'Proctoring Monitor', icon: MonitorCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'security-docs', label: 'Security & Architecture', icon: KeyRound },
  ];

  return (
    <div id="classforum-sidebar" className="w-68 bg-forest text-white flex flex-col h-screen border-r border-slate flex-shrink-0">
      {/* Branding Header */}
      <div className="p-6 border-b border-slate flex items-center gap-3">
        <div className="w-10 h-10 bg-slate rounded-lg flex items-center justify-center border border-greenmist">
          <Shield className="w-6 h-6 text-greenmist" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-xl tracking-wide leading-tight">ClassForum</h1>
          <p className="text-[9px] text-greenmist font-mono tracking-widest uppercase">SECURE ASSESSMENTS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider text-greenmist font-semibold mb-3 px-3">
          Admin Workspace
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !isSimulatorActive;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                isActive
                  ? 'bg-slate text-white border-l-2 border-greenmist font-medium'
                  : 'text-gray-400 hover:bg-slate/50 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-greenmist' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6 border-t border-slate/50 mt-6">
          <div className="text-[10px] uppercase tracking-wider text-greenmist font-semibold mb-3 px-3">
            Testing Portal
          </div>
          <button
            id="nav-item-simulator"
            onClick={onEnterSimulator}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
              isSimulatorActive
                ? 'bg-greenmist/20 text-greenmist border border-greenmist font-medium'
                : 'text-gray-400 hover:bg-slate/50 hover:text-white border border-transparent'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${isSimulatorActive ? 'text-greenmist' : 'text-gray-400'}`} />
            <div className="flex-1 flex items-center justify-between">
              <span>Take Test Simulator</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-greenmist text-forest rounded-full font-mono font-bold uppercase">
                Demo
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* User profile footer - Dr. Sarah Khan */}
      <div className="p-4 border-t border-slate bg-slate/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-greenmist/20 border border-greenmist overflow-hidden flex items-center justify-center">
            {/* Fallback elegant monogram */}
            <span className="text-greenmist font-serif font-bold text-sm">SK</span>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Dr. Sarah Khan</h4>
            <p className="text-[10px] text-gray-400">Administrator</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online"></div>
      </div>
    </div>
  );
}
