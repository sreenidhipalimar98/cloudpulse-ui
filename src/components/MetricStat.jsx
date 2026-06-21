export function MetricStat({ label, value, unit, status }) {
  const statusColor = status ? { healthy: 'var(--status-healthy)', degraded: 'var(--status-degraded)', critical: 'var(--status-critical)' }[status] : 'var(--text-primary)';
  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 700, color: statusColor, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{unit}</span>}
      </div>
    </div>
  );
}
