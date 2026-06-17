import { useState } from 'react';

const BLOCK_TYPES = [
  { type: 'header', label: '📑 Header', icon: 'H' },
  { type: 'richtext', label: '📝 Rich Text', icon: 'T' },
  { type: 'media', label: '🖼️ Media', icon: 'M' },
  { type: 'code', label: '💻 Code', icon: 'C' },
];

const DEFAULT_DATA = {
  header: { title: '', subtitle: '' },
  richtext: { content: '' },
  media: { url: '', caption: '', align: 'center' },
  code: { code: '', language: 'javascript' },
};

const LANGUAGES = [
  'javascript', 'python', 'typescript', 'java', 'cpp', 'go',
  'rust', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown',
];

function BlockEditorItem({ block, index, total, onChange, onMove, onDelete }) {
  const updateData = (field, value) => {
    onChange(index, { ...block, data: { ...block.data, [field]: value } });
  };

  return (
    <div
      className="glass-card p-5 group"
      style={{ background: 'var(--surface-1)', borderRadius: '0.875rem' }}
    >
      {/* Block header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md uppercase"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}
          >
            {block.type}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Block {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)' }}
            title="Move up"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)' }}
            title="Move down"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer ml-1"
            style={{ color: '#ef4444' }}
            title="Delete block"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      {/* Block-specific editors */}
      {block.type === 'header' && (
        <div className="space-y-3">
          <input
            className="input-field text-lg font-bold"
            placeholder="Enter title..."
            value={block.data.title || ''}
            onChange={(e) => updateData('title', e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Enter subtitle (optional)..."
            value={block.data.subtitle || ''}
            onChange={(e) => updateData('subtitle', e.target.value)}
          />
        </div>
      )}

      {block.type === 'richtext' && (
        <textarea
          className="input-field"
          rows={5}
          placeholder="Write your content in Markdown..."
          value={block.data.content || ''}
          onChange={(e) => updateData('content', e.target.value)}
          style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }}
        />
      )}

      {block.type === 'media' && (
        <div className="space-y-3">
          <input
            className="input-field"
            placeholder="Image URL (e.g. https://images.unsplash.com/...)"
            value={block.data.url || ''}
            onChange={(e) => updateData('url', e.target.value)}
          />
          <div className="flex gap-3">
            <input
              className="input-field flex-1"
              placeholder="Caption (optional)"
              value={block.data.caption || ''}
              onChange={(e) => updateData('caption', e.target.value)}
            />
            <select
              className="input-field"
              style={{ width: '120px' }}
              value={block.data.align || 'center'}
              onChange={(e) => updateData('align', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          {block.data.url && (
            <img
              src={block.data.url}
              alt="Preview"
              className="max-h-40 rounded-lg object-cover"
              style={{ border: '1px solid var(--glass-border)' }}
            />
          )}
        </div>
      )}

      {block.type === 'code' && (
        <div className="space-y-3">
          <select
            className="input-field"
            value={block.data.language || 'javascript'}
            onChange={(e) => updateData('language', e.target.value)}
            style={{ width: '180px' }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <textarea
            className="input-field"
            rows={8}
            placeholder="Paste your code here..."
            value={block.data.code || ''}
            onChange={(e) => updateData('code', e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>
      )}
    </div>
  );
}

export default function BlockEditor({ blocks, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const addBlock = (type) => {
    onChange([...blocks, { type, data: { ...DEFAULT_DATA[type] } }]);
    setShowPicker(false);
  };

  const updateBlock = (index, updated) => {
    const next = [...blocks];
    next[index] = updated;
    onChange(next);
  };

  const moveBlock = (index, direction) => {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const deleteBlock = (index) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockEditorItem
          key={index}
          block={block}
          index={index}
          total={blocks.length}
          onChange={updateBlock}
          onMove={moveBlock}
          onDelete={deleteBlock}
        />
      ))}

      {/* Add block button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full py-4 rounded-xl border-2 border-dashed text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{
            borderColor: showPicker ? 'rgba(139,92,246,0.4)' : 'var(--glass-border)',
            color: showPicker ? '#a78bfa' : 'var(--text-muted)',
            background: showPicker ? 'rgba(139,92,246,0.05)' : 'transparent',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Content Block
          </span>
        </button>

        {showPicker && (
          <div
            className="absolute left-0 right-0 mt-2 p-2 rounded-xl z-10 grid grid-cols-2 sm:grid-cols-4 gap-2"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            }}
          >
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => addBlock(bt.type)}
                className="p-3 rounded-lg text-center transition-all duration-200 cursor-pointer"
                style={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                  e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'var(--surface-1)';
                }}
              >
                <span className="text-xl block mb-1">{bt.label.split(' ')[0]}</span>
                <span className="text-xs font-medium">{bt.label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
