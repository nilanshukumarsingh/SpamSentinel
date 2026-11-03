import axios from 'axios';
import {
  Message,
  MessageListResponse,
  WhitelistItem,
  FeedbackItem,
  AnalyticsData,
  ModelMetrics,
  HealthStatus,
  MessageStatus,
  PredictionType
} from '../types';

// Axios instance pointing to backend (proxied via Vite during dev)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Health & System
  getHealth: async (): Promise<HealthStatus> => {
    const res = await apiClient.get<HealthStatus>('/api/health');
    return res.data;
  },

  // Detection
  detectMessage: async (text: string, sender?: string, source: string = 'manual'): Promise<Message> => {
    const res = await apiClient.post<Message>('/api/detect', { text, sender, source });
    return res.data;
  },

  seedSamples: async (): Promise<{ message: string; ids?: string[] }> => {
    const res = await apiClient.post('/api/detect/seed-samples');
    return res.data;
  },

  // Messages CRUD
  getMessages: async (params: {
    page?: number;
    limit?: number;
    prediction?: string;
    status?: string;
    search?: string;
    sort_order?: number;
  }): Promise<MessageListResponse> => {
    const res = await apiClient.get<MessageListResponse>('/api/messages', { params });
    return res.data;
  },

  getMessageById: async (id: string): Promise<Message> => {
    const res = await apiClient.get<Message>(`/api/messages/${id}`);
    return res.data;
  },

  updateMessageStatus: async (id: string, status: MessageStatus): Promise<Message> => {
    const res = await apiClient.patch<Message>(`/api/messages/${id}/status`, { status });
    return res.data;
  },

  deleteMessage: async (id: string): Promise<{ message: string; id: string }> => {
    const res = await apiClient.delete(`/api/messages/${id}`);
    return res.data;
  },

  // Archive
  getArchivedMessages: async (page = 1, limit = 10, search?: string): Promise<MessageListResponse> => {
    const res = await apiClient.get<MessageListResponse>('/api/archive', { params: { page, limit, search } });
    return res.data;
  },

  archiveMessage: async (id: string): Promise<Message> => {
    const res = await apiClient.post<Message>(`/api/archive/${id}`);
    return res.data;
  },

  restoreArchivedMessage: async (id: string): Promise<Message> => {
    const res = await apiClient.post<Message>(`/api/archive/restore/${id}`);
    return res.data;
  },

  purgeAllArchived: async (target: 'archived' | 'all_spam' = 'archived'): Promise<{ message: string; deleted_count: number }> => {
    const res = await apiClient.delete(`/api/archive/purge/all`, { params: { target } });
    return res.data;
  },

  // Whitelist
  getWhitelist: async (): Promise<WhitelistItem[]> => {
    const res = await apiClient.get<WhitelistItem[]>('/api/whitelist');
    return res.data;
  },

  addWhitelist: async (data: { value: string; type: string; note?: string }): Promise<WhitelistItem> => {
    const res = await apiClient.post<WhitelistItem>('/api/whitelist', data);
    return res.data;
  },

  deleteWhitelist: async (id: string): Promise<{ message: string; id: string }> => {
    const res = await apiClient.delete(`/api/whitelist/${id}`);
    return res.data;
  },

  // Analytics & ML Metrics
  getAnalytics: async (): Promise<AnalyticsData> => {
    const res = await apiClient.get<AnalyticsData>('/api/analytics');
    return res.data;
  },

  getModelMetrics: async (): Promise<ModelMetrics> => {
    const res = await apiClient.get<ModelMetrics>('/api/analytics/model-metrics');
    return res.data;
  },

  // Feedback
  submitFeedback: async (data: {
    message_id: string;
    actual_label: PredictionType;
    predicted_label: PredictionType;
    feedback?: string;
  }): Promise<FeedbackItem> => {
    const res = await apiClient.post<FeedbackItem>('/api/feedback', data);
    return res.data;
  },
};

