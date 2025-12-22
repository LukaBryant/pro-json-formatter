
import React from 'react';
import { Braces, GitCompare, ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';
import { ToolMode, Theme } from '../types';

interface SidebarProps {
  activeTool: ToolMode;
  setActiveTool: (tool: ToolMode) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenHotkeys: () => void;
  theme: Theme;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTool, 
  setActiveTool, 
  isCollapsed, 
  setIsCollapsed, 
  onOpenHotkeys,
  theme 
}) => {
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'formatter' as ToolMode, icon: Braces, label: 'JSON Formatter' },
    { id: 'comparison' as ToolMode, icon: GitCompare, label: 'JSON Comparison' },
  ];

  return (
    <div className={`relative flex flex-col h-full transition-all duration-300 border-r ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      
      {/* App Logo Area (Draggable region buffer) */}
      <div className="h-14 flex items-center px-4 mb-4" style={{ WebkitAppRegion: 'drag' } as any}>
        {!isCollapsed && <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>ProJSON</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTool(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTool === item.id
                ? (isDark ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/40' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100')
                : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-white hover:text-slate-900')
            }`}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button
          onClick={onOpenHotkeys}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-white'
          }`}
          title={isCollapsed ? 'Keyboard Shortcuts' : ''}
        >
          <Keyboard size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Shortcuts</span>}
        </button>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-white'
          }`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="text-sm">Collapse Sidebar</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
