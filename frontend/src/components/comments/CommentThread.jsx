import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { comments as commentsApi } from '../../api/client';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

/**
 * CommentThread — fetches flat comments from API, builds tree, renders recursively.
 */
export default function CommentThread({ postId }) {
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const addToast = useToast();

  const fetchComments = useCallback(async () => {
    try {
      const data = await commentsApi.list(postId);
      setCommentList(data);
    } catch {
      // silently fail — post might have no comments
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // Build tree from flat list
  const buildTree = (comments) => {
    const map = {};
    const roots = [];
    comments.forEach((c) => { map[c.id] = { ...c, children: [] }; });
    comments.forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  };

  const handleSubmit = async (content, parentId) => {
    try {
      await commentsApi.create(postId, { content, parent_id: parentId || null });
      addToast('Comment posted!');
      await fetchComments();
    } catch (err) {
      addToast(err.message || 'Failed to post comment', 'error');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentsApi.delete(postId, commentId);
      addToast('Comment deleted');
      await fetchComments();
    } catch (err) {
      addToast(err.message || 'Failed to delete comment', 'error');
    }
  };

  const handleVote = async (commentId, value) => {
    if (!user) {
      addToast('Please sign in to vote', 'info');
      return;
    }
    try {
      await commentsApi.vote(postId, commentId, value);
      await fetchComments();
    } catch (err) {
      addToast(err.message || 'Failed to vote', 'error');
    }
  };

  const tree = buildTree(commentList);

  const renderNode = (node) => (
    <CommentItem
      key={node.id}
      comment={node}
      onReply={handleSubmit}
      onDelete={handleDelete}
      onVote={handleVote}
    >
      {node.children.map(renderNode)}
    </CommentItem>
  );

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Comments
        <span
          className="text-sm font-normal px-2 py-0.5 rounded-full ml-1"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}
        >
          {commentList.length}
        </span>
      </h2>

      {/* New comment form (top-level) */}
      {user ? (
        <div className="mb-8">
          <CommentForm postId={postId} onSubmit={handleSubmit} placeholder="Join the discussion..." />
        </div>
      ) : (
        <div
          className="mb-8 p-4 rounded-xl text-center text-sm"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
        >
          Sign in to join the conversation
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : tree.length === 0 ? (
        <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {tree.map(renderNode)}
        </div>
      )}
    </div>
  );
}
