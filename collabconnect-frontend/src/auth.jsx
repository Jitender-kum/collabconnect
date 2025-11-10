import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser]   = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  // sync localStorage on change
  useEffect(() => {
    if (token) localStorage.setItem("token", token); else localStorage.removeItem("token");
    if (user)  localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user");
  }, [token, user]);

  const login = (t, u) => { setToken(t); setUser(u); };
  const logout = () => { setToken(null); setUser(null); };

  return (
    <AuthCtx.Provider value={{ token, user, role: user?.role, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
