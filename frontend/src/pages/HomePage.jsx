import { useState, useEffect } from 'react';
import { posts as postsApi } from '../api/client';
import PostCard from '../components/posts/PostCard';

// Strip markdown syntax so excerpts show as plain text
function stripMarkdown(text = '') {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // bold
    .replace(/\*(.+?)\*/g, '$1')       // italic
    .replace(/`(.+?)`/g, '$1')         // inline code
    .replace(/#{1,6}\s/g, '')          // headings
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/\n+/g, ' ')              // newlines → space
    .trim();
}

export default function HomePage() {
  const [data, setData] = useState({ posts: [], total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 9;

  useEffect(() => {
    setLoading(true);
    postsApi.list(page, perPage)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(data.total / perPage);

  return (
    <div className="relative z-10">

      {/* ── Full-Viewport Hero ───────────────────────────────────────────── */}
      <section
        style={{ minHeight: 'calc(100vh - 80px)' }}
        className="flex flex-col justify-center px-6 md:px-16 border-b-[4px] border-black bg-[var(--accent-1)] relative overflow-hidden"
      >
        {/* decorative corner label */}
        <div
          className="absolute top-6 right-6 text-[10px] font-mono-bold bg-black text-white px-3 py-1 rotate-0"
          style={{ letterSpacing: '0.2em' }}
        >
          EST. 2026
        </div>

        {/* large rotated watermark */}
        <span
          className="absolute -right-12 top-1/2 -translate-y-1/2 text-[12rem] font-black uppercase text-black/5 select-none pointer-events-none leading-none"
          style={{ fontFamily: 'var(--font-display)' }}
          aria-hidden="true"
        >
          BLOG
        </span>

        <div className="max-w-7xl w-full mx-auto">
          <div className="inline-block bg-black text-white px-4 py-1 mb-8 font-mono-bold text-sm tracking-widest">
            THE FUTURE OF PUBLISHING
          </div>

          <h1
            className="font-display font-black uppercase text-black mb-8 leading-[0.95]"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
          >
            IDEAS THAT<br />
            <span className="bg-[var(--accent-2)] text-white px-3">BREAK</span>{' '}
            THE GRID.
          </h1>

          <p
            className="text-xl sm:text-2xl font-bold text-black max-w-2xl border-l-[5px] border-black pl-5"
            style={{ lineHeight: 1.5 }}
          >
            A brutal, bold storytelling platform for the modern web.
            No soft shadows. No gradients. Just content.
          </p>

          {/* scroll hint */}
          <div className="mt-16 flex items-center gap-3">
            <div className="w-10 h-[3px] bg-black" />
            <span className="font-mono-bold text-xs text-black tracking-[0.2em] uppercase">
              Scroll to read
            </span>
          </div>
        </div>
      </section>

      {/* ── Posts Grid ──────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto">

        {/* section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="font-mono-bold text-xs tracking-[0.25em] uppercase text-black bg-[var(--accent-3)] px-3 py-1 border-[2px] border-black shadow-[3px_3px_0px_#000]">
            Latest Stories
          </span>
          <div className="flex-1 h-[3px] bg-black" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-brutal border-[3px] border-black h-[400px] w-full" />
            ))}
          </div>
        ) : data.posts.length === 0 ? (
          <div className="text-center py-32 border-[4px] border-black bg-white shadow-[8px_8px_0px_#000]">
            <span className="font-display font-black uppercase text-5xl mb-4 block">A Blank Canvas</span>
            <p className="font-mono-bold text-xl">Be the first to publish a story.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {data.posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} stripMarkdown={stripMarkdown} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-brutal text-xs disabled:opacity-30 disabled:pointer-events-none"
                >
                  PREV
                </button>
                <div className="flex items-center gap-2 font-display text-xl font-bold border-[3px] border-black px-4 py-1 bg-white shadow-[4px_4px_0px_#000]">
                  <span>{page}</span>
                  <span className="text-gray-400">/</span>
                  <span>{totalPages}</span>
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="btn-brutal text-xs disabled:opacity-30 disabled:pointer-events-none"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
