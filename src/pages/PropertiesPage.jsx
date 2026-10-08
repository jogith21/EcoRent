import PageTitle from "../components/PageTitle";
import PropertyCard from "../components/PropertyCard";
import PropertyManager from "../components/PropertyManager";
export default function PropertiesPage({ currentProperties, search, setSearch, filter, setFilter, openProperty, session, addProperty }) { return <main className="page">
<PageTitle eyebrow="PROPERTIES" title="Choose your eco-friendly home" subtitle="Browse the catalogue, then jump straight into the rental agreement workflow."/>
<div className="toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by property, city or type…"/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All availability</option><option value="available">Available</option><option value="occupied">Occupied</option></select></div>
<div className="property-grid">{currentProperties.map(p=><PropertyCard key={p.id} property={p} onClick={openProperty}/>)}</div>
{session && <PropertyManager onSave={addProperty}/>}</main>; }
