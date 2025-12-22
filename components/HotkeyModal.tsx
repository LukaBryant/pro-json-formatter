
import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { Theme } from '../types';

interface HotkeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const HotkeyModal: React.FC<HotkeyModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const shortcuts = [
    { keys: ['⌘', 'F'], desc: 'Format JSON' },
    { keys: ['⌘', 'M'], desc: 'Minify JSON' },
    { keys: ['⌘', 'D'], desc: 'Toggle Comparison Mode' },
    { keys: ['⌘', 'T'], desc: 'Toggle Dark/Light Mode' },
    { keys: ['⌘', 'C'], desc: 'Copy Content' },
    { keys: ['⌘', 'L'], desc: 'Clear Current Editor' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-indigo-500">
              <Keyboard size={24} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Keyboard Shortcuts</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {shortcuts.map((s, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${
                isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
              }`}>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{s.desc}</span>
                <div className="flex gap-1.5">
                  {s.keys.map(k => (
                    <kbd key={k} className={`px-2 py-1 rounded border shadow-sm text-xs font-bold ${
                      isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-700'
                    }`}>{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className={`mt-6 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Custom keybinding feature coming in next update
          </p>

          <button 
            onClick={onClose}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotkeyModal;
