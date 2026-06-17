import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { posts as postsApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import BlockEditor from '../components/blocks/BlockEditor';

export default function EditPostPage() {
  const { slug } = useParams();
  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const addToast = useToast();

  useEffect(() => {
    postsApi.get(slug)
      .then((post) => {
        setPostId(post.id);
        setTitle(post.title);
        setSummary(post.summary || '');
        setBlocks(post.blocks || []);
      })
      .catch(() => addToast('Failed to load post', 'error'))
      .finally(() => setLoading(false));
  }, [slug, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { addToast('Title is required', 'error'); return; }

    setSaving(true);
    try {
      const updated = await postsApi.update(postId, { title, summary, blocks });
      addToast('Post updated! ✅');
      navigate(`/post/${updated.slug}`);
    } catch (err) {
      addToast(err.message || 'Failed to update post', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    try {
      await postsApi.delete(postId);
      addToast('Post deleted');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Failed to delete post', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="skeleton-brutal h-32 w-full mb-8 border-[4px] border-black" />
        <div className="skeleton-brutal h-[600px] w-full border-[4px] border-black shadow-[8px_8px_0px_#000]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 brutal-card p-8 bg-[var(--accent-2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-black text-5xl sm:text-6xl uppercase text-white mb-3" style={{ textShadow: '4px 4px 0px #000' }}>
              Revise Post
            </h1>
            <p className="font-mono-bold text-black text-lg bg-white inline-block px-2 border-2 border-black">
              UPDATE YOUR NARRATIVE.
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="btn-brutal bg-white text-black hover:bg-red-500 hover:text-white border-[3px] shadow-[4px_4px_0px_#000] text-sm py-2"
          >
            DELETE POST
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="brutal-card p-8 bg-white">
            <label className="block text-xl font-display font-black uppercase text-black mb-4 border-b-4 border-black pb-2">
              Post Title
            </label>
            <input
              id="edit-post-title"
              className="input-field-brutal text-2xl font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="brutal-card p-8 bg-white">
            <label className="block text-xl font-display font-black uppercase text-black mb-4 border-b-4 border-black pb-2">
              Summary
            </label>
            <textarea
              id="edit-post-summary"
              className="input-field-brutal"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="brutal-card p-8 bg-white">
            <label className="block text-xl font-display font-black uppercase text-black mb-6 border-b-4 border-black pb-2">
              Content Blocks
            </label>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6">
            <button type="button" onClick={() => navigate(`/post/${slug}`)} className="btn-brutal bg-white">
              CANCEL
            </button>
            <button type="submit" disabled={saving} className="btn-brutal btn-brutal-primary text-xl px-8 disabled:opacity-50">
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
