import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RegisterInfluencer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    niche: ""
  });

  const [links, setLinks] = useState([
    { platform: "", url: "", followers: "" }
  ]);

  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    // ✅ Validate dynamic `links` array
    const validLinks = links.filter(
      l => l.platform.trim() !== "" && l.url.trim() !== ""
    );

    if (validLinks.length === 0) {
      setMsg("At least one social account is required.");
      return;
    }

    // ✅ Ensure followers is a number
    validLinks.forEach(l => {
      l.followers = Number(l.followers || 0);
    });

    try {
      const payload = { ...form, links: validLinks };
      const { data } = await api.post("/auth/register-influencer", payload);

      setMsg("OTP sent to your email ✅ Redirecting...");
      
      // ✅ Redirect to OTP verification screen
      navigate("/verify-otp?email=" + form.email);

      // Reset fields
      setForm({ name: "", email: "", password: "", niche: "" });
      setLinks([{ platform: "", url: "", followers: "" }]);

    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <input
        className="input"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        className="input"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />

      <input
        className="input"
        placeholder="Niche (e.g., Travel, Fitness)"
        value={form.niche}
        onChange={e => setForm({ ...form, niche: e.target.value })}
      />

      {/* ✅ Social Links UI */}
      <h4 style={{ marginTop: 14 }}>Social Accounts</h4>

      {links.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <select
            className="input"
            style={{ width: "150px" }}
            value={item.platform}
            onChange={(e) => {
              const updated = [...links];
              updated[index].platform = e.target.value;
              setLinks(updated);
            }}
            required
          >
            <option value="">Platform</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="Twitter">X / Twitter</option>
            <option value="Facebook">Facebook</option>
            <option value="Other">Other</option>
          </select>

          <input
            className="input"
            placeholder="Profile URL or @username"
            value={item.url}
            onChange={(e) => {
              const updated = [...links];
              updated[index].url = e.target.value;
              setLinks(updated);
            }}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Followers (optional)"
            value={item.followers}
            onChange={(e) => {
              const updated = [...links];
              updated[index].followers = e.target.value;
              setLinks(updated);
            }}
            style={{ width: "160px" }}
          />

          {index > 0 && (
            <button
              type="button"
              onClick={() => setLinks(links.filter((_, i) => i !== index))}
              style={{ padding: "6px" }}
            >
              ✖
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn ghost"
        onClick={() => setLinks([...links, { platform: "", url: "", followers: "" }])}
      >
        + Add another account
      </button>

      <div className="muted">At least one social link is required.</div>

      <div className="kv">
        <button className="btn primary" type="submit">Create Account</button>
        {msg && <span className={`notice ${/Redirecting|OTP|✅/i.test(msg) ? "success" : "error"}`}>{msg}</span>}
      </div>
    </form>
  );
}
