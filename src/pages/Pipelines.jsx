import { api } from '../services/api';
import { usePolling } from '../hooks/usePolling';
import { Panel } from '../components/Panel';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

export function Pipelines() {
  const pipelines = usePolling(api.getPipelines, 15000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Pipelines</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>CI/CD run status across CloudPulse's deployment pipelines</p>
      </div>
      <Panel title="Recent runs">
        {pipelines.loading ? <LoadingState /> : pipelines.error ? <ErrorState message="Could not reach /pipelines" /> : (pipelines.data || []).length === 0 ? <EmptyState message="No pipeline runs recorded yet." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pipelines.data.map((run, i) => (
              <div key={run.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{run.name || run.pipeline_name || `Run #${i + 1}`}</div>
                  {run.commit && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{run.commit.slice(0, 8)}</div>}
                </div>
                <StatusBadge status={run.status} />
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
