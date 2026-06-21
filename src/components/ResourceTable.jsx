import { StatusBadge } from './StatusBadge';

export function ResourceTable({ columns, rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-subtle)' }}>{col.label}</th>
            ))}
            <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-subtle)' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: col.mono ? 'var(--font-mono)' : 'var(--font-sans)' }}>{row[col.key] ?? '—'}</td>
              ))}
              <td style={{ padding: 'var(--space-3)' }}><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
