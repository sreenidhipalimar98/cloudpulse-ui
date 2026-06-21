import { api } from '../services/api';
import { usePolling } from '../hooks/usePolling';
import { Panel } from '../components/Panel';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

const REPO_COLORS = {
  'cloudpulse-api': 'var(--status-healthy)',
  'cloudpulse-ui': 'var(--accent)',
  'CloudPulse-Terraform': 'var(--status-degraded)',
};

export function Pipelines() {
  const pipelines = usePolling(api.getPipelines, 15000);
  const commits = usePolling(api.getRecentCommits, 60000); // poll every minute

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Pipelines & Commits</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Recent pushes to develop across all CloudPulse repositories</p>
      </div>

      {/* Recent Commits */}
      <Panel title="Recent Commits (develop)" meta={commits.lastUpdated ? `updated ${commits.lastUpdated.toLocaleTimeString()}` : ''}>
        {commits.loading ? <LoadingState /> : commits.error ? <ErrorState message="Could not reach /github/commits" /> : (commits.data || []).length === 0 ? <EmptyState message="No commits found." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {commits.data.map((commit, i) => (
              <a
                key={commit.full_sha || i}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${REPO_COLORS[commit.repo] || 'var(--text-tertiary)'}`,
                  transition: 'background 0.12s ease',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: REPO_COLORS[commit.repo] || 'var(--text-tertiary)', fontWeight: 600 }}>{commit.repo}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{commit.sha}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{commit.message}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {commit.author} • {new Date(commit.date).toLocaleString()}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </Panel>

      {/* Pipeline runs (placeholder until CodePipeline integration) */}
      <Panel title="Pipeline Runs">
        {pipelines.loading ? <LoadingState /> : pipelines.error ? <ErrorState message="Could not reach /pipelines" /> : (pipelines.data || []).length === 0 ? <EmptyState message="No pipeline runs recorded yet. Pushes to develop trigger CI/CD via GitHub Actions." /> : (
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
