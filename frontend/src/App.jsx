import React, { useState, useEffect } from 'react';
import GeneratorForm from './components/GeneratorForm';
import OutlineDisplay from './components/OutlineDisplay';
import ContentDisplay from './components/ContentDisplay';
import QuestionsDisplay from './components/QuestionsDisplay';
import History from './components/History';
import LoadingSpinner from './components/LoadingSpinner';
import ProgressIndicator from './components/ProgressIndicator';
import { generateOutline, generateContent, generateQuestions, getGenerationProgress } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form', 'history', 'view'
  const [currentStep, setCurrentStep] = useState(0); // 0: form, 1: outline, 2: content, 3: questions
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [generationId, setGenerationId] = useState(null);
  const [outline, setOutline] = useState('');
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState('');
  const [progress, setProgress] = useState(null);

  // 輪詢進度
  useEffect(() => {
    let intervalId;
    if (loading && generationId && currentStep === 2) {
      intervalId = setInterval(async () => {
        try {
          const progressData = await getGenerationProgress(generationId);
          setProgress(progressData);
          if (progressData.status === 'completed' || progressData.status === 'error') {
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('取得進度失敗:', error);
        }
      }, 1000); // 每秒查詢一次
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading, generationId, currentStep]);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setLoading(true);
    setCurrentStep(1);

    try {
      const response = await generateOutline(data.subject, data.grade, data.unit);
      setGenerationId(response.generation_id);
      setOutline(response.outline);
      setCurrentStep(1);
    } catch (error) {
      alert('生成大綱失敗，請稍後再試');
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleOutlineConfirm = async (editedOutline) => {
    setLoading(true);
    setProgress(null);

    try {
      const response = await generateContent(generationId, editedOutline);
      setContent(response.content);
      setCurrentStep(2);
    } catch (error) {
      alert('生成教材失敗，請稍後再試');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const handleContentConfirm = async (currentContent) => {
    setLoading(true);

    try {
      const response = await generateQuestions(generationId, currentContent);
      setQuestions(response.questions);
      setCurrentStep(3);
    } catch (error) {
      alert('生成題目失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData(null);
    setGenerationId(null);
    setOutline('');
    setContent('');
    setQuestions('');
    setCurrentView('form');
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleSelectHistoryItem = (item) => {
    setFormData({
      subject: item.subject,
      grade: item.grade,
      unit: item.unit,
    });
    setGenerationId(item.id);
    setOutline(item.outline || '');
    setContent(item.content || '');
    setQuestions(item.questions || '');
    
    // 判斷應該顯示到哪個步驟
    if (item.questions) {
      setCurrentStep(3);
    } else if (item.content) {
      setCurrentStep(2);
    } else if (item.outline) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
    
    setCurrentView('form');
  };

  const renderStepIndicator = () => {
    if (currentStep === 0) return null;

    const steps = [
      { number: 1, label: '大綱' },
      { number: 2, label: '教材' },
      { number: 3, label: '題目' }
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${currentStep >= step.number 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500'}
              `}>
                {step.number}
              </div>
              <span className={`ml-2 font-medium ${
                currentStep >= step.number ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-4 ${
                currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                智慧教材生成平台
              </h1>
              <span className="ml-3 text-sm text-gray-500">AI Learning Generator</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentView('form')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'form'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                生成教材
              </button>
              <button
                onClick={handleViewHistory}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'history'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                歷史記錄
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentView === 'history' ? (
          <History onSelectItem={handleSelectHistoryItem} />
        ) : (
          <>
            {renderStepIndicator()}
            
            <div className="space-y-6">
              {/* Step 0: Form */}
              {currentStep === 0 && (
                <GeneratorForm onSubmit={handleFormSubmit} isLoading={loading} />
              )}

              {/* Step 1: Outline */}
              {currentStep >= 1 && (
                <>
                  {formData && (
                    <div className="card max-w-2xl mx-auto mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-semibold">科目：</span>
                        <span className="ml-2">{formData.subject}</span>
                        <span className="mx-3">|</span>
                        <span className="font-semibold">年級：</span>
                        <span className="ml-2">{formData.grade}</span>
                        <span className="mx-3">|</span>
                        <span className="font-semibold">單元：</span>
                        <span className="ml-2">{formData.unit}</span>
                        <button
                          onClick={handleReset}
                          className="ml-auto text-primary-600 hover:text-primary-700"
                        >
                          重新開始
                        </button>
                      </div>
                    </div>
                  )}

                  {loading && currentStep === 1 ? (
                    <LoadingSpinner message="正在生成教學大綱..." />
                  ) : outline && (
                    <div className="max-w-4xl mx-auto">
                      <OutlineDisplay
                        outline={outline}
                        onConfirm={handleOutlineConfirm}
                        onEdit={setOutline}
                        isLoading={loading && currentStep === 2}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Content */}
              {currentStep >= 2 && (
                <>
                  {loading && currentStep === 2 ? (
                    progress && progress.total > 0 ? (
                      <div className="max-w-4xl mx-auto">
                        <ProgressIndicator
                          current={progress.current}
                          total={progress.total}
                          message="正在逐章生成教材內容"
                        />
                      </div>
                    ) : (
                      <LoadingSpinner message="正在生成教材內容..." />
                    )
                  ) : content && (
                    <div className="max-w-4xl mx-auto">
                      <ContentDisplay
                        content={content}
                        onConfirm={handleContentConfirm}
                        isLoading={loading && currentStep === 3}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Step 3: Questions */}
              {currentStep >= 3 && (
                <>
                  {loading && currentStep === 3 ? (
                    <LoadingSpinner message="正在生成練習題目..." />
                  ) : questions && (
                    <div className="max-w-4xl mx-auto">
                      <QuestionsDisplay questions={questions} />
                      <div className="mt-6 text-center">
                        <button onClick={handleReset} className="btn-primary">
                          生成新教材
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>智慧教材生成平台 © 2025 | Powered by Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;



