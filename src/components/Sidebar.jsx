import { NavLink } from 'react-router-dom';
import { Pulse } from './Pulse';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: '◆' },
  { to: '/infrastructure', label: 'Infrastructure', icon: '▣' },
  { to: '/pipelines', label: 'Pipelines', icon: '▶' },
  { to: '/alerts', label: 'Alerts', icon: '▲' },
  { to: '/costs', label: 'Costs', icon: '◎' },
];

export function Sidebar({ overallStatus = 'healthy' }) {
  return (
    <nav style={{ width: 'var(--rail-width)', flexShrink: 0, background: 'var(--bg-panel)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
        <Pulse size={24} active={overallStatus !== 'critical'} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>CloudPulse</span>
      </div>
      <div style={{ padding: 'var(--space-3)', flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', marginBottom: '2px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 500, textDecoration: 'none', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', background: isActive ? 'var(--accent-dim)' : 'transparent', borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent', transition: 'background 0.12s ease, color 0.12s ease' })}>
            <span style={{ fontSize: '12px', opacity: 0.7 }} aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
      <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>v0.1.0 · ap-south-1</div>
    </nav>
  );
}
