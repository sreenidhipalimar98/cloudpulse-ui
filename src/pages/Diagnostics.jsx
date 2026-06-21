import { useState } from 'react';
import { api } from '../services/api';
import { usePolling } from '../hooks/usePolling';
import { Panel } from '../components/Panel';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

const LOG_LEVEL_COLORS = {
  error: 'var(--status-critical)',
  warning: 'var(--status-degraded)',
  info: 'var(--text-secondary)',
};

export function Diagnostics() {
  const ecs = usePolling(api.getEcsServices, 30000);
  const rds = usePolling(api.getRdsInstances, 30000);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedRds, setSelectedRds] = useState(null);
  const [ecsDiag, setEcsDiag] = useState(null);
  const [rdsDiag, setRdsDiag] = useState(null);
  const [loading, setLoading] = useState(false);

  const diagnoseEcs = async (serviceName) => {
    setSelectedService(serviceName);
    setSelectedRds(null);
    setLoading(true);
    try {
      const data = await api.getDiagnosticsEcs(serviceName);
      setEcsDiag(data);
    } catch (e) {
      setEcsDiag({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const diagnoseRds = async (instanceId) => {
    setSelectedRds(instanceId);
    setSelectedService(null);
    setLoading(true);
    try {
      const data = await api.getDiagnosticsRds(instanceId);
      setRdsDiag(data);
    } catch (e) {
      setRdsDiag({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Diagnostics</h1>
        <p style={{ margin: 'var(--space-1) 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Click a service to view application logs, stopped task reasons, and root cause data</p>
      </div>

      {/* Service selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Panel title="ECS Services">
          {ecs.loading ? <LoadingState /> : ecs.error ? <ErrorState message="Could not load ECS services" /> : (ecs.data || []).length === 0 ? <EmptyState message="No ECS services" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {ecs.data.map((svc) => (
                <button key={svc.name} onClick={() => diagnoseEcs(svc.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: selectedService === svc.name ? 'var(--accent-dim)' : 'var(--bg-elevated)', border: selectedService === svc.name ? '1px solid var(--accent)' : '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{svc.name}</span>
                  <StatusBadge status={svc.status} />
                </button>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="RDS Instances">
          {rds.loading ? <LoadingState /> : rds.error ? <ErrorState message="Could not load RDS instances" /> : (rds.data || []).length === 0 ? <EmptyState message="No RDS instances" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {rds.data.map((db) => (
                <button key={db.id} onClick={() => diagnoseRds(db.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: selectedRds === db.id ? 'var(--accent-dim)' : 'var(--bg-elevated)', border: selectedRds === db.id ? '1px solid var(--accent)' : '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{db.name}</span>
                  <StatusBadge status={db.status} />
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Diagnostics results */}
      {loading && <LoadingState />}

      {selectedService && ecsDiag && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Panel title={`Diagnostics: ${selectedService}`} meta={`${ecsDiag.running_count || 0}/${ecsDiag.desired_count || 0} tasks`}>
            {ecsDiag.error ? <ErrorState message={ecsDiag.error} /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

                {/* Stopped Tasks */}
                {ecsDiag.stopped_tasks?.length > 0 && (
                  <div>
                    <h3 style={{ margin: '0 0 var(--space-3)', fontSize: '13px', fontWeight: 600, color: 'var(--status-critical)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>⚠ Stopped Tasks (Root Cause)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {ecsDiag.stopped_tasks.map((task, i) => (
                        <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--status-critical-bg)', borderLeft: '3px solid var(--status-critical)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>Task: {task.task_id}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: 4, fontWeight: 500 }}>{task.stop_reason}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 2 }}>Exit code: {task.exit_code ?? 'N/A'} | Code: {task.stop_code} | Stopped: {task.stopped_at || 'unknown'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application Logs (the real logs) */}
                {ecsDiag.recent_logs?.length > 0 && (
                  <div>
                    <h3 style={{ margin: '0 0 var(--space-3)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Application Logs (last hour)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 500, overflowY: 'auto', background: 'var(--bg-base)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      {ecsDiag.recent_logs.map((log, i) => (
                        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.8, color: LOG_LEVEL_COLORS[log.level] || 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '2px 0' }}>
                          <span style={{ color: 'var(--text-tertiary)', marginRight: 8 }}>{log.timestamp.split('T')[1]?.slice(0, 8)}</span>
                          <span style={{ color: log.level === 'error' ? 'var(--status-critical)' : log.level === 'warning' ? 'var(--status-degraded)' : 'var(--accent)', marginRight: 8, fontWeight: 600 }}>[{log.level.toUpperCase()}]</span>
                          {log.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Logs (filtered) */}
                {ecsDiag.recent_errors?.length > 0 && (
                  <div>
                    <h3 style={{ margin: '0 0 var(--space-3)', fontSize: '13px', fontWeight: 600, color: 'var(--status-critical)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Errors & Exceptions Only</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 300, overflowY: 'auto', background: 'var(--bg-base)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(229, 72, 77, 0.3)' }}>
                      {ecsDiag.recent_errors.map((log, i) => (
                        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.8, color: 'var(--status-critical)', padding: '2px 0' }}>
                          <span style={{ color: 'var(--text-tertiary)', marginRight: 8 }}>{log.timestamp.split('T')[1]?.slice(0, 8)}</span>
                          {log.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Events */}
                {ecsDiag.events?.length > 0 && (
                  <div>
                    <h3 style={{ margin: '0 0 var(--space-3)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Service Events</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: 250, overflowY: 'auto' }}>
                      {ecsDiag.events.map((event, i) => (
                        <div key={i} style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                          <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginRight: 8 }}>{event.timestamp.split('T')[1]?.slice(0, 8)}</span>
                          <span style={{ color: 'var(--text-primary)' }}>{event.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!ecsDiag.stopped_tasks?.length && !ecsDiag.recent_errors?.length && !ecsDiag.recent_logs?.length && (
                  <EmptyState message="No issues detected. Service is running normally." />
                )}
              </div>
            )}
          </Panel>
        </div>
      )}

      {selectedRds && rdsDiag && !loading && (
        <Panel title={`RDS Diagnostics: ${selectedRds}`}>
          {rdsDiag.error ? <ErrorState message={rdsDiag.error} /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {rdsDiag.metrics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>CPU</div>
                    <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: (rdsDiag.metrics.cpu_percent || 0) > 80 ? 'var(--status-critical)' : 'var(--text-primary)' }}>{rdsDiag.metrics.cpu_percent ?? '—'}%</div>
                  </div>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Connections</div>
                    <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{rdsDiag.metrics.connections ?? '—'}</div>
                  </div>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Free Storage</div>
                    <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: (rdsDiag.metrics.free_storage_gb || 99) < 2 ? 'var(--status-critical)' : 'var(--text-primary)' }}>{rdsDiag.metrics.free_storage_gb ?? '—'} GB</div>
                  </div>
                </div>
              )}
              {rdsDiag.events?.length > 0 ? (
                <div>
                  <h3 style={{ margin: '0 0 var(--space-3)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Recent Events (24h)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {rdsDiag.events.map((event, i) => (
                      <div key={i} style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginRight: 8 }}>{event.timestamp.split('T')[0]}</span>
                        <span style={{ color: 'var(--accent)', marginRight: 8 }}>[{event.category}]</span>
                        <span style={{ color: 'var(--text-primary)' }}>{event.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <EmptyState message="No recent events. Database is running normally." />}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
