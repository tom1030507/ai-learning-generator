import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
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



