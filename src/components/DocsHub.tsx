import React, { useState } from 'react';
import { Database, FileCode, Landmark, HelpCircle, Network, ListChecks, ArrowUpRight, Copy, Check } from 'lucide-react';
import { DB_SCHEMA, API_ROUTES, SECURITY_MITIGATIONS, CODE_SNIPPETS, TEST_PLAN_CONTENT } from '../data';

export default function DocsHub() {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'database' | 'api' | 'security' | 'code' | 'testing'>('architecture');
  const [selectedSnippetId, setSelectedSnippetId] = useState(CODE_SNIPPETS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeSnippet = CODE_SNIPPETS.find(s => s.id === selectedSnippetId) || CODE_SNIPPETS[0];

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const subTabs = [
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'database', label: 'Database Schema', icon: Database },
    { id: 'api', label: 'API Reference', icon: Landmark },
    { id: 'security', label: 'Security Matrix', icon: ListChecks },
    { id: 'code', label: 'Backend Snippets', icon: FileCode },
    { id: 'testing', label: 'Test Plan', icon: ListChecks },
  ];

  return (
    <div id="docs-hub-container" className="space-y-6 animate-fade-in pb-12">
      
      {/* Title block */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-forest tracking-tight">Security & Architecture Hub</h2>
        <p className="text-xs text-slate/70">Production-grade infrastructure specifications, ledger models, and cryptographic safeguards.</p>
      </div>

      {/* Sub tabs nav */}
      <div className="flex border-b border-fog overflow-x-auto gap-1">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`subtab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-greenmist text-forest font-bold'
                  : 'border-transparent text-slate/60 hover:text-slate'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-fog p-6 shadow-sm min-h-[400px]">
        
        {/* SubTab 1: Architecture Flow */}
        {activeSubTab === 'architecture' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-forest mb-1">High-Level System Architecture</h3>
              <p className="text-xs text-slate/60">Comprehensive component layout and secure data boundaries for horizontal scaling (1000+ takers).</p>
            </div>

            {/* Visual Flow diagram using grid and boxes */}
            <div id="arch-visual-grid" className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              
              <div className="bg-paper p-4 rounded-lg border border-fog flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-slate/50">Boundary 1</span>
                  <h4 className="text-xs font-bold text-forest mt-1">Candidate Browser</h4>
                  <p className="text-[10px] text-slate/60 mt-1">Client SPA container. Restricts copy/paste, hooks visibility APIs, and loads questions singly.</p>
                </div>
                <div className="text-right text-greenmist mt-4">
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </div>
              </div>

              <div className="bg-forest text-white p-4 rounded-lg border border-slate flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-greenmist">Boundary 2 (WAF Gateway)</span>
                  <h4 className="text-xs font-bold text-white mt-1">Reverse Proxy & Rate Limiter</h4>
                  <p className="text-[10px] text-gray-300 mt-1">Cloudflare / Nginx gateway. Terminates SSL, manages DDOS shields, and limits login brute attacks.</p>
                </div>
                <div className="text-right text-greenmist mt-4">
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </div>
              </div>

              <div className="bg-slate text-white p-4 rounded-lg border border-forest flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-greenmist">Boundary 3 (Node App Node)</span>
                  <h4 className="text-xs font-bold text-white mt-1">Node.js Server Cluster</h4>
                  <p className="text-[10px] text-gray-300 mt-1">Express API running Drizzle ORM. Enforces RBAC permissions, evaluates timers, and grades essays via Gemini.</p>
                </div>
                <div className="text-right text-greenmist mt-4">
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </div>
              </div>

              <div className="bg-paper p-4 rounded-lg border border-fog flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-slate/50">Boundary 4 (Storage Ledgers)</span>
                  <h4 className="text-xs font-bold text-forest mt-1">PostgreSQL & Redis DBs</h4>
                  <p className="text-[10px] text-slate/60 mt-1">Handles atomic scoring transactions with row locks (Postgres) and tracks active session states (Redis).</p>
                </div>
                <div className="text-right text-greenmist mt-4">
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </div>
              </div>
            </div>

            {/* Architecture description details */}
            <div className="bg-paper p-4 rounded-lg border border-fog text-xs space-y-3 mt-4 text-slate/80">
              <h4 className="font-bold text-forest">Trust Boundaries & Security Safeguards:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><span className="font-semibold text-forest">Strict Single-Question Isolation:</span> The candidate SPA is never served the entire question bank. It requests current indices sequentially, authenticated via JSON Web Tokens.</li>
                <li><span className="font-semibold text-forest">Server Authoritative Grading:</span> Correct answer payloads never cross the client boundary before submission. Scores are calculated by atomic DB comparisons or rubric-based models securely.</li>
                <li><span className="font-semibold text-forest">Scale & Thread Safeguards:</span> Rate limiting protects grading endpoints under heavy thread lock contention. Redis manages session caches to minimize active DB I/O.</li>
              </ul>
            </div>
          </div>
        )}

        {/* SubTab 2: Database Schema */}
        {activeSubTab === 'database' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-forest mb-1">Database Schema Definitions</h3>
              <p className="text-xs text-slate/60">Complete Relational Schema mapping out row properties and cryptographic storage fields in PostgreSQL.</p>
            </div>

            <div className="space-y-6">
              {DB_SCHEMA.map((table) => (
                <div key={table.name} className="border border-fog rounded-lg overflow-hidden shadow-sm bg-paper/20">
                  <div className="bg-paper px-4 py-3 border-b border-fog flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-forest">TABLE: {table.name}</span>
                    <span className="text-[10px] text-slate/50 italic">{table.description}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-paper/40 border-b border-fog text-[9px] uppercase tracking-wider text-slate/50 font-bold">
                          <th className="py-2 px-4">Column Name</th>
                          <th className="py-2 px-4">Type</th>
                          <th className="py-2 px-4">Constraints</th>
                          <th className="py-2 px-4">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-fog/60 font-mono">
                        {table.columns.map((col, idx) => (
                          <tr key={idx} className="hover:bg-white/60 transition-colors">
                            <td className="py-2 px-4 font-bold text-forest">{col.name}</td>
                            <td className="py-2 px-4 text-slate">{col.type}</td>
                            <td className="py-2 px-4 text-greenmist font-semibold">{col.constraints}</td>
                            <td className="py-2 px-4 text-slate/70 font-sans text-xs">{col.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SubTab 3: API Reference */}
        {activeSubTab === 'api' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-forest mb-1">Secure API Reference Endpoints</h3>
              <p className="text-xs text-slate/60">Strictly typed REST endpoints, authentication parameters, and active rate limiting controls.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-fog text-[10px] uppercase tracking-wider text-slate/50 font-bold">
                    <th className="py-3 px-2">Method</th>
                    <th className="py-3 px-2">Path</th>
                    <th className="py-3 px-2">Authentication</th>
                    <th className="py-3 px-2">Rate Limit policy</th>
                    <th className="py-3 px-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fog/60 font-mono">
                  {API_ROUTES.map((route, idx) => (
                    <tr key={idx} className="hover:bg-paper/20 transition-colors">
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          route.method === 'GET' ? 'bg-blue-50 text-blue-700' :
                          route.method === 'POST' ? 'bg-emerald-50 text-emerald-700' :
                          route.method === 'PUT' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {route.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-semibold text-forest font-mono">{route.path}</td>
                      <td className="py-3.5 px-2 text-slate/70 font-sans">{route.auth}</td>
                      <td className="py-3.5 px-2 text-greenmist font-sans font-semibold text-[11px]">{route.rateLimit}</td>
                      <td className="py-3.5 px-2 text-slate/60 font-sans text-xs">{route.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SubTab 4: Security Matrix */}
        {activeSubTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-forest mb-1">OWASP Security Matrix</h3>
              <p className="text-xs text-slate/60">Direct mapping of our functional features to the specific security countermeasures protecting them.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-fog text-[10px] uppercase tracking-wider text-slate/50 font-bold">
                    <th className="py-3 px-2">Module</th>
                    <th className="py-3 px-2">Threat Vector</th>
                    <th className="py-3 px-2">Security Countermeasure / Protection Method</th>
                    <th className="py-3 px-2 text-right">Postures</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fog/60">
                  {SECURITY_MITIGATIONS.map((matrix) => (
                    <tr key={matrix.id} className="hover:bg-paper/20 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-forest">{matrix.feature}</td>
                      <td className="py-3.5 px-2 text-red-600 font-medium">{matrix.vulnerability}</td>
                      <td className="py-3.5 px-2 text-slate/70 leading-relaxed max-w-sm">{matrix.mitigation}</td>
                      <td className="py-3.5 px-2 text-right">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-semibold font-mono">
                          {matrix.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SubTab 5: Code Snippets */}
        {activeSubTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Snippet selector sidebar */}
            <div className="lg:col-span-1 space-y-2">
              <h4 className="text-xs font-semibold text-slate/70 uppercase mb-3">Security Implementations</h4>
              {CODE_SNIPPETS.map((sn) => (
                <button
                  key={sn.id}
                  id={`btn-code-${sn.id}`}
                  onClick={() => setSelectedSnippetId(sn.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedSnippetId === sn.id
                      ? 'bg-slate border-slate text-white font-medium'
                      : 'bg-white border-fog text-slate hover:bg-paper'
                  }`}
                >
                  <div className="font-semibold truncate">{sn.title}</div>
                  <div className={`text-[10px] ${selectedSnippetId === sn.id ? 'text-greenmist' : 'text-slate/40'} font-mono mt-1`}>
                    {sn.filename}
                  </div>
                </button>
              ))}
            </div>

            {/* Code Viewer Panel */}
            <div className="lg:col-span-3 space-y-3.5">
              <div className="flex items-center justify-between border-b border-fog pb-2">
                <div>
                  <h4 className="text-sm font-bold text-forest">{activeSnippet.title}</h4>
                  <p className="text-[10px] font-mono text-slate/40">{activeSnippet.filename}</p>
                </div>
                <button
                  onClick={() => handleCopyCode(activeSnippet.id, activeSnippet.code)}
                  className="p-1.5 hover:bg-fog text-slate hover:text-forest rounded transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Copy code block"
                >
                  {copiedId === activeSnippet.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code text frame */}
              <div className="bg-forest text-gray-200 p-4 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[420px] overflow-y-auto border border-slate shadow-inner">
                <pre>{activeSnippet.code}</pre>
              </div>
            </div>
          </div>
        )}

        {/* SubTab 6: Testing */}
        {activeSubTab === 'testing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-serif font-bold text-forest mb-1">Quality Assurance & Test Plan</h3>
              <p className="text-xs text-slate/60">Structured functional, load, and security penetration test profiles.</p>
            </div>

            <div className="bg-paper p-5 rounded-lg border border-fog text-xs text-slate/80 leading-relaxed whitespace-pre-line font-sans">
              {TEST_PLAN_CONTENT}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
