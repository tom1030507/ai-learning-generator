import React from 'react';

const OutlineDisplay = ({ outline, onConfirm, onEdit, isLoading }) => {
  const [editedOutline, setEditedOutline] = React.useState(outline);
  const [isEditing, setIsEditing] = React.useState(false);
  const [parsedOutline, setParsedOutline] = React.useState(null);
  const [editData, setEditData] = React.useState(null);

  // 嘗試解析 JSON 格式的大綱
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(outline);
      setParsedOutline(parsed);
      setEditedOutline(JSON.stringify(parsed, null, 2));
      setEditData(JSON.parse(JSON.stringify(parsed))); // 深拷贝
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
    // 将编辑的数据转回JSON字符串
    const jsonString = JSON.stringify(editData, null, 2);
    setEditedOutline(jsonString);
    onEdit(jsonString);
    setParsedOutline(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // 重置为原始数据
    if (parsedOutline) {
      setEditData(JSON.parse(JSON.stringify(parsedOutline)));
    }
    setIsEditing(false);
  };

  const updateTitle = (value) => {
    setEditData({ ...editData, title: value });
  };

  const updateObjective = (index, value) => {
    const newObjectives = [...editData.objectives];
    newObjectives[index] = value;
    setEditData({ ...editData, objectives: newObjectives });
  };

  const addObjective = () => {
    setEditData({ 
      ...editData, 
      objectives: [...editData.objectives, '新增學習目標'] 
    });
  };

  const removeObjective = (index) => {
    const newObjectives = editData.objectives.filter((_, i) => i !== index);
    setEditData({ ...editData, objectives: newObjectives });
  };

  const updateChapter = (index, field, value) => {
    const newChapters = [...editData.chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setEditData({ ...editData, chapters: newChapters });
  };

  const updateChapterTopic = (chapterIndex, topicIndex, value) => {
    const newChapters = [...editData.chapters];
    const newTopics = [...newChapters[chapterIndex].topics];
    newTopics[topicIndex] = value;
    newChapters[chapterIndex] = { ...newChapters[chapterIndex], topics: newTopics };
    setEditData({ ...editData, chapters: newChapters });
  };

  const addChapterTopic = (chapterIndex) => {
    const newChapters = [...editData.chapters];
    newChapters[chapterIndex].topics.push('新增主題');
    setEditData({ ...editData, chapters: newChapters });
  };

  const removeChapterTopic = (chapterIndex, topicIndex) => {
    const newChapters = [...editData.chapters];
    newChapters[chapterIndex].topics = newChapters[chapterIndex].topics.filter((_, i) => i !== topicIndex);
    setEditData({ ...editData, chapters: newChapters });
  };

  const addChapter = () => {
    const newChapterNumber = editData.chapters.length + 1;
    setEditData({
      ...editData,
      chapters: [
        ...editData.chapters,
        {
          chapter_number: newChapterNumber,
          title: `新章節 ${newChapterNumber}`,
          topics: ['主題1', '主題2'],
          description: '章節描述'
        }
      ]
    });
  };

  const removeChapter = (index) => {
    const newChapters = editData.chapters.filter((_, i) => i !== index);
    // 重新编号
    newChapters.forEach((chapter, i) => {
      chapter.chapter_number = i + 1;
    });
    setEditData({ ...editData, chapters: newChapters });
  };

  const renderEditForm = () => {
    if (!editData) return null;

    return (
      <div className="space-y-6">
        {/* 单元标题 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            單元標題
          </label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* 学习目标 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              學習目標
            </label>
            <button
              onClick={addObjective}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增目標
            </button>
          </div>
          <div className="space-y-2">
            {editData.objectives.map((obj, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeObjective(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                  disabled={editData.objectives.length <= 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 章节 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-700">
              教學章節
            </label>
            <button
              onClick={addChapter}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增章節
            </button>
          </div>
          <div className="space-y-4">
            {editData.chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="border border-gray-300 rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    第 {chapter.chapter_number} 章
                  </span>
                  <button
                    onClick={() => removeChapter(chapterIndex)}
                    className="text-red-600 hover:text-red-700"
                    disabled={editData.chapters.length <= 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">章節標題</label>
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => updateChapter(chapterIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">章節描述</label>
                    <textarea
                      value={chapter.description}
                      onChange={(e) => updateChapter(chapterIndex, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                      rows="2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-gray-600">學習主題</label>
                      <button
                        onClick={() => addChapterTopic(chapterIndex)}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        + 新增主題
                      </button>
                    </div>
                    <div className="space-y-1">
                      {chapter.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => updateChapterTopic(chapterIndex, topicIndex, e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                          />
                          <button
                            onClick={() => removeChapterTopic(chapterIndex, topicIndex)}
                            className="text-red-600 hover:text-red-700"
                            disabled={chapter.topics.length <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
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
        {!isEditing && !isLoading && parsedOutline && (
          <button onClick={handleEdit} className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            編輯
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        {isEditing ? (
          renderEditForm()
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
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              儲存編輯
            </button>
            <button onClick={handleCancel} className="btn-secondary">
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



