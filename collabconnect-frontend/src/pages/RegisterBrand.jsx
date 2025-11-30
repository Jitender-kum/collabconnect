import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import "./Auth.css";

export default function RegisterBrand() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ brandName: "", email: "", password: "", website: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register-brand", form);
      alert("Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="auth-title">Hire Creators</h2>
        <p className="auth-subtitle">Create a brand account to post campaigns</p>

        {msg && <div className="error-msg">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Brand Name</label>
            <input className="auth-input" type="text" placeholder="e.g. Nike, TechStart" 
              onChange={e => setForm({...form, brandName: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Website (Optional)</label>
            <input className="auth-input" type="text" placeholder="https://yourbrand.com" 
              onChange={e => setForm({...form, website: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Work Email</label>
            <input className="auth-input" type="email" placeholder="contact@brand.com" 
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="auth-input" type="password" placeholder="Create a strong password" 
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Brand Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
}