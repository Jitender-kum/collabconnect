import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// ✅ All Icons Imported
import { Users, User, TrendingUp, Briefcase, ExternalLink, LogOut, PlusCircle, Bell, Layout } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState("Loading your dashboard...");
  
  // Graph rendering state
  const [showGraph, setShowGraph] = useState(false);
  const [chartData, setChartData] = useState([]);

  // ✅ Helper: User Role ke hisaab se Graph Data banao
  const generateDynamicData = (user) => {
    const data = [];
    const baseMetric = user.role === "Influencer" ? (user.reachScore || 100) : 500; 
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); 

      // Random fluctuation logic
      const randomFactor = 0.6 + (Math.random() * 0.4) + (0.05 * (6 - i)); 
      const value = Math.round(baseMetric * randomFactor);

      data.push({
        name: dayName,
        value: value > 0 ? value : 10
      });
    }
    return data;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // 1. Fetch User Data
    api.get("/user/me")
      .then(res => {
        setMe(res.data);
        // Data aate hi graph calculate karo
        setChartData(generateDynamicData(res.data));
      })
      .catch((err) => {
        console.error(err);
        setMsg("Session expired.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
      });

    // 2. Graph Delay (Error Fix for Animation)
    const timer = setTimeout(() => setShowGraph(true), 500);
      
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!me) return <div className="dashboard-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>{msg}</div>;

  const userId = me._id || me.id;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="dashboard-container">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- 1. HEADER SECTION --- */}
        <motion.div variants={itemVariants} className="welcome-section">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}>
            <div>
              <p style={{color: '#a0aec0'}}>Welcome back,</p>
              <h1>{me.name || me.brandName} 👋</h1>
            </div>
            
            <div style={{display:'flex', gap:'10px'}}>
              {/* Notifications Button */}
              <button 
                className="action-btn" 
                style={{background: 'rgba(129, 140, 248, 0.15)', color: '#a5b4fc', border:'1px solid rgba(129, 140, 248, 0.3)'}}
                onClick={() => navigate("/notifications")}
              >
                <Bell size={18} /> <span className="hide-mobile">Notifications</span>
              </button>

              {/* Logout Button */}
              <button 
                className="action-btn" 
                style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border:'1px solid rgba(239, 68, 68, 0.2)'}}
                onClick={() => { 
                  localStorage.clear(); 
                  window.location.href="/login"; 
                }}
              >
                <LogOut size={18} /> <span className="hide-mobile">Logout</span>
              </button>
            </div>
          </div>
          <p style={{marginTop:'0.5rem'}}>{me.role === "Brand" ? "Manage your campaigns and applicants." : "Track your reach and collaborations."}</p>
        </motion.div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

        {/* --- 2. ACTION BUTTONS (TOP) --- */}
        <motion.div variants={itemVariants} className="action-section" style={{marginBottom: '2rem', marginTop: '0'}}>
          
          {/* INFLUENCER ACTIONS */}
          {me.role === "Influencer" && userId && (
            <>
              <button 
                className="action-btn btn-primary" 
                onClick={() => navigate("/influencer/profile")}
              >
                <User size={18} /> My Profile
              </button>
              
              <button 
                className="action-btn btn-secondary" 
                onClick={() => navigate("/campaigns")}
              >
                Browse Campaigns
              </button>

              <button 
                className="action-btn btn-secondary" 
                onClick={() => window.open(`/profile/${userId}`, '_blank')}
                style={{borderStyle: 'dashed', opacity: 0.8}}
              >
                <ExternalLink size={16} /> Public View
              </button>
            </>
          )}

          {/* BRAND ACTIONS */}
          {me.role === "Brand" && (
            <>
              <button 
                className="action-btn btn-primary" 
                onClick={() => navigate("/campaign/create")}
              >
                <PlusCircle size={18} /> Create Campaign
              </button>
              <button 
                className="action-btn btn-secondary" 
                onClick={() => navigate("/applicants")}
              >
                View Applicants
              </button>
              <button 
                className="action-btn btn-secondary" 
                onClick={() => navigate("/brand/campaigns")}
              >
                <Layout size={18} /> My Campaigns
              </button>
              <button 
                className="action-btn btn-secondary" 
                onClick={() => navigate("/brand/profile")}
              >
                <User size={18} /> Edit Profile
              </button>
            </>
          )}
        </motion.div>

        {/* --- 3. STATS GRID --- */}
        <motion.div variants={itemVariants} className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{me.role === "Brand" ? "Active Campaigns" : "Total Reach"}</span>
              <div className="icon-box"><TrendingUp size={20} /></div>
            </div>
            <div className="stat-value">{me.role === "Brand" ? "3" : Math.round(me.reachScore || 0)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{me.role === "Brand" ? "Total Applicants" : "Followers"}</span>
              <div className="icon-box"><Users size={20} /></div>
            </div>
            <div className="stat-value">{me.role === "Brand" ? "12" : (me.totalFollowers || "15.2k")}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Collaborations</span>
              <div className="icon-box"><Briefcase size={20} /></div>
            </div>
            <div className="stat-value">8</div>
          </div>
        </motion.div>

        {/* --- 4. GRAPH SECTION --- */}
        <motion.div variants={itemVariants} className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>
            {me.role === "Brand" ? "Profile Visits (Last 7 Days)" : "Reach Growth (Last 7 Days)"}
          </h3>
          
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            {showGraph && chartData.length > 0 ? (
              <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} 
                    cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorReach)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{height: '100%', display:'flex', alignItems:'center', justifyContent:'center', color: '#666'}}>
                Loading Analytics...
              </div>
            )}
          </div>
        </motion.div>
      
      </motion.div>
    </div>
  );
}