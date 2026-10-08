export default function QuickAction({ title, icon, onClick }) {
  return <button className="quick-action" onClick={onClick}><span>{icon}</span><strong>{title}</strong><small>Open →</small></button>;
}
