import { api } from '../services/api';
import { usePolling } from '../hooks/usePolling';
import { Panel } from '../components/Panel';
import { MetricStat } from '../components/MetricStat';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

export function Costs() {
  const summary = usePolling(api.getCostSummary, 3600000); // 1 hour
  const byService = usePolling(api.getCostByService, 3600000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Costs</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Month-to-date AWS spending breakdown by service</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <MetricStat
          label="Month-to-date"
          value={summary.data ? `$${summary.data.total_cost}` : '...'}
          status={summary.data?.status}
          unit="USD"
        />
        <MetricStat
          label="Services tracked"
          value={(byService.data || []).length}
          unit="services"
        />
        <MetricStat
          label="Period"
          value={summary.data?.period ? summary.data.period.split(' to ')[0] : '...'}
          unit="to today"
        />
      </div>

      <Panel title="Cost by service" meta={byService.lastUpdated ? `updated ${byService.lastUpdated.toLocaleTimeString()}` : ''}>
        {byService.loading ? (
          <LoadingState />
        ) : byService.error ? (
          <ErrorState message="Could not reach /costs/by-service" />
        ) : (byService.data || []).length === 0 ? (
          <EmptyState message="No cost data available yet. AWS updates billing data every 8-24 hours." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-subtle)' }}>Service</th>
                  <th style={{ textAlign: 'right', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-subtle)' }}>Cost (USD)</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--border-subtle)', width: '40%' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {byService.data.map((svc, i) => {
                  const maxCost = byService.data[0]?.cost || 1;
                  const pct = (svc.cost / maxCost) * 100;
                  return (
                    <tr key={svc.name || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{svc.name}</td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>${svc.cost.toFixed(2)}</td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width 0.3s ease' }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
