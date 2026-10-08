import { money } from "../utils";
export default function AgreementPreview({ property, profile, draft, tenant }) {
  return (<section className="panel agreement-preview">
    <div className="panel-header"><div><h3>Live agreement preview</h3><p>Updates as you fill the form. Use the browser print dialog to save a PDF.</p></div><button className="secondary" type="button" onClick={()=>window.print()}>Print / Save PDF</button></div>
    <div className="document-paper">
      <div className="document-topline">ECORENT · DIGITAL RENTAL AGREEMENT</div><h2>Rental Agreement</h2>
      <p>This agreement is entered into between <strong>{profile?.full_name || "Raj Shekar"}</strong> (Landlord) and <strong>{draft.tenantName || tenant?.full_name || "Tenant"}</strong> (Tenant).</p>
      <div className="doc-grid">
        <div><span>Property</span><strong>{property.name}</strong></div><div><span>Location</span><strong>{property.address || property.location}</strong></div>
        <div><span>Monthly rent</span><strong>{money(draft.monthlyRent)}</strong></div><div><span>Security deposit</span><strong>{money(draft.securityDeposit)}</strong></div>
        <div><span>Lease start</span><strong>{draft.startDate}</strong></div><div><span>Lease end</span><strong>{draft.endDate}</strong></div>
        <div><span>Notice period</span><strong>{draft.noticePeriod} days</strong></div><div><span>Maintenance</span><strong>{money(draft.maintenance)}/month</strong></div>
      </div>
      <div className="doc-section"><strong>Key terms</strong><p>The tenant agrees to pay the monthly rent on time, maintain the property in reasonable condition, and provide notice according to the agreed notice period. This screen is a digital agreement-management preview and should be reviewed before signing.</p></div>
      <div className="signature-row"><div><span>Landlord</span><strong>{profile?.full_name || "Raj Shekar"}</strong></div><div><span>Tenant</span><strong>{draft.tenantName || tenant?.full_name || "Tenant"}</strong></div></div>
    </div>
  </section>);
}
