export interface AppState {
  currentView: 'selection' | 'chat';
  selectedLevel: 'G3' | 'G2' | '';
  messages: Message[];
  inputMessage: string;
  isRecording: boolean;
}

export interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export type CertificationLevel = 'G3' | 'G2';

export interface WelcomeMessage {
  G3: string;
  G2: string;
}

export interface CertificationInfo {
  level: CertificationLevel;
  title: string;
  description: string;
  details: string;
  color: 'blue' | 'red';
}