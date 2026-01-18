import axios from 'axios';
import { ApiResponse, AnalysisResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAuthUrl = async (): Promise<string> => {
  const response = await api.get<{ authUrl: string }>('/auth/google');
  return response.data.authUrl;
};

export const analyzeCalendar = async (
  accessToken: string,
  days: number = 30
): Promise<ApiResponse<AnalysisResult>> => {
  const response = await api.get<ApiResponse<AnalysisResult>>('/api/analyze', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: { days },
  });
  return response.data;
};
