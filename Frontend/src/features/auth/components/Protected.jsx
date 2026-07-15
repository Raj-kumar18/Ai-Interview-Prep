import { useAuth } from "../hook/useAuth";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {

    const { user, loading } = useAuth()

    console.log(user)

    if (loading) {
        return (
            <h1 className="tetx-center text-4xl flex items-center justify-center h-screen w-screen">Loading...</h1>
        )
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default Protected