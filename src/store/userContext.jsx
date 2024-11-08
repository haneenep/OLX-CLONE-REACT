import { useState, useEffect, createContext } from "react";
import { auth } from "../util/firebase";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
export const AuthContext = createContext(null);

export default function Context({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        };
        setUser(userData);

        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
    return () => unSubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
Context.propTypes = {
  children: PropTypes.node.isRequired,
};
