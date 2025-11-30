import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Layout, PlusCircle, Trash2 } from "lucide-react"; // ✅ Trash icon imported
import { useNavigate } from "react-router-dom";
import "./Campaigns.css"; 

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = () => {
    api.get("/campaign/brand")
      .then(res => setCampaigns(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/campaign/${id}`);
      // UI se hatane ke liye filter karo (Reload ki zaroorat nahi)
      setCampaigns(prev => prev.filter(c => c._id !== id));
      alert("Campaign deleted successfully.");
    } catch (err) {
      alert("Failed to delete campaign.");
    }
  };

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

              <div className="card-footer" style={{gap: '10px'}}>
                 {/* View Applicants Button */}
                 <button 
                   className="btn-gradient" 
                   style={{flex: 1, justifyContent:'center'}}
                   onClick={() => navigate(`/applicants?cid=${c._id}`)}
                 >
                   View Applicants
                 </button>

                 {/* ✅ DELETE BUTTON */}
                 <button 
                   className="btn-danger"
                   style={{padding: '10px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)', cursor: 'pointer', color: '#f87171'}}
                   onClick={() => handleDelete(c._id)}
                   title="Delete Campaign"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}