import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Copy, Check, Trash2, Info, Zap, Globe } from 'lucide-react';
import { CliResult } from '../types';
import { runForgeCommand, FORGE_I18N_DICTIONARIES } from '../data/forgeRepoData';
import { useI18n, SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n/I18nContext';

interface TerminalViewProps {
  onExecuteCommand?: (args: string[]) => Promise<CliResult>;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ onExecuteCommand }) => {
  const { language, setLanguage, t } = useI18n();
  const [history, setHistory] = useState<CliResult[]>([
    {
      command: 'nexora --version',
      exitCode: 0,
      output: `NEXORA Forge v0.1.0 (Sprint 1 Genesis)\nPython 3.12+ Enterprise Developer CLI`,
      rawOutput: `NEXORA Forge v0.1.0 (Sprint 1 Genesis)\nPython 3.12+ Enterprise Developer CLI`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputCommand, setInputCommand] = useState('nexora doctor');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: 'nexora --help', args: ['--help'] },
    { label: 'nexora --version', args: ['--version'] },
    { label: 'nexora doctor', args: ['doctor'] },
    { label: 'nexora doctor --json', args: ['doctor', '--json'] },
    { label: 'nexora workspace info', args: ['workspace', 'info'] },
    { label: 'nexora workspace validate', args: ['workspace', 'validate'] },
    { label: 'nexora workspace validate --strict', args: ['workspace', 'validate', '--strict'] },
  ];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleRun = async (cmdString: string) => {
    if (!cmdString.trim() || isLoading) return;
    setIsLoading(true);

    let rawArgs = cmdString.trim();
    if (rawArgs.startsWith('nexora ')) {
      rawArgs = rawArgs.replace(/^nexora\s+/, '');
    }
    const argsArray = rawArgs.split(/\s+/).filter(Boolean);

    try {
      if (onExecuteCommand) {
        const res = await onExecuteCommand(argsArray);
        setHistory(prev => [...prev, res]);
      } else {
        // Fallback to local Python CLI engine simulation
        const res = runForgeCommand(cmdString, language);
        setHistory(prev => [...prev, res]);
      }
    } catch (err: any) {
      setHistory(prev => [
        ...prev,
        {
          command: cmdString,
          exitCode: 1,
          output: `Error executing command: ${err.message}`,
          rawOutput: `Error executing command: ${err.message}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    const dict = FORGE_I18N_DICTIONARIES[langCode] || FORGE_I18N_DICTIONARIES['en'];
    setHistory(prev => [
      ...prev,
      {
        command: `# i18n locale switch -> ${langCode.toUpperCase()}`,
        exitCode: 0,
        output: `[i18n] ${dict.lang_switched}`,
        rawOutput: dict.lang_switched,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar & Preset Buttons */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{t('forge.presets')}:</span>
          </div>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900 px-2 py-1 rounded border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-mono font-bold text-sky-300 outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                  {l.flag} {l.nativeName} ({l.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputCommand(preset.label);
                handleRun(preset.label);
              }}
              disabled={isLoading}
              className="px-2.5 py-1 text-xs font-mono bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700/80 rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setHistory([])}
            className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded transition-colors ml-auto flex items-center cursor-pointer"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
            {t('common.cancel')}
          </button>
        </div>
      </div>

      {/* Terminal Display Window */}
      <div className="cli-output flex flex-col font-mono text-sm overflow-hidden">
        {/* Terminal Titlebar */}
        <div className="bg-[#1e293b] px-4 py-2.5 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="text-xs text-slate-300 ml-2 rtl:ml-0 rtl:mr-2 font-sans font-semibold flex items-center">
              <TerminalIcon className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 text-sky-400" />
              nexora-forge terminal session — zsh
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans uppercase font-bold tracking-wider">
            NEXORA ENGINE CORE v0.1.0
          </span>
        </div>

        {/* Console Log Area */}
        <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto bg-[#020617]">
          {history.length === 0 ? (
            <div className="text-slate-500 text-xs py-10 text-center font-sans">
              <Info className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              Terminal ready. Select a preset command above or type your command below.
            </div>
          ) : (
            history.map((item, index) => (
              <div key={index} className="space-y-2 border-b border-slate-900/80 pb-3 last:border-b-0">
                {/* Command Line Prompt */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-emerald-400 font-bold">$</span>
                    <span className="text-sky-400 font-semibold">{item.command}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.exitCode === 0
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-red-950/80 text-red-400 border border-red-800'
                      }`}
                    >
                      EXIT {item.exitCode}
                    </span>
                    <button
                      onClick={() => handleCopy(item.output, index)}
                      className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                      title="Copy Output"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Formatted Console Output */}
                <pre className="text-slate-200 bg-[#0f172a] p-4 rounded-md border border-[#1e293b] overflow-x-auto whitespace-pre-wrap leading-relaxed text-xs font-mono">
                  {item.output}
                </pre>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sky-400 text-xs py-2 font-mono">
              <span className="animate-pulse">▶ Executing NEXORA engine command...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRun(inputCommand);
          }}
          className="bg-[#1e293b] border-t border-[#334155] p-3 flex items-center gap-2"
        >
          <span className="text-sky-400 font-bold text-xs pl-2 font-mono">$</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="Type command (e.g. nexora doctor --verbose or nexora workspace validate)"
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded px-3 py-1.5 text-slate-100 placeholder-slate-500 text-xs font-mono outline-none focus:border-sky-400 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputCommand.trim()}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded transition-colors flex items-center disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Play className="w-3 h-3 mr-1.5 rtl:mr-0 rtl:ml-1.5 fill-slate-950" />
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
};

