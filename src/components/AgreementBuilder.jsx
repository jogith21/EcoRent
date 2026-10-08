import { useEffect, useState } from "react";
import AgreementPreview from "./AgreementPreview";
import { emptyTenant, money } from "../utils";

export default function AgreementBuilder({ property, tenants, profile, onAddTenant, onSubmit }) {
  const [draft, setDraft] = useState({ propertyId:property.id, tenantId:tenants[0]?.id || "", tenantName:tenants[0]?.full_name || "", tenantPhone:tenants[0]?.phone || "", tenantEmail:tenants[0]?.email || "", startDate:new Date().toISOString().slice(0,10), endDate:new Date(Date.now()+31536000000).toISOString().slice(0,10), monthlyRent:property.rent, securityDeposit:property.deposit, noticePeriod:30, maintenance:1200 });
  const [showNewTenant, setShowNewTenant] = useState(tenants.length===0);
  const [newTenant, setNewTenant] = useState(emptyTenant);
  useEffect(()=>{ const current=tenants.find(t=>t.id===draft.tenantId); if(current) setDraft(prev=>({...prev,tenantName:current.full_name,tenantPhone:current.phone||"",tenantEmail:current.email||""})); },[draft.tenantId,tenants]);
  function setField(field,value){ setDraft(prev=>({...prev,[field]:value})); }
  async function submit(e){ e.preventDefault(); let tenantId=draft.tenantId; if(showNewTenant||!tenantId){ if(!newTenant.name||!newTenant.phone) return; const created=await onAddTenant(newTenant); if(!created) return; tenantId=created.id; setDraft(prev=>({...prev,tenantId,tenantName:created.full_name,tenantPhone:created.phone||"",tenantEmail:created.email||""})); } await onSubmit({...draft,tenantId,propertyId:property.id}); }
  const selectedTenant=tenants.find(t=>t.id===draft.tenantId);
  return (<div className="agreement-layout"><section className="panel form-card"><div className="page-title"><p className="eyebrow">RENTAL AGREEMENT</p><h1>Rent {property.name}</h1><p className="page-subtitle">Enter structured lease details once and generate a polished digital record.</p></div>
    <div className="owner-chip"><div className="avatar">RS</div><div><span>Landlord</span><strong>{profile?.full_name||"Raj Shekar"}</strong></div></div>
    <form onSubmit={submit}><div className="form-grid">
      <label>Tenant<select value={showNewTenant?"new":draft.tenantId} onChange={e=>{ if(e.target.value==="new"){setShowNewTenant(true);setField("tenantId","");}else{setShowNewTenant(false);setField("tenantId",e.target.value);} }}>{tenants.map(item=><option key={item.id} value={item.id}>{item.full_name}</option>)}<option value="new">+ Add new tenant</option></select></label>
      <label>Monthly rent<input type="number" value={draft.monthlyRent} onChange={e=>setField("monthlyRent",e.target.value)}/></label>
      {showNewTenant && <><label>Tenant name *<input required value={newTenant.name} onChange={e=>setNewTenant({...newTenant,name:e.target.value})} placeholder="Enter full name"/></label><label>Phone *<input required value={newTenant.phone} onChange={e=>setNewTenant({...newTenant,phone:e.target.value})} placeholder="+91…"/></label><label>Email<input type="email" value={newTenant.email} onChange={e=>setNewTenant({...newTenant,email:e.target.value})} placeholder="tenant@example.com"/></label></>}
      <label>Start date<input required type="date" value={draft.startDate} onChange={e=>setField("startDate",e.target.value)}/></label><label>End date<input required type="date" value={draft.endDate} onChange={e=>setField("endDate",e.target.value)}/></label>
      <label>Security deposit<input type="number" value={draft.securityDeposit} onChange={e=>setField("securityDeposit",e.target.value)}/></label><label>Notice period<input type="number" value={draft.noticePeriod} onChange={e=>setField("noticePeriod",e.target.value)}/></label><label>Maintenance / month<input type="number" value={draft.maintenance} onChange={e=>setField("maintenance",e.target.value)}/></label>
    </div><div className="agreement-summary"><strong>Agreement Summary</strong><span>{property.name} · {property.location}</span><span>{draft.tenantName||"Tenant"} · {draft.startDate} → {draft.endDate}</span><span>{money(draft.monthlyRent)} / month · Deposit {money(draft.securityDeposit)}</span></div><button className="primary full" type="submit">Create Rental Agreement</button></form>
  </section><AgreementPreview property={property} profile={profile} draft={draft} tenant={selectedTenant}/></div>);
}
