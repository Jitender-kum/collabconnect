import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ add this
import api from "../api";

export default function RegisterBrand() {
  const navigate = useNavigate(); // ✅ initialize navigation

  const [form, setForm] = useState({
    brandName: "",
    email: "",
    password: "",
    website: "",
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("Submitting...");
    try {
      const { data } = await api.post("/auth/register-brand", form);

      setMsg(data.message || "Registered!");

      // ✅ Redirect to OTP Verification Page with email attached
      setTimeout(() => {
        navigate("/verify-otp?email=" + form.email);
      }, 800);

    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <form className="form" onSubmit={submit}>

      <input
        className="input"
        placeholder="Brand Name"
        value={form.brandName}
        onChange={(e) => setForm({ ...form, brandName: e.target.value })}
        required
      />

      <input
        className="input"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <input
        className="input"
        placeholder="Website (optional)"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />

      <div className="kv">
        <button className="btn primary" type="submit">
          Create Account
        </button>

        {msg && (
          <span className={`notice ${/Registered|✅/i.test(msg) ? "success" : "error"}`}>
            {msg}
          </span>
        )}
      </div>

    </form>
  );
}
