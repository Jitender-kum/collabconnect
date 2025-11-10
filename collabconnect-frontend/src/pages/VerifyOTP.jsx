import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setEmail(params.get("email") || "");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", { email, code });
      setMsg(res.data.message);

      // ✅ redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <input className="input" placeholder="Email"
        value={email} onChange={e=>setEmail(e.target.value)} required />

      <input className="input" placeholder="Enter OTP"
        value={code} onChange={e=>setCode(e.target.value)} required />

      <button className="btn primary">Verify</button>

      {msg && <p style={{marginTop:10}}>{msg}</p>}
    </form>
  );
}
