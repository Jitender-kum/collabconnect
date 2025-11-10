import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function ProfilePublic() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ Safety Check: Agar ID nahi hai ya 'undefined' string hai, to call mat karo
    if (!id || id === "undefined" || id === "null") {
        setError("Invalid Profile ID");
        setLoading(false);
        return;
    }

    setLoading(true);
    api.get(`/user/profile/${id}`)
       .then(r => {
           setUser(r.data);
           setError("");
       })
       .catch(err => {
           console.error("Profile fetch error:", err);
           setError("Failed to load profile. User might not exist.");
       })
       .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{textAlign:"center", marginTop:40}}>Loading profile...</p>;
  if (error) return <p style={{textAlign:"center", marginTop:40, color: 'red'}}>{error}</p>;
  if (!user) return <p style={{textAlign:"center", marginTop:40}}>User not found.</p>;

  const initials = (user.name || user.brandName || "?")
    ?.split(" ")
    .map(n => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // Max 2 chars

  const Avatar = () => (
    user.profilePhoto ? (
      <img
        src={user.profilePhoto}
        alt="avatar"
        style={{
          width: 130, height: 130, borderRadius: "50%",
          objectFit: "cover", border: "3px solid #ddd"
        }}
      />
    ) : (
      <div
        style={{
          width: 130, height: 130, borderRadius: "50%",
          background: "#222", display:"flex", alignItems:"center",
          justifyContent:"center", color:"#fff", fontSize:46, fontWeight:600,
          margin: "0 auto" // Center align if flex parent
        }}
      >
        {initials}
      </div>
    )
  );

  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      padding: "28px",
      borderRadius: "14px",
      border: "1px solid #ddd",
      background: "white",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
    }}>

      <div style={{textAlign:"center"}}>
        <Avatar />
        <h2 style={{marginTop:12, marginBottom:4}}>{user.name || user.brandName}</h2>
        <p style={{color:"#666", marginBottom:2}}>
          {user.role === 'Brand' ? (user.industry || 'Brand') : (user.niche || "Influencer / Creator")}
        </p>

        {/* Reach Score Badge - Only for Influencers */}
        {user.role === 'Influencer' && (
            <span style={{
            display:"inline-block", marginTop:8, padding:"6px 14px",
            background:"#4a4aff", color:"white", borderRadius:8,
            fontSize:"14px", fontWeight:500
            }}>
            ⭐ Reach Score: {Math.round(user.reachScore || 0)}
            </span>
        )}
      </div>

      {/* Social Accounts or Website */}
      {user.role === 'Influencer' && user.socialLinks?.length > 0 && (
          <>
            <h3 style={{marginTop:32, marginBottom:12}}>Social Profiles</h3>
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                {user.socialLinks.map((s, i) => (
                <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                    padding:"10px 14px",
                    border:"1px solid #ddd",
                    borderRadius:"10px",
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    textDecoration:"none",
                    color:"#000",
                    background:"#fafafa",
                    transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#f0f0f0"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#fafafa"}
                >
                    <span style={{fontWeight:500, textTransform: 'capitalize'}}>{s.platform}</span>
                    <span style={{color:"#666"}}>
                    {s.followers ? `${s.followers.toLocaleString()} followers` : "View Profile"}
                    </span>
                </a>
                ))}
            </div>
          </>
      )}

      {user.role === 'Brand' && user.website && (
          <div style={{marginTop: 32, textAlign: 'center'}}>
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Visit Website
              </a>
          </div>
      )}

      {/* Optional Footer */}
      <p style={{textAlign:"center", marginTop:32, color:"#888", fontSize: '0.9em'}}>
        CollabConnect {user.role} Profile
      </p>
    </div>
  );
}