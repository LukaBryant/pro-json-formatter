import React, { useState } from 'react';
import { X, Command, Keyboard, RotateCcw, Edit2, Check } from 'lucide-react';
import { Theme, HotkeyConfig } from '../types';

interface HotkeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  hotkeys: HotkeyConfig;
  onUpdate: (newHotkeys: HotkeyConfig) => void;
  onReset: () => void;
  defaultHotkeys: HotkeyConfig;
}

const HotkeyModal: React.FC<HotkeyModalProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  hotkeys,
  onUpdate,
  onReset,
  defaultHotkeys
}) => {
  const [editingKey, setEditingKey] = useState<keyof HotkeyConfig | null>(null);
  const [recordedKeys, setRecordedKeys] = useState<string>('');
  const [localHotkeys, setLocalHotkeys] = useState<HotkeyConfig>(hotkeys);

  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const shortcuts: Array<{ id: keyof HotkeyConfig; name: string; desc: string }> = [
    { id: 'format', name: 'Format JSON', desc: '格式化 JSON' },
    { id: 'minify', name: 'Minify JSON', desc: '压缩 JSON' },
    { id: 'toggleMode', name: 'Toggle Mode', desc: '切换格式化/比较模式' },
    { id: 'toggleTheme', name: 'Toggle Theme', desc: '切换深色/浅色主题' },
    { id: 'quickOpen', name: 'Quick Show App', desc: '全局快捷键唤起应用 (仅 Electron)' },
  ];


  const handleStartRecording = (id: keyof HotkeyConfig) => {
    setEditingKey(id);
    setRecordedKeys('Press any key combination...');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!editingKey) return;
    
    e.preventDefault();
    e.stopPropagation();

    const parts: string[] = [];
    if (e.metaKey || e.ctrlKey) parts.push('cmd');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    
    const key = e.key.toLowerCase();
    if (key !== 'meta' && key !== 'control' && key !== 'shift' && key !== 'alt') {
      parts.push(key);
      const newHotkey = parts.join('+');
      setRecordedKeys(newHotkey);
      
      // Update local state
      const updated = { ...localHotkeys, [editingKey]: newHotkey };
      setLocalHotkeys(updated);
      setEditingKey(null);
    } else {
      setRecordedKeys(parts.join('+') + '+...');
    }
  };

  const handleSave = () => {
    onUpdate(localHotkeys);
    onClose();
  };

  const handleResetToDefault = () => {
    onReset();
    setLocalHotkeys(defaultHotkeys);
    onClose();
  };

  const formatHotkeyDisplay = (hotkeyStr: string): string[] => {
    return hotkeyStr.split('+').map(part => {
      if (part === 'cmd' || part === 'ctrl') return '⌘';
      if (part === 'shift') return '⇧';
      if (part === 'alt') return '⌥';
      return part.toUpperCase();
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-indigo-500">
              <Keyboard size={24} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Keyboard Shortcuts
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {shortcuts.map((s) => (
              <div 
                key={s.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  editingKey === s.id
                    ? isDark
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-indigo-500 bg-indigo-50'
                    : isDark 
                    ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {s.name}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {s.desc}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {editingKey === s.id ? (
                    <div className={`px-3 py-1.5 rounded border text-xs font-mono ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-indigo-400' 
                        : 'bg-white border-indigo-300 text-indigo-600'
                    }`}>
                      {recordedKeys}
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1">
                        {formatHotkeyDisplay(localHotkeys[s.id]).map((k, idx) => (
                          <kbd 
                            key={idx} 
                            className={`px-2 py-1 rounded border shadow-sm text-xs font-bold ${
                              isDark 
                                ? 'bg-slate-700 border-slate-600 text-slate-100' 
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                      <button
                        onClick={() => handleStartRecording(s.id)}
                        className={`p-1.5 rounded transition-colors ${
                          isDark 
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                            : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
                        }`}
                        title="Edit shortcut"
                      >
                        <Edit2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {editingKey && (
            <div className={`mt-4 p-3 rounded-lg text-xs ${
              isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              ⚡ Press any key combination to set new shortcut. Press Esc to cancel.
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleResetToDefault}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <RotateCcw size={16} />
              Reset to Default
            </button>
            
            <button 
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              <Check size={16} />
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotkeyModal;
