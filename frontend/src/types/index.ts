export type PredictionType = 'spam' | 'ham';
export type MessageStatus = 'unreviewed' | 'archived' | 'whitelisted';
export type WhitelistType = 'sender' | 'keyword' | 'phrase' | 'domain';

export interface Message {
  id: string;
  text: string;
  prediction: PredictionType;
  confidence: number;
  status: MessageStatus;
  source: string;
  sender?: string;
  spam_probability?: number;
  ham_probability?: number;
  highlighted_keywords?: string[];
  created_at: string;
  updated_at: string;
}

export interface MessageListResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  messages: Message[];
}

export interface WhitelistItem {
  id: string;
  value: string;
  type: WhitelistType;
  note?: string;
  created_at: string;
}

export interface FeedbackItem {
  id: string;
  message_id: string;
  actual_label: PredictionType;
  predicted_label: PredictionType;
  feedback: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_messages: number;
  spam_count: number;
  ham_count: number;
  archived_count: number;
  whitelisted_count: number;
  unreviewed_count: number;
  spam_rate_percent: number;
  whitelist_rules_count: number;
}

export interface TimelineDataPoint {
  date: string;
  spam: number;
  ham: number;
  total: number;
}

export interface KeywordFrequency {
  keyword: string;
  frequency: number;
}

export interface ConfusionMatrix {
  true_negative_ham: number;
  false_positive_spam: number;
  false_negative_ham: number;
  true_positive_spam: number;
}

export interface ModelMetrics {
  dataset_name: string;
  dataset_size: number;
  train_size: number;
  test_size: number;
  ham_count: number;
  spam_count: number;
  model_architecture: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: ConfusionMatrix;
  vocabulary_size?: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  timeline: TimelineDataPoint[];
  top_keywords: KeywordFrequency[];
  recent_messages: Message[];
  model_metrics: ModelMetrics;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  database: {
    connected: boolean;
    database_name: string;
    total_messages: number;
    whitelist_rules: number;
  };
  model: {
    loaded: boolean;
    architecture: string;
    accuracy: number | null;
  };
}

