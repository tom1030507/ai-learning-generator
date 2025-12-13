import React from 'react';

const ContentDisplay = ({ content, onConfirm, isLoading }) => {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">
          2
        </span>
        <h3 className="text-xl font-bold text-gray-800">教材內容</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-4 max-h-[600px] overflow-y-auto">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {content}
          </div>
        </div>
      </div>

      <button 
        onClick={() => onConfirm(content)} 
        className="btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? '生成題目中...' : '確認教材，生成練習題'}
      </button>
    </div>
  );
};

export default ContentDisplay;



