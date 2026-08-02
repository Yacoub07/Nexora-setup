import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  FileCheck2,
  Sliders,
  Activity,
  Calendar,
  Layers,
  Terminal,
  Key,
  Lock,
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Share2,
  Download,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Database,
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  Cpu,
  BarChart3,
  ShieldAlert,
  FileText
} from 'lucide-react';
import {
  CORE_SPRINT_ROADMAP,
  MOCK_CORE_ORG_UNITS,
  MOCK_CORE_USERS,
  MOCK_CORE_AUDIT_LOGS,
  MOCK_CORE_SYSTEM_METRICS,
  CORE_VERSION
} from '../../data/coreData';
import {
  CoreSprintSpec,
  CoreOrganizationUnit,
  CoreUserRecord,
  CoreAuditLog
} from '../../types/core';

interface CoreExplorerProps {
  onOpenCodeModal: (title: string, code: string, language?: string) => void;
  onTriggerToast: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const CoreExplorer: React.FC<CoreExplorerProps> = ({
  onOpenCodeModal,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'iam' | 'org' | 'users' | 'audit' | 'admin'>('roadmap');

  // Roadmap State
  const [selectedSprint, setSelectedSprint] = useState<CoreSprintSpec>(CORE_SPRINT_ROADMAP[0]);
  const [expandedSection, setExpandedSection] = useState<string>('tasks');

  // IAM Interactive State
  const [iamUserRole, setIamUserRole] = useState<string>('WORKSPACE_ADMIN');
  const [iamPermission, setIamPermission] = useState<string>('org:create');
  const [iamEvalResult, setIamEvalResult] = useState<boolean | null>(null);
  const [generatedJwt, setGeneratedJwt] = useState<string | null>(null);

  // User Mgmt State
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [usersList, setUsersList] = useState<CoreUserRecord[]>(MOCK_CORE_USERS);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<string>('MEMBER');

  // Audit State
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');
  const [auditStatusFilter, setAuditStatusFilter] = useState<string>('ALL');

  // Org Units State
  const [orgUnits, setOrgUnits] = useState<CoreOrganizationUnit[]>(MOCK_CORE_ORG_UNITS);

  // IAM permission evaluator
  const handleEvaluatePermission = () => {
    const rolePermissions: Record<string, string[]> = {
      PLATFORM_ADMIN: ['*'],
      WORKSPACE_ADMIN: ['org:*', 'user:*', 'role:read', 'role:write', 'audit:read'],
      SECURITY_OFFICER: ['audit:*', 'session:*', 'user:read', 'mfa:*'],
      MEMBER: ['org:read', 'user:read'],
      AUDITOR: ['audit:read', 'org:read', 'user:read']
    };
    const perms = rolePermissions[iamUserRole] || [];
    const isAllowed = perms.includes('*') || perms.includes(iamPermission) || (iamPermission.startsWith('org:') && perms.includes('org:*'));
    setIamEvalResult(isAllowed);
    onTriggerToast(
      'IAM RBAC Evaluated',
      `Role [${iamUserRole}] requesting [${iamPermission}]: ${isAllowed ? 'PERMITTED' : 'DENIED'}`,
      isAllowed ? 'success' : 'warning'
    );
  };

  const handleGenerateJwtToken = () => {
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'nexora-core-key-1' }));
    const payload = btoa(JSON.stringify({
      iss: 'https://core.nexora.io',
      sub: 'usr-101',
      aud: 'https://api.nexora.io',
      tenant_id: 'tenant-global-01',
      roles: [iamUserRole],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    const signature = 'sig_' + Math.random().toString(36).substring(2, 15);
    const jwt = `${header}.${payload}.${signature}`;
    setGeneratedJwt(jwt);
    onTriggerToast('JWT Token Issued', 'Issued RS256 Tenant Scoped JWT Access Token', 'success');
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newUser: CoreUserRecord = {
      id: `usr-${Math.random().toString(36).substring(2, 7)}`,
      email: inviteEmail,
      fullName: inviteEmail.split('@')[0].replace('.', ' '),
      role: inviteRole,
      orgId: 'bu-north-america',
      deptName: 'Engineering & Product',
      status: 'INVITED',
      mfaEnabled: false,
      lastLoginAt: 'Pending Invitation'
    };

    setUsersList([newUser, ...usersList]);
    setInviteEmail('');
    onTriggerToast('User Invited', `Sent secure invitation link to ${inviteEmail}`, 'success');
  };

  const handleRevokeSession = (userId: string, email: string) => {
    onTriggerToast('Session Terminated', `Killed active Redis JWT refresh session for ${email}`, 'warning');
  };

  const filteredUsers = usersList.filter(u =>
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const filteredAuditLogs = MOCK_CORE_AUDIT_LOGS.filter(a => {
    const matchesSearch = a.actorEmail.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      a.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      a.resource.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      a.traceId.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesStatus = auditStatusFilter === 'ALL' || a.status === auditStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onTriggerToast('Copied to Clipboard', label, 'info');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner Header */}
      <div className="relative rounded-xl bg-slate-900 border border-slate-800 p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Phase 8 Core Platform
              </span>
              <span className="text-xs text-slate-400 font-mono">NEXORA CORE v{CORE_VERSION}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Enterprise Identity, Organization & Platform Foundation
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SRF + NICF + SDK Ready
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Central multi-tenant platform powering Identity & Access Management (IAM), hierarchical organization trees, fine-grained RBAC/ABAC security, compliance audit logs, and runtime ops monitoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenCodeModal(
                'NEXORA CORE v1.0 Production Architecture Blueprint',
                `# NEXORA CORE v1.0 Service Architecture Overview
# Built on SRF + NICF + NEXORA SDK v0.1.0

# 1. Identity & Access Management (IAM)
- Multi-Tenant JWT Engine with RS256 Asymmetric Key Rotation
- OAuth2 / OpenID Connect Identity Provider Endpoints
- API Key Scope Hashing Engine (SHA-256)
- MFA Challenge State Machine & WebAuthn / TOTP Support

# 2. Organization Management
- Hierarchical Multi-Tenant Org Tree (Closure Table DB Pattern)
- Units: Organization -> Business Unit -> Department -> Team -> Site

# 3. Security & Policy Engine
- RBAC Permission Matrix with Wildcard Scope Matching
- ABAC Dynamic Policy Evaluator Integration (nexora-security)

# 4. Audit Engine
- Immutable Security Audit Log Stream
- CloudEvents v1.0 Event Dispatcher (nexora-events)
- Correlation Trace IDs (RFC 7807 Problem Details)
`,
                'yaml'
              )}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              Architecture Spec
            </button>
            <button
              onClick={() => onTriggerToast('Roadmap Exported', 'Exported NEXORA CORE v1.0 Agile Roadmap to JSON/YAML', 'success')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Release Plan
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="mt-8 border-t border-slate-800/80 pt-4 flex flex-wrap items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Agile Sprints Roadmap (6 Sprints)
          </button>

          <button
            onClick={() => setActiveTab('iam')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'iam'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-400" />
            IAM & Auth Engine
          </button>

          <button
            onClick={() => setActiveTab('org')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'org'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Organization Hierarchy
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Users & Active Sessions
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            Audit & Compliance
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            Platform Ops & Health
          </button>
        </div>
      </div>

      {/* TAB 1: AGILE SPRINTS ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Sprints Overview Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {CORE_SPRINT_ROADMAP.map((sp) => {
              const isSelected = selectedSprint.id === sp.id;
              return (
                <div
                  key={sp.id}
                  onClick={() => setSelectedSprint(sp)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      Sprint {sp.sprintNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      sp.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : sp.status === 'IN_PROGRESS'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {sp.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-2 h-8 leading-snug">
                    {sp.name.split(':')[1] || sp.name}
                  </h3>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sp.durationWeeks} Weeks</span>
                    <span className="text-cyan-400 font-semibold">View Spec &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Sprint Specification Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Sprint {selectedSprint.sprintNumber} of 6
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    selectedSprint.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : selectedSprint.status === 'IN_PROGRESS'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {selectedSprint.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedSprint.name}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-4xl">{selectedSprint.goal}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCodeModal(
                    `Sprint ${selectedSprint.sprintNumber} Implementation Blueprint`,
                    JSON.stringify(selectedSprint, null, 2),
                    'json'
                  )}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Sprint Spec JSON
                </button>
              </div>
            </div>

            {/* Sub-tabs for Sprint Details */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
              {[
                { id: 'tasks', label: 'Technical Tasks & User Stories' },
                { id: 'db', label: 'Database Schema Changes' },
                { id: 'api', label: 'API Contracts & Endpoints' },
                { id: 'ui', label: 'UI Components & Tests' },
                { id: 'dod', label: 'Definition of Done' }
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setExpandedSection(subTab.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    expandedSection === subTab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Tasks & Stories */}
            {expandedSection === 'tasks' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    User Stories
                  </h4>
                  <ul className="space-y-2">
                    {selectedSprint.userStories.map((us, usIdx) => (
                      <li key={usIdx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 p-2 bg-slate-900/60 rounded border border-slate-800/60">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{us}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    Technical Implementation Tasks
                  </h4>
                  <ul className="space-y-2">
                    {selectedSprint.technicalTasks.map((tt, ttIdx) => (
                      <li key={ttIdx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 p-2 bg-slate-900/60 rounded border border-slate-800/60 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Sub-tab 2: DB Schema */}
            {expandedSection === 'db' && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    PostgreSQL DDL Migration Scripts
                  </h4>
                  <button
                    onClick={() => copyToClipboard(selectedSprint.databaseChanges.join('\n'), 'SQL Migration Scripts')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy DDL SQL
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 font-mono overflow-x-auto leading-relaxed">
                  {selectedSprint.databaseChanges.join('\n\n')}
                </pre>
              </div>
            )}

            {/* Sub-tab 3: API Contracts */}
            {expandedSection === 'api' && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  REST & gRPC Endpoint Contracts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedSprint.apiEndpoints.map((ep, epIdx) => {
                    const [method, path] = ep.split(' ');
                    return (
                      <div key={epIdx} className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between font-mono text-xs">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          method === 'GET' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          method === 'POST' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          method === 'PUT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {method}
                        </span>
                        <span className="text-slate-200">{path}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-tab 4: UI & Tests */}
            {expandedSection === 'ui' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    React UI Components
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSprint.uiComponents.map((comp, cIdx) => (
                      <span key={cIdx} className="px-2.5 py-1 rounded bg-slate-900 text-slate-200 text-xs font-mono border border-slate-800">
                        &lt;{comp} /&gt;
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Automated Test Suite Requirements
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedSprint.testRequirements.map((tr, trIdx) => (
                      <li key={trIdx} className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                        <span>{tr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Sub-tab 5: Definition of Done */}
            {expandedSection === 'dod' && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Sprint Definition of Done (DoD) Criteria
                </h4>
                <div className="space-y-2">
                  {selectedSprint.definitionOfDone.map((dodItem, dodIdx) => (
                    <div key={dodIdx} className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-emerald-300 flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{dodItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: IAM & AUTH ENGINE */}
      {activeTab === 'iam' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                Identity & Access Management (IAM) Execution Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Multi-tenant auth engine with RS256 JWT access tokens, refresh rotation, API key validation, and fine-grained RBAC evaluation using <code className="text-cyan-300">nexora-security</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: JWT Token Issuer */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold text-white">Tenant-Scoped RS256 JWT Issuer</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">POST /api/v1/auth/login</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Role Scope</label>
                    <select
                      value={iamUserRole}
                      onChange={(e) => setIamUserRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                    >
                      <option value="PLATFORM_ADMIN">PLATFORM_ADMIN</option>
                      <option value="WORKSPACE_ADMIN">WORKSPACE_ADMIN</option>
                      <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
                      <option value="MEMBER">MEMBER</option>
                      <option value="AUDITOR">AUDITOR</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateJwtToken}
                    className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Issue Asymmetric RS256 JWT
                  </button>

                  {generatedJwt && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Signed JWT Token</span>
                        <button
                          onClick={() => copyToClipboard(generatedJwt, 'JWT Token')}
                          className="hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <pre className="p-3 bg-slate-900 border border-slate-800 rounded text-[10px] text-cyan-300 font-mono break-all leading-relaxed max-h-32 overflow-y-auto">
                        {generatedJwt}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Fine-Grained RBAC Permission Matrix Evaluator */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">RBAC Permission Matrix Evaluator</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">RbacEvaluator.hasPermission()</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Role</label>
                    <input
                      type="text"
                      disabled
                      value={iamUserRole}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-cyan-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Permission</label>
                    <select
                      value={iamPermission}
                      onChange={(e) => setIamPermission(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                    >
                      <option value="org:create">org:create</option>
                      <option value="user:invite">user:invite</option>
                      <option value="audit:read">audit:read</option>
                      <option value="mfa:override">mfa:override</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleEvaluatePermission}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Evaluate Authorization
                </button>

                {iamEvalResult !== null && (
                  <div className={`p-3 rounded border text-xs font-mono flex items-center justify-between ${
                    iamEvalResult
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    <span>Permission Status: <strong>{iamEvalResult ? 'PERMITTED (200 OK)' : 'FORBIDDEN (403 DENIED)'}</strong></span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZATION HIERARCHY */}
      {activeTab === 'org' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  Multi-Tenant Organization Structure & Hierarchies
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hierarchical tree model (Closure Table DB Pattern) supporting Organizations, Business Units, Departments, Teams, and Sites.
                </p>
              </div>

              <button
                onClick={() => onTriggerToast('Org Unit Created', 'Added new operational unit to organization tree', 'success')}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Org Unit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orgUnits.map((unit) => (
                <div key={unit.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {unit.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {unit.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{unit.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{unit.location}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Leader:</span>
                      <strong className="text-slate-200">{unit.leaderName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Members:</span>
                      <strong className="text-cyan-400 font-mono">{unit.memberCount} users</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & SESSIONS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  User Directory & Active Session Management
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage active profiles, issue invitation links, monitor MFA status, and execute session kill-switches.
                </p>
              </div>

              {/* Invite Form */}
              <form onSubmit={handleInviteUser} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="new.user@nexora.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 w-48 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite User
                </button>
              </form>
            </div>

            {/* User Search Bar */}
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter users by name, email, or role..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 w-full focus:outline-none"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                    <th className="p-3">User Profile</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">MFA Status</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-950/50 transition-colors">
                      <td className="p-3 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden font-mono text-cyan-400 text-xs">
                          {usr.avatarUrl ? (
                            <img src={usr.avatarUrl} alt={usr.fullName} className="w-full h-full object-cover" />
                          ) : (
                            usr.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <div>{usr.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{usr.email}</div>
                        </div>
                      </td>

                      <td className="p-3 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-bold border border-slate-700">
                          {usr.role}
                        </span>
                      </td>

                      <td className="p-3 text-slate-400">{usr.deptName}</td>

                      <td className="p-3 font-mono">
                        {usr.mfaEnabled ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Enabled
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Disabled
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          usr.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {usr.status}
                        </span>
                      </td>

                      <td className="p-3 text-slate-400 font-mono text-[11px]">{usr.lastLoginAt}</td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRevokeSession(usr.id, usr.email)}
                          className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px] transition-colors cursor-pointer"
                        >
                          Revoke Sessions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT & COMPLIANCE */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                Immutable Security & Compliance Audit Log Stream
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time security event tracking with RFC 7807 trace ID correlation and CloudEvents v1.0 dispatch.
              </p>
            </div>

            {/* Search & Status Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-800 w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs by actor, action, or trace ID..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-200 w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'SUCCESS', 'DENIED', 'FAILED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAuditStatusFilter(st)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      auditStatusFilter === st
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Resource</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Trace ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-950/50 transition-colors">
                      <td className="p-3 text-slate-400">{log.timestamp}</td>
                      <td className="p-3 font-semibold text-cyan-300">{log.actorEmail}</td>
                      <td className="p-3 text-slate-200 font-bold">{log.action}</td>
                      <td className="p-3 text-slate-400">{log.resource}</td>
                      <td className="p-3 text-slate-400">{log.ipAddress}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">{log.traceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PLATFORM OPS & HEALTH */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Platform Operational Metrics & System Health
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time telemetry monitoring NEXORA CORE performance, session load, and latency thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_CORE_SYSTEM_METRICS.map((m, mIdx) => (
                <div key={mIdx} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.metricName}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      {m.status}
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-cyan-300 font-mono">
                    {m.currentValue} <span className="text-xs text-slate-400 font-normal">{m.unit}</span>
                  </div>

                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Target Threshold:</span>
                    <strong className="text-slate-200 font-mono">{m.targetThreshold}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
