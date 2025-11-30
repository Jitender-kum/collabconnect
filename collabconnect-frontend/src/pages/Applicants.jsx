import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { Instagram, Youtube, Twitter, Facebook, ExternalLink, ArrowLeft, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import "./Campaigns.css";

export default function Applicants() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const filterCampaignId = searchParams.get("cid");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: Tab State ('applied' | 'accepted' | 'rejected' | 'all')
  const [statusFilter, setStatusFilter] = useState("applied");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = () => {
    setLoading(true);
    api.get("/applicants/brand")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.post("/application/update-status", { applicationId, status });
      fetchApplicants(); // Refresh data to move item to correct tab
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

  // --- FILTER LOGIC ---
  const getFilteredApplicants = (applicants) => {
    if (statusFilter === 'all') return applicants;
    // Database mein status Capitalize ho sakta hai (Applied, Accepted, Rejected)
    // Isliye compare karte waqt dhyan rakhein
    return applicants.filter(app => app.status.toLowerCase() === statusFilter.toLowerCase());
  };

  // Campaign Filter (URL wala) + Status Filter (Tab wala)
  const displayData = data
    .filter(block => filterCampaignId ? block.campaignId === filterCampaignId : true)
    .map(block => ({
      ...block,
      applicants: getFilteredApplicants(block.applicants)
    }))
    .filter(block => block.applicants.length > 0); // Jisme applicants nahi bache use mat dikhao

  return (
    <div className="page-container">
      <div className="page-header" style={{textAlign:'left', marginBottom:'1.5rem'}}>
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          {filterCampaignId && (
            <button onClick={() => nav("/brand/campaigns")} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>
               <ArrowLeft size={24} />
            </button>
          )}
          <div>
              <h1 className="page-title" style={{fontSize:'2rem', marginBottom:0}}>
                {filterCampaignId ? "Campaign Applicants" : "Manage Applications"}
              </h1>
              <p className="page-subtitle" style={{margin:0}}>Review and shortlist creators.</p>
          </div>
        </div>
      </div>

      {/* ✅ TABS SECTION */}
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'1rem'}}>
        {[
          { key: 'applied', label: 'Pending', icon: <Clock size={16}/> },
          { key: 'accepted', label: 'Accepted', icon: <CheckCircle size={16}/> },
          { key: 'rejected', label: 'Rejected', icon: <XCircle size={16}/> },
          { key: 'all', label: 'All History', icon: <Filter size={16}/> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              background: statusFilter === tab.key ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
              color: statusFilter === tab.key ? '#a5b4fc' : '#94a3b8',
              border: statusFilter === tab.key ? '1px solid #818cf8' : '1px solid transparent',
              padding: '8px 16px', borderRadius: '20px', cursor:'pointer',
              display:'flex', alignItems:'center', gap:'6px', fontWeight:500, transition:'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? <p style={{textAlign:'center', color: '#94a3b8'}}>Loading...</p> : 
       displayData.length === 0 ? (
         <div style={{textAlign:'center', padding:'3rem', color:'#64748b', background:'rgba(255,255,255,0.02)', borderRadius:'16px'}}>
           <p>No {statusFilter} applicants found.</p>
         </div>
       ) : (
        
        <div style={{display:'flex', flexDirection:'column', gap:'2rem', maxWidth:'1000px', margin:'0 auto'}}>
          
          {displayData.map(block => (
            <motion.div key={block.campaignId} initial={{opacity:0}} animate={{opacity:1}}>
              <h3 style={{color:'white', marginBottom:'1rem', borderLeft:'4px solid #818cf8', paddingLeft:'10px', fontSize:'1.2rem'}}>
                {block.campaignTitle} <span style={{fontSize:'0.9rem', color:'#64748b', fontWeight:'normal'}}>({block.applicants.length})</span>
              </h3>

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
                         <span style={{
                           color: app.status==='Accepted'?'#34d399':app.status==='Rejected'?'#f87171':'#fbbf24', 
                           fontWeight:600, fontSize:'0.9rem',
                           background: app.status==='Accepted'?'rgba(52,211,153,0.1)':app.status==='Rejected'?'rgba(248,113,113,0.1)':'rgba(251,191,36,0.1)',
                           padding: '4px 10px', borderRadius:'6px'
                         }}>
                           {app.status}
                         </span>
                         
                         {/* Action Buttons Sirf Pending tab mein dikhao */}
                         {app.status === 'Applied' && (
                           <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                             <button className="btn-success" onClick={()=>updateStatus(app.applicationId, "Accepted")}>Accept</button>
                             <button className="btn-danger" onClick={()=>updateStatus(app.applicationId, "Rejected")}>Reject</button>
                           </div>
                         )}
                         
                         {/* Agar Accepted/Rejected tab mein hai to wapas Undo karne ka option bhi de sakte ho (Optional) */}
                         {statusFilter !== 'applied' && statusFilter !== 'all' && (
                            <button 
                              onClick={()=>updateStatus(app.applicationId, "Applied")} 
                              style={{fontSize:'0.8rem', color:'#94a3b8', background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline'}}
                            >
                              Undo Action
                            </button>
                         )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}