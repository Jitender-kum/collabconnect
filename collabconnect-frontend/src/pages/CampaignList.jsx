import { useEffect, useState } from "react";
import api from "../api";

export default function CampaignList() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    api.get("/campaign/list")
      .then(r => { setList(r.data); setMsg(""); })
      .catch(() => setMsg("Failed to load"));
  }, []);

  const apply = async (id) => {
    setMsg("Applying...");
    try {
      const { data } = await api.post("/application/apply", { campaignId: id });
      setMsg(data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <>
      {msg && <p className="muted">{msg}</p>}
      <div className="grid cards">
        {list.map(c=>(
          <div key={c._id} className="card">
            <h3>{c.title}</h3>
            <p className="muted">{c.description}</p>
            <div className="kv">
              <b>Budget:</b> ₹{c.budget}
            </div>
            <div style={{marginTop:10}}>
              <button className="btn" onClick={()=>apply(c._id)}>Apply</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
