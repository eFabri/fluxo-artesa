export interface QuizOption {
  id: string;
  label: string;
  value?: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuizOption[];
  preRenders: Record<string, string> | string;
  icon?: 'chat' | 'needle';
}

export interface VaoResult {
  mensal: number;
  anual: number;
}

export interface PortasResult {
  busca: boolean;
  vitrine: boolean;
  retorno: boolean;
}

export interface CaptureData {
  nome: string;
  instagram: string;
  cidade: string;
}
