import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import "./Auth.css";

export default function RegisterInfluencer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", niche: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Social links empty array bhej rahe hain abhi ke liye simplicity ke liye
      await api.post("/auth/register-influencer", { ...form, links: [] });
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
        <h2 className="auth-title">Join as Creator</h2>
        <p className="auth-subtitle">Showcase your portfolio and get hired</p>

        {msg && <div className="error-msg">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="auth-input" type="text" placeholder="e.g. Rahul Sharma" 
              onChange={e => setForm({...form, name: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Niche / Category</label>
            <input className="auth-input" type="text" placeholder="e.g. Tech, Fashion, Travel" 
              onChange={e => setForm({...form, niche: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="auth-input" type="email" placeholder="you@example.com" 
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="auth-input" type="password" placeholder="Create a strong password" 
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Join Now"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
}