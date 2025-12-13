import React, { useEffect, useState } from 'react';
import { getHistory, getHistoryItem } from '../services/api';

const History = ({ onSelectItem }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError('載入歷史記錄失敗');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = async (id) => {
    try {
      const item = await getHistoryItem(id);
      onSelectItem(item);
    } catch (err) {
      console.error('載入記錄詳情失敗:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredHistory = history.filter(item =>
    item.subject.includes(searchTerm) ||
    item.grade.includes(searchTerm) ||
    item.unit.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card max-w-4xl mx-auto">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">歷史記錄</h2>
        <input
          type="text"
          placeholder="搜尋科目、年級或單元..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {filteredHistory.length === 0 ? (
        <div className="card text-center text-gray-500">
          <p>目前沒有歷史記錄</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSelectItem(item.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {item.subject}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {item.grade}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.unit}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.outline && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" title="已有大綱"></span>
                  )}
                  {item.content && (
                    <span className="w-2 h-2 bg-green-500 rounded-full" title="已有教材"></span>
                  )}
                  {item.questions && (
                    <span className="w-2 h-2 bg-purple-500 rounded-full" title="已有題目"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;



