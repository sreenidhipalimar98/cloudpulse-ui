export function Pulse({ size = 20, active = true, color = 'var(--status-healthy)' }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 40 20" fill="none" role="img" aria-label={active ? 'Active pulse' : 'No pulse'}>
      <path d="M0 10 H10 L14 2 L18 18 L22 10 H40" stroke={active ? color : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" style={active ? { strokeDasharray: 60, strokeDashoffset: 60, animation: 'pulse-draw 2.4s ease-in-out infinite' } : undefined} />
      <style>{`@keyframes pulse-draw { 0% { stroke-dashoffset: 60; opacity: 0.3; } 50% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: -60; opacity: 0.3; } }`}</style>
    </svg>
  );
}
