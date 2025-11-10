import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function ProfilePublic() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/user/profile/${id}`).then(r => setUser(r.data));
  }, [id]);

  if (!user) return <p style={{textAlign:"center", marginTop:40}}>Loading profile...</p>;

  const initials = user.name
    ?.split(" ")
    .map(n => n[0]?.toUpperCase())
    .join("");

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
          justifyContent:"center", color:"#fff", fontSize:46, fontWeight:600
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
        <h2 style={{marginTop:12, marginBottom:4}}>{user.name}</h2>
        <p style={{color:"#666", marginBottom:2}}>
          {user.niche || "Influencer / Creator"}
        </p>

        {/* Reach Score Badge */}
        <span style={{
          display:"inline-block", marginTop:8, padding:"6px 14px",
          background:"#4a4aff", color:"white", borderRadius:8,
          fontSize:"14px", fontWeight:500
        }}>
          ⭐ Reach Score: {Math.round(user.reachScore || 0)}
        </span>
      </div>

      {/* Social Accounts */}
      <h3 style={{marginTop:32, marginBottom:12}}>Social Profiles</h3>

      <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        {user.socialLinks?.map((s, i) => (
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
              background:"#fafafa"
            }}
          >
            <span style={{fontWeight:500}}>{s.platform}</span>
            <span style={{color:"#666"}}>
              {s.followers ? `${s.followers} followers` : ""}
            </span>
          </a>
        ))}
      </div>

      {/* Optional Footer */}
      <p style={{textAlign:"center", marginTop:32, color:"#888"}}>
        CollabConnect Creator Profile
      </p>
    </div>
  );
}
