const STATUS_CONFIG = {
  healthy: { color: 'var(--status-healthy)', bg: 'var(--status-healthy-bg)', label: 'Healthy' },
  degraded: { color: 'var(--status-degraded)', bg: 'var(--status-degraded-bg)', label: 'Degraded' },
  critical: { color: 'var(--status-critical)', bg: 'var(--status-critical-bg)', label: 'Critical' },
  unknown: { color: 'var(--status-unknown)', bg: 'var(--status-unknown-bg)', label: 'Unknown' },
};

export function StatusBadge({ status = 'unknown', showLabel = true }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: '3px 10px', borderRadius: '999px', background: config.bg, color: config.color, fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: config.color, flexShrink: 0 }} aria-hidden="true" />
      {showLabel && config.label}
    </span>
  );
}
