import React from 'react';
import ReactMarkdown from 'react-markdown';

const OutlineDisplay = ({ outline, onConfirm, onEdit, isLoading }) => {
  const [editedOutline, setEditedOutline] = React.useState(outline);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleConfirm = () => {
    onConfirm(editedOutline);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedOutline);
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
        {!isEditing && !isLoading && (
          <button onClick={handleEdit} className="text-primary-600 hover:text-primary-700 text-sm">
            編輯
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        {isEditing ? (
          <textarea
            value={editedOutline}
            onChange={(e) => setEditedOutline(e.target.value)}
            className="input-field min-h-[300px] font-mono text-sm"
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{editedOutline}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-primary flex-1">
              儲存編輯
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary">
              取消
            </button>
          </>
        ) : (
          <button 
            onClick={handleConfirm} 
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? '生成教材中...' : '確認大綱，生成教材'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OutlineDisplay;



