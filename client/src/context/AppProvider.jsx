import { useState, useEffect } from "react";
import AppContext from "./AppContext";

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [openSidebar, setOpenSidebar] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    useEffect(() => {
        let userItem = localStorage.getItem('user')
        userItem = JSON.parse(userItem)
        setUser(userItem)
    }, [])
    return (
        <AppContext.Provider value={{ user, setUser, profileImage, setProfileImage, openSidebar, setOpenSidebar }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider