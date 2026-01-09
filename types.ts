
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  imageUrl?: string;
  type: 'text' | 'image' | 'thought';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
