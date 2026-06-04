export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'Ready' | 'Processing';
  attendees: string[];
  actionItems: { text: string; completed: boolean; }[];
  category: 'Internal' | 'Client' | 'Investor';
  priority: 'Low' | 'Medium' | 'High';
  summary: string;
  transcript: { timestamp: string; text: string; }[];
  notes?: string;
  tags: string[];
}

export interface Insight {
  id: string;
  type: 'Action Item' | 'Decision';
  content: string;
  timestamp: string;
  tags: string[];
}
