// 數學公式格式轉換工具
// 將 LaTeX 的 [ ] 格式轉換為 Markdown 的 $$ $$ 格式

export const preprocessMathContent = (content) => {
  if (!content) return content;

  // 轉換區塊級公式：[ ... ] → $$...$$
  // 使用非貪婪匹配，避免匹配過長
  let processed = content.replace(/\[\s*([^\]]+?)\s*\]/g, (match, formula) => {
    // 檢查是否真的是數學公式（包含常見的 LaTeX 命令）
    if (formula.includes('\\') || formula.includes('frac') || formula.includes('text')) {
      return `$$${formula}$$`;
    }
    // 如果不是數學公式，保持原樣（可能是普通的方括號）
    return match;
  });

  return processed;
};

export const preprocessContent = (content) => {
  if (!content) return content;

  // 先處理數學公式
  let processed = preprocessMathContent(content);

  // 可以在這裡新增其他預處理邏輯

  return processed;
};

