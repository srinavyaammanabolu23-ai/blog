import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ data }) {
  const language = data.language || 'javascript';
  const code = data.code || '';

  return (
    <div className="code-block-wrapper py-3">
      {/* Language badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-mono font-medium px-2.5 py-1 rounded-md uppercase tracking-wider"
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#a78bfa',
          }}
        >
          {language}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs px-2.5 py-1 rounded-md transition-colors duration-200 cursor-pointer"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
            border: '1px solid var(--glass-border)',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--text-primary)';
            e.target.style.borderColor = 'rgba(139,92,246,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--text-muted)';
            e.target.style.borderColor = 'var(--glass-border)';
          }}
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          background: 'var(--surface-2)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          fontSize: '0.85rem',
          border: '1px solid var(--glass-border)',
          margin: 0,
        }}
        codeTagProps={{
          style: { fontFamily: "var(--font-mono)" },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
