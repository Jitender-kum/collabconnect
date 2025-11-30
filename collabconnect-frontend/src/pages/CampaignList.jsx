import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import "./Campaigns.css";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/campaign/all")
      .then(res => setCampaigns(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (id) => {
    try {
      if(!window.confirm("Confirm apply?")) return;
      await api.post("/application/apply", { campaignId: id });
      alert("Applied successfully! 🚀");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Find Collaborations</h1>
        <p style={{color: '#94a3b8'}}>Discover campaigns that match your niche.</p>
      </div>

      {loading ? (
        <p style={{textAlign:'center', color: '#94a3b8'}}>Loading opportunities...</p>
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
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                <span className="tag-badge">{c.brandId?.brandName || "Brand"}</span>
                <span className="price-tag">${c.budget}</span>
              </div>
              
              <h3 className="card-title" style={{marginTop:'12px'}}>{c.title}</h3>
              <p className="card-subtitle">{c.description?.substring(0, 100)}...</p>
              
              <div style={{margin: '1rem 0', display:'flex', gap:'10px', fontSize:'0.9rem', color:'#cbd5e1'}}>
                 <span>📅 {new Date(c.startDate).toLocaleDateString()}</span>
              </div>

              <button 
                className="btn-gradient" 
                style={{marginTop:'0', padding:'8px'}}
                onClick={() => handleApply(c._id)}
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}