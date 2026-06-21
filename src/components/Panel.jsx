export function Panel({ title, meta, children, style }) {
  return (
    <section style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', ...style }}>
      {title && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>{title}</h2>
          {meta && <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{meta}</span>}
        </header>
      )}
      <div style={{ padding: 'var(--space-5)' }}>{children}</div>
    </section>
  );
}
