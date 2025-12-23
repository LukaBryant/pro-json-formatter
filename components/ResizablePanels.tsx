import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  theme: 'light' | 'dark';
}

const ResizablePanels: React.FC<ResizablePanelsProps> = ({ leftPanel, rightPanel, theme }) => {
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem('json-formatter-split-position');
    return saved ? parseFloat(saved) : 50;
  });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    let newLeftWidth = (mouseX / containerWidth) * 100;
    
    // Constrain between 20% and 80%
    newLeftWidth = Math.max(20, Math.min(80, newLeftWidth));
    
    setLeftWidth(newLeftWidth);
    localStorage.setItem('json-formatter-split-position', newLeftWidth.toString());
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const isDark = theme === 'dark';

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left Panel */}
      <div style={{ width: `${leftWidth}%` }} className="h-full pr-2">
        {leftPanel}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`flex items-center justify-center cursor-col-resize group relative ${
          isDragging ? 'z-50' : 'z-10'
        }`}
        style={{ width: '12px', flexShrink: 0 }}
      >
        <div
          className={`w-1 h-full rounded-full transition-all ${
            isDragging || isDark
              ? 'bg-indigo-500'
              : isDark
              ? 'bg-slate-700 group-hover:bg-indigo-500'
              : 'bg-slate-300 group-hover:bg-indigo-500'
          } ${isDragging ? 'w-1.5' : 'group-hover:w-1.5'}`}
        />
        <div
          className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 ${
            isDragging ? 'bg-indigo-500/20' : ''
          }`}
          style={{ width: '20px' }}
        />
      </div>

      {/* Right Panel */}
      <div style={{ width: `${100 - leftWidth}%` }} className="h-full pl-2">
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanels;
