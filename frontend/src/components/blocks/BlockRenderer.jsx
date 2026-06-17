import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function HeaderBlock({ data }) {
  const Tag = `h${data.level || 2}`;
  return (
    <Tag className="font-display font-black uppercase text-black mb-6 border-b-[4px] border-black pb-2 inline-block" style={{ marginTop: '1.5em' }}>
      {data.text}
    </Tag>
  );
}

function RichTextBlock({ data }) {
  return (
    <div className="mb-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {data.content}
      </ReactMarkdown>
    </div>
  );
}

function MediaBlock({ data }) {
  return (
    <figure className="my-12">
      <div className="brutal-card overflow-hidden">
        <img
          src={data.url}
          alt={data.caption || 'Media'}
          className="w-full h-auto object-cover border-b-[3px] border-black"
          loading="lazy"
        />
        {data.caption && (
          <figcaption className="text-center font-mono-bold text-xs uppercase p-3 bg-[var(--accent-1)] text-black">
            {data.caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

function CodeBlock({ data }) {
  return (
    <div className="my-10 brutal-card bg-[#000] text-[#00ff00] relative">
      {data.language && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--accent-2)] text-white text-[10px] font-mono-bold uppercase border-l-[3px] border-b-[3px] border-black">
          {data.language}
        </div>
      )}
      <pre className="p-6 overflow-x-auto text-sm font-mono-bold leading-relaxed">
        <code>{data.code}</code>
      </pre>
    </div>
  );
}

const BLOCK_MAP = {
  header: HeaderBlock,
  richtext: RichTextBlock,
  media: MediaBlock,
  code: CodeBlock,
};

export default function BlockRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="flex flex-col">
      {blocks.map((block, index) => {
        const BlockComponent = BLOCK_MAP[block.type];
        if (!BlockComponent) return null;
        return <BlockComponent key={block.id || index} data={block.data} />;
      })}
    </div>
  );
}
