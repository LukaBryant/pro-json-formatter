
import React from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EditorProps } from '../types';

const EditorPanel: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  language = 'json', 
  readOnly = false, 
  title,
  isValid = true,
  theme,
  error = null
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-full rounded-xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm tracking-tight uppercase ${
            isDark ? 'text-slate-400' : 'text-slate-700'
          }`}>{title}</span>
          <div className="flex items-center">
            {isValid ? (
              <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${
                isDark 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-emerald-600 bg-emerald-50 border-emerald-100'
              }`}>
                <CheckCircle2 size={12} className="mr-1" /> Valid
              </span>
            ) : (
              <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${
                isDark 
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                  : 'text-rose-600 bg-rose-50 border-rose-100'
              }`}>
                <AlertCircle size={12} className="mr-1" /> Invalid JSON
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
            }`}
            title="Clear"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleCopy}
            className={`p-1.5 flex items-center gap-1.5 rounded-lg transition-all duration-200 ${
              copied 
                ? (isDark ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50') 
                : (isDark ? 'text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50')
            }`}
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 relative min-h-0">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme={isDark ? 'vs-dark' : 'vs-light'}
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'always',
            lineNumbers: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          }}
        />
      </div>

      {/* ✨ Error Display Bar */}
      {error && !isValid && (
        <div className={`flex items-start gap-2 px-4 py-2.5 border-t text-sm animate-in slide-in-from-bottom-2 ${
          isDark 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Line {error.line}, Column {error.column}:</span>
            <span className="ml-2">{error.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPanel;
