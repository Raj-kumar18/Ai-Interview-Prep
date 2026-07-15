import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
export const Otp = () => {
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [email, setEmail] = useState("");
    const { loading, handleVerifyEmail, handleResendOtp } = useAuth()
    const [errors, setErrors] = useState({})
    const inputRef = useRef([]);

    useEffect(() => {
        inputRef.current[0]?.focus();
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;

        setErrors((prev) => ({
            ...prev,
            otp: undefined,
        }));

        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);

        setOtp(newOtp);

        if (value && index < inputRef.current.length - 1) {
            inputRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    };

    const handleClick = (index) => {
        inputRef.current[index]?.setSelectionRange(1, 1);

        const firstEmpty = otp.indexOf("");

        if (firstEmpty !== -1 && firstEmpty < index) {
            inputRef.current[firstEmpty]?.focus();
        }
    };

    const otpSubmit = async (e) => {
        e.preventDefault();

        const combineOtp = otp.join("");

        if (combineOtp.length !== 4) {
            return toast.error("Please enter a valid OTP");
        }

        try {
            await handleVerifyEmail({
                email,
                otp: combineOtp,
            });

            toast.success("Email verified successfully");

            setErrors({});
            setEmail("");
            setOtp(new Array(4).fill(""));

            navigate("/login");

        } catch (error) {

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || "Email verification failed");
            }
        }
    };

    const otpReset = async () => {
        try {
            await handleResendOtp({
                email,
            });

            toast.success("OTP sent successfully");

            setErrors({});
            setOtp(new Array(4).fill(""));

        } catch (error) {

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || "Email verification failed");
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
            <form
                onSubmit={otpSubmit}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl"
            >
                {/* Heading */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Verify Email
                    </h1>

                    <p className="mt-2 text-sm leading-5 text-slate-400">
                        Enter the 4-digit verification code sent to your email.
                    </p>
                </div>

                {/* Email */}
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="mb-1 block text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                            setErrors((prev) => ({
                                ...prev,
                                email: undefined,
                            }));
                        }}
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

                {/* OTP */}
                <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-slate-300">
                        Verification Code
                    </label>

                    <div className="flex  gap-2">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRef.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onClick={() => handleClick(index)}
                                className={`h-14 w-14 rounded-xl border border-slate-700 bg-slate-900/70 text-center text-xl font-semibold text-white outline-none transition
      ${errors.otp?.[index]
                                        ? "border-red-500 focus:ring-red-500/20"
                                        : "focus:border-pink-500 focus:ring-pink-500/20"
                                    }`}
                            />

                        ))}

                    </div>
                    {errors.otp && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.otp[0]}
                        </p>
                    )}
                </div>

                {/* Button */}
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                {/* Footer */}
                <div className="mt-5 text-center flex items-baseline justify-ceter gap-2">
                    <p className="text-sm text-slate-400">
                        Didn't receive the code?
                    </p>

                    <button
                        type="button"
                        onClick={otpReset}
                        className="mt-2 text-sm font-semibold cursor-pointer text-pink-400 transition hover:text-pink-300"
                    >
                        Resend OTP
                    </button>
                </div>
            </form>
        </div>
    );
};