import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CampaignCreate() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ title: "", description: "", budget: "" });

  useEffect(() => {
    api.get("/user/me")
      .then(r => {
        setMe(r.data);
        if (r.data.role !== "Brand") {
          setMsg("Only Brand can create campaigns");
          setTimeout(()=>nav("/dashboard"), 800);
        }
      })
      .catch(() => nav("/login"));
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("Creating...");
    try {
      const { data } = await api.post("/campaign/create", {
        ...form,
        budget: Number(form.budget || 0)
      });
      setMsg(data.message || "Created");
      setForm({ title:"", description:"", budget:"" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  if (!me) return <p>Loading...</p>;
  return !me ? <p>Loading...</p> : (
    <form className="form" onSubmit={submit}>
      <input className="input" placeholder="Title" value={form.title}
        onChange={e=>setForm({...form, title:e.target.value})} required />
      <textarea className="textarea" placeholder="Description" value={form.description}
        onChange={e=>setForm({...form, description:e.target.value})} required />
      <input className="input" type="number" placeholder="Budget (₹)" value={form.budget}
        onChange={e=>setForm({...form, budget:e.target.value})} required />
      <div className="kv">
        <button className="btn success" type="submit">Create</button>
        {msg && <span className={`notice ${/Created|✅/i.test(msg)?'success':'error'}`}>{msg}</span>}
      </div>
    </form>
  );
}
