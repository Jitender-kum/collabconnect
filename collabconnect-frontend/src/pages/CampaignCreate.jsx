import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import "./Campaigns.css";

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", budget: "", requirements: "", startDate: "", endDate: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/campaign/create", form);
      alert("Campaign Launched Successfully! 🚀");
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Create New Campaign</h1>
        <p className="page-subtitle">Launch your brand's next big collaboration.</p>
      </div>

      <motion.div 
        className="glass-card create-form"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Campaign Title</label>
            <input className="glass-input" type="text" placeholder="e.g. Summer Collection Launch" 
              onChange={e => setForm({...form, title: e.target.value})} required />
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
            <div className="form-group">
              <label className="form-label">Budget ($)</label>
              <input className="glass-input" type="number" placeholder="500" 
                onChange={e => setForm({...form, budget: e.target.value})} required />
            </div>
            <div className="form-group">
               <label className="form-label">Requirements</label>
               <input className="glass-input" type="text" placeholder="e.g. 1 Reel, 2 Stories" 
                onChange={e => setForm({...form, requirements: e.target.value})} />
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="glass-input" type="date" 
                onChange={e => setForm({...form, startDate: e.target.value})} required />
            </div>
            <div className="form-group">
               <label className="form-label">End Date</label>
               <input className="glass-input" type="date" 
                onChange={e => setForm({...form, endDate: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="glass-input" placeholder="Describe your campaign goals and guidelines..."
              onChange={e => setForm({...form, description: e.target.value})} required />
          </div>

          <button className="btn-gradient" style={{width:'100%', justifyContent:'center'}} disabled={loading}>
            {loading ? "Launching..." : <><Rocket size={18} /> Launch Campaign</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}