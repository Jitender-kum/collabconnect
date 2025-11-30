import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom"; // ✅ useSearchParams import kiya
import api from "../api";
import { motion } from "framer-motion";
import { Instagram, Youtube, Twitter, Facebook, ExternalLink, ArrowLeft, Filter } from "lucide-react";
import "./Campaigns.css";

export default function Applicants() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams(); // ✅ URL Params hook
  
  // URL se campaign ID nikalo (agar hai to)
  const filterCampaignId = searchParams.get("cid");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applicants/brand")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      await api.post("/application/update-status", { applicationId, status });
      const fresh = await api.get("/applicants/brand");
      setData(fresh.data);
    } catch (err) {
      alert("Error updating status");
    }
  };

  const getIcon = (platform) => {
    if(platform.includes("insta")) return <Instagram size={14}/>;
    if(platform.includes("youtu")) return <Youtube size={14}/>;
    if(platform.includes("twit") || platform.includes("x")) return <Twitter size={14}/>;
    return <Facebook size={14}/>;
  }

  // ✅ FILTER LOGIC: Agar URL mein ID hai, to sirf wahi campaign dikhao
  const filteredData = filterCampaignId 
    ? data.filter(block => block.campaignId === filterCampaignId)
    : data;

  return (
    <div className="page-container">
      <div className="page-header" style={{textAlign:'left', display:'flex', alignItems:'center', gap:'1rem'}}>
        
        {/* Agar filter laga hai, to Back button dikhao */}
        {filterCampaignId && (
          <button onClick={() => nav("/brand/campaigns")} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>
             <ArrowLeft size={24} />
          </button>
        )}

        <div>
            <h1 className="page-title" style={{fontSize:'2rem', marginBottom:0}}>
              {filterCampaignId ? "Campaign Applicants" : "All Applicants"}
            </h1>
            <p className="page-subtitle" style={{margin:0}}>
              {filterCampaignId ? "Reviewing applicants for selected campaign." : "Review creators across all campaigns."}
            </p>
        </div>

        {/* Filter Clear Button (Agar filter laga ho to) */}
        {filterCampaignId && (
           <button 
             onClick={() => nav("/applicants")} 
             style={{marginLeft:'auto', background:'rgba(255,255,255,0.1)', color:'#cbd5e1', border:'1px solid rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}
           >
             <Filter size={16} /> Show All
           </button>
        )}
      </div>

      {loading ? <p style={{textAlign:'center', color: '#94a3b8'}}>Loading applicants...</p> : 
       filteredData.length === 0 ? <p style={{textAlign:'center', color: '#94a3b8'}}>No applicants found for this view.</p> : (
        
        <div style={{display:'flex', flexDirection:'column', gap:'2rem', maxWidth:'1000px', margin:'0 auto'}}>
          
          {/* ✅ Filtered Data Map Kar Rahe Hain */}
          {filteredData.map(block => (
            <motion.div key={block.campaignId} initial={{opacity:0}} animate={{opacity:1}}>
              <h3 style={{color:'white', marginBottom:'1rem', borderLeft:'4px solid #818cf8', paddingLeft:'10px'}}>
                {block.campaignTitle}
              </h3>

              {block.applicants.length === 0 ? (
                <p style={{color:'#64748b', fontStyle:'italic'}}>No pending applications.</p>
              ) : (
                <div style={{display:'grid', gap:'1rem'}}>
                  {block.applicants.map(app => {
                    let profileId = app.influencerId;
                    if (typeof profileId === 'object' && profileId !== null) profileId = profileId._id || profileId.id;

                    return (
                      <div key={app.applicationId} className="glass-card" style={{padding:'1.2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem'}}>
                        
                        <div style={{flex: 1, minWidth:'250px'}}>
                          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <h4 style={{margin:0, fontSize:'1.1rem'}}>{app.influencerName}</h4>
                            <span style={{fontSize:'0.8rem', background:'rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:'10px'}}>
                              {app.influencerNiche}
                            </span>
                          </div>
                          
                          <div style={{display:'flex', gap:'8px', marginTop:'8px', flexWrap:'wrap'}}>
                            {app.socialLinks?.map((s, i) => (
                              <a key={i} href={s.url} target="_blank" rel="noreferrer" 
                                 style={{display:'flex', alignItems:'center', gap:'4px', color:'#94a3b8', textDecoration:'none', fontSize:'0.85rem', background:'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:'6px'}}>
                                 {getIcon(s.platform)} {s.followers || 0}
                              </a>
                            ))}
                          </div>

                          {profileId && (
                            <Link to={`/profile/${profileId}`} target="_blank" style={{display:'inline-flex', alignItems:'center', gap:'4px', color:'#818cf8', marginTop:'8px', textDecoration:'none', fontSize:'0.9rem'}}>
                              View Profile <ExternalLink size={14} />
                            </Link>
                          )}
                        </div>

                        <div style={{display:'flex', flexDirection:'column', alignItems:'end', gap:'5px'}}>
                           <span style={{color: app.status==='Accepted'?'#34d399':app.status==='Rejected'?'#f87171':'#fbbf24', fontWeight:600, fontSize:'0.9rem'}}>
                             {app.status}
                           </span>
                           {app.status === 'Applied' && (
                             <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                               <button className="btn-success" onClick={()=>updateStatus(app.applicationId, "Accepted")}>Accept</button>
                               <button className="btn-danger" onClick={()=>updateStatus(app.applicationId, "Rejected")}>Reject</button>
                             </div>
                           )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}