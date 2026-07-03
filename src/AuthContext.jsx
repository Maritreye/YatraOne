import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // Firebase user object
  const [mongoUser, setMongoUser] = useState(null); // Atlas user (_id etc.)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch the corresponding Atlas user
        try {
          const res = await fetch(
            `http://localhost:5000/api/users/${firebaseUser.uid}`
          );
          if (res.ok) {
            const data = await res.json();
            setMongoUser(data);
          }
        } catch (err) {
          console.error("Failed to fetch mongo user:", err);
        }
      } else {
        setMongoUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, mongoUser, setMongoUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}