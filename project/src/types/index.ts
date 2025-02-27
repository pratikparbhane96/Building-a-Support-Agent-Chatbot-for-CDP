export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface CDP {
  id: string;
  name: string;
  docUrl: string;
  logo: string;
  color: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedCDP: CDP | null;
}