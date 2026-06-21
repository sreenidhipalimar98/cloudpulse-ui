import { api } from '../services/api';
import { usePolling } from '../hooks/usePolling';
import { Panel } from '../components/Panel';
import { MetricStat } from '../components/MetricStat';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

export function Overview() {
  const health = usePolling(api.getHealth, 10000);
  const ec2 = usePolling(api.getEc2Instances, 20000);
  const ecs = usePolling(api.getEcsServices, 20000);
  const rds = usePolling(api.getRdsInstances, 20000);
  const alerts = usePolling(api.getAlerts, 15000);

  const countByStatus = (items, status) => (items || []).filter((i) => i.status === status).length;
  const allResources = [...(ec2.data || []), ...(ecs.data || []), ...(rds.data || [])];
  const healthyCount = countByStatus(allResources, 'healthy');
  const totalCount = allResources.length;
  const activeAlerts = (alerts.data || []).filter((a) => a.status !== 'resolved');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Overview</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Live status across your AWS infrastructure and deployment pipelines</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <MetricStat label="API status" value={health.error ? 'DOWN' : health.data ? 'UP' : '...'} status={health.error ? 'critical' : health.data ? 'healthy' : undefined} />
        <MetricStat label="Resources healthy" value={totalCount > 0 ? `${healthyCount}/${totalCount}` : '\u2014'} status={totalCount === 0 ? undefined : healthyCount === totalCount ? 'healthy' : 'degraded'} />
        <MetricStat label="Active alerts" value={activeAlerts.length} status={activeAlerts.length === 0 ? 'healthy' : 'critical'} />
        <MetricStat label="EC2 instances" value={(ec2.data || []).length} unit="running" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Panel title="ECS services">
          {ecs.loading ? <LoadingState /> : ecs.error ? <ErrorState message="Could not reach /infrastructure/ecs" /> : (ecs.data || []).length === 0 ? <EmptyState message="No ECS services found." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {ecs.data.map((svc, i) => (<div key={svc.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{svc.name || svc.id}</span><StatusBadge status={svc.status} /></div>))}
            </div>
          )}
        </Panel>
        <Panel title="RDS instances">
          {rds.loading ? <LoadingState /> : rds.error ? <ErrorState message="Could not reach /infrastructure/rds" /> : (rds.data || []).length === 0 ? <EmptyState message="No RDS instances found." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {rds.data.map((db, i) => (<div key={db.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{db.name || db.id}</span><StatusBadge status={db.status} /></div>))}
            </div>
          )}
        </Panel>
        <Panel title="Recent alerts">
          {alerts.loading ? <LoadingState /> : alerts.error ? <ErrorState message="Could not reach /alerts" /> : activeAlerts.length === 0 ? <EmptyState message="No active alerts. Everything's quiet." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {activeAlerts.slice(0, 5).map((alert, i) => (<div key={alert.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{alert.message || alert.title}</span><StatusBadge status={alert.severity || 'critical'} /></div>))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
