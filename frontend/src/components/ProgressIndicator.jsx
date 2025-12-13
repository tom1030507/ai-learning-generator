import React from 'react';

const ProgressIndicator = ({ current, total, message }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
        <h3 className="text-xl font-bold text-gray-800">{message}</h3>
      </div>

      <div className="space-y-4">
        {/* 進度條 */}
        <div className="relative">
          <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: `${percentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-500"
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>已完成 {current} / {total} 章</span>
            <span>{percentage}%</span>
          </div>
        </div>

        {/* 進度詳情 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-blue-900 font-medium">AI 正在為每個章節生成詳細內容</p>
              <p className="text-blue-700 text-sm mt-1">這可能需要幾分鐘時間，請耐心等候...</p>
            </div>
          </div>
        </div>

        {/* 章節列表 */}
        <div className="space-y-2">
          {Array.from({ length: total }, (_, index) => {
            const chapterNum = index + 1;
            const isCompleted = chapterNum < current;
            const isCurrent = chapterNum === current;
            const isPending = chapterNum > current;

            return (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg ${
                  isCompleted ? 'bg-green-50' :
                  isCurrent ? 'bg-primary-50 border-2 border-primary-300' :
                  'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  isCompleted ? 'bg-green-500' :
                  isCurrent ? 'bg-primary-600' :
                  'bg-gray-300'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <span className="text-white text-sm font-semibold">{chapterNum}</span>
                  )}
                </div>
                <span className={`flex-1 ${
                  isCompleted ? 'text-green-900 font-medium' :
                  isCurrent ? 'text-primary-900 font-semibold' :
                  'text-gray-500'
                }`}>
                  第 {chapterNum} 章
                  {isCompleted && ' ✓ 已完成'}
                  {isCurrent && ' - 生成中...'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;

