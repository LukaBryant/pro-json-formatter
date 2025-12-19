
import React, { useState, useEffect } from 'react';
import { Braces, ArrowRightLeft, Sparkles, Wand2, Minimize, Sun, Moon, Terminal } from 'lucide-react';
import EditorPanel from './components/EditorPanel';
import { Theme } from './types';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string>('');
  const [formattedText, setFormattedText] = useState<string>('');
  const [isRawValid, setIsRawValid] = useState<boolean>(true);
  const [isFormattedValid, setIsFormattedValid] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('json-formatter-theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('json-formatter-theme', theme);
  }, [theme]);

  useEffect(() => {
    const initialData = {
      app: "Pro JSON Formatter",
      mode: "Native Desktop Client",
      platform: "macOS",
      features: ["Native Window Control", "Folding", "Validation"]
    };
    const initialString = JSON.stringify(initialData, null, 2);
    setRawText(initialString);
    setFormattedText(initialString);
  }, []);

  const validateJson = (text: string): boolean => {
    if (!text.trim()) return true;
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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

  const formatRaw = () => {
    if (isRawValid && rawText.trim()) {
      const parsed = JSON.parse(rawText);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedText(formatted);
      setRawText(formatted);
    }
  };

  const minifyRaw = () => {
    if (isRawValid && rawText.trim()) {
      const parsed = JSON.parse(rawText);
      const minified = JSON.stringify(parsed);
      setRawText(minified);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-screen max-h-screen transition-colors duration-300 overflow-hidden ${
      isDark ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Navigation - With Drag Region for macOS */}
      <header 
        className={`flex-none h-14 border-b px-6 flex items-center justify-between z-10 shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
        style={{ WebkitAppRegion: 'drag' } as any} // 允许在标题栏拖拽窗口
      >
        <div className="flex items-center gap-3 pl-16"> {/* pl-16 避开左侧红绿灯按钮 */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-colors ${
            isDark ? 'bg-indigo-500 shadow-indigo-900/20' : 'bg-indigo-600 shadow-indigo-200'
          }`}>
            <Braces className="text-white" size={18} />
          </div>
          <div>
            <h1 className={`text-sm font-bold tracking-tight transition-colors ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>ProJSON</h1>
          </div>
        </div>

        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

          <button 
            onClick={minifyRaw}
            disabled={!isRawValid || !rawText.trim()}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Minimize size={14} /> Minify
          </button>
          
          <button 
            onClick={formatRaw}
            disabled={!isRawValid || !rawText.trim()}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-900/20' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            <Wand2 size={14} /> Format
          </button>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-1 p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <EditorPanel title="Raw JSON" value={rawText} onChange={handleRawChange} isValid={isRawValid} theme={theme} />
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <EditorPanel title="Formatted Editor" value={formattedText} onChange={handleFormattedChange} isValid={isFormattedValid} theme={theme} />
        </div>
      </main>

      {/* Status Bar */}
      <footer className={`flex-none h-6 px-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 ${
        isDark ? 'bg-slate-900 text-slate-500' : 'bg-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isRawValid && isFormattedValid ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
            Desktop Mode
          </span>
          <span>Size: {(new Blob([rawText]).size / 1024).toFixed(2)} KB</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Terminal size={10} /> Local JSON Processing</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
