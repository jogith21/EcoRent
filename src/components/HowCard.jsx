export default function HowCard({ number, title, text, icon }) {
  return (
    <div className="how-card">
      <div className="how-icon">{icon}</div>
      <div className="how-number">{number}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
