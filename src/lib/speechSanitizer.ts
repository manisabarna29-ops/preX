/**
 * Robust text sanitization layer for text-to-speech (TTS) & Web Speech API.
 * Strips raw LaTeX math, Markdown syntax, code block markers, and symbols
 * so the synthetic voice sounds natural, articulate, and fluent.
 */

function processLatexMath(mathStr: string): string {
  let m = mathStr;

  // Fractions: \frac{a}{b} -> a over b
  m = m.replace(/\\?frac\{([^}]+)\}\{([^}]+)\}/gi, '$1 over $2');

  // Big-O notations: O(1), O(N), O(N \log N), O(N^2)
  m = m.replace(/O\s*\(\s*1\s*\)/gi, 'O of 1');
  m = m.replace(/O\s*\(\s*N\s*\)/gi, 'O of N');
  m = m.replace(/O\s*\(\s*N\s*\\?log\s*N\s*\)/gi, 'O of N log N');
  m = m.replace(/O\s*\(\s*N\^2\s*\)/gi, 'O of N squared');
  m = m.replace(/O\s*\(\s*N\^3\s*\)/gi, 'O of N cubed');
  m = m.replace(/O\s*\(([^)]+)\)/gi, 'O of $1');

  // Superscripts & Exponents
  m = m.replace(/([a-zA-Z0-9]+)\^2/g, '$1 squared');
  m = m.replace(/([a-zA-Z0-9]+)\^3/g, '$1 cubed');
  m = m.replace(/([a-zA-Z0-9]+)\^\{([^}]+)\}/g, '$1 to the power of $2');
  m = m.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '$1 to the power of $2');

  // Common mathematical operations & symbols
  m = m.replace(/\\?times/gi, ' times ');
  m = m.replace(/\\?div/gi, ' divided by ');
  m = m.replace(/\\?pm/gi, ' plus or minus ');
  m = m.replace(/\\?leq?/gi, ' is less than or equal to ');
  m = m.replace(/\\?geq?/gi, ' is greater than or equal to ');
  m = m.replace(/\\?neq/gi, ' is not equal to ');
  m = m.replace(/\\?approx/gi, ' is approximately ');
  m = m.replace(/\\?sqrt\{([^}]+)\}/gi, ' square root of $1 ');
  m = m.replace(/\\?sum/gi, ' sum of ');
  m = m.replace(/\\?infty/gi, ' infinity ');
  m = m.replace(/\\?rightarrow/gi, ' leads to ');
  m = m.replace(/\\?leftarrow/gi, ' from ');
  m = m.replace(/\\?cdot/gi, ' dot ');

  // Percentage symbols
  m = m.replace(/\\?%/g, ' percent');

  // Strip remaining TeX control sequences
  m = m.replace(/\\[a-zA-Z]+/g, ' ');

  return m;
}

export function cleanTextForNarration(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Remove or summarize code blocks:
  // Instead of reciting raw brackets and semicolons, announce code concisely
  text = text.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, ' Here is the relevant code implementation. ');
  text = text.replace(/```([\s\S]*?)```/g, ' Here is the code block. ');

  // 2. Inline code markers: `someFunction()` -> someFunction()
  text = text.replace(/`([^`]+)`/g, '$1');

  // 3. LaTeX Math formatting transformations:
  // Block math: $$ ... $$
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => processLatexMath(math));
  // Inline math: $ ... $
  text = text.replace(/\$([^\$\n]+)\$/g, (_, math) => processLatexMath(math));

  // 4. Markdown headers: # Header -> Header
  text = text.replace(/^#{1,6}\s+(.*)$/gm, '$1.');

  // 5. Bold & Italic markers: **bold**, *italic*, __bold__, _italic_
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  // 6. Markdown links: [anchor text](url) -> anchor text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 7. Markdown blockquotes: > text -> text
  text = text.replace(/^>\s+/gm, '');

  // 8. Markdown bullet lists / numbered lists:
  text = text.replace(/^[\*\-\+]\s+/gm, '');
  text = text.replace(/^\d+\.\s+/gm, '');

  // 9. Tables and horizontal rules:
  text = text.replace(/^[-*_]{3,}\s*$/gm, '');
  text = text.replace(/\|/g, ' ');

  // 10. Strip remaining brackets, braces, backslashes
  text = text.replace(/[{}\\]/g, ' ');

  // 11. Normalize multiple spaces & newlines into natural pauses
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
