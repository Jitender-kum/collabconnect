import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Info, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Campaigns.css"; // Styling reuse karenge

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Notifications fetch karo
    api.get("/notifications")
      .then(res => setList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
      
    // 2. Sabko "Read" mark kar do (Background mein)
    api.put("/notifications/read").catch(()=>{});
  }, []);

  // Icon helper based on type
  const getIcon = (type) => {
    if (type === "success") return <CheckCircle size={24} color="#34d399" />;
    if (type === "alert") return <AlertCircle size={24} color="#f87171" />;
    return <Info size={24} color="#818cf8" />;
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{textAlign:'left', display:'flex', alignItems:'center', gap:'1rem'}}>
        <button onClick={() => navigate(-1)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>
            <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="page-title" style={{fontSize:'2rem', marginBottom:0}}>Notifications</h1>
            <p className="page-subtitle" style={{margin:0}}>Recent updates on your activity.</p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading updates...</p>
        ) : list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
            <Bell size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
            <p>No new notifications yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {list.map((note, i) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card"
                style={{
                  padding: "1.2rem",
                  display: "flex",
                  alignItems: "start",
                  gap: "1rem",
                  borderLeft: note.type === 'success' ? '4px solid #34d399' : note.type === 'alert' ? '4px solid #f87171' : '4px solid #818cf8',
                  background: note.isRead ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.8)' // Unread thoda dark dikhega
                }}
              >
                <div style={{marginTop:'2px'}}>{getIcon(note.type)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: "1rem", color: "#fff", lineHeight: '1.4' }}>{note.message}</p>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
                {!note.isRead && <div style={{width:10, height:10, background:'#818cf8', borderRadius:'50%', marginTop:'6px'}}/>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}