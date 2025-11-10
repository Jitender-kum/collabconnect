import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Applicants() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    api.get("/user/me")
      .then(r => {
        setMe(r.data);
        if (r.data.role !== "Brand") {
          setMsg("Only Brand can view applicants");
          setTimeout(()=>nav("/dashboard"), 800);
          return;
        }
        return api.get("/applicants/brand");
      })
      .then(r => { if (r) { setData(r.data); setMsg(""); }})
      .catch(() => setMsg("Login again / Token invalid"));
  }, [nav]);

  const updateStatus = async (applicationId, status) => {
    try {
      setMsg(`Updating to ${status}...`);

      if (status === "Rejected") {
        setData(prev =>
          prev.map(block => ({
            ...block,
            applicants: block.applicants.filter(a => String(a.applicationId) !== String(applicationId))
          }))
        );
      }
      
      await api.post("/application/update-status", { applicationId, status });

      const fresh = await api.get("/applicants/brand");
      setData(fresh.data);

      setMsg(`Application ${status} ✅`);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  // ✅ Social Link Component
  const LinkList = ({ links }) => {
    if (!links || links.length === 0) return null;

    return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"6px" }}>
        {links.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noreferrer"
            style={{ padding:"4px 8px", border:"1px solid var(--border)", borderRadius:"8px" }}>
            {s.platform} {s.followers ? `(${s.followers})` : ""}
          </a>
        ))}
      </div>
    );
  };

  // ✅ Followers + Reach Score Display
  const CountRow = ({ f = {}, reachScore = 0 }) => {
    const fmt = (n) => {
      const x = Number(n||0);
      if (x >= 1_000_000) return (x/1_000_000).toFixed(1) + "M";
      if (x >= 1_000)    return (x/1_000).toFixed(1) + "k";
      return x.toString();
    };

    return (
      <div style={{ display:"flex", gap:"6px", marginTop:"6px", flexWrap:"wrap" }}>
        <span className="link" style={{padding:"4px 8px", border:"1px solid var(--border)", borderRadius:"8px"}}>IG: {fmt(f.instagram)}</span>
        <span className="link" style={{padding:"4px 8px", border:"1px solid var(--border)", borderRadius:"8px"}}>YT: {fmt(f.youtube)}</span>
        <span className="link" style={{padding:"4px 8px", border:"1px solid var(--border)", borderRadius:"8px"}}>X: {fmt(f.twitter)}</span>
        <span className="link" style={{padding:"4px 8px", border:"1px solid var(--border)", borderRadius:"8px"}}>FB: {fmt(f.facebook)}</span>
        <span className="btn ghost" style={{padding:"4px 10px"}}>Reach Score: {fmt(reachScore)}</span>
      </div>
    );
  };

  if (!me) return <p>{msg}</p>;

  return (
    <div>
      <h2>Applicants</h2>
      {msg && <p>{msg}</p>}

      {data.length === 0 && <p>No applicants yet.</p>}

      <div style={{ display:"grid", gap:16 }}>
        {data.map(block => (
          <div key={block.campaignId} className="card">
            <h3>{block.campaignTitle}</h3>

            {block.applicants.length === 0 ? (
              <p>No applications</p>
            ) : (
              block.applicants.map(app => (
                <div key={app.applicationId}
                  style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderTop:"1px dashed #ddd" }}>

                  <div style={{ flex:1 }}>
                    <div><b>{app.influencerName}</b> — {app.influencerNiche || "-"}</div>
                    <div>Status: <b>{app.status}</b></div>

                    <LinkList links={app.socialLinks} />
                    <CountRow f={app.followerCounts} reachScore={app.reachScore} />

                    {/* ✅ Public Profile Link */}
                    <a href={`/profile/${app.influencerId}`} target="_blank" className="btn ghost" style={{marginTop:"8px"}}>
                      View Profile
                    </a>
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>updateStatus(app.applicationId, "Accepted")}>Accept</button>
                    <button onClick={()=>updateStatus(app.applicationId, "Rejected")}>Reject</button>
                  </div>
                </div>
              ))
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
