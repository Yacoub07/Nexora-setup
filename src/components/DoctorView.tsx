import React from 'react';
import { Stethoscope, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Cpu, GitBranch, FolderCheck, Terminal } from 'lucide-react';
import { DoctorReport } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface DoctorViewProps {
  report?: DoctorReport | null;
  onRunDoctor?: () => void;
  isLoading?: boolean;
}

export const DoctorView: React.FC<DoctorViewProps> = ({
  report = null,
  onRunDoctor,
  isLoading = false
}) => {
  const { t } = useI18n();

  if (isLoading && !report) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-cyan-400" />
        <p className="text-sm">{t('forge.doctor_running')}</p>
      </div>
    );
  }

  const defaultReport: DoctorReport = report || {
    overall_status: 'HEALTHY',
    target_path: './nexora-forge',
    summary: { total: 6, pass: 6, warn: 0, fail: 0 },
    checks: [
      { category: 'Environment', name: 'Python Version', status: 'PASS', message: 'Python 3.12.2 detected', recommendation: null },
      { category: 'Environment', name: 'Operating System', status: 'PASS', message: 'Linux 6.6.137+ (x86_64)', recommendation: null },
      { category: 'Tooling', name: 'Git Integration', status: 'PASS', message: 'git version 2.43.0', recommendation: null },
      { category: 'Workspace', name: 'Workspace Detection', status: 'PASS', message: 'Detected NEXORA workspace manifest (nexora.yaml)', recommendation: null },
      { category: 'Workspace', name: 'Project Structure', status: 'PASS', message: 'Structure valid (Score: 100.0%)', recommendation: null },
      { category: 'Environment', name: 'CLI Version', status: 'PASS', message: 'NEXORA Forge v0.1.0', recommendation: null }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Top Diagnostics Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Stethoscope className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">{t('forge.doctor_title')}</h1>
          </div>
          <p className="text-slate-400 text-xs">
            Reviewing current environment and NEXORA workspace health at <span className="text-sky-300 font-mono">{defaultReport.target_path}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRunDoctor}
            disabled={isLoading}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-md font-bold text-xs shadow-md transition-colors flex items-center cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('forge.run_doctor')}
          </button>
        </div>
      </div>

      {/* Health Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t('common.status')} CHECKS</div>
          <div className="text-2xl font-bold text-white font-mono">{defaultReport.summary.total}</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
          <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">{t('forge.checks_passed')}</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{defaultReport.summary.pass}</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
          <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">{t('forge.warnings')}</div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{defaultReport.summary.warn}</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t('forge.compliance_score')}</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {Math.round((defaultReport.summary.pass / (defaultReport.summary.total || 1)) * 100)}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-400 font-mono">
            {defaultReport.summary.pass}/{defaultReport.summary.total}
          </div>
        </div>
      </div>

      {/* Terminal Output Check Window */}
      <div className="cli-output p-6 font-mono text-sm leading-relaxed flex flex-col gap-4">
        <div className="text-slate-500 text-xs border-b border-slate-800 pb-3 flex justify-between items-center">
          <span>$ nexora doctor --verbose</span>
          <span className="text-emerald-400 font-bold text-[11px] uppercase">[{t('common.system_status')}]</span>
        </div>

        <div className="text-xs">
          <span className="text-sky-400 font-bold">[INFO]</span> {t('forge.doctor_healthy')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
          {defaultReport.checks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-slate-300 font-medium">{check.name}</span>
              <span className="font-bold flex items-center">
                {check.status === 'PASS' && <span className="text-emerald-400">PASSED [OK]</span>}
                {check.status === 'WARN' && <span className="text-amber-400">WARNING</span>}
                {check.status === 'FAIL' && <span className="text-red-400">FAILED</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

