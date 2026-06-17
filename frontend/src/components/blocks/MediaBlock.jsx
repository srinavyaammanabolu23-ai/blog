export default function MediaBlock({ data }) {
  const alignment = data.align || 'center';
  const alignClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[alignment] || 'mx-auto';

  return (
    <figure className={`py-4 flex flex-col ${alignClass}`} style={{ maxWidth: '100%' }}>
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: '1px solid var(--glass-border)' }}
      >
        <img
          src={data.url}
          alt={data.caption || 'Blog image'}
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
          style={{ maxHeight: '500px' }}
          loading="lazy"
        />
      </div>
      {data.caption && (
        <figcaption
          className="text-sm mt-3 text-center italic"
          style={{ color: 'var(--text-muted)' }}
        >
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}
