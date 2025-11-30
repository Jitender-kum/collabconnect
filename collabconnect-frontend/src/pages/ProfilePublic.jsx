import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { 
  Instagram, Youtube, Twitter, Facebook, Globe, 
  Mail, Share2, CheckCircle 
} from "lucide-react";
import "./Campaigns.css"; 

export default function ProfilePublic() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || id === "undefined") {
        setError("Invalid Profile ID");
        setLoading(false);
        return;
    }

    setLoading(true);
    api.get(`/user/profile/${id}`)
       .then(r => {
           setUser(r.data);
           setError("");
       })
       .catch(err => {
           console.error(err);
           setError("User not found or private.");
       })
       .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{textAlign:'center', color:'#94a3b8', marginTop:'100px'}}>Loading Profile...</div>;
  if (error) return <div style={{textAlign:'center', color:'#f87171', marginTop:'100px'}}>{error}</div>;
  if (!user) return null;

  // Initials logic
  const initials = (user.name || "U").slice(0, 2).toUpperCase();

  const getSocialIcon = (platform) => {
    const p = platform.toLowerCase();
    if(p.includes("insta")) return <Instagram size={20} color="#E1306C" />;
    if(p.includes("youtu")) return <Youtube size={20} color="#FF0000" />;
    if(p.includes("twit") || p.includes("x")) return <Twitter size={20} color="#1DA1F2" />;
    if(p.includes("face")) return <Facebook size={20} color="#1877F2" />;
    return <Globe size={20} color="#cbd5e1" />;
  };

  return (
    <div className="page-container" style={{display:'flex', justifyContent:'center', paddingTop:'4rem'}}>
      
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{maxWidth: '500px', width: '100%', textAlign: 'center', padding: '0', overflow: 'hidden'}}
      >
        {/* --- COVER BANNER --- */}
        <div style={{
          height: '120px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          zIndex: 0 /* ✅ Banner ko peeche rakha */
        }}></div>

        {/* --- AVATAR (Fixed Layering) --- */}
        <div style={{
          marginTop: '-60px', 
          marginBottom: '1rem', 
          display: 'flex', 
          justifyContent: 'center',
          position: 'relative', /* ✅ Z-Index ke liye zaroori */
          zIndex: 10 /* ✅ Banner ke upar lao */
        }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: user.profilePhoto ? `url(${user.profilePhoto}) center/cover` : '#1e293b',
            border: '4px solid #0f172a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            color: 'white', fontSize: '2.5rem', fontWeight: '700'
          }}>
            {!user.profilePhoto && initials}
          </div>
        </div>

        {/* --- INFO SECTION --- */}
        <div style={{padding: '0 2rem 2rem'}}>
          
          <h1 style={{margin: '0 0 5px 0', fontSize: '2rem'}}>{user.name}</h1>
          
          <div style={{display:'flex', justifyContent:'center', gap:'10px', alignItems:'center', marginBottom: '1.5rem'}}>
            <span style={{
              background: 'rgba(129, 140, 248, 0.15)', color: '#a5b4fc', 
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500'
            }}>
              {user.niche || "Creator"}
            </span>
            {user.role === "Influencer" && <CheckCircle size={18} color="#34d399" />}
          </div>

          {/* --- STATS GRID --- */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', 
            background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{fontSize: '1.5rem', fontWeight: '700', color: 'white'}}>
                {user.reachScore || 0}
              </div>
              <div style={{fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px'}}>Reach Score</div>
            </div>
            <div>
              <div style={{fontSize: '1.5rem', fontWeight: '700', color: 'white'}}>
                {user.totalFollowers || "N/A"}
              </div>
              <div style={{fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px'}}>Followers</div>
            </div>
          </div>

          {/* --- SOCIAL LINKS --- */}
          <div style={{marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1rem', color: '#cbd5e1', marginBottom: '10px'}}>Social Presence</h3>
            <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap'}}>
              {user.socialLinks?.length > 0 ? user.socialLinks.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer"
                   style={{
                     background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%',
                     color: 'white', transition: '0.2s', border: '1px solid rgba(255,255,255,0.1)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}
                   onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                   onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  {getSocialIcon(s.platform)}
                </a>
              )) : (
                <span style={{color: '#64748b', fontSize: '0.9rem'}}>No links added.</span>
              )}
            </div>
          </div>

          {/* --- CONTACT BUTTON --- */}
          <div style={{display: 'flex', gap: '1rem'}}>
            <button 
              className="btn-gradient" 
              style={{flex: 1, justifyContent: 'center', padding: '12px'}}
              onClick={() => window.location.href = `mailto:${user.email}`}
            >
              <Mail size={18} style={{marginRight: '8px'}} /> Contact Creator
            </button>
            <button 
              className="btn-secondary" 
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', 
                color: 'white', borderRadius: '10px', padding: '0 15px', cursor: 'pointer'
              }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link Copied!");
              }}
            >
              <Share2 size={20} />
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}