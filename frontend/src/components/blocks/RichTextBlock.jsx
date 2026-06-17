import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RichTextBlock({ data }) {
  return (
    <div className="markdown-body py-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {data.content || ''}
      </ReactMarkdown>
    </div>
  );
}
