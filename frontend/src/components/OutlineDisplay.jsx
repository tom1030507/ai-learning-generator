import React from 'react';

const OutlineDisplay = ({ outline, onConfirm, onEdit, isLoading }) => {
  const [editedOutline, setEditedOutline] = React.useState(outline);
  const [isEditing, setIsEditing] = React.useState(false);
  const [parsedOutline, setParsedOutline] = React.useState(null);

  // 嘗試解析 JSON 格式的大綱
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(outline);
      setParsedOutline(parsed);
      setEditedOutline(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // 如果不是 JSON，就保持原樣
      setParsedOutline(null);
      setEditedOutline(outline);
    }
  }, [outline]);

  const handleConfirm = () => {
    onConfirm(editedOutline);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedOutline);
    // 重新解析更新後的大綱
    try {
      const parsed = JSON.parse(editedOutline);
      setParsedOutline(parsed);
    } catch (e) {
      setParsedOutline(null);
    }
  };

  const renderStructuredOutline = (data) => {
    return (
      <div className="space-y-6">
        {/* 單元標題 */}
        <div>
          <h4 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h4>
        </div>

        {/* 學習目標 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            學習目標
          </h5>
          <ul className="space-y-2">
            {data.objectives.map((obj, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 章節列表 */}
        <div>
          <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            教學章節
            <span className="ml-2 text-sm text-gray-500">（共 {data.chapters.length} 章，將逐章生成內容）</span>
          </h5>
          <div className="space-y-4">
            {data.chapters.map((chapter, index) => (
              <div key={index} className="border-l-4 border-primary-500 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-lg px-3 py-1 text-sm font-semibold mr-3 flex-shrink-0">
                    第 {chapter.chapter_number} 章
                  </span>
                  <div className="flex-1">
                    <h6 className="text-lg font-semibold text-gray-800 mb-2">{chapter.title}</h6>
                    {chapter.description && (
                      <p className="text-gray-600 text-sm mb-3">{chapter.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {chapter.topics.map((topic, topicIndex) => (
                        <span 
                          key={topicIndex}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">
            1
          </span>
          教學大綱
        </h3>
        {!isEditing && !isLoading && (
          <button onClick={handleEdit} className="text-primary-600 hover:text-primary-700 text-sm">
            編輯
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        {isEditing ? (
          <textarea
            value={editedOutline}
            onChange={(e) => setEditedOutline(e.target.value)}
            className="input-field min-h-[300px] font-mono text-sm"
          />
        ) : parsedOutline ? (
          renderStructuredOutline(parsedOutline)
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
            {editedOutline}
          </pre>
        )}
      </div>

      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-primary flex-1">
              儲存編輯
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary">
              取消
            </button>
          </>
        ) : (
          <button 
            onClick={handleConfirm} 
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? '生成教材中...' : parsedOutline ? `確認大綱，逐章生成教材（共 ${parsedOutline.chapters.length} 章）` : '確認大綱，生成教材'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OutlineDisplay;



