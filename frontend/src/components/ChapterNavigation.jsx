import React from 'react';

const ChapterNavigation = ({ chapters, currentChapter, onSelectChapter }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
        章節導航
      </h3>
      <div className="space-y-2">
        {chapters.map((chapter, index) => {
          const isCurrent = index === currentChapter;
          const isCompleted = index < currentChapter;
          
          return (
            <button
              key={index}
              onClick={() => onSelectChapter(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isCurrent
                  ? 'border-primary-500 bg-primary-50'
                  : isCompleted
                  ? 'border-green-300 bg-green-50 hover:bg-green-100'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  isCurrent
                    ? 'bg-primary-600'
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white font-bold">{chapter.chapter_number}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold ${
                    isCurrent ? 'text-primary-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                  }`}>
                    {chapter.title}
                  </div>
                  {chapter.description && (
                    <div className={`text-sm mt-1 truncate ${
                      isCurrent ? 'text-primary-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {chapter.description}
                    </div>
                  )}
                </div>
                {isCurrent && (
                  <div className="ml-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-full font-semibold">
                    當前
                  </div>
                )}
                {isCompleted && (
                  <div className="ml-2 text-green-600 text-xs font-semibold">
                    已完成
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterNavigation;



