import { Link } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
export const Login = () => {
    const navigate = useNavigate()
    const { loading, handleLogin } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await handleLogin({
                email,
                password
            })
            toast.success("Login SuccessFully")
            setErrors({});
            setEmail("")
            setPassword("")
            navigate("/")
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {

                toast.error("Login failed");
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">

                {/* Heading */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm leading-5 text-slate-400">
                        Sign in to continue your AI-powered interview preparation.
                    </p>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="mb-1 block text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>

                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                            setErrors((prev) => ({
                                ...prev,
                                email: undefined,
                            }));
                        }}
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        className={`w-full rounded-xl px-4 py-2.5 bg-slate-900/70 text-white outline-none transition
    ${errors.email
                                ? "border border-red-500 focus:ring-red-500/20"
                                : "border border-slate-700 focus:border-pink-500 focus:ring-pink-500/20"
                            }`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.email[0]}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-2">
                    <div className="mb-1 flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>


                    </div>

                    <input
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);

                            setErrors((prev) => ({
                                ...prev,
                                password: undefined,
                            }));
                        }}
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className={`w-full rounded-xl px-4 py-2.5 bg-slate-900/70 text-white outline-none transition
    ${errors.password
                                ? "border border-red-500 focus:ring-red-500/20"
                                : "border border-slate-700 focus:border-pink-500 focus:ring-pink-500/20"
                            }`}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.password[0]}
                        </p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="mb-5 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                        <input
                            type="checkbox"
                            className="h-4 w-4 accent-pink-500"
                        />
                        Remember me
                    </label>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                >
                    Sign In
                </button>


                {/* Footer */}
                <p className="mt-5 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-pink-400 transition hover:text-pink-300"
                    >
                        Create Account
                    </Link>
                </p>

            </form>
        </div>
    );
};