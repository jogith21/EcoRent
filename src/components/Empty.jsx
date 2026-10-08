export default function Empty({ text, action, onClick }) {
  return (<div className="empty"><div>📄</div><h3>{text}</h3><p>{action}</p>{onClick && <button className="primary" onClick={onClick}>Get started</button>}</div>);
}
