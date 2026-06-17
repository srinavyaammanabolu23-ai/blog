import { Link } from 'react-router-dom';

// Accent colours cycling per card index
const ACCENT_CYCLE = ['var(--accent-1)', 'var(--accent-3)', 'var(--accent-2)'];

export default function PostCard({ post, index = 0, stripMarkdown }) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Build plain-text excerpt: prefer summary, else first richtext block
  let rawExcerpt = post.summary || '';
  if (!rawExcerpt) {
    const textBlock = post.blocks?.find((b) => b.type === 'richtext');
    rawExcerpt = textBlock?.data?.content || '';
  }
  const excerpt = stripMarkdown
    ? stripMarkdown(rawExcerpt).slice(0, 130)
    : rawExcerpt.slice(0, 130);

  const accentColor = ACCENT_CYCLE[index % 3];
  const initials = post.author_username?.[0]?.toUpperCase() || '?';

  return (
    <Link to={`/post/${post.slug}`} className="block no-underline group h-full">
      <article className="brutal-card brutal-card-hover h-full flex flex-col bg-white overflow-hidden">

        {/* Coloured accent bar at top */}
        <div
          className="h-3 w-full border-b-[3px] border-black flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-mono-bold uppercase bg-black text-white px-2 py-[3px] tracking-wider">
              {date}
            </span>
            <div
              className="w-8 h-8 border-[2px] border-black flex items-center justify-center font-display font-bold text-sm text-black shadow-[2px_2px_0px_#000] flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {initials}
            </div>
          </div>

          {/* Title */}
          <h2 className="font-display font-black text-2xl leading-tight mb-4 text-black uppercase break-words group-hover:text-[var(--accent-2)] transition-colors duration-150">
            {post.title}
          </h2>

          {/* Excerpt — plain text, no markdown */}
          <p className="text-sm font-medium text-gray-700 leading-relaxed flex-1 mb-6 break-words">
            {excerpt}{rawExcerpt.length > 130 ? '…' : ''}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-[3px] border-black mt-auto">
            <span
              className="text-[10px] font-mono-bold uppercase tracking-widest group-hover:underline decoration-[3px] underline-offset-4"
            >
              Read Story →
            </span>
            <div className="flex gap-2">
              <span className="text-[9px] font-mono-bold bg-black text-white px-2 py-[2px]">
                {post.blocks?.length || 0} BLK
              </span>
              <span className="text-[9px] font-mono-bold bg-black text-white px-2 py-[2px]">
                {post.comment_count || 0} CMT
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
