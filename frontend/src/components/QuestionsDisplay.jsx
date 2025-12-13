import React, { useState } from 'react';

const QuestionsDisplay = ({ questions }) => {
  const [showAnswers, setShowAnswers] = useState({});

  // 嘗試解析 JSON 格式的題目
  let parsedQuestions = null;
  try {
    // 移除可能的 markdown 程式碼區塊標記
    const cleanJson = questions.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    parsedQuestions = JSON.parse(cleanJson);
  } catch (e) {
    // 如果無法解析，就顯示原始文字
    console.log('無法解析題目 JSON，將顯示原始文字');
  }

  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">
          3
        </span>
        <h3 className="text-xl font-bold text-gray-800">練習題目</h3>
      </div>

      {parsedQuestions && parsedQuestions.questions ? (
        <div className="space-y-6">
          {parsedQuestions.questions.map((q, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-5 border-l-4 border-primary-500">
              <div className="flex items-start mb-3">
                <span className="bg-primary-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 text-sm flex-shrink-0">
                  {q.number || index + 1}
                </span>
                <div className="flex-1">
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded mb-2">
                    {q.type || '題目'}
                  </span>
                  <p className="text-gray-800 font-medium">{q.question}</p>
                </div>
              </div>

              {q.options && q.options.length > 0 && (
                <div className="ml-10 mb-3 space-y-2">
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="text-gray-700">
                      {option}
                    </div>
                  ))}
                </div>
              )}

              <div className="ml-10">
                <button
                  onClick={() => toggleAnswer(index)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {showAnswers[index] ? '隱藏解答' : '顯示解答'}
                </button>

                {showAnswers[index] && (
                  <div className="mt-3 p-4 bg-white rounded border border-green-200">
                    <p className="text-green-700 font-semibold mb-2">
                      答案：{q.answer}
                    </p>
                    {q.explanation && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">解析：</span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
            {questions}
          </pre>
        </div>
      )}

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



