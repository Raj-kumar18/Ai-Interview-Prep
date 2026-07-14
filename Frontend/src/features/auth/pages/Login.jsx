import { Link } from "react-router";

export const Login = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
            <form className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">

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
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    />
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
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    />
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
                    className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
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