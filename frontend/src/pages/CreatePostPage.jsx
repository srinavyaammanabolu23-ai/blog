import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { posts as postsApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import BlockEditor from '../components/blocks/BlockEditor';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const addToast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { addToast('Title is required', 'error'); return; }
    if (blocks.length === 0) { addToast('Add at least one content block', 'error'); return; }

    setSaving(true);
    try {
      const post = await postsApi.create({ title, summary, blocks });
      addToast('Post published! 🎉');
      navigate(`/post/${post.slug}`);
    } catch (err) {
      addToast(err.message || 'Failed to create post', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 brutal-card p-8 bg-[var(--accent-1)]">
          <h1 className="font-display font-black text-5xl sm:text-6xl uppercase text-black mb-3">
            Craft a Narrative
          </h1>
          <p className="font-mono-bold text-black text-lg bg-white inline-block px-2 border-2 border-black">
            BUILD YOUR POST USING CONTENT BLOCKS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="brutal-card p-8 bg-white">
            <label className="block text-xl font-display font-black uppercase text-black mb-4 border-b-4 border-black pb-2">
              Post Title
            </label>
            <input
              id="post-title"
              className="input-field-brutal text-2xl font-bold"
              placeholder="An eye-catching title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="brutal-card p-8 bg-white">
            <label className="block text-xl font-display font-black uppercase text-black mb-4 border-b-4 border-black pb-2">
              Summary <span className="text-xs font-mono-bold bg-black text-white px-2 py-1 ml-2 align-middle">OPTIONAL</span>
            </label>
            <textarea
              id="post-summary"
              className="input-field-brutal"
              rows={2}
              placeholder="A brief description of your post..."
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
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-brutal bg-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-brutal btn-brutal-primary text-xl px-8 disabled:opacity-50"
            >
              {saving ? 'PUBLISHING...' : 'PUBLISH POST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
