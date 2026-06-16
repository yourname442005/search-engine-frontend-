/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, ShieldAlert, Database, Settings, ShieldCheck, 
  Search, Filter, RotateCcw, Activity, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { UserAccount, AuditLog } from '../types';
import { mockUsers, mockAuditLogs } from '../data/mockData';

export default function AdminPanel() {
  
  // States
  const [users, setUsers] = useState<UserAccount[]>(mockUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  
  // Filter states
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [actionQuery, setActionQuery] = useState('');
  
  // Pending Approval Queue
  const [pendingQueue, setPendingQueue] = useState([
    {
      id: "pend-1",
      title: "Synthesizing Sparse Matrix Operations inside Deep Attention Blocks",
      authors: ["Zeyuan Li", "Ming Tang"],
      year: 2026,
      department: "Engineering",
      doi: "10.48550/arXiv.2605.0142"
    },
    {
      id: "pend-2",
      title: "A Comprehensive Survey of Post-Quantum Digital Signature Verification",
      authors: ["Robert Chen"],
      year: 2025,
      department: "Computer Science",
      doi: "10.1109/surv.2025.101"
    }
  ]);

  // System Configs
  const [ragTemperature, setRagTemperature] = useState(0.15);
  const [embWeight, setEmbWeight] = useState(65); // 65% dense vector, 35% BM25 keyword
  const [retrievalCount, setRetrievalCount] = useState(5);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notification Toast
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg(null);
    }, 4500);
  };

  // Modify user roles
  const handleAssignRole = (userId: string, targetRole: 'Student' | 'Faculty' | 'Librarian' | 'Admin') => {
    const updated = users.map(u => {
      if (u.id === userId) {
        triggerToast(`Authorization updated: Assigned user "${u.name}" to role: "${targetRole}".`);
        
        // Append new Audit Log element
        const newLog: AuditLog = {
          id: `log-${Date.now()}`,
          user: "admin.alis@university.edu",
          role: "Admin",
          action: "Modify User Role",
          target: `Assigned ${u.email} -> ${targetRole}`,
          ip: "10.142.1.2",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        setAuditLogs(prev => [newLog, ...prev]);

        return { ...u, role: targetRole };
      }
      return u;
    });
    setUsers(updated);
  };

  // Approve Resource Queue
  const handleResourceApproval = (id: string, name: string, status: 'approved' | 'declined') => {
    setPendingQueue(pendingQueue.filter(p => p.id !== id));
    triggerToast(`Approval Queue: Reference "${name}" has been ${status.toUpperCase()} and removed from the active ingest queue.`);
    
    // Add audit trail log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: "admin.alis@university.edu",
      role: "Admin",
      action: `Resource Ingest ${status === 'approved' ? 'Approval' : 'Decline'}`,
      target: `Title: "${name}"`,
      ip: "10.142.1.2",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("System Variables: Embedding vector matrices weights & response ratios updated securely.");
  };

  // Compute filtered audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (userRoleFilter !== 'all' && log.role !== userRoleFilter) return false;
      if (actionQuery.trim()) {
        const query = actionQuery.toLowerCase();
        const match = log.action.toLowerCase().includes(query) || 
                      log.target.toLowerCase().includes(query) ||
                      log.user.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [auditLogs, userRoleFilter, actionQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="admin-panel-screen-root">
      
      {/* Toast Alert */}
      {alertMsg && (
        <div id="admin-toast-alert" className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 shadow-xl transition-all duration-300 transform translate-y-0 text-sm font-medium text-zinc-850">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Header info */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 font-mono">System Command Center</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1 uppercase">
            ALIS V2.0 Administrative Panel
          </h1>
        </div>

        <div className="rounded-lg bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 flex items-center gap-1.5 font-mono">
          <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span>Ingest Engine Version: <strong>bge-m3-v2</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="admin-panel-bento-grid">
        
        {/* Left Side: User list & pending approvals queue (2/3 columns span) */}
        <div className="lg:col-span-2 space-y-8" id="admin-management-leads">
          
          {/* User Management System card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm" id="user-management-block">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-600" />
              Institutional Account Management
            </h3>

            <div className="overflow-x-auto" id="user-table-wrapper">
              <table className="w-full text-left text-xs text-zinc-500">
                <thead className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 bg-zinc-50/70 border-b border-zinc-200">
                  <tr>
                    <th className="px-4 py-3">Academic Name</th>
                    <th className="px-4 py-3">Email Index</th>
                    <th className="px-4 py-3">Clearance Role</th>
                    <th className="px-4 py-3 text-right">Assign Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-sans font-medium text-zinc-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50/40" id={`user-row-id-${u.id}`}>
                      <td className="px-4 py-3 font-bold">{u.name}</td>
                      <td className="px-4 py-3 text-zinc-500 font-mono">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[9px] font-bold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          id={`select-role-user-${u.id}`}
                          value={u.role}
                          onChange={(e) => handleAssignRole(u.id, e.target.value as any)}
                          className="rounded border border-zinc-250 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700 focus:outline-none"
                        >
                          <option value="Student">Student</option>
                          <option value="Faculty">Faculty</option>
                          <option value="Librarian">Librarian</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resource Approval Queue Block */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm" id="resource-approval-queue-block">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Ingest Approval Vault Queue ({pendingQueue.length})
            </h3>
            
            {pendingQueue.length === 0 ? (
              <div className="text-center py-6 text-zinc-400 text-xs border border-dashed border-zinc-200 rounded-lg bg-zinc-50/20" id="empty-approval-queue">
                Approval queue completely empty. No incoming files waiting indexing.
              </div>
            ) : (
              <div className="space-y-4" id="approval-queue-list">
                {pendingQueue.map((item) => (
                  <div key={item.id} className="rounded-lg border border-zinc-200 bg-zinc-50/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id={`pending-approval-card-${item.id}`}>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">{item.doi}</span>
                      <h4 className="text-xs font-bold text-zinc-900 leading-snug">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">By {item.authors.join(', ')} • Dept: {item.department}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`reject-pnd-btn-${item.id}`}
                        onClick={() => handleResourceApproval(item.id, item.title, 'declined')}
                        className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-650 hover:bg-red-50"
                      >
                        Decline
                      </button>
                      <button
                        id={`approve-pnd-btn-${item.id}`}
                        onClick={() => handleResourceApproval(item.id, item.title, 'approved')}
                        className="rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 shadow-sm"
                      >
                        Approve Ingest
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Logs System Ledger Card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm" id="audit-trail-ledger">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3 mb-4 gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                <Database className="h-4 w-4 text-zinc-400" />
                Security Audit Log Logs
              </h3>

              {/* Logs filter inputs */}
              <div className="flex items-center gap-2" id="audit-logs-filtering-row">
                <select
                  id="logs-filter-role-select"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="rounded border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="Student">Student Only</option>
                  <option value="Faculty">Faculty Only</option>
                  <option value="Librarian">Librarian Only</option>
                  <option value="Admin">Admin Only</option>
                </select>

                <input
                  type="text"
                  id="logs-action-search-bar"
                  value={actionQuery}
                  onChange={(e) => setActionQuery(e.target.value)}
                  placeholder="Filter logs..."
                  className="rounded border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 focus:outline-none w-32 sm:w-44"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[300px]" id="audit-ledger-scroller">
              <table className="w-full text-left text-[11px] text-zinc-500 font-mono">
                <thead className="bg-zinc-50 border-b border-zinc-150 text-[9px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-3 py-2">User Email</th>
                    <th className="px-3 py-2">Action</th>
                    <th className="px-3 py-2">Target Profile</th>
                    <th className="px-3 py-2 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700 font-mono">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/50" id={`audit-tr-row-${log.id}`}>
                      <td className="px-3 py-2 font-bold text-zinc-900">{log.user}</td>
                      <td className="px-3 py-2">
                        <span className="bg-zinc-100 text-zinc-800 rounded px-1.5 py-0.5 text-[8.5px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-2 truncate max-w-xs">{log.target}</td>
                      <td className="px-3 py-2 text-right text-zinc-400">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Area: System configuration form (1/3 columns span) */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm h-fit" id="system-configurations-column">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
            <Settings className="h-4 w-4 text-amber-700" />
            Core System Variables
          </h3>

          <form onSubmit={handleSaveConfigs} className="space-y-5">
            
            {/* RAG generative temperature */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-650">RAG Generation Temp</label>
                <span className="text-[10px] font-mono font-bold text-zinc-500">{ragTemperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ragTemperature}
                onChange={(e) => setRagTemperature(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[9px] text-zinc-400 block font-sans">Lower temperature strictly grounds LLM responses, preventing creative tangents.</span>
            </div>

            {/* Embedding weighting dense vs sparse */}
            <div className="space-y-1.5 border-t border-zinc-100 pt-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-650">Cognitive Hybrid Search Ratio</label>
                <span className="text-[10px] font-mono font-bold text-blue-600 font-sans">{embWeight}% Vector Dense</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={embWeight}
                onChange={(e) => setEmbWeight(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-400 font-mono font-bold">
                <span>100% Lexical BM25 (Exact terms)</span>
                <span>100% Dense Vector Embedding</span>
              </div>
            </div>

            {/* Top-k passage context index size limit */}
            <div className="space-y-1.5 border-t border-zinc-100 pt-3.5">
              <label className="text-xs font-bold text-zinc-650 block">Generator Passages Count (Top-k)</label>
              <select
                id="config-topk-select"
                value={retrievalCount}
                onChange={(e) => setRetrievalCount(parseInt(e.target.value))}
                className="w-full text-xs font-semibold rounded border border-zinc-200 bg-zinc-50/50 p-2 focus:outline-none"
              >
                <option value="3">3 Contextual Passages (Fastest)</option>
                <option value="5">5 Contextual Passages (Optimal Precision)</option>
                <option value="8">8 Contextual Passages (Extensive Analysis)</option>
                <option value="12">12 Contextual Passages (Extreme Exhaustive)</option>
              </select>
            </div>

            {/* Maintenance Mode Toggle switcher */}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-4" id="config-maintenance-row">
              <div className="space-y-0.5 pr-2">
                <label className="text-xs font-bold text-zinc-650 block">Maintenance Halt</label>
                <span className="text-[9.5px] text-zinc-400 leading-normal block">Temporarily locks public ingestion pipelines.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => {
                    setMaintenanceMode(e.target.checked);
                    triggerToast(`System Lockout Mode: Ingest operations have been ${e.target.checked ? 'TEMPORARILY HALTED' : 'RESTORED'}`);
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button
              id="submit-save-configs-btn"
              type="submit"
              className="w-full rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 shadow-sm transition-colors block mt-4"
            >
              Update System Configurations
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
