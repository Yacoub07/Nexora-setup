import React, { useState } from 'react';
import { FolderGit2, CheckCircle2, AlertTriangle, XCircle, FileCode, Play, ShieldAlert, FileCheck } from 'lucide-react';
import { WorkspaceValidationReport } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface WorkspaceViewProps {
  onValidateWorkspace?: (args: string[]) => Promise<any>;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ onValidateWorkspace }) => {
  const { t } = useI18n();
  const [selectedScenario, setSelectedScenario] = useState<string>('valid');
  const [strictMode, setStrictMode] = useState<boolean>(false);
  const [validationReport, setValidationReport] = useState<WorkspaceValidationReport>({
    valid: true,
    score: 100,
    errors: [],
    warnings: [],
    checks_passed: [
      'Manifest detected at nexora.yaml',
      'Manifest contains valid project name',
      'Manifest contains valid version',
      "Directory 'src/' exists",
      "Directory 'tests/' exists",
      "Directory 'docs/' exists"
    ],
    manifest_path: '/workspace/nexora-forge/nexora.yaml'
  });

  const [manifestYaml, setManifestYaml] = useState<string>(
`name: nexora-forge
version: 0.1.0
description: Official development CLI for the NEXORA ecosystem
environment: development
components:
  - cli
  - core
  - services
  - commands
  - utils`
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scenarios = [
    { id: 'valid', name: 'Valid NEXORA Core Workspace', score: 100, isGood: true },
    { id: 'microservice', name: 'NEXORA Microservice Project', score: 90, isGood: true },
    { id: 'warnings', name: 'Missing Version (Warnings)', score: 75, isGood: false },
    { id: 'invalid', name: 'Uninitialized / Missing Folders', score: 20, isGood: false }
  ];

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    if (scenarioId === 'valid') {
      setManifestYaml(
`name: nexora-forge
version: 0.1.0
description: Official development CLI for the NEXORA ecosystem
environment: development
components:
  - cli
  - core
  - services
  - commands
  - utils`
      );
      setValidationReport({
        valid: true,
        score: 100,
        errors: [],
        warnings: [],
        checks_passed: [
          'Manifest detected at nexora.yaml',
          'Manifest contains valid project name',
          'Manifest contains valid version',
          "Directory 'src/' exists",
          "Directory 'tests/' exists",
          "Directory 'docs/' exists"
        ],
        manifest_path: '/workspace/nexora-forge/nexora.yaml'
      });
    } else if (scenarioId === 'microservice') {
      setManifestYaml(
`name: nexora-auth-service
version: 1.2.0
description: Authentication and identity service for NEXORA
environment: production
components:
  - oauth
  - jwt
  - vault`
      );
      setValidationReport({
        valid: true,
        score: 100,
        errors: [],
        warnings: [],
        checks_passed: [
          'Manifest detected at nexora.yaml',
          'Manifest contains valid project name',
          'Manifest contains valid version',
          "Directory 'src/' exists",
          "Directory 'tests/' exists",
          "Directory 'docs/' exists"
        ],
        manifest_path: '/workspace/nexora-auth-service/nexora.yaml'
      });
    } else if (scenarioId === 'warnings') {
      setManifestYaml(
`name: nexora-experimental
description: Experimental sandbox component`
      );
      setValidationReport({
        valid: !strictMode,
        score: 75,
        errors: strictMode ? ["Missing standard directory 'docs/'"] : [],
        warnings: [
          "Manifest missing explicit 'version' field (defaulting to 0.1.0)",
          "Missing standard directory 'docs/'"
        ],
        checks_passed: [
          'Manifest detected at nexora.yaml',
          'Manifest contains valid project name',
          "Directory 'src/' exists",
          "Directory 'tests/' exists"
        ],
        manifest_path: '/workspace/nexora-experimental/nexora.yaml'
      });
    } else {
      setManifestYaml(`# Invalid empty workspace manifest`);
      setValidationReport({
        valid: false,
        score: 0,
        errors: [
          "Manifest missing required field: 'name'",
          "Missing standard directory 'src/'",
          "Missing standard directory 'tests/'",
          "Missing standard directory 'docs/'"
        ],
        warnings: ["Manifest missing explicit 'version' field"],
        checks_passed: ['Manifest detected at nexora.yaml'],
        manifest_path: '/workspace/empty-dir/nexora.yaml'
      });
    }
  };

  const handleValidateNow = async () => {
    setIsLoading(true);
    try {
      if (onValidateWorkspace) {
        const args = ['workspace', 'validate'];
        if (strictMode) args.push('--strict');
        await onValidateWorkspace(args);
      }
      if (selectedScenario === 'warnings' && strictMode) {
        setValidationReport(prev => ({
          ...prev,
          valid: false,
          errors: ["Missing standard directory 'docs/' (strict mode active)"]
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Controls & Scenario Selectors */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center font-mono">
              <FolderGit2 className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-sky-400" />
              {t('workspace.title')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Validates workspace manifests (`nexora.yaml`), component maps, and directory structure integrity (`src/`, `tests/`, `docs/`).
            </p>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-medium text-slate-300 cursor-pointer bg-slate-900 px-3 py-1.5 rounded border border-slate-700">
              <input
                type="checkbox"
                checked={strictMode}
                onChange={(e) => {
                  setStrictMode(e.target.checked);
                }}
                className="accent-sky-500 rounded"
              />
              <span className="font-mono text-xs">Strict Mode (--strict)</span>
            </label>

            <button
              onClick={handleValidateNow}
              disabled={isLoading}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded transition-colors flex items-center shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 fill-slate-950" />
              {t('workspace.validate_btn')}
            </button>
          </div>
        </div>

        {/* Preset Selector Chips */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedScenario === sc.id
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              {sc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Manifest Editor & Validation Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workspace Manifest YAML Editor */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-[#020617] border-b border-[#334155] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center font-mono uppercase">
              <FileCode className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-sky-400" />
              nexora.yaml (Workspace Manifest)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">YAML CONFIG</span>
          </div>

          <div className="p-4 bg-[#020617] flex-1 font-mono text-xs text-slate-200">
            <textarea
              value={manifestYaml}
              onChange={(e) => setManifestYaml(e.target.value)}
              rows={12}
              className="w-full h-full bg-[#0f172a] border border-[#1e293b] rounded p-3 text-sky-300 outline-none focus:border-sky-400 font-mono text-xs leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Validation Score & Report Details */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg shadow-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Validation Status</span>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                  {validationReport.valid ? (
                    <span className="inline-flex items-center text-emerald-400 font-bold text-lg font-mono">
                      <CheckCircle2 className="w-5 h-5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                      VALID WORKSPACE
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-400 font-bold text-lg font-mono">
                      <XCircle className="w-5 h-5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                      INVALID WORKSPACE
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right rtl:text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">{t('workspace.score')}</span>
                <div className="text-2xl font-bold font-mono text-sky-400">
                  {validationReport.score}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
