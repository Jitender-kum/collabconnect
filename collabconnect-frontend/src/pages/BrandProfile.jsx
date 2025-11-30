import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Save, User, Globe, Layout, Image as ImageIcon, Edit2, X, CheckCircle } from "lucide-react";
import "./Campaigns.css"; 

export default function BrandProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // ✅ Toggle State
  
  const [user, setUser] = useState(null); // Original Data
  const [form, setForm] = useState({});   // Form Data

  // 1. Load Data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    api.get("/user/me")
      .then(res => {
        setUser(res.data);
        // Form ko bhi initialize kar do
        setForm({
          brandName: res.data.brandName || "",
          website: res.data.website || "",
          niche: res.data.niche || "",
          profilePhoto: res.data.profilePhoto || ""
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // 2. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/user/update", form);
      alert("Profile Updated Successfully! 🎉");
      setIsEditing(false); // Wapas View mode mein jao
      fetchProfile();      // Data refresh karo
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{textAlign:'center', color:'#fff', marginTop:'50px'}}>Loading Profile...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Brand Profile</h1>
        <p className="page-subtitle">Manage how creators see your brand.</p>
      </div>

      <motion.div 
        className="glass-card create-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        
        {/* --- VIEW MODE --- */}
        {!isEditing ? (
          <div style={{textAlign:'center'}}>
            <div style={{
              width:'120px', height:'120px', borderRadius:'50%', margin:'0 auto 1.5rem',
              background: user.profilePhoto ? `url(${user.profilePhoto}) center/cover` : 'rgba(255,255,255,0.1)',
              border: '3px solid #818cf8', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: '0 0 20px rgba(129, 140, 248, 0.3)'
            }}>
              {!user.profilePhoto && <User size={50} color="#a5b4fc" />}
            </div>

            <h2 style={{fontSize:'2rem', marginBottom:'0.5rem'}}>{user.brandName || "Brand Name"}</h2>
            <span style={{background:'rgba(255,255,255,0.1)', padding:'4px 12px', borderRadius:'20px', color:'#94a3b8', fontSize:'0.9rem'}}>
              {user.niche || "Industry Not Set"}
            </span>

            <div style={{marginTop:'2rem', display:'flex', justifyContent:'center', gap:'2rem', flexWrap:'wrap'}}>
               <div style={{textAlign:'center'}}>
                 <div style={{color:'#818cf8', marginBottom:'5px'}}><Globe size={20}/></div>
                 <a href={user.website} target="_blank" rel="noreferrer" style={{color:'white', textDecoration:'none', borderBottom:'1px dashed #666'}}>
                   {user.website ? "Visit Website" : "No Website"}
                 </a>
               </div>
               <div style={{textAlign:'center'}}>
                 <div style={{color:'#818cf8', marginBottom:'5px'}}><CheckCircle size={20}/></div>
                 <span style={{color:'white'}}>Verified Brand</span>
               </div>
            </div>

            <div style={{marginTop:'3rem', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem'}}>
              <button 
                className="btn-gradient" 
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} style={{marginRight:'8px'}}/> Edit Profile
              </button>
            </div>
          </div>
        ) : (
          
          /* --- EDIT MODE --- */
          <form onSubmit={handleUpdate}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
               <h3 style={{margin:0}}>Edit Details</h3>
               <button type="button" onClick={() => setIsEditing(false)} style={{background:'transparent', border:'none', color:'#94a3b8', cursor:'pointer'}}>
                 <X size={24} />
               </button>
            </div>

            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <input className="glass-input" type="text" value={form.brandName}
                onChange={e => setForm({...form, brandName: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Industry / Niche</label>
              <input className="glass-input" type="text" value={form.niche}
                onChange={e => setForm({...form, niche: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Website URL</label>
              <input className="glass-input" type="text" value={form.website}
                onChange={e => setForm({...form, website: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Logo Image URL</label>
              <input className="glass-input" type="text" value={form.profilePhoto}
                onChange={e => setForm({...form, profilePhoto: e.target.value})} />
            </div>

            <div style={{display:'flex', gap:'1rem', marginTop:'2rem'}}>
              <button className="btn-gradient" style={{flex:1, justifyContent:'center'}} disabled={saving}>
                {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="glass-input" style={{flex:1, textAlign:'center', cursor:'pointer', background:'rgba(255,255,255,0.05)'}}>
                Cancel
              </button>
            </div>
          </form>
        )}

      </motion.div>
    </div>
  );
}