import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const QuestionsDisplay = ({ questions }) => {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">
          3
        </span>
        <h3 className="text-xl font-bold text-gray-800">練習題目</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
          >
            {questions}
          </ReactMarkdown>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-green-800 font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          教材生成完成！
        </p>
        <p className="text-green-600 text-sm mt-1">
          所有內容已自動儲存至歷史記錄。
        </p>
      </div>
    </div>
  );
};

export default QuestionsDisplay;



