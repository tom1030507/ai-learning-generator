import React, { useState } from 'react';

const GeneratorForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    subject: '數學',
    grade: '小六',
    unit: '',
  });

  const subjects = ['數學', '自然科學', '理化', '生物', '物理', '化學', '國文', '英文', '歷史', '地理'];
  const grades = ['小一', '小二', '小三', '小四', '小五', '小六', '國一', '國二', '國三', '高一', '高二', '高三'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.unit.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">建立新教材</h2>
      
      <div className="space-y-4">
        <div>
          <label className="label">科目</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">年級</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">單元名稱</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="例如：速率、圓周率、光合作用"
            className="input-field"
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full mt-6"
          disabled={isLoading || !formData.unit.trim()}
        >
          {isLoading ? '生成中...' : '開始生成教材'}
        </button>
      </div>
    </form>
  );
};

export default GeneratorForm;



