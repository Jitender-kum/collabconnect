import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      navigate("/login");
      return;
    }
    api.get("/user/me")
      .then(res => setMe(res.data))
      .catch(() => setMsg("Token invalid / Login again ❌"));
  }, [navigate]);

  if (!me) return <p>{msg}</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p><b>Role:</b> {me.role}</p>
      {me.role === "Influencer" ? (
        <p>Welcome, {me.name}! Niche: {me.niche || "-"}</p>
      ) : (
        <p>Welcome, {me.brandName}! Website: {me.website || "-"}</p>
      )}

 <button className="btn ghost" onClick={()=>{ localStorage.clear(); navigate("/login"); }}>
  Logout
</button>

    </div>
  );
}
