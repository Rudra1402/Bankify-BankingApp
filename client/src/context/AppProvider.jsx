import { useState, useEffect } from "react";
import { getNotifications } from "../apis/apis";
import AppContext from "./AppContext";

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [openSidebar, setOpenSidebar] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [notifications, setNotifications] = useState(null);
    useEffect(() => {
        if (!user) {
            let userItem = localStorage.getItem('user')
            userItem = JSON.parse(userItem)
            setUser(userItem)
        }
    }, [])
    useEffect(() => {
        if (user) {
            getNotifications(user?.id, setNotifications);
        }
    }, [user])
    return (
        <AppContext.Provider value={{ user, setUser, profileImage, setProfileImage, openSidebar, setOpenSidebar, notifications, setNotifications }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider