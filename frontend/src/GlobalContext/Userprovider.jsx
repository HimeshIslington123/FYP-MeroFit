import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(null);

const Userprovider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");


        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:4000/api/users/userdetail",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
       
        setUser(null);
      } finally {

        setLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default Userprovider;