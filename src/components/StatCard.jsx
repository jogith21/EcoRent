export default function StatCard({ label, value, helper, icon, tone = "" }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}
