import { useEffect, useMemo, useState } from "react";
import { demoState } from "../demoData";
import { supabase } from "../supabase";
import { agreementStatus, cloneDemo, monthLabel } from "../utils";

export default function useEcoRent() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState(() => cloneDemo(demoState));
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ full_name: "", email: "", password: "", phone: "", role: "landlord" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const demoMode = !session;

  function notify(message, tone = "success") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2800);
  }

  function goHome() {
    setSelected(null);
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function go(pageName) {
    setSelected(null);
    setPage(pageName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function loadProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data || null);
  }

  async function loadAll(activeSession = session) {
    if (!activeSession?.user) {
      setState(cloneDemo(demoState));
      return;
    }
    try {
      const userId = activeSession.user.id;
      const [propertiesRes, tenantsRes, agreementsRes, paymentsRes, documentsRes] = await Promise.all([
        supabase.from("properties").select("*").order("created_at", { ascending: false }),
        supabase.from("tenants").select("*").eq("owner_id", userId).order("created_at", { ascending: false }),
        supabase.from("agreements").select("*").eq("owner_id", userId).order("created_at", { ascending: false }),
        supabase.from("rent_payments").select("*").eq("owner_id", userId).order("created_at", { ascending: false }),
        supabase.from("documents").select("*").eq("owner_id", userId).order("created_at", { ascending: false })
      ]);
      if (propertiesRes.error || tenantsRes.error || agreementsRes.error || paymentsRes.error || documentsRes.error) {
        throw new Error(propertiesRes.error?.message || tenantsRes.error?.message || agreementsRes.error?.message || paymentsRes.error?.message || documentsRes.error?.message || "Unable to load data");
      }
      setState({
        properties: propertiesRes.data || [],
        tenants: tenantsRes.data || [],
        agreements: agreementsRes.data || [],
        payments: paymentsRes.data || [],
        documents: documentsRes.data || []
      });
    } catch (error) {
      console.error(error);
      notify("Supabase is not ready yet. Demo data remains available.", "warning");
      setState(cloneDemo(demoState));
    }
  }

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) await loadProfile(data.session.user.id);
      await loadAll(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (nextSession?.user) await loadProfile(nextSession.user.id);
      else { setProfile(null); setState(cloneDemo(demoState)); }
      await loadAll(nextSession);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function submitAuth(e) {
    e.preventDefault();
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password });
        if (error) throw error;
        notify("Signed in successfully.");
        setAuthOpen(false);
        setPage("dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: { data: { full_name: authForm.full_name || "EcoRent User", phone: authForm.phone || "", role: authForm.role } }
        });
        if (error) throw error;
        if (data.user && !data.session) notify("Account created. Check your email if confirmation is enabled.", "warning");
        else notify("Account created successfully.");
        setAuthMode("login");
      }
    } catch (error) { notify(error.message, "error"); }
  }

  async function logout() {
    await supabase.auth.signOut();
    setAuthOpen(false);
    goHome();
    notify("Signed out. Demo Mode is active.");
  }

  function openProperty(property) { setSelected(property); setPage("details"); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function addProperty(form) {
    if (!session?.user) {
      const newProperty = { ...form, id: `local-${Date.now()}`, features: form.features || ["LED Lighting"], eco: Number(form.eco || 4) };
      setState((prev) => ({ ...prev, properties: [newProperty, ...prev.properties] }));
      notify("Property added in Demo Mode.");
      return newProperty;
    }
    const payload = {
      owner_id: session.user.id,
      name: form.name, location: form.location, type: form.type,
      rent: Number(form.rent), deposit: Number(form.deposit), eco: Number(form.eco || 4),
      features: form.features || ["LED Lighting"], description: form.description || "",
      address: form.address || form.location, bedrooms: Number(form.bedrooms || 1), status: form.status || "Available"
    };
    const { data, error } = await supabase.from("properties").insert(payload).select().single();
    if (error) { notify(error.message, "error"); return null; }
    setState((prev) => ({ ...prev, properties: [data, ...prev.properties] }));
    notify("Property saved to Supabase.");
    return data;
  }

  async function addTenant(form) {
    if (!session?.user) {
      const newTenant = { id: `local-t-${Date.now()}`, full_name: form.name || form.full_name, phone: form.phone, email: form.email };
      setState((prev) => ({ ...prev, tenants: [newTenant, ...prev.tenants] }));
      return newTenant;
    }
    const { data, error } = await supabase.from("tenants").insert({
      owner_id: session.user.id, full_name: form.name || form.full_name, email: form.email, phone: form.phone, id_type: form.id_type || "Aadhaar"
    }).select().single();
    if (error) { notify(error.message, "error"); return null; }
    setState((prev) => ({ ...prev, tenants: [data, ...prev.tenants] }));
    return data;
  }

  async function submitAgreement(form) {
    const selectedProperty = state.properties.find((item) => item.id === form.propertyId) || selected;
    if (!selectedProperty) { notify("Please select a property.", "error"); return null; }
    let tenant = state.tenants.find((item) => item.id === form.tenantId);
    if (!tenant) tenant = await addTenant({ name: form.tenantName, phone: form.tenantPhone, email: form.tenantEmail });
    if (!tenant) return null;
    const status = agreementStatus(form.endDate);
    const base = {
      property_id: selectedProperty.id, tenant_id: tenant.id, owner_name: profile?.full_name || "Raj Shekar",
      start_date: form.startDate, end_date: form.endDate, monthly_rent: Number(form.monthlyRent),
      security_deposit: Number(form.securityDeposit), notice_period_days: Number(form.noticePeriod), maintenance: Number(form.maintenance), status
    };
    if (!session?.user) {
      const newAgreement = { id: `local-a-${Date.now()}`, ...base };
      const newPayment = { id: `local-r-${Date.now()}`, agreement_id: newAgreement.id, tenant_id: tenant.id, month: monthLabel(new Date(form.startDate)), amount: Number(form.monthlyRent), payment_date: null, status: "Pending" };
      setState((prev) => ({ ...prev, agreements: [newAgreement, ...prev.agreements], payments: [newPayment, ...prev.payments] }));
      setSelected(selectedProperty); setPage("agreements"); notify("Agreement created in Demo Mode."); return newAgreement;
    }
    const { data: agreement, error } = await supabase.from("agreements").insert({ ...base, owner_id: session.user.id }).select().single();
    if (error) { notify(error.message, "error"); return null; }
    const { data: payment, error: paymentError } = await supabase.from("rent_payments").insert({
      owner_id: session.user.id, agreement_id: agreement.id, tenant_id: tenant.id, month: monthLabel(new Date(form.startDate)), amount: Number(form.monthlyRent), status: "Pending"
    }).select().single();
    if (paymentError) notify("Agreement saved, but first payment record could not be created.", "warning");
    setState((prev) => ({ ...prev, agreements: [agreement, ...prev.agreements], payments: payment ? [payment, ...prev.payments] : prev.payments }));
    setSelected(selectedProperty); setPage("agreements"); notify("Agreement saved to Supabase."); return agreement;
  }

  async function markPaid(paymentId) {
    if (!session?.user) {
      setState((prev) => ({ ...prev, payments: prev.payments.map((p) => p.id === paymentId ? { ...p, status: "Paid", payment_date: new Date().toISOString().slice(0, 10) } : p) }));
      notify("Payment marked as paid in Demo Mode."); return;
    }
    const { data, error } = await supabase.from("rent_payments").update({ status: "Paid", payment_date: new Date().toISOString().slice(0, 10) }).eq("id", paymentId).eq("owner_id", session.user.id).select().single();
    if (error) { notify(error.message, "error"); return; }
    setState((prev) => ({ ...prev, payments: prev.payments.map((p) => p.id === paymentId ? data : p) }));
    notify("Payment updated.");
  }

  async function uploadDocument(agreementId, file) {
    if (!file) return;
    if (!session?.user) {
      setState((prev) => ({ ...prev, documents: [{ id: `local-doc-${Date.now()}`, agreement_id: agreementId, file_name: file.name, file_path: `demo/${file.name}`, mime_type: file.type }, ...prev.documents] }));
      notify("Document recorded in Demo Mode."); return;
    }
    const path = `${session.user.id}/${agreementId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage.from("agreement-documents").upload(path, file);
    if (uploadError) { notify(uploadError.message, "error"); return; }
    const { data, error } = await supabase.from("documents").insert({ owner_id: session.user.id, agreement_id: agreementId, file_name: file.name, file_path: path, mime_type: file.type }).select().single();
    if (error) { notify(error.message, "error"); return; }
    setState((prev) => ({ ...prev, documents: [data, ...prev.documents] }));
    notify("Signed document uploaded.");
  }

  async function addSeedPayment() {
    if (!session?.user || !state.agreements[0]) { notify("Sign in and create an agreement first.", "warning"); return; }
    const agreement = state.agreements[0];
    const tenant = state.tenants.find((t) => t.id === agreement.tenant_id);
    if (!tenant) return;
    const payload = { owner_id: session.user.id, agreement_id: agreement.id, tenant_id: tenant.id, month: monthLabel(), amount: Number(agreement.monthly_rent), status: "Pending" };
    const { data, error } = await supabase.from("rent_payments").insert(payload).select().single();
    if (error) { notify(error.message, "error"); return; }
    setState((prev) => ({ ...prev, payments: [data, ...prev.payments] }));
    notify("Payment record added.");
  }

  const currentProperties = useMemo(() => {
    let result = [...state.properties];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.type?.toLowerCase().includes(q));
    }
    if (filter !== "all") result = result.filter((p) => p.status?.toLowerCase() === filter.toLowerCase());
    return result;
  }, [state.properties, search, filter]);

  const activeAgreements = state.agreements.filter((a) => agreementStatus(a.end_date) === "Active").length;
  const expiring = state.agreements.filter((a) => agreementStatus(a.end_date) === "Expiring Soon");
  const expired = state.agreements.filter((a) => agreementStatus(a.end_date) === "Expired").length;
  const pendingRent = state.payments.filter((p) => p.status !== "Paid").reduce((sum, p) => sum + Number(p.amount), 0);
  const collected = state.payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + Number(p.amount), 0);

  useEffect(() => {
    if (!session?.user || !state.agreements.length) return;
    const updates = state.agreements.filter((a) => a.status !== agreementStatus(a.end_date)).map((a) => ({ id: a.id, status: agreementStatus(a.end_date) })).filter((item) => !item.id.startsWith("local-"));
    if (!updates.length) return;
    Promise.all(updates.map((item) => supabase.from("agreements").update({ status: item.status }).eq("id", item.id).eq("owner_id", session.user.id))).then(() => {
      setState((prev) => ({ ...prev, agreements: prev.agreements.map((a) => { const match = updates.find((u) => u.id === a.id); return match ? { ...a, status: match.status } : a; }) }));
    });
  }, [session, state.agreements.length]);

  return {
    page, setPage, selected, setSelected, state, session, profile, loading, toast, authOpen, setAuthOpen,
    authMode, setAuthMode, authForm, setAuthForm, search, setSearch, filter, setFilter, demoMode,
    notify, go, goHome, openProperty, addProperty, addTenant, submitAgreement, markPaid, uploadDocument, addSeedPayment,
    currentProperties, activeAgreements, expiring, expired, pendingRent, collected, submitAuth, logout
  };
}
