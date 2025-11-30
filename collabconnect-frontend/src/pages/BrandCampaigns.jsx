import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Layout, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Campaigns.css"; // Styling reuse

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/campaign/brand")
      .then(res => setCampaigns(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Campaigns</h1>
        <p className="page-subtitle">Track and manage your active campaigns.</p>
      </div>

      {loading ? (
        <p style={{textAlign:'center', color: '#94a3b8'}}>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <div style={{textAlign:'center', marginTop:'3rem'}}>
          <p style={{color: '#94a3b8', marginBottom:'1rem'}}>You haven't posted any campaigns yet.</p>
          <button className="btn-gradient" onClick={() => navigate("/campaign/create")}>
            <PlusCircle size={18} style={{marginRight:8}} /> Create New Campaign
          </button>
        </div>
      ) : (
        <div className="campaign-grid">
          {campaigns.map((c, i) => (
            <motion.div 
              key={c._id} 
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="card-header">
                <span className="brand-badge" style={{background:'rgba(52, 211, 153, 0.15)', color:'#6ee7b7'}}>
                  Active
                </span>
                <span className="price-tag">${c.budget}</span>
              </div>
              
              <h3 className="card-title">{c.title}</h3>
              <p className="card-desc">{c.description}</p>
              
              <div style={{margin:'1rem 0', padding:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'10px', fontSize:'0.9rem', display:'flex', flexDirection:'column', gap:'5px'}}>
                 <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#cbd5e1'}}>
                    <Calendar size={14} /> 
                    <span>Start: {new Date(c.startDate).toLocaleDateString()}</span>
                 </div>
                 <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#cbd5e1'}}>
                    <Calendar size={14} /> 
                    <span>End: {new Date(c.endDate).toLocaleDateString()}</span>
                 </div>
              </div>

              <div className="card-footer">
                 <button 
                   className="btn-gradient" 
                   style={{width:'100%', justifyContent:'center'}}
                   // ✅ MAIN CHANGE: URL mein ID bheja (?cid=...)
                   onClick={() => navigate(`/applicants?cid=${c._id}`)}
                 >
                   View Applicants
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}