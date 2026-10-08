import { useState } from "react";

export default function PropertyManager({ onSave }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name:"", location:"Bengaluru", type:"2 BHK Apartment", rent:20000, deposit:60000, eco:4, bedrooms:2, address:"", description:"", status:"Available" });
  function submit(e){ e.preventDefault(); if(!form.name || !form.location || !form.rent) return; onSave(form); setForm((prev)=>({...prev,name:"",address:"",description:""})); setOpen(false); }
  return (<section className="manager-panel"><div className="panel-header"><div><h3>Property management</h3><p>Add a property directly to your portfolio.</p></div><button className="secondary" onClick={()=>setOpen(!open)}>{open?"Close":"+ Add property"}</button></div>
    {open && <form className="form-grid" onSubmit={submit}>
      <label>Property name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Green Valley Apartments" /></label>
      <label>Location<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label>
      <label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>1 BHK Apartment</option><option>2 BHK Apartment</option><option>3 BHK Apartment</option><option>Villa</option><option>Independent House</option></select></label>
      <label>Bedrooms<input type="number" min="1" value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:e.target.value})}/></label>
      <label>Monthly rent<input type="number" min="0" value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})}/></label>
      <label>Security deposit<input type="number" min="0" value={form.deposit} onChange={e=>setForm({...form,deposit:e.target.value})}/></label>
      <label>Eco score<select value={form.eco} onChange={e=>setForm({...form,eco:e.target.value})}><option value="5">5 / 5</option><option value="4">4 / 5</option><option value="3">3 / 5</option><option value="2">2 / 5</option></select></label>
      <label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Available</option><option>Occupied</option></select></label>
      <label className="full">Address<input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Street / locality" /></label>
      <label className="full">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the property…"/></label>
      <button className="primary full" type="submit">Save property</button>
    </form>}
  </section>);
}
