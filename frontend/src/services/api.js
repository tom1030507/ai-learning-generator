import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateOutline = async (subject, grade, unit) => {
  try {
    const response = await api.post('/api/generate-outline', {
      subject,
      grade,
      unit,
    });
    return response.data;
  } catch (error) {
    console.error('生成大綱失敗:', error);
    throw error;
  }
};

export const generateContent = async (generationId, outline) => {
  try {
    const response = await api.post('/api/generate-content', {
      generation_id: generationId,
      outline,
    });
    return response.data;
  } catch (error) {
    console.error('生成教材失敗:', error);
    throw error;
  }
};

export const generateQuestions = async (generationId, content) => {
  try {
    const response = await api.post('/api/generate-questions', {
      generation_id: generationId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('生成題目失敗:', error);
    throw error;
  }
};

export const getGenerationProgress = async (generationId) => {
  try {
    const response = await api.get(`/api/generation-progress/${generationId}`);
    return response.data;
  } catch (error) {
    console.error('取得生成進度失敗:', error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error) {
    console.error('取得歷史記錄失敗:', error);
    throw error;
  }
};

export const getHistoryItem = async (id) => {
  try {
    const response = await api.get(`/api/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('取得記錄詳情失敗:', error);
    throw error;
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    const response = await api.delete(`/api/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('刪除歷史記錄失敗:', error);
    throw error;
  }
};

export default api;



