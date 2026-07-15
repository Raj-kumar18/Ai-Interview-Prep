import axios from "axios"

const api = axios.create({
    baseURL: "hinterviewprevai-production.up.railway.app/api/auth",
    withCredentials: true
})


export async function register({ username, email, password }) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password
        })

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}



export async function login({ email, password }) {
    try {
        const response = await api.post("/login", {
            email,
            password
        })

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function logout() {
    try {

        const response = await api.get("/logout")
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function logoutAll() {
    try {
        const response = await api.get("/logout-all")
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function verifyEmail({ email, otp }) {
    try {
        const response = await api.post("/verify-email", {
            email,
            otp
        })

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}
export async function refreshToken() {
    try {
        const response = await api.post("/refresh-token")

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}



export async function resendOtp({ email }) {
    try {
        const response = await api.post("/resend-otp", {
            email
        })

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getMe() {
    try {
        const response = await api.get("/getMe")
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function getAllSession() {
    try {
        const response = await api.get("/all-sessions")
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function revokeSession(sessionId) {
    try {
        const response = await api.post(`/revoke-session/${sessionId}`)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}