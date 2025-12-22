
import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Split, FileText, ArrowRightLeft } from 'lucide-react';
import { Theme } from '../types';

interface ComparisonToolProps {
  theme: Theme;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ theme }) => {
  const [original, setOriginal] = useState('{\n  "status": "old",\n  "version": 1.0\n}');
  const [modified, setModified] = useState('{\n  "status": "new",\n  "version": 1.1,\n  "author": "Electron User"\n}');
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className={`flex items-center justify-between px-4 py-3 mb-4 rounded-xl border ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-slate-400" />
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Original</span>
          </div>
          <ArrowRightLeft size={16} className="text-indigo-500" />
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-indigo-500" />
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Modified</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Differences are highlighted automatically</span>
        </div>
      </div>

      <div className={`flex-1 rounded-xl border overflow-hidden ${
        isDark ? 'border-slate-800' : 'border-slate-200 shadow-md'
      }`}>
        <DiffEditor
          height="100%"
          language="json"
          original={original}
          modified={modified}
          theme={isDark ? 'vs-dark' : 'vs-light'}
          options={{
            renderSideBySide: true,
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            originalEditable: true,
          }}
          onMount={(editor) => {
            // Sync content changes back if needed
            editor.getOriginalEditor().onDidChangeModelContent(() => {
              setOriginal(editor.getOriginalEditor().getValue());
            });
            editor.getModifiedEditor().onDidChangeModelContent(() => {
              setModified(editor.getModifiedEditor().getValue());
            });
          }}
        />
      </div>
    </div>
  );
};

export default ComparisonTool;
