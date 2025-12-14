import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import InteractiveQuestions from './InteractiveQuestions';
import 'katex/dist/katex.min.css';

const ChapterDisplay = ({
  chapter,
  chapterIndex,
  totalChapters,
  onNext,
  onPrev,
  onFinish,
  generationId,
  outline,
  onChapterUpdate
}) => {
  const [regenLoading, setRegenLoading] = React.useState(false);

  const handleRegenerate = async () => {
    if (!generationId || !outline) return;
    setRegenLoading(true);
    try {
      const res = await import('../services/api').then(m => m.regenerateChapter(generationId, chapter.chapter_number, outline));
      if (res?.chapter && onChapterUpdate) {
        onChapterUpdate(res.chapter);
      }
    } catch (e) {
      console.error('重新生成章節失敗:', e);
      alert('重新生成本章失敗，請稍後再試');
    } finally {
      setRegenLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* 章节导航头部 */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-primary-600 font-semibold mb-1">
              第 {chapter.chapter_number} 章 / 共 {totalChapters} 章
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{chapter.title}</h2>
            {chapter.description && (
              <p className="text-gray-600 mt-2">{chapter.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={regenLoading}
            className="px-4 py-2 rounded-lg flex items-center gap-2 bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300 disabled:opacity-60"
          >
            {regenLoading ? '重新生成中...' : '重新生成本章'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
            <button
              onClick={onPrev}
              disabled={chapterIndex === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                chapterIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一章
            </button>
            {chapterIndex < totalChapters - 1 ? (
              <button
                onClick={onNext}
                className="px-4 py-2 rounded-lg flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700"
              >
                下一章
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onFinish}
                className="px-4 py-2 rounded-lg flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
              >
                完成學習
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 本章主题 */}
      {chapter.topics && chapter.topics.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            本章學習主題
          </h3>
          <div className="flex flex-wrap gap-2">
            {chapter.topics.map((topic, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 章节内容 */}
      <div className="card">
        <div className="flex items-center mb-4">
          <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">
            📖
          </span>
          <h3 className="text-xl font-bold text-gray-800">教材內容</h3>
        </div>
        <div className="prose prose-slate max-w-none bg-gray-50 rounded-lg p-6">
          <ReactMarkdown 
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
          >
            {chapter.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* 练习题 */}
      <div className="card">
        <div className="flex items-center mb-4">
          <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">
            ✏️
          </span>
          <h3 className="text-xl font-bold text-gray-800">本章練習題</h3>
        </div>
        <InteractiveQuestions questionsMarkdown={chapter.questions} />
      </div>

      {/* 底部导航 */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <button
          onClick={onPrev}
          disabled={chapterIndex === 0}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
            chapterIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-primary-600 hover:bg-primary-50 border-2 border-primary-300 font-semibold'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          上一章
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">學習進度</div>
          <div className="text-lg font-bold text-primary-600">
            {chapterIndex + 1} / {totalChapters}
          </div>
        </div>

        {chapterIndex < totalChapters - 1 ? (
          <button
            onClick={onNext}
            className="px-6 py-3 rounded-lg flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-semibold"
          >
            下一章
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onFinish}
            className="px-6 py-3 rounded-lg flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 font-semibold"
          >
            完成學習
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterDisplay;

