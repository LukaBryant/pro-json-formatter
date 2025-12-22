import React, { useState, useEffect, useCallback } from 'react';
import { Braces, ArrowRightLeft, Sparkles, Wand2, Minimize, Sun, Moon, Terminal } from 'lucide-react';
import EditorPanel from './components/EditorPanel';
import Sidebar from './components/Sidebar';
import ComparisonTool from './components/ComparisonTool';
import HotkeyModal from './components/HotkeyModal';
import { Theme, ToolMode } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolMode>('formatter');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isHotkeyModalOpen, setIsHotkeyModalOpen] = useState<boolean>(false);
  
  const [rawText, setRawText] = useState<string>('');
  const [formattedText, setFormattedText] = useState<string>('');
  const [isRawValid, setIsRawValid] = useState<boolean>(true);
  const [isFormattedValid, setIsFormattedValid] = useState<boolean>(true);
  
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('json-formatter-theme');
    return (saved as Theme) || 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const formatRaw = useCallback(() => {
    try {
      if (rawText.trim()) {
        const parsed = JSON.parse(rawText);
        const formatted = JSON.stringify(parsed, null, 2);
        setFormattedText(formatted);
        setRawText(formatted);
      }
    } catch (e) {}
  }, [rawText]);

  const minifyRaw = useCallback(() => {
    try {
      if (rawText.trim()) {
        const parsed = JSON.parse(rawText);
        setRawText(JSON.stringify(parsed));
      }
    } catch (e) {}
  }, [rawText]);

  // Global Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd) {
        if (e.key === 'f') { e.preventDefault(); formatRaw(); }
        if (e.key === 'm') { e.preventDefault(); minifyRaw(); }
        if (e.key === 'd') { e.preventDefault(); setActiveTool(prev => prev === 'formatter' ? 'comparison' : 'formatter'); }
        if (e.key === 't') { e.preventDefault(); toggleTheme(); }
        if (e.key === ',') { e.preventDefault(); setIsHotkeyModalOpen(true); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formatRaw, minifyRaw, toggleTheme]);

  useEffect(() => {
    localStorage.setItem('json-formatter-theme', theme);
  }, [theme]);

  useEffect(() => {
    const initialData = {
      app: "Pro JSON Formatter",
      mode: "Native Desktop Client",
      platform: "macOS",
      features: ["Native Window Control", "Folding", "Validation", "Sidebar Navigation", "JSON Comparison", "Global Shortcuts"],
      shortcuts: "Try Cmd+F to format, Cmd+D to compare"
    };
    setRawText(JSON.stringify(initialData, null, 2));
    setFormattedText(JSON.stringify(initialData, null, 2));
  }, []);

  const validateJson = (text: string): boolean => {
    if (!text.trim()) return true;
    try { JSON.parse(text); return true; } catch (e) { return false; }
  };

  const handleRawChange = (value: string | undefined) => {
    const content = value || '';
    setRawText(content);
    const isValid = validateJson(content);
    setIsRawValid(isValid);
    if (isValid && content.trim()) {
      try {
        const parsed = JSON.parse(content);
        setFormattedText(JSON.stringify(parsed, null, 2));
        setIsFormattedValid(true);
      } catch (e) {}
    }
  };

  const handleFormattedChange = (value: string | undefined) => {
    const content = value || '';
    setFormattedText(content);
    const isValid = validateJson(content);
    setIsFormattedValid(isValid);
    if (isValid && content.trim()) {
      try {
        const parsed = JSON.parse(content);
        setRawText(JSON.stringify(parsed, null, 2));
        setIsRawValid(true);
      } catch (e) {}
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen max-h-screen transition-colors duration-300 overflow-hidden ${
      isDark ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenHotkeys={() => setIsHotkeyModalOpen(true)}
        theme={theme}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Transparent Header for macOS drag support */}
        <header 
          className="flex-none h-14 px-6 flex items-center justify-between z-10"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <div className="flex items-center gap-3 pl-16"> {/* pl-16 避开左侧红绿灯按钮 */}
             <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
               {activeTool === 'formatter' ? 'Format & Edit' : 'Compare JSON Objects'}
             </span>
          </div>

          <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700 shadow-xl shadow-black/20' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {activeTool === 'formatter' && (
              <div className="flex items-center gap-2 ml-2">
                <button 
                  onClick={minifyRaw}
                  disabled={!isRawValid || !rawText.trim()}
                  className={`hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Minimize size={14} /> Minify
                </button>
                <button 
                  onClick={formatRaw}
                  disabled={!isRawValid || !rawText.trim()}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                    isDark 
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-900/40' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                  }`}
                >
                  <Wand2 size={14} /> Format
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Tool Content */}
        <main className="flex-1 p-3 md:p-4 flex flex-col min-h-0">
          {activeTool === 'formatter' ? (
            <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 min-h-0 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex-1 flex flex-col min-h-0">
                <EditorPanel title="Input Source" value={rawText} onChange={handleRawChange} isValid={isRawValid} theme={theme} />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <EditorPanel title="Output Result" value={formattedText} onChange={handleFormattedChange} isValid={isFormattedValid} theme={theme} />
              </div>
            </div>
          ) : (
            <ComparisonTool theme={theme} />
          )}
        </main>

        {/* Global Status Bar */}
        <footer className={`flex-none h-6 px-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 border-t ${
          isDark ? 'bg-slate-900/50 text-slate-500 border-slate-800' : 'bg-white text-slate-400 border-slate-200'
        }`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isRawValid && isFormattedValid ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
              {activeTool.toUpperCase()} MODE
            </span>
            <span>|</span>
            <span>Desktop Client</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1"><Terminal size={10} /> {rawText.length} chars</span>
          </div>
        </footer>
      </div>

      {/* Hotkey Configuration Modal */}
      <HotkeyModal 
        isOpen={isHotkeyModalOpen} 
        onClose={() => setIsHotkeyModalOpen(false)} 
        theme={theme} 
      />
    </div>
  );
};

export default App;
