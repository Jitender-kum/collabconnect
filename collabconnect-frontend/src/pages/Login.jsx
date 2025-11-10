import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();   // ✅ Correct: hook used INSIDE component
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("Logging in...");

    try {
      const { data } = await api.post("/auth/login", form);

      // ✅ Update global auth state
      login(data.token, data.user);

      setMsg("Login Successful ✅ Redirecting...");
      setTimeout(() => navigate("/dashboard"), 600);

    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <input className="input" type="email" placeholder="Email" value={form.email}
        onChange={e=>setForm({...form, email:e.target.value})} required />

      <input className="input" type="password" placeholder="Password" value={form.password}
        onChange={e=>setForm({...form, password:e.target.value})} required />

      <div className="kv">
        <button className="btn primary" type="submit">Login</button>
        {msg && <span className={`notice ${/Successful|Redirect/i.test(msg)?'success':'error'}`}>{msg}</span>}
      </div>
    </form>
  );
}
