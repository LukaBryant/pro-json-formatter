
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
}

export enum EditorMode {
  RAW = 'raw',
  FORMATTED = 'formatted'
}
