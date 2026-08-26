export type DocFileType = 'pdf' | 'txt' | 'md' | 'ipynb' | 'docx' | 'xlsx' | 'png' | 'jpg' | 'jpeg';
export type DocStatus = 'SIAP' | 'TERPROSES' | 'PROSES';

export interface DocChunk {
  id: string;
  docId: string;
  docName: string;
  chunkIndex: number;
  content: string;
  tokenCount?: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocFileType;
  size: number; // bytes
  chunkCount: number;
  status: DocStatus;
  uploadedAt: string;
  folderPath?: string;
  fullText: string;
  chunks: DocChunk[];
}

export interface Citation {
  docId: string;
  docName: string;
  chunkIndex: number;
  excerpt: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  thinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
}

export interface AISettings {
  serverUrl: string;
  modelName: string;
  apiKey: string;
  googleDriveConnected: boolean;
  driveFolder?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  icon: string;
}
