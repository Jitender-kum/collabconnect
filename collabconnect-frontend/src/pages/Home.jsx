import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Shield, Globe, ArrowRight } from "lucide-react"; // Icons import
import "./Home.css";

export default function Home() {
  
  // Animations setup
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <span className="hero-badge">🚀 The Future of Influencer Marketing</span>
          
          <h1 className="hero-title">
            Connect. Collaborate. <br />
            <span className="gradient-text">Create Impact.</span>
          </h1>
          
          <p className="hero-subtitle">
            CollabConnect bridges the gap between brands and creators. 
            No middlemen, just direct and secure partnerships.
          </p>

          <div className="cta-group">
            <Link to="/register/brand" className="btn-large btn-glow">
              Hire Influencers
            </Link>
            <Link to="/register/influencer" className="btn-large btn-outline">
              Join as Creator
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why choose CollabConnect?
        </motion.h2>

        <div className="features-grid">
          {/* Feature 1 */}
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-icon"><Zap size={28} /></div>
            <h3>Fast & Direct</h3>
            <p>Connect directly with top brands and creators. No agencies, no delays, just results.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="feature-icon"><Shield size={28} /></div>
            <h3>Secure Platform</h3>
            <p>Verified profiles and transparent campaign tracking ensure your collaborations are safe.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="feature-icon"><Globe size={28} /></div>
            <h3>Global Reach</h3>
            <p>Scale your brand globally by tapping into a diverse network of influencers.</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}