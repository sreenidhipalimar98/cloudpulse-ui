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

function formatDuration(seconds) {
  if (!seconds) return '';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function Pipelines() {
  const pipelines = usePolling(api.getPipelines, 30000);
  const commits = usePolling(api.getRecentCommits, 60000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Pipelines & Commits</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>CI/CD workflow runs and recent commits across all CloudPulse repos</p>
      </div>

      {/* GitHub Actions Workflow Runs */}
      <Panel title="CI/CD Runs (GitHub Actions)" meta={pipelines.lastUpdated ? `updated ${pipelines.lastUpdated.toLocaleTimeString()}` : ''}>
        {pipelines.loading ? <LoadingState /> : pipelines.error ? <ErrorState message="Could not reach /pipelines" /> : (pipelines.data || []).length === 0 ? <EmptyState message="No workflow runs found." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {pipelines.data.map((run, i) => (
              <a
                key={run.id || i}
                href={run.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${REPO_COLORS[run.repo] || 'var(--text-tertiary)'}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{run.name}</div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 3 }}>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{run.commit}</span>
                      <span>{run.author}</span>
                      {run.duration_seconds && <span>{formatDuration(run.duration_seconds)}</span>}
                      {run.started_at && <span>{new Date(run.started_at).toLocaleString()}</span>}
                    </div>
                    {run.message && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{run.message}</div>}
                  </div>
                  <StatusBadge status={run.status} />
                </div>
              </a>
            ))}
          </div>
        )}
      </Panel>

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
    </div>
  );
}
