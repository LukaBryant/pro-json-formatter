import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Braces, ArrowRightLeft, Sparkles, Wand2, Minimize, Sun, Moon, Terminal } from 'lucide-react';
import EditorPanel from './components/EditorPanel';
import Sidebar from './components/Sidebar';
import ComparisonTool from './components/ComparisonTool';
import HotkeyModal from './components/HotkeyModal';
import ResizablePanels from './components/ResizablePanels';
import { Theme, ToolMode, HotkeyConfig, JsonError, ToolStates } from './types';

// Parse JSON error to extract line number and message
function parseJsonError(text: string, error: Error): JsonError | null {
  try {
    const errorMsg = error.message;
    // Extract position from error message like "Unexpected token } in JSON at position 45"
    const positionMatch = errorMsg.match(/position (\d+)/);
    
    if (positionMatch) {
      const position = parseInt(positionMatch[1]);
      const lines = text.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      // Extract meaningful error message
      let message = errorMsg.replace(/in JSON at position \d+/, '').trim();
      message = message.replace(/^Unexpected token /, 'Unexpected token ');
      message = message.replace(/^JSON\.parse: /, '');
      
      return { line, column, message };
    }
    
    // Fallback for errors without position
    return { line: 1, column: 1, message: errorMsg };
  } catch (e) {
    return null;
  }
}

// Default hotkey configuration
const DEFAULT_HOTKEYS: HotkeyConfig = {
  format: 'cmd+f',
  minify: 'cmd+m',
  toggleMode: 'cmd+d',
  toggleTheme: 'cmd+t',
  quickOpen: 'cmd+shift+j',
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolMode>('formatter');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isHotkeyModalOpen, setIsHotkeyModalOpen] = useState<boolean>(false);
  
  // Ref for ComparisonTool to access flushChanges method
  const comparisonToolRef = useRef<any>(null);
  
  const [rawText, setRawText] = useState<string>('');
  const [formattedText, setFormattedText] = useState<string>('');
  const [isRawValid, setIsRawValid] = useState<boolean>(true);
  const [isFormattedValid, setIsFormattedValid] = useState<boolean>(true);
  
  // ✨ 新增：错误信息状态
  const [rawError, setRawError] = useState<JsonError | null>(null);
  const [formattedError, setFormattedError] = useState<JsonError | null>(null);
  
  // ✨ 新增：Comparison 模式状态
  const [leftJson, setLeftJson] = useState<string>('{\n  "status": "old",\n  "version": 1.0\n}');
  const [rightJson, setRightJson] = useState<string>('{\n  "status": "new",\n  "version": 1.1,\n  "author": "Electron User"\n}');
  
  // ✨ 新增：工具切换历史状态（仅内存）
  const [toolStates, setToolStates] = useState<ToolStates>({
    formatter: { rawText: '', formattedText: '' },
    comparison: { 
      leftJson: '{\n  "status": "old",\n  "version": 1.0\n}', 
      rightJson: '{\n  "status": "new",\n  "version": 1.1,\n  "author": "Electron User"\n}'
    }
  });
  
  // ✨ 新增：工具切换处理函数
  const handleToolSwitch = useCallback((newTool: ToolMode) => {
    if (newTool === activeTool) return;
    
    // 如果当前是comparison模式，在保存状态前强制同步编辑器内容
    if (activeTool === 'comparison') {
      comparisonToolRef.current?.flushChanges();
    }
    
    // 先保存当前模式的数据到临时变量
    const currentState = {
      formatter: { rawText, formattedText },
      comparison: { leftJson, rightJson }
    };
    
    // 保存当前模式的数据
    setToolStates(prev => ({
      ...prev,
      ...(activeTool === 'formatter' 
        ? { formatter: currentState.formatter }
        : { comparison: currentState.comparison }
      )
    }));
    
    // 切换到新模式
    setActiveTool(newTool);
    
    // 恢复新模式的历史数据
    if (newTool === 'formatter') {
      setRawText(currentState.formatter.rawText);
      setFormattedText(currentState.formatter.formattedText);
    } else if (newTool === 'comparison') {
      setLeftJson(currentState.comparison.leftJson);
      setRightJson(currentState.comparison.rightJson);
    }
  }, [activeTool, rawText, formattedText, leftJson, rightJson, toolStates, comparisonToolRef]);
  
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('json-formatter-theme');
    return (saved as Theme) || 'light';
  });

  // Load hotkey configuration from localStorage
  const [hotkeys, setHotkeys] = useState<HotkeyConfig>(() => {
    const saved = localStorage.getItem('json-formatter-hotkeys');
    return saved ? JSON.parse(saved) : DEFAULT_HOTKEYS;
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

  // Parse hotkey string to key combination
  const parseHotkey = (hotkeyStr: string): { key: string; cmd: boolean; shift: boolean; alt: boolean } => {
    const parts = hotkeyStr.toLowerCase().split('+');
    return {
      key: parts[parts.length - 1],
      cmd: parts.includes('cmd') || parts.includes('ctrl'),
      shift: parts.includes('shift'),
      alt: parts.includes('alt'),
    };
  };

  // Check if pressed keys match a hotkey
  const matchesHotkey = (e: KeyboardEvent, hotkeyStr: string): boolean => {
    const hotkey = parseHotkey(hotkeyStr);
    const isCmd = e.metaKey || e.ctrlKey;
    return (
      e.key.toLowerCase() === hotkey.key &&
      isCmd === hotkey.cmd &&
      e.shiftKey === hotkey.shift &&
      e.altKey === hotkey.alt
    );
  };

  // Global Shortcuts with dynamic configuration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Format
      if (matchesHotkey(e, hotkeys.format)) {
        e.preventDefault();
        formatRaw();
      }
      // Minify
      else if (matchesHotkey(e, hotkeys.minify)) {
        e.preventDefault();
        minifyRaw();
      }
      // Toggle Mode
      else if (matchesHotkey(e, hotkeys.toggleMode)) {
        e.preventDefault();
        handleToolSwitch(activeTool === 'formatter' ? 'comparison' : 'formatter');
      }
      // Toggle Theme
      else if (matchesHotkey(e, hotkeys.toggleTheme)) {
        e.preventDefault();
        toggleTheme();
      }
      // Note: quickOpen 全局快捷键在 Electron 主进程中处理 (main.js)
      // 快捷键设置只能通过侧边栏按钮打开
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formatRaw, minifyRaw, toggleTheme, hotkeys]);

  // Persist theme and hotkeys
  useEffect(() => {
    localStorage.setItem('json-formatter-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('json-formatter-hotkeys', JSON.stringify(hotkeys));
  }, [hotkeys]);

  // 应用启动时从主进程获取当前快捷键配置
  useEffect(() => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI && electronAPI.getCurrentHotkey) {
      const fetchCurrentHotkey = async () => {
        // 尝试多次获取，确保主进程已准备好
        let attempts = 0;
        const maxAttempts = 10;
        
        const attempt = async () => {
          try {
            console.log(`尝试从主进程获取当前快捷键配置 (尝试 ${attempts + 1}/${maxAttempts})`);
            const result = await electronAPI.getCurrentHotkey();
            if (result.success) {
              console.log('从主进程获取到的快捷键:', result.hotkey);
              
              // 使用主进程的快捷键更新本地状态
              setHotkeys(prevHotkeys => {
                const updatedHotkeys = {
                  ...prevHotkeys,
                  quickOpen: result.hotkey
                };
                
                // 同时更新localStorage
                localStorage.setItem('json-formatter-hotkeys', JSON.stringify(updatedHotkeys));
                
                console.log('已使用主进程的快捷键配置更新本地状态');
                return updatedHotkeys;
              });
            } else {
              console.error('获取当前快捷键失败:', result.error);
              if (attempts < maxAttempts - 1) {
                attempts++;
                setTimeout(attempt, 200); // 200ms后重试
              }
            }
          } catch (error) {
            console.error('调用获取当前快捷键API失败:', error);
            if (attempts < maxAttempts - 1) {
              attempts++;
              setTimeout(attempt, 200); // 200ms后重试
            }
          }
        };
        
        attempt();
      };
      
      // 立即尝试获取
      fetchCurrentHotkey();
    }
  }, []); // 仅在启动时执行一次

  useEffect(() => {
    const initialData = {
      app: "Pro JSON Formatter",
      mode: "Native Desktop Client",
      platform: "macOS",
      features: ["Native Window Control", "Folding", "Validation", "Sidebar Navigation", "JSON Comparison", "Global Shortcuts"],
      shortcuts: "Try Cmd+F to format, Cmd+D to compare, Cmd+K to open settings"
    };
    const initialJson = JSON.stringify(initialData, null, 2);
    
    // 设置格式化模式的初始数据
    setRawText(initialJson);
    setFormattedText(initialJson);
    
    // 初始化 toolStates
    setToolStates({
      formatter: { rawText: initialJson, formattedText: initialJson },
      comparison: { 
        leftJson: '{\n  "status": "old",\n  "version": 1.0\n}', 
        rightJson: '{\n  "status": "new",\n  "version": 1.1,\n  "author": "Electron User"\n}'
      }
    });
  }, []);

  const validateJson = (text: string): boolean => {
    if (!text.trim()) return true;
    try { JSON.parse(text); return true; } catch (e) { return false; }
  };

  // ✨ 优化：当左侧无效时清空右侧 + 显示详细错误信息
  const handleRawChange = (value: string | undefined) => {
    const content = value || '';
    setRawText(content);
    
    if (!content.trim()) {
      // 空内容
      setIsRawValid(true);
      setRawError(null);
      setFormattedText('');
      setIsFormattedValid(true);
      return;
    }
    
    try {
      const parsed = JSON.parse(content);
      // 有效 JSON
      setIsRawValid(true);
      setRawError(null);
      setFormattedText(JSON.stringify(parsed, null, 2));
      setIsFormattedValid(true);
    } catch (e) {
      // 无效 JSON：解析错误信息
      setIsRawValid(false);
      setRawError(parseJsonError(content, e as Error));
      setFormattedText('');
      setIsFormattedValid(true);
    }
  };

  const handleFormattedChange = (value: string | undefined) => {
    const content = value || '';
    setFormattedText(content);
    
    if (!content.trim()) {
      setIsFormattedValid(true);
      setFormattedError(null);
      return;
    }
    
    try {
      const parsed = JSON.parse(content);
      setIsFormattedValid(true);
      setFormattedError(null);
      setRawText(JSON.stringify(parsed, null, 2));
      setIsRawValid(true);
      setRawError(null);
    } catch (e) {
      setIsFormattedValid(false);
      setFormattedError(parseJsonError(content, e as Error));
    }
  };

  const handleHotkeyUpdate = async (newHotkeys: HotkeyConfig) => {
    console.log('开始更新快捷键配置:', newHotkeys);
    
    // 通知 Electron 主进程更新全局快捷键
    const electronAPI = (window as any).electronAPI;
    let updateSuccess = false;
    
    if (electronAPI && electronAPI.updateGlobalHotkey) {
      try {
        console.log('正在向主进程发送快捷键更新请求:', newHotkeys.quickOpen);
        const result = await electronAPI.updateGlobalHotkey(newHotkeys.quickOpen);
        if (result.success) {
          console.log('已通知主进程更新全局快捷键:', newHotkeys.quickOpen);
          updateSuccess = true;
        } else {
          console.error('更新全局快捷键失败:', result.error);
        }
      } catch (error) {
        console.error('调用更新全局快捷键API失败:', error);
      }
    }
    
    // 只有在主进程更新成功后，才更新本地状态和localStorage
    if (updateSuccess) {
      setHotkeys(newHotkeys);
      localStorage.setItem('json-formatter-hotkeys', JSON.stringify(newHotkeys));
    }
  };

  const handleHotkeyReset = async () => {
    console.log('开始重置快捷键到默认值');
    setHotkeys(DEFAULT_HOTKEYS);
    
    // 通知 Electron 主进程重置全局快捷键
    const electronAPI = (window as any).electronAPI;
    if (electronAPI && electronAPI.updateGlobalHotkey) {
      try {
        const result = await electronAPI.updateGlobalHotkey(DEFAULT_HOTKEYS.quickOpen);
        if (result.success) {
          console.log('已通知主进程重置全局快捷键:', DEFAULT_HOTKEYS.quickOpen);
        } else {
          console.error('重置全局快捷键失败:', result.error);
        }
      } catch (error) {
        console.error('调用重置全局快捷键API失败:', error);
      }
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
        setActiveTool={handleToolSwitch}
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
            // ✨ 优化点 3: 可调整的分割布局
            <div className="flex-1 min-h-0 animate-in slide-in-from-bottom-2 duration-300">
              <ResizablePanels
                theme={theme}
                leftPanel={
                  <EditorPanel 
                    title="Input Source" 
                    value={rawText} 
                    onChange={handleRawChange} 
                    isValid={isRawValid} 
                    theme={theme}
                    error={rawError}
                  />
                }
                rightPanel={
                  <EditorPanel 
                    title="Output Result" 
                    value={formattedText} 
                    onChange={handleFormattedChange} 
                    isValid={isFormattedValid} 
                    theme={theme}
                    error={formattedError}
                  />
                }
              />
            </div>
          ) : (
            <ComparisonTool 
              theme={theme}
              leftJson={leftJson}
              rightJson={rightJson}
              onLeftChange={setLeftJson}
              onRightChange={setRightJson}
              ref={comparisonToolRef}
            />
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
        hotkeys={hotkeys}
        onUpdate={handleHotkeyUpdate}
        onReset={handleHotkeyReset}
        defaultHotkeys={DEFAULT_HOTKEYS}
      />
    </div>
  );
};

export default App;
