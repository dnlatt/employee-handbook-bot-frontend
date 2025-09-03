export interface HandbookMessage extends Message {
  sources?: Array<{
    id: number;
    score: number;
    text: string;
    relevance: number;
  }>;
  confidence?: number;
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  sources?: Array<{
    id: number
    score: number
    text: string
    relevance: number
  }>
  confidence?: number
}