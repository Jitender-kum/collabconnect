import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Save, User, Layout, Image as ImageIcon, Edit2, X, Instagram, Youtube, Twitter, Facebook, Globe } from "lucide-react";
import "./Campaigns.css"; 

export default function InfluencerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [user, setUser] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    name: "",
    niche: "",
    profilePhoto: "",
    instagram: "",
    youtube: "",
    twitter: "",
    facebook: ""
  });

  // 1. Load Data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    api.get("/user/me")
      .then(res => {
        const u = res.data;
        setUser(u);
        
        // Social links array ko wapas form fields mein convert karo
        const links = u.socialLinks || [];
        const getLink = (p) => links.find(l => l.platform === p)?.url || "";

        setForm({
          name: u.name || "",
          niche: u.niche || "",
          profilePhoto: u.profilePhoto || "",
          instagram: getLink("instagram"),
          youtube: getLink("youtube"),
          twitter: getLink("twitter"),
          facebook: getLink("facebook"),
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // 2. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Form fields ko wapas array structure mein convert karo
    const socialLinks = [];
    if(form.instagram) socialLinks.push({ platform: "instagram", url: form.instagram });
    if(form.youtube)   socialLinks.push({ platform: "youtube", url: form.youtube });
    if(form.twitter)   socialLinks.push({ platform: "twitter", url: form.twitter });
    if(form.facebook)  socialLinks.push({ platform: "facebook", url: form.facebook });

    const payload = {
        name: form.name,
        niche: form.niche,
        profilePhoto: form.profilePhoto,
        socialLinks
    };

    try {
      await api.put("/user/update", payload);
      alert("Profile Updated Successfully! 🎉");
      setIsEditing(false);
      fetchProfile();
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
        <h1 className="page-title">Creator Profile</h1>
        <p className="page-subtitle">Showcase your identity and social reach.</p>
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
              width:'130px', height:'130px', borderRadius:'50%', margin:'0 auto 1.5rem',
              background: user.profilePhoto ? `url(${user.profilePhoto}) center/cover` : 'rgba(255,255,255,0.1)',
              border: '3px solid #818cf8', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: '0 0 25px rgba(129, 140, 248, 0.4)'
            }}>
              {!user.profilePhoto && <User size={60} color="#a5b4fc" />}
            </div>

            <h2 style={{fontSize:'2.2rem', marginBottom:'0.5rem', fontWeight:'800'}}>{user.name || "Your Name"}</h2>
            <span style={{background:'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)', padding:'6px 16px', borderRadius:'20px', color:'white', fontSize:'0.95rem', fontWeight:'600'}}>
              {user.niche || "Creator"}
            </span>

            {/* Social Stats Row */}
            <div style={{marginTop:'2.5rem', display:'flex', justifyContent:'center', gap:'1.5rem', flexWrap:'wrap'}}>
               {user.socialLinks?.length > 0 ? user.socialLinks.map((s, i) => (
                 <a key={i} href={s.url} target="_blank" rel="noreferrer" 
                    style={{
                        display:'flex', alignItems:'center', gap:'8px', 
                        background:'rgba(255,255,255,0.05)', padding:'10px 16px', 
                        borderRadius:'12px', textDecoration:'none', color:'white',
                        border: '1px solid rgba(255,255,255,0.1)', transition:'0.3s'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#818cf8'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                 >
                    {s.platform === 'instagram' && <Instagram size={20} color="#E1306C" />}
                    {s.platform === 'youtube' && <Youtube size={20} color="#FF0000" />}
                    {s.platform === 'twitter' && <Twitter size={20} color="#1DA1F2" />}
                    {s.platform === 'facebook' && <Facebook size={20} color="#1877F2" />}
                    <span style={{textTransform:'capitalize'}}>{s.platform}</span>
                 </a>
               )) : <p style={{color:'#94a3b8'}}>No social links added yet.</p>}
            </div>

            <div style={{marginTop:'3rem', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem'}}>
              <button className="btn-gradient" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} style={{marginRight:'8px'}}/> Edit Profile
              </button>
            </div>
          </div>
        ) : (
          
          /* --- EDIT MODE --- */
          <form onSubmit={handleUpdate}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
               <h3 style={{margin:0}}>Update Details</h3>
               <button type="button" onClick={() => setIsEditing(false)} style={{background:'transparent', border:'none', color:'#94a3b8', cursor:'pointer'}}>
                 <X size={24} />
               </button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="glass-input" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Niche (e.g. Tech, Fashion)</label>
              <input className="glass-input" type="text" value={form.niche} onChange={e => setForm({...form, niche: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image URL</label>
              <input className="glass-input" type="text" value={form.profilePhoto} onChange={e => setForm({...form, profilePhoto: e.target.value})} placeholder="https://..." />
            </div>

            <h4 style={{marginTop:'2rem', marginBottom:'1rem', color:'#818cf8'}}>Social Links</h4>

            <div className="form-group">
              <label className="form-label"><Instagram size={14} style={{marginRight:5}}/> Instagram URL</label>
              <input className="glass-input" type="text" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} placeholder="https://instagram.com/..." />
            </div>

            <div className="form-group">
              <label className="form-label"><Youtube size={14} style={{marginRight:5}}/> YouTube URL</label>
              <input className="glass-input" type="text" value={form.youtube} onChange={e => setForm({...form, youtube: e.target.value})} placeholder="https://youtube.com/..." />
            </div>

            <div className="form-group">
              <label className="form-label"><Twitter size={14} style={{marginRight:5}}/> Twitter/X URL</label>
              <input className="glass-input" type="text" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} placeholder="https://twitter.com/..." />
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