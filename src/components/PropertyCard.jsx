import { money } from "../utils";
export default function PropertyCard({ property, onClick }) {
  return (
    <article className="property-card">
      <div className="property-image">
        <span className="eco-badge">★ {property.eco}/5</span><span className="house-emoji">🏡</span>
        <span className={`availability ${property.status === "Occupied" ? "occupied" : "available"}`}>{property.status || "Available"}</span>
      </div>
      <div className="property-body">
        <p className="location">📍 {property.location}</p><h3>{property.name}</h3><p className="muted">{property.type}</p>
        <div className="card-bottom"><strong>{money(property.rent)}<small>/month</small></strong><button className="outline" onClick={() => onClick(property)}>View</button></div>
      </div>
    </article>
  );
}
