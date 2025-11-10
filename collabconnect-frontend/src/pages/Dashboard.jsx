import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    api.get("/user/me")
      .then(res => {
        setMe(res.data);
        setMsg("");
      })
      .catch((err) => {
        console.error("Dashboard API Error:", err);
        setMsg("Session expired. Please login again.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
      });
  }, [navigate]);

  if (!me) return <p style={{ textAlign: 'center', marginTop: 20 }}>{msg}</p>;

  // ✅ UNIVERSAL ID GETTER: _id ya id jo bhi mile le lo
  const userId = me._id || me.id;
  console.log(me);

  return (
    <div className="card">
      {me.role === "Influencer" && (
        <>
          <div style={{ marginBottom: 20 }}>
              <p><b>Name:</b> {me.name}</p>
              <p><b>Niche:</b> {me.niche || "-"}</p>
              <p><b>Reach:</b> {Math.round(me.reachScore || 0)}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* ✅ SUPER SAFE LINK */}
              {userId ? (
                <Link className="btn primary" to={`/profile/${userId}`}>
                  View Public Profile
                </Link>
              ) : (
                <button className="btn primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                   Profile Not Ready
                </button>
              )}

              <Link className="btn ghost" to="/campaigns">Browse Campaigns</Link>
          </div>
        </>
      )}

      {me.role === "Brand" && (
        <>
           <div style={{ marginBottom: 20 }}>
              <p><b>Brand:</b> {me.brandName}</p>
              <p><b>Website:</b> {me.website ? <a href={me.website} target="_blank" rel="noopener noreferrer">{me.website}</a> : "-"}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link className="btn primary" to="/campaign/create">Create Campaign</Link>
              <Link className="btn ghost" to="/applicants">View Applicants</Link>
          </div>
        </>
      )}

      <hr style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <button
        className="btn error"
        onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}