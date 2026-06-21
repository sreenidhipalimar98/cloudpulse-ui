import { api } from '../services/api';
import { usePolling } from '../hooks/usePolling';
import { Panel } from '../components/Panel';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

const SEVERITY_BORDER_COLOR = {
  critical: 'var(--status-critical)',
  degraded: 'var(--status-degraded)',
  healthy: 'var(--status-healthy)',
};

export function Alerts() {
  const alerts = usePolling(api.getAlerts, 15000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Alerts</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Active and recent alerts across monitored infrastructure</p>
      </div>
      <Panel title="All alerts">
        {alerts.loading ? <LoadingState /> : alerts.error ? <ErrorState message="Could not reach /alerts" /> : (alerts.data || []).length === 0 ? <EmptyState message="No alerts. Everything's quiet." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {alerts.data.map((alert, i) => (
              <div key={alert.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${SEVERITY_BORDER_COLOR[alert.severity] || SEVERITY_BORDER_COLOR.critical}` }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{alert.title || alert.message}</div>
                  {alert.resource && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 4 }}>{alert.resource}</div>}
                </div>
                <StatusBadge status={alert.severity || 'critical'} />
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
