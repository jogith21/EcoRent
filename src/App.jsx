import useEcoRent from "./hooks/useEcoRent";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import DetailsPage from "./pages/DetailsPage";
import AgreementPage from "./pages/AgreementPage";
import DashboardPage from "./pages/DashboardPage";
import AgreementsPage from "./pages/AgreementsPage";
import PaymentsPage from "./pages/PaymentsPage";
import AboutPage from "./pages/AboutPage";

export default function App(){
  const app=useEcoRent();
  const {page, state, session, profile, loading, toast, authOpen, demoMode, selected, currentProperties, search, setSearch, filter, setFilter}=app;
  if(loading) return <div className="loading-screen"><div className="loading-card"><div className="loading-logo">🌱</div><strong>Loading EcoRent…</strong><span>Preparing your rental workspace</span></div></div>;
  return <div className="app">
    <Navbar page={page} goHome={app.goHome} go={app.go} demoMode={demoMode} session={session} onSignIn={()=>app.setAuthOpen(true)} onSignOut={app.logout}/>
    <div className="page-shell">
      {page==="home" && <HomePage state={state} go={app.go} openProperty={app.openProperty}/>} 
      {page==="properties" && <PropertiesPage currentProperties={currentProperties} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} openProperty={app.openProperty} session={session} addProperty={app.addProperty}/>} 
      {page==="details" && selected && <DetailsPage selected={selected} go={app.go} startAgreement={()=>app.setPage("agreement")}/>} 
      {page==="agreement" && selected && <AgreementPage selected={selected} go={app.go} state={state} profile={profile} addTenant={app.addTenant} submitAgreement={app.submitAgreement}/>} 
      {page==="dashboard" && <DashboardPage state={state} profile={profile} activeAgreements={app.activeAgreements} pendingRent={app.pendingRent} collected={app.collected} expiring={app.expiring} expired={app.expired} setSelected={app.setSelected} setPage={app.setPage} go={app.go}/>} 
      {page==="agreements" && <AgreementsPage state={state} go={app.go} setSelected={app.setSelected} setPage={app.setPage} uploadDocument={app.uploadDocument}/>} 
      {page==="payments" && <PaymentsPage state={state} collected={app.collected} pendingRent={app.pendingRent} addSeedPayment={app.addSeedPayment} markPaid={app.markPaid}/>} 
      {page==="about" && <AboutPage/>}
    </div>
    <footer><span>🌱 EcoRent · Team B9</span><span>Smart rental agreement management</span></footer>
    {toast && <div className={`toast ${toast.tone}`}>{toast.message}</div>}
    {authOpen && <AuthModal mode={app.authMode} form={app.authForm} setForm={app.setAuthForm} setMode={app.setAuthMode} onClose={()=>app.setAuthOpen(false)} onSubmit={app.submitAuth}/>} 
  </div>;
}
