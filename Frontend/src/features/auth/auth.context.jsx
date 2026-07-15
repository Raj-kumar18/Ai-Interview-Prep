import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api.js";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                console.log(data)
                setUser(data.user)
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error(error);
                    setUser(null);
                }
            }
            finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])


    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}
