import { useRef } from "react";
import { classForStatus, dateLabel, money } from "../utils";
export default function AgreementRow({ agreement, property, tenant, docs, liveStatus, onOpen, onUpload }) {
 const fileRef=useRef(null);
 return <div className="record"><div className="record-icon">🌱</div><div className="record-main"><strong>{agreement.id.slice(0,8)}</strong><h3>{property?.name||"Property"}</h3><p>{tenant?.full_name||"Tenant"} · {tenant?.phone||"No phone"}</p></div><div className="record-info"><span>{money(agreement.monthly_rent)}/month</span><small>{dateLabel(agreement.start_date)} → {dateLabel(agreement.end_date)}</small></div><div className="record-actions"><span className={classForStatus(liveStatus)}>{liveStatus}</span><button className="small-button" onClick={onOpen}>Open</button><button className="upload-button" onClick={()=>fileRef.current?.click()}>{docs.length?`📎 ${docs.length}`:"Upload"}</button><input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" hidden onChange={e=>onUpload(e.target.files?.[0])}/></div></div>;
}
