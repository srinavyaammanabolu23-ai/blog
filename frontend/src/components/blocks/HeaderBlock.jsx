export default function HeaderBlock({ data }) {
  return (
    <div className="py-4">
      {data.title && (
        <h1
          className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {data.title}
        </h1>
      )}
      {data.subtitle && (
        <p
          className="text-lg sm:text-xl font-light leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {data.subtitle}
        </p>
      )}
    </div>
  );
}
