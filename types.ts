
export type Theme = 'light' | 'dark';
export type ToolMode = 'formatter' | 'comparison';

export interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  title: string;
  isValid?: boolean;
  theme: Theme;
  error?: JsonError | null;  // 新增：错误信息
}

export enum EditorMode {
  RAW = 'raw',
  FORMATTED = 'formatted'
}

// Hotkey Configuration
export interface HotkeyConfig {
  format: string;
  minify: string;
  toggleMode: string;
  toggleTheme: string;
  quickOpen: string;
}

export interface HotkeyAction {
  id: keyof HotkeyConfig;
  name: string;
  defaultKey: string;
  description: string;
}

// JSON Error Information
export interface JsonError {
  line: number;
  column: number;
  message: string;
}

// Tool States for history management
export interface ToolStates {
  formatter: {
    rawText: string;
    formattedText: string;
  };
  comparison: {
    leftJson: string;
    rightJson: string;
  };
}
