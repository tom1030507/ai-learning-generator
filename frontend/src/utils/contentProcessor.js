// 数学公式格式转换工具
// 将 LaTeX 的 [ ] 格式转换为 Markdown 的 $$ $$ 格式

export const preprocessMathContent = (content) => {
  if (!content) return content;
  
  // 转换块级公式：[ ... ] → $$...$$
  // 使用非贪婪匹配，避免匹配过长
  let processed = content.replace(/\[\s*([^\]]+?)\s*\]/g, (match, formula) => {
    // 检查是否真的是数学公式（包含常见的 LaTeX 命令）
    if (formula.includes('\\') || formula.includes('frac') || formula.includes('text')) {
      return `$$${formula}$$`;
    }
    // 如果不是数学公式，保持原样（可能是普通的方括号）
    return match;
  });
  
  return processed;
};

export const preprocessContent = (content) => {
  if (!content) return content;
  
  // 先处理数学公式
  let processed = preprocessMathContent(content);
  
  // 可以在这里添加其他预处理逻辑
  
  return processed;
};

