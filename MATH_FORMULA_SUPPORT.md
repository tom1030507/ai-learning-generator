# 数学公式渲染支持 - 说明文档

## 问题

原先的系统无法正确渲染数学公式，例如：
```
[ \text{速率} = \frac{\text{距離}}{\text{時間}} ]
```
会显示为纯文本，而不是美观的数学公式。

## 解决方案

添加了 **KaTeX** 数学公式渲染支持。

### 安装的依赖

```json
{
  "remark-math": "^6.0.0",      // Markdown 数学公式插件
  "rehype-katex": "^7.0.0",      // KaTeX 渲染插件
  "katex": "^0.16.x"             // KaTeX 库
}
```

### 修改的组件

所有使用 `ReactMarkdown` 的组件都已更新：

1. ✅ `ChapterDisplay.jsx` - 章节内容和练习题
2. ✅ `ContentDisplay.jsx` - 教材内容
3. ✅ `QuestionsDisplay.jsx` - 练习题目

### 使用方式

在所有 Markdown 组件中添加了数学插件：

```jsx
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

<ReactMarkdown 
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {content}
</ReactMarkdown>
```

## 数学公式语法

### 行内公式
使用单个 `$` 包裹：
```
速率的公式是 $v = \frac{d}{t}$，其中...
```

效果：速率的公式是 $v = \frac{d}{t}$，其中...

### 块级公式
使用双 `$$` 或 `[ ]` 包裹：

```markdown
公式如下：

$$
\text{速率} = \frac{\text{距離}}{\text{時間}}
$$

或者：

$$
v = \frac{d}{t}
$$
```

效果：
$$
\text{速率} = \frac{\text{距離}}{\text{時間}}
$$

### 常用公式示例

#### 1. 分数
```latex
$\frac{1}{2}$    →  ½
$\frac{a}{b}$    →  a/b
```

#### 2. 上标和下标
```latex
$x^2$            →  x²
$a_1$            →  a₁
$x^{n+1}$        →  x^(n+1)
```

#### 3. 根号
```latex
$\sqrt{2}$       →  √2
$\sqrt[3]{8}$    →  ³√8
```

#### 4. 希腊字母
```latex
$\alpha$         →  α
$\beta$          →  β
$\theta$         →  θ
$\pi$            →  π
```

#### 5. 数学符号
```latex
$\times$         →  ×
$\div$           →  ÷
$\pm$            →  ±
$\leq$           →  ≤
$\geq$           →  ≥
$\neq$           →  ≠
```

#### 6. 求和和积分
```latex
$\sum_{i=1}^{n}$ →  Σ(i=1 到 n)
$\int_{a}^{b}$   →  ∫(从a到b)
```

#### 7. 矩阵
```latex
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

## 后端提示词建议

为了让AI生成正确的数学公式，可以在prompt中添加：

```python
要求：
...
5. 数学公式请使用 LaTeX 格式：
   - 行内公式用 $公式$ 
   - 块级公式用 $$公式$$
   - 例如：速率公式 $v = \\frac{d}{t}$
   - 例如：面积公式 $$A = \\pi r^2$$
```

### 示例 Prompt 片段

```python
prompt = f"""
...
要求：
1. 使用淺顯易懂的語言
2. 提供生活化的例子
3. **所有数学公式使用 LaTeX 格式**：
   - 行内公式用 $...$
   - 块级公式用 $$...$$
   - 示例：$v = \\frac{d}{t}$ 或 $$E = mc^2$$
4. 確保公式正確且美觀
"""
```

## 效果展示

### 之前（纯文本）
```
[ \text{速率} = \frac{\text{距離}}{\text{時間}} ]
```

### 现在（渲染后）
$$
\text{速率} = \frac{\text{距離}}{\text{時間}}
$$

## 测试建议

生成一个数学或物理相关的教材，测试公式渲染：

**测试科目：**
- 数学（分数、方程式、几何）
- 物理（速率、力学、电学）
- 化学（化学式、反应式）

**测试案例：**
```
科目：数学
年级：国中二年级
单元：一元二次方程式

应该包含的公式：
- $ax^2 + bx + c = 0$
- $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
```

## 常见问题

### Q1: 公式显示为纯文本
**A:** 确保：
1. 已安装所有依赖：`npm install`
2. 已导入 KaTeX CSS
3. 使用了正确的插件配置

### Q2: 公式语法错误
**A:** 检查：
- 是否正确使用 `$` 或 `$$`
- LaTeX 语法是否正确
- 特殊字符是否需要转义（如 `\`）

### Q3: 部分公式不显示
**A:** 可能原因：
- LaTeX 语法错误
- 使用了不支持的命令
- 需要额外的 KaTeX 宏定义

## 支持的功能

✅ 行内公式  
✅ 块级公式  
✅ 分数、根号、指数  
✅ 希腊字母  
✅ 数学符号  
✅ 求和、积分  
✅ 矩阵  
✅ 多行公式  
✅ 文本标注（`\text{}`）  

## 更多资源

- [KaTeX 文档](https://katex.org/docs/supported.html)
- [LaTeX 数学符号](https://katex.org/docs/support_table.html)
- [在线 LaTeX 编辑器](https://www.latexlive.com/)

---

现在系统已完全支持数学公式渲染！🎉

