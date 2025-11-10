import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./auth";
import { RequireAuth, RequireRole } from "./guards";

import Home from "./pages/Home";
import RegisterInfluencer from "./pages/RegisterInfluencer";
import RegisterBrand from "./pages/RegisterBrand";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignList from "./pages/CampaignList";
import Applicants from "./pages/Applicants";
import ProfilePublic from "./pages/ProfilePublic";
import VerifyOTP from "./pages/VerifyOTP";  // ✅ move import here


export default function App() {
  const { token, role, logout } = useAuth();

  return (
    <>
      <div className="nav">
        <div className="nav-inner">
          <div className="brand"><div className="brand-badge" /> CollabConnect</div>
          <div className="links">
            <Link className="link" to="/">Home</Link>

            {role === "Influencer" && (
              <Link className="link" to="/campaigns">Find Campaigns</Link>
            )}

            {role === "Brand" && (
              <>
                <Link className="link" to="/campaign/create">Create Campaign</Link>
                <Link className="link" to="/applicants">Applicants</Link>
              </>
            )}

            {token && <Link className="link primary" to="/dashboard">Dashboard</Link>}

            {!token && (
              <>
                <Link className="link" to="/register/influencer">Register (Influencer)</Link>
                <Link className="link" to="/register/brand">Register (Brand)</Link>
                <Link className="link" to="/login">Login</Link>
              </>
            )}

            {token && (
              <button className="link" style={{border:"none", background:"transparent", cursor:"pointer"}}
                onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container section">
        <Routes>

          <Route path="/" element={<Home/>} />

          {/* ✅ OTP Page is always allowed */}
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {!token && <Route path="/register/influencer" element={<SectionCard title="Register — Influencer"><RegisterInfluencer/></SectionCard>} />}
          {!token && <Route path="/register/brand" element={<SectionCard title="Register — Brand"><RegisterBrand/></SectionCard>} />}
          {!token && <Route path="/login" element={<SectionCard title="Login"><Login/></SectionCard>} />}

          <Route path="/dashboard" element={<RequireAuth><SectionCard title="Dashboard"><Dashboard/></SectionCard></RequireAuth>} />

          <Route path="/profile/:id" element={<ProfilePublic />} /> 

          <Route path="/campaign/create" element={
            <RequireRole role="Brand">
              <SectionCard title="Create Campaign"><CampaignCreate/></SectionCard>
            </RequireRole>
          } />

          <Route path="/applicants" element={
            <RequireRole role="Brand">
              <SectionCard title="Applicants"><Applicants/></SectionCard>
            </RequireRole>
          } />

          <Route path="/campaigns" element={
            <RequireRole role="Influencer">
              <SectionCard title="Campaigns"><CampaignList/></SectionCard>
            </RequireRole>
          } />

        </Routes>
      </div>
    </>
  );
}

function SectionCard({ title, children }){
  return (
    <div className="card">
      <h2>{title}</h2>
      <div style={{marginTop:12}}>{children}</div>
    </div>
  )
}
