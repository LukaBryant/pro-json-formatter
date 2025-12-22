import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Split, FileText, ArrowRightLeft } from 'lucide-react';
import { Theme } from '../types';

interface ComparisonToolProps {
  theme: Theme;
  leftJson: string;
  rightJson: string;
  onLeftChange: (value: string) => void;
  onRightChange: (value: string) => void;
}

const ComparisonTool = forwardRef<any, ComparisonToolProps>(({ 
  theme, 
  leftJson, 
  rightJson, 
  onLeftChange, 
  onRightChange 
}, ref) => {
  const isDark = theme === 'dark';
  const editorRef = useRef<any>(null);
  
  // 暴露强制同步方法给父组件
  useImperativeHandle(ref, () => ({
    flushChanges: () => {
      if (editorRef.current) {
        const editor = editorRef.current;
        const currentLeftValue = editor.getOriginalEditor().getValue();
        const currentRightValue = editor.getModifiedEditor().getValue();
        
        // 只有当值真正改变时才触发回调
        if (currentLeftValue !== leftJson) {
          onLeftChange(currentLeftValue);
        }
        if (currentRightValue !== rightJson) {
          onRightChange(currentRightValue);
        }
      }
    }
  }));
  
  // ✅ 使用 useEffect 监听编辑器变化，实时更新
  useEffect(() => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    
    // 监听左侧编辑器（Original）
    const leftDisposable = editor.getOriginalEditor().onDidChangeModelContent(() => {
      const newValue = editor.getOriginalEditor().getValue();
      if (newValue !== leftJson) {
        onLeftChange(newValue);
      }
    });
    
    // 监听右侧编辑器（Modified）
    const rightDisposable = editor.getModifiedEditor().onDidChangeModelContent(() => {
      const newValue = editor.getModifiedEditor().getValue();
      if (newValue !== rightJson) {
        onRightChange(newValue);
      }
    });
    
    // 清理函数
    return () => {
      leftDisposable?.dispose();
      rightDisposable?.dispose();
    };
  }, [leftJson, rightJson, onLeftChange, onRightChange]);

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
          original={leftJson}
          modified={rightJson}
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
            // ✅ 修复光标跳转：保存编辑器引用，使用 useEffect 监听变化
            editorRef.current = editor;
          }}
        />
      </div>
    </div>
  );
});

export default ComparisonTool;
