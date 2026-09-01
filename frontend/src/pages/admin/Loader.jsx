export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{
        width: 36, height: 36, border: '3px solid #1e3a5f', borderTopColor: '#2563eb',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{ color: '#64748b', fontSize: 14 }}>{text}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
