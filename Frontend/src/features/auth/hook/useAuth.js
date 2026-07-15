import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { getAllSession, login, logout, logoutAll, refreshToken, register, resendOtp, verifyEmail, revokeSession } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({ email, password });

            setUser(data.user);

            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }


    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }


    const handleLogoutAll = async () => {
        setLoading(true)
        try {
            const data = await logoutAll()
            setUser(null)
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }


    const handleRefreshToken = async () => {
        setLoading(true)
        try {
            await refreshToken()
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyEmail = async ({ email, otp }) => {
        setLoading(true)
        try {
            const data = await verifyEmail({ email, otp })

            console.log(data)
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }


    const handleResendOtp = async ({ email }) => {
        setLoading(true)
        try {
            const data = await resendOtp({ email })
            setUser(data.user)
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleAllSession = async () => {
        try {
            const data = await getAllSession()
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const handleRevokeSession = async (sessionId) => {
        setLoading(true)
        try {
            const data = await revokeSession(sessionId)
            return data
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleLogoutAll,
        handleRefreshToken,
        handleResendOtp,
        handleVerifyEmail,
        handleAllSession,
        handleRevokeSession
    };
};