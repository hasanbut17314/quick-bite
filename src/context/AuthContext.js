// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Check if user is logged in on page load
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const expiry = localStorage.getItem("expiry");
//     if (token && expiry && new Date(expiry) > new Date()) {
//       setUser({ token });
//     } else {
//       localStorage.removeItem("token");
//       localStorage.removeItem("expiry");
//     }
//   }, []);

//   const login = (token) => {
//     const expiry = new Date();
//     expiry.setDate(expiry.getDate() + 3); // Set expiry to 3 days from now
//     localStorage.setItem("token", token);
//     localStorage.setItem("expiry", expiry.toISOString());
//     setUser({ token });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("expiry");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const expiry = localStorage.getItem("expiry");

    if (token && storedUser && expiry && new Date(expiry) > new Date()) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expiry");
    }
  }, []);

  const login = (token, userData) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 3); // Set expiry to 3 days from now

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("expiry", expiry.toISOString());

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiry");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
