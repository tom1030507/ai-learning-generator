import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// 洗牌（Fisher-Yates）
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const InteractiveQuestions = ({ questionsMarkdown }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState({});

  useEffect(() => {
    parseQuestions(questionsMarkdown);
  }, [questionsMarkdown]);

  const parseQuestions = (markdown) => {
    const parsed = [];
    const lines = markdown.split('\n');
    let currentQuestion = null;
    let collectingExplanation = false;
    let collectingCommonErrors = false;
    let collectingTips = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 題目開始
      const questionMatch = line.match(/^##\s*第\s*(\d+)\s*題[（(](.+?)[）)]/);
      if (questionMatch) {
        if (currentQuestion) parsed.push(finalizeQuestion(currentQuestion));
        currentQuestion = {
          number: questionMatch[1],
          type: questionMatch[2],
          question: '',
          options: [],
          answer: '',
          explanation: '',
          commonErrors: '',
          tips: ''
        };
        collectingExplanation = false;
        collectingCommonErrors = false;
        collectingTips = false;
        continue;
      }

      if (!currentQuestion) continue;

      // 選項
      const optionMatch = line.match(/^([A-D])[\).)]\s*(.+)/);
      if (optionMatch) {
        currentQuestion.options.push({
          label: optionMatch[1],
          text: optionMatch[2]
        });
        continue;
      }

      // 答案
      if (line.includes('**正確答案') || line.includes('**答案')) {
        const answerMatch = line.match(/[：:]\*\*\s*(.+?)(?:\s|$)/);
        if (answerMatch) {
          currentQuestion.answer = answerMatch[1].trim();
        } else {
          const simpleMatch = line.match(/[：:]\s*(.+)/);
          if (simpleMatch) {
            currentQuestion.answer = simpleMatch[1].replace(/\*\*/g, '').trim();
          }
        }
        continue;
      }

      // 區塊標記
      if (line.includes('**詳細解析') || line.includes('**解析')) {
        collectingExplanation = true;
        collectingCommonErrors = false;
        collectingTips = false;
        continue;
      }
      if (line.includes('**常見錯誤') || line.includes('**常見易錯**')) {
        collectingExplanation = false;
        collectingCommonErrors = true;
        collectingTips = false;
        continue;
      }
      if (line.includes('**技巧提示') || line.includes('**解題技巧**')) {
        collectingExplanation = false;
        collectingCommonErrors = false;
        collectingTips = true;
        continue;
      }

      // 分隔線：題目結束
      if (line === '---' || line === '──' || line.startsWith('---')) {
        if (currentQuestion) parsed.push(finalizeQuestion(currentQuestion));
        currentQuestion = null;
        collectingExplanation = false;
        collectingCommonErrors = false;
        collectingTips = false;
        continue;
      }

      // 收集內容
      if (currentQuestion) {
        if (collectingExplanation) {
          if (line) currentQuestion.explanation += line + '\n';
        } else if (collectingCommonErrors) {
          if (line) currentQuestion.commonErrors += line + '\n';
        } else if (collectingTips) {
          if (line) currentQuestion.tips += line + '\n';
        } else if (line && !line.startsWith('#')) {
          currentQuestion.question += line + ' ';
        }
      }
    }

    if (currentQuestion) parsed.push(finalizeQuestion(currentQuestion));
    setQuestions(parsed);
  };

  // 對單題做洗牌並標註正確答案映射
  const finalizeQuestion = (q) => {
    // 洗牌選項，重新賦予 A-D 顯示標籤
    const shuffled = shuffleArray(q.options).map((opt, idx) => ({
      ...opt,
      displayLabel: String.fromCharCode(65 + idx), // A-D
      originalLabel: opt.label
    }));
    // 找到正確顯示標籤
    const correctDisplay = shuffled.find(
      (opt) => opt.originalLabel.toUpperCase() === q.answer.charAt(0).toUpperCase()
    )?.displayLabel || q.answer.charAt(0).toUpperCase();

    return {
      ...q,
      options: shuffled,
      correctLabel: correctDisplay,
      explanation: q.explanation.trim(),
      commonErrors: q.commonErrors.trim(),
      tips: q.tips.trim()
    };
  };

  const handleSelectAnswer = (questionIndex, selectedOption) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: selectedOption
    });
  };

  const handleSubmit = (questionIndex) => {
    setShowResults({
      ...showResults,
      [questionIndex]: true
    });
  };

  const isCorrect = (questionIndex) => {
    const question = questions[questionIndex];
    const userAnswer = userAnswers[questionIndex];
    if (!userAnswer) return false;
    return userAnswer.charAt(0).toUpperCase() === question.correctLabel.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        const hasAnswered = showResults[index];
        const selectedAnswer = userAnswers[index];
        const correct = hasAnswered && isCorrect(index);

        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-primary-500">
            {/* 題目標題 */}
            <div className="flex items-start mb-4">
              <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
                {question.number}
              </span>
              <div className="flex-1">
                <span className="inline-block bg-primary-100 text-primary-700 text-xs px-3 py-1 rounded-full mb-2 font-medium">
                  {question.type}
                </span>
                <div className="text-gray-800 text-lg leading-relaxed">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {question.question}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* 選項 */}
            <div className="ml-11 space-y-3 mb-4">
              {question.options.map((option, optIndex) => {
                const isSelected = selectedAnswer === option.displayLabel;
                const isCorrectAnswer = hasAnswered && (option.displayLabel === question.correctLabel);
                const isWrongSelected = hasAnswered && isSelected && !correct;

                return (
                  <button
                    key={optIndex}
                    onClick={() => !hasAnswered && handleSelectAnswer(index, option.displayLabel)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      hasAnswered
                        ? isCorrectAnswer
                          ? 'border-green-500 bg-green-50'
                          : isWrongSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                    } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start">
                      <span className={`font-bold mr-3 flex-shrink-0 ${
                        hasAnswered
                          ? isCorrectAnswer
                            ? 'text-green-700'
                            : isWrongSelected
                            ? 'text-red-700'
                            : 'text-gray-600'
                          : isSelected
                          ? 'text-primary-700'
                          : 'text-gray-600'
                      }`}>
                        {option.label})
                      </span>
                      <div className={`flex-1 ${
                        hasAnswered
                          ? isCorrectAnswer
                            ? 'text-green-900'
                            : isWrongSelected
                            ? 'text-red-900'
                            : 'text-gray-700'
                          : isSelected
                          ? 'text-primary-900'
                          : 'text-gray-700'
                      }`}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({node, ...props}) => <span {...props} />
                          }}
                        >
                          {option.text}
                        </ReactMarkdown>
                      </div>
                      {hasAnswered && isCorrectAnswer && (
                        <svg className="w-6 h-6 text-green-600 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {hasAnswered && isWrongSelected && (
                        <svg className="w-6 h-6 text-red-600 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 提交按鈕 */}
            {!hasAnswered && selectedAnswer && (
              <div className="ml-11">
                <button
                  onClick={() => handleSubmit(index)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
                >
                  提交答案
                </button>
              </div>
            )}

            {/* 結果顯示 */}
            {hasAnswered && (
              <div className="ml-11 mt-4">
                {/* 對錯提示 */}
                <div className={`p-4 rounded-lg mb-3 ${
                  correct ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                }`}>
                  <div className="flex items-center">
                    {correct ? (
                      <>
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-semibold">✓ 答對了！做得好！</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800 font-semibold">✗ 答錯了，再想想看！</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 正確答案 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <p className="text-blue-900 font-semibold mb-1">✓ 正確答案：</p>
                  <p className="text-blue-800 font-medium text-lg">
                    {question.correctLabel}
                  </p>
                </div>

                {/* 詳細解析 */}
                {question.explanation && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900 font-semibold mb-2">📝 詳細解析：</p>
                    <div className="text-gray-700 prose prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {question.explanation.trim()}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* 常見錯誤 */}
                {question.commonErrors && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-3">
                    <p className="text-red-900 font-semibold mb-2">⚠️ 常見錯誤：</p>
                    <div className="text-red-800 prose prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {question.commonErrors.trim()}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* 技巧提示 */}
                {question.tips && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                    <p className="text-green-900 font-semibold mb-2">💡 技巧提示：</p>
                    <div className="text-green-800 prose prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {question.tips.trim()}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveQuestions;
