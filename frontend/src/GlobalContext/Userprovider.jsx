import { createContext } from "react"
import { useState,useContext } from "react"

export const UserContext=createContext(null);

const Userprovider=({children})=>{
     const[user,setUser]=useState(null);
     return(
<UserContext.Provider value={{user,setUser}}>
        {children}
    </UserContext.Provider>
     )
}

export default Userprovider
