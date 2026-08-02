import React, { useState } from 'react';
import { NexoraProductId, ToastMessage } from './types/designSystem';
import { I18nProvider } from './i18n/I18nContext';
import { GlobalHeader } from './components/designSystem/GlobalHeader';
import { GlobalSidebar } from './components/designSystem/GlobalSidebar';
import { DesignSystemOverview } from './components/designSystem/DesignSystemOverview';
import { TokenShowcase } from './components/designSystem/TokenShowcase';
import { ComponentShowcase } from './components/designSystem/ComponentShowcase';
import { ProductWorkspace } from './components/designSystem/ProductWorkspace';
import { EdmExplorer } from './components/edm/EdmExplorer';
import { NeapExplorer } from './components/neap/NeapExplorer';
import { EifExplorer } from './components/eif/EifExplorer';
import { NpepExplorer } from './components/npep/NpepExplorer';
import { SrfExplorer } from './components/srf/SrfExplorer';
import { NicfExplorer } from './components/nicf/NicfExplorer';
import { SdkExplorer } from './components/sdk/SdkExplorer';
import { CoreExplorer } from './components/core/CoreExplorer';
import { SsgExplorer } from './components/ssg/SsgExplorer';
import { CommandPalette } from './components/designSystem/CommandPalette';
import { ToastSystem } from './components/designSystem/ToastSystem';
import { CodeSnippetModal } from './components/designSystem/CodeSnippetModal';

export default function App() {
  const [currentProductId, setCurrentProductId] = useState<NexoraProductId>('forge');
  const [activeSection, setActiveSection] = useState<'overview' | 'tokens' | 'components' | 'products' | 'edm' | 'neap' | 'eif' | 'npep' | 'srf' | 'nicf' | 'sdk' | 'core' | 'ssg'>('ssg');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Code snippet modal state
  const [codeModal, setCodeModal] = useState<{ isOpen: boolean; title: string; code: string }>({
    isOpen: false,
    title: '',
    code: ''
  });

  const handleTriggerToast = (
    title: string,
    desc: string,
    type: 'info' | 'success' | 'warning' | 'error' | 'ai'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, description: desc, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenCodeModal = (title: string, code: string) => {
    setCodeModal({ isOpen: true, title, code });
  };

  return (
    <I18nProvider>
      <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans flex flex-col antialiased selection:bg-sky-500 selection:text-slate-950">
        {/* 1. Global Header with Product Switcher & Command Palette Trigger */}
        <GlobalHeader
          currentProductId={currentProductId}
          onSelectProduct={(prodId) => setCurrentProductId(prodId)}
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onTriggerToast={handleTriggerToast}
        />

        {/* 2. Main Content Layout with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Global Sidebar */}
          <GlobalSidebar
            currentProductId={currentProductId}
            onSelectProduct={(prodId) => setCurrentProductId(prodId)}
            activeSection={activeSection}
            onSelectSection={(sec) => setActiveSection(sec)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onTriggerToast={handleTriggerToast}
          />

          {/* Main Canvas Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
            {activeSection === 'overview' && (
              <DesignSystemOverview
                onSelectSection={setActiveSection}
                onSelectProduct={setCurrentProductId}
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'core' && (
              <CoreExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'ssg' && (
              <SsgExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'sdk' && (
              <SdkExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'nicf' && (
              <NicfExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'srf' && (
              <SrfExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'edm' && (
              <EdmExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'eif' && (
              <EifExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'npep' && (
              <NpepExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'neap' && (
              <NeapExplorer
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'tokens' && (
              <TokenShowcase
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'components' && (
              <ComponentShowcase
                onOpenCodeModal={handleOpenCodeModal}
                onTriggerToast={handleTriggerToast}
              />
            )}

            {activeSection === 'products' && (
              <ProductWorkspace
                productId={currentProductId}
                onTriggerToast={handleTriggerToast}
              />
            )}
          </main>
        </div>

        {/* 3. Global Footer Status Bar */}
        <footer className="bg-[#1e293b] border-t border-[#334155] text-slate-300 py-2 px-4 text-[10px] font-bold flex flex-wrap items-center justify-between uppercase tracking-tight font-mono z-30">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="text-sky-400">NEXORA DESIGN SYSTEM v2.4</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400">WCAG AAA 7:1 PASSED</span>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span>10 PRODUCTS UNIFIED</span>
            <span className="text-purple-400">AI COPILOT ONLINE</span>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hover:text-white cursor-pointer underline"
            >
              PRESS ⌘K FOR COMMANDS
            </button>
          </div>
        </footer>

        {/* 4. Overlays & Modals */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onSelectProduct={(prodId) => setCurrentProductId(prodId)}
          onSelectSection={(sec) => setActiveSection(sec)}
          onTriggerToast={handleTriggerToast}
        />

        <ToastSystem toasts={toasts} onDismiss={handleDismissToast} />

        <CodeSnippetModal
          isOpen={codeModal.isOpen}
          onClose={() => setCodeModal({ ...codeModal, isOpen: false })}
          title={codeModal.title}
          code={codeModal.code}
        />
      </div>
    </I18nProvider>
  );
}

