import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CommentForm({ postId, parentId, onSubmit, onCancel, placeholder }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSubmit(content, parentId);
      setContent('');
      if (onCancel) onCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-1"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {user.username[0].toUpperCase()}
        </div>
        <textarea
          className="input-field flex-1"
          rows={parentId ? 2 : 3}
          placeholder={placeholder || 'Share your thoughts...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ resize: 'vertical', fontSize: '0.875rem' }}
        />
      </div>
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-xs"
            style={{ padding: '0.4rem 0.85rem' }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="btn-primary text-xs disabled:opacity-40"
          style={{ padding: '0.4rem 1rem' }}
        >
          {loading ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </button>
      </div>
    </form>
  );
}
