import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import { RequireAuth, RequireRole } from "./guards";

// Pages Imports
import Home from "./pages/Home";
import RegisterInfluencer from "./pages/RegisterInfluencer";
import RegisterBrand from "./pages/RegisterBrand";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignList from "./pages/CampaignList";
import Applicants from "./pages/Applicants";
import ProfilePublic from "./pages/ProfilePublic";
import VerifyOTP from "./pages/VerifyOTP";
import Notifications from "./pages/Notifications";
import BrandProfile from "./pages/BrandProfile";
import BrandCampaigns from "./pages/BrandCampaigns";
import InfluencerProfile from "./pages/InfluencerProfile";

export default function App() {
  const { token, role, logout } = useAuth();
  const location = useLocation();

  // ✅ LIST UPDATE: In sabhi pages ko "Full Width" milega (No Container Restriction)
  const isFullWidth = [
    "/", 
    "/login", 
    "/register/influencer", 
    "/register/brand", 
    "/dashboard",
    "/campaigns",       
    "/campaign/create",
    "/brand/profile", 
    "/applicants",   
    "/brand/campaigns",  
    "/notifications",
    "/influencer/profile"
  ].includes(location.pathname);

  return (
    <>
      {/* --- Navigation Bar --- */}
      <div className="nav">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-badge" /> CollabConnect
          </div>
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
                <Link className="link" to="/register/influencer">Creator Join</Link>
                <Link className="link" to="/register/brand">Hire Creators</Link>
                <Link className="link" to="/login">Login</Link>
              </>
            )}

            {token && (
              <button 
                className="link" 
                style={{border:"none", background:"transparent", cursor:"pointer"}}
                onClick={logout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      {/* Agar page 'isFullWidth' list mein hai, to 'container' class mat lagao */}
      <div className={isFullWidth ? "" : "container section"}>
        <Routes>

          {/* 1. Public Home Page */}
          <Route path="/" element={<Home/>} />
          
          {/* 2. Auth Pages (Fixed: Redirect logic instead of removing route) */}
          <Route 
            path="/register/influencer" 
            element={!token ? <RegisterInfluencer/> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register/brand" 
            element={!token ? <RegisterBrand/> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/login" 
            element={!token ? <Login/> : <Navigate to="/dashboard" replace />} 
          />

          {/* 3. Dashboard (Protected) */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard/>
            </RequireAuth>
          } />

          <Route path="/influencer/profile" element={
            <RequireRole role="Influencer">
              <InfluencerProfile />
            </RequireRole>
          } />

          <Route path="/brand/campaigns" element={
            <RequireRole role="Brand">
              <BrandCampaigns />
            </RequireRole>
          } />
          <Route path="/brand/profile" element={
            <RequireRole role="Brand">
              <BrandProfile />
            </RequireRole>
          } />

          <Route path="/notifications" element={
            <RequireAuth>
              <Notifications />
            </RequireAuth>
          } />

          {/* 4. Brand Specific Routes */}
          <Route path="/campaign/create" element={
            <RequireRole role="Brand">
              <CampaignCreate/>
            </RequireRole>
          } />

          <Route path="/applicants" element={
            <RequireRole role="Brand">
              <Applicants/>
            </RequireRole>
          } />

          {/* 5. Influencer Specific Routes */}
          <Route path="/campaigns" element={
            <RequireRole role="Influencer">
              <CampaignList/>
            </RequireRole>
          } />

          {/* 6. Other Pages */}
          <Route path="/profile/:id" element={<ProfilePublic />} /> 
          <Route path="/verify-otp" element={<VerifyOTP />} />

        </Routes>
      </div>
    </>
  );
}