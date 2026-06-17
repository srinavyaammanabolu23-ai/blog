import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, children, onReply, onDelete, onVote }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [voteAnimating, setVoteAnimating] = useState(null); // 'up' | 'down' | null
  const { user } = useAuth();

  const hasChildren = children && children.length > 0;
  const timeAgo = formatTimeAgo(comment.created_at);

  const handleVote = (value) => {
    setVoteAnimating(value === 1 ? 'up' : 'down');
    setTimeout(() => setVoteAnimating(null), 300);
    onVote(comment.id, value);
  };

  return (
    <div className="relative">
      {/* Thread line for nested comments */}
      {hasChildren && !collapsed && <div className="comment-thread-line" />}

      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
          style={{
            background: comment.author_avatar
              ? `url(${comment.author_avatar}) center/cover`
              : 'var(--gradient-primary)',
          }}
        >
          {!comment.author_avatar && (comment.author_username?.[0]?.toUpperCase() || '?')}
        </div>

        <div className="flex-1 min-w-0">
          {/* Comment header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {comment.author_username || 'Anonymous'}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {timeAgo}
            </span>
          </div>

          {/* Comment body */}
          <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {comment.content}
          </p>

          {/* Actions bar */}
          <div className="flex items-center gap-3 mt-2">
            {/* Upvote */}
            <button
              onClick={() => handleVote(1)}
              className={`flex items-center gap-1 text-xs transition-all duration-200 cursor-pointer ${voteAnimating === 'up' ? 'vote-pulse' : ''}`}
              style={{
                color: comment.user_vote === 1 ? '#8b5cf6' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                padding: '2px 6px',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => { if (comment.user_vote !== 1) e.target.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={(e) => { if (comment.user_vote !== 1) e.target.style.color = 'var(--text-muted)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={comment.user_vote === 1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>

            {/* Score */}
            <span
              className="text-xs font-semibold min-w-[16px] text-center"
              style={{
                color: comment.score > 0 ? '#8b5cf6' : comment.score < 0 ? '#ef4444' : 'var(--text-muted)',
              }}
            >
              {comment.score}
            </span>

            {/* Downvote */}
            <button
              onClick={() => handleVote(-1)}
              className={`flex items-center gap-1 text-xs transition-all duration-200 cursor-pointer ${voteAnimating === 'down' ? 'vote-pulse' : ''}`}
              style={{
                color: comment.user_vote === -1 ? '#ef4444' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                padding: '2px 6px',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => { if (comment.user_vote !== -1) e.target.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={(e) => { if (comment.user_vote !== -1) e.target.style.color = 'var(--text-muted)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={comment.user_vote === -1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </button>

            {/* Reply */}
            {user && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-xs transition-colors duration-200 cursor-pointer"
                style={{
                  color: showReply ? '#8b5cf6' : 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  padding: '2px 6px',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.target.style.color = showReply ? '#8b5cf6' : 'var(--text-muted)')}
              >
                Reply
              </button>
            )}

            {/* Delete (owner / admin) */}
            {user && (user.id === comment.author_id || user.role === 'admin') && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-xs transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', padding: '2px 6px' }}
                onMouseEnter={(e) => (e.target.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
              >
                Delete
              </button>
            )}

            {/* Collapse toggle */}
            {hasChildren && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-xs transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', padding: '2px 6px' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
              >
                {collapsed ? `▸ Show ${children.length} ${children.length === 1 ? 'reply' : 'replies'}` : '▾ Collapse'}
              </button>
            )}
          </div>

          {/* Inline reply form */}
          {showReply && (
            <div className="mt-3">
              <CommentForm
                parentId={comment.id}
                onSubmit={(content, parentId) => {
                  onReply(content, parentId);
                  setShowReply(false);
                }}
                onCancel={() => setShowReply(false)}
                placeholder={`Reply to ${comment.author_username}...`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {hasChildren && !collapsed && (
        <div className="ml-12 mt-3 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Simple relative time formatter
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
