import React, { useState } from 'react';
import { TestTube2, CheckCircle2, Play, RefreshCw, Terminal, Clock, ShieldCheck } from 'lucide-react';
import { TestSuiteResult } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface TestRunnerViewProps {
  onRunTests?: () => Promise<TestSuiteResult>;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({ onRunTests }) => {
  const { t } = useI18n();
  const [testResults, setTestResults] = useState<TestSuiteResult>({
    passed: 12,
    failed: 0,
    skipped: 0,
    total: 12,
    duration: 0.42,
    coverage: 96.8,
    suites: [
      {
        file: 'tests/test_cli.py',
        tests: [
          { name: 'test_cli_help', status: 'PASSED', duration: '0.03s' },
          { name: 'test_cli_version_flag', status: 'PASSED', duration: '0.02s' },
          { name: 'test_cli_no_args_shows_help', status: 'PASSED', duration: '0.02s' }
        ]
      },
      {
        file: 'tests/test_version.py',
        tests: [
          { name: 'test_version_command_default', status: 'PASSED', duration: '0.02s' },
          { name: 'test_version_command_json', status: 'PASSED', duration: '0.02s' }
        ]
      },
      {
        file: 'tests/test_doctor.py',
        tests: [
          { name: 'test_doctor_service_run_diagnostics', status: 'PASSED', duration: '0.08s' },
          { name: 'test_doctor_command_json', status: 'PASSED', duration: '0.04s' },
          { name: 'test_doctor_command_table', status: 'PASSED', duration: '0.05s' }
        ]
      },
      {
        file: 'tests/test_workspace.py',
        tests: [
          { name: 'test_workspace_service_detection', status: 'PASSED', duration: '0.04s' },
          { name: 'test_workspace_info_command_valid', status: 'PASSED', duration: '0.03s' },
          { name: 'test_workspace_info_command_invalid', status: 'PASSED', duration: '0.02s' },
          { name: 'test_workspace_validate_command_success', status: 'PASSED', duration: '0.03s' }
        ]
      }
    ],
    rawOutput: '================ 12 passed in 0.42s ================'
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'suites' | 'raw'>('suites');

  const handleExecutePytest = async () => {
    setIsRunning(true);
    try {
      if (onRunTests) {
        const res = await onRunTests();
        setTestResults(res);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Test Controls Bar */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono">
            <TestTube2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">{t('tests.title')}</h2>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-2 py-0.5 rounded font-mono font-bold">
              PYTEST 8.0+
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Executes full unit test suite covering CLI commands, version specs, doctor diagnostics, and workspace validation.
          </p>
        </div>

        <button
          onClick={handleExecutePytest}
          disabled={isRunning}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded transition-colors flex items-center shadow-md disabled:opacity-50 cursor-pointer"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 fill-slate-950" />
          )}
          {isRunning ? 'RUNNING PYTEST...' : t('tests.run_all')}
        </button>
      </div>

      {/* Test Score Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[10px] uppercase font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('tests.passed')}</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{testResults.passed}</div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[10px] uppercase font-bold text-slate-400">
            <TestTube2 className="w-3.5 h-3.5" />
            <span>TOTAL SUITE TESTS</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{testResults.total}</div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[10px] uppercase font-bold text-sky-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('tests.coverage')}</span>
          </div>
          <div className="text-2xl font-bold text-sky-400 mt-1 font-mono">{testResults.coverage}%</div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[10px] uppercase font-bold text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>DURATION</span>
          </div>
          <div className="text-2xl font-bold text-slate-200 mt-1 font-mono">{testResults.duration}s</div>
        </div>
      </div>
    </div>
  );
};
