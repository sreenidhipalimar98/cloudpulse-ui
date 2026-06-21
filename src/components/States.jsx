export function ErrorState({ message = 'This panel could not load data.' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)', padding: 'var(--space-4)', background: 'var(--status-critical-bg)', border: '1px solid rgba(229, 72, 77, 0.3)', borderRadius: 'var(--radius-sm)' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--status-critical)' }}>Connection failed</span>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{message}</span>
    </div>
  );
}

export function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div style={{ padding: 'var(--space-6) var(--space-4)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>{message}</div>
  );
}

export function LoadingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 16, borderRadius: 4, background: 'var(--bg-elevated)', opacity: 1 - i * 0.2, animation: 'skeleton-pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
      ))}
      <style>{`@keyframes skeleton-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
    </div>
  );
}
