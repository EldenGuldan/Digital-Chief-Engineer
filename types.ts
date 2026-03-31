
export type MessageType = 'user' | 'ai';

export interface Source {
  id: string;
  title: string;
  snippet: string;      // 引用原文片段
  location?: string;    // 具体位置，如“第3.2.1条”或“第15页”
  link?: string;        // 快捷链接
}

export interface Message {
  id: number;
  type: MessageType;
  content: string;
  sources?: Source[] | null;
}

export interface Report {
  title: string;
  type: string;
  date: string;
  tags: string[];
  icon: any;
  color: string;
}

export interface Project {
  name: string;
  industry: string;
  location: string;
  investment: string;
  stage: string;
  color: string;
  x: string;
  y: string;
  archivedFiles: number;
  participants: string; // 项目建设参与方
  startTime: string;    // 项目开展时间
}

export interface Standard {
  code: string;
  name: string;
  type: string;
  status: string;
  category: string;
  isMandatory?: boolean;
}

export interface Folder {
  name: string;
  count: number;
  desc: string;
  icon: any;
  color: string;
  type: string;
}

export type AppTab = 'home' | 'ai-chat' | 'industry' | 'project' | 'standard' | 'collection' | 'admin';
