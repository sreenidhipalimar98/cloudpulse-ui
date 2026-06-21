import { api } from '../services/api';
import { usePolling } from '../hooks/usePolling';
import { Panel } from '../components/Panel';
import { ResourceTable } from '../components/ResourceTable';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

const EC2_COLUMNS = [
  { key: 'id', label: 'Instance ID', mono: true },
  { key: 'instance_type', label: 'Type', mono: true },
  { key: 'availability_zone', label: 'AZ' },
];
const ECS_COLUMNS = [
  { key: 'name', label: 'Service' },
  { key: 'cluster', label: 'Cluster' },
  { key: 'running_count', label: 'Running tasks', mono: true },
];
const RDS_COLUMNS = [
  { key: 'name', label: 'Identifier', mono: true },
  { key: 'engine', label: 'Engine' },
  { key: 'instance_class', label: 'Class', mono: true },
];

export function Infrastructure() {
  const ec2 = usePolling(api.getEc2Instances, 20000);
  const ecs = usePolling(api.getEcsServices, 20000);
  const rds = usePolling(api.getRdsInstances, 20000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Infrastructure</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Live resource state, queried directly from AWS via the CloudPulse API</p>
      </div>
      <Panel title="EC2 instances">
        {ec2.loading ? <LoadingState /> : ec2.error ? <ErrorState message="Could not reach /infrastructure/ec2" /> : (ec2.data || []).length === 0 ? <EmptyState message="No EC2 instances found." /> : <ResourceTable columns={EC2_COLUMNS} rows={ec2.data} />}
      </Panel>
      <Panel title="ECS services">
        {ecs.loading ? <LoadingState /> : ecs.error ? <ErrorState message="Could not reach /infrastructure/ecs" /> : (ecs.data || []).length === 0 ? <EmptyState message="No ECS services found." /> : <ResourceTable columns={ECS_COLUMNS} rows={ecs.data} />}
      </Panel>
      <Panel title="RDS instances">
        {rds.loading ? <LoadingState /> : rds.error ? <ErrorState message="Could not reach /infrastructure/rds" /> : (rds.data || []).length === 0 ? <EmptyState message="No RDS instances found." /> : <ResourceTable columns={RDS_COLUMNS} rows={rds.data} />}
      </Panel>
    </div>
  );
}
