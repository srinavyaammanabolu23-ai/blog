import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { posts as postsApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import BlockRenderer from '../blocks/BlockRenderer';
import CommentThread from '../comments/CommentThread';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    postsApi.get(slug)
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="skeleton-brutal h-16 w-3/4 mb-6 border-[3px] border-black" />
        <div className="skeleton-brutal h-8 w-1/2 mb-16 border-[3px] border-black" />
        <div className="skeleton-brutal h-[500px] w-full border-[3px] border-black shadow-[8px_8px_0px_#000]" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-24 text-center">
        <div className="brutal-card p-16 inline-block bg-white text-center">
          <h1 className="font-display font-black text-5xl uppercase mb-6">Story Not Found</h1>
          <p className="font-mono-bold mb-10 text-xl">{error || "The narrative you seek is unavailable."}</p>
          <Link to="/" className="btn-brutal inline-block no-underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const canEdit = user && (user.id === post.author_id || user.role === 'admin');

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 pb-24">
      {/* Brutalist Header */}
      <header className="mb-16 brutal-card p-8 sm:p-16 bg-[var(--accent-2)]">
        <div className="flex items-center gap-3 mb-6 font-mono-bold text-xs uppercase">
          <span className="bg-black text-white px-2 py-1">{date}</span>
          <span className="bg-black text-white px-2 py-1">{post.blocks?.length || 0} BLOCKS</span>
        </div>
        
        <h1 className="font-display font-black text-5xl sm:text-7xl uppercase leading-[0.9] text-white mb-8" style={{ textShadow: '4px 4px 0px #000' }}>
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-xl font-bold text-black border-l-[6px] border-black pl-4 bg-white p-4 shadow-[4px_4px_0px_#000]">
            {post.summary}
          </p>
        )}

        <div className="mt-12 flex items-center justify-between border-t-[4px] border-black pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center font-display font-black text-xl bg-[var(--accent-1)] shadow-[2px_2px_0px_#000]">
              {post.author_username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-black uppercase text-xl bg-white px-2">
                {post.author_username || 'Unknown'}
              </p>
              <p className="font-mono-bold text-xs text-white bg-black inline-block px-1 mt-1">AUTHOR</p>
            </div>
          </div>
          
          {canEdit && (
            <button
              onClick={() => navigate(`/edit/${post.slug}`)}
              className="btn-brutal bg-white text-xs"
            >
              Edit Story
            </button>
          )}
        </div>
      </header>

      {/* Content Blocks */}
      <div className="markdown-brutal brutal-card p-8 sm:p-16 bg-white mb-20">
        <BlockRenderer blocks={post.blocks} />
      </div>

      {/* Comments Section */}
      <section className="brutal-card p-8 sm:p-12 bg-[var(--accent-3)]">
        <div className="border-b-[4px] border-black pb-4 mb-8">
          <h3 className="font-display font-black text-4xl uppercase text-black" style={{ textShadow: '2px 2px 0px #fff' }}>Discourse</h3>
        </div>
        <CommentThread postId={post.id} />
      </section>
    </article>
  );
}
