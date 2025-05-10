'use client';
const { useRouter } = require("next/navigation");
const { createContext, useState, useContext } = require("react");

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const router = useRouter();

    const [userLoggedIn, setUserLoggedIn] = useState(
        localStorage.getItem("token",) || false
    );

    const [email, setEmail] = useState(
        localStorage.getItem("email") || ''
    );



    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setUserLoggedIn(false);
        router.push('/Authentication');
    }

    return <AppContext.Provider value={{ userLoggedIn, setUserLoggedIn, logout, email, setEmail }}>
        {children}
    </AppContext.Provider>

}

const useAppContext = () => useContext(AppContext);

export default useAppContext;