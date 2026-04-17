"use client";
import React, { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatContext } from "../context/chatcontext";
import api from "../apicall";
import { User, Lock, Eye, EyeOff, Loader2, UserPlus, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { setMyUsername, updatePremium, setLogin } = useContext(ChatContext);
    const router = useRouter();

    const validate = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Min 6 characters required";

        if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";
        else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const lowerUsername = username.toLowerCase();

        try {
            const { data } = await api.post("/singup", {
                username: lowerUsername,
                password,
            });

            if (data.token) localStorage.setItem("tokenn", data.token);
            if (data.user?.username) {
                localStorage.setItem("username", data.user.username);
                setMyUsername(data.user.username);
            }

            if (data.user?.premiumExpiry) {
                localStorage.setItem("premiumExpiry", data.user.premiumExpiry);
            }
            if (data.user?.isPremium !== undefined) {
                localStorage.setItem("isPremium", data.user.isPremium.toString());
                updatePremium(data.user.isPremium, data.user.premiumExpiry);
            }

            toast.success("singup successfully");

            setLogin(true);
            router.push("/chatlist");
        } catch (error) {
            console.error(error);
            setErrors({ general: "Signup failed. Username might be taken." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#050505] overflow-hidden p-6">

            {/* --- Dynamic Background Glows --- */}
            <div className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-[440px]"
            >
                {/* --- Main Card --- */}
                <div className="bg-[#0f0f0f]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                            <UserPlus className="text-white" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                        <p className="text-gray-500 text-sm mt-1">Start your journey with <span className="text-blue-400">CodeFlux</span></p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <AnimatePresence>
                            {errors.general && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] py-2 px-4 rounded-xl text-center font-medium"
                                >
                                    {errors.general}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Identity</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value); setErrors({}); }}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                            {errors.username && <p className="text-red-400 text-[10px] ml-2 mt-1">{errors.username}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Choose Password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-[10px] ml-2 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Verify</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-[10px] ml-2 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-blue-600/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Free Account"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Member already?{" "}
                            <span
                                onClick={() => router.push("/login")}
                                className="text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors"
                            >
                                Sign In
                            </span>
                        </p>
                    </div>
                </div>

                {/* --- Bottom Badge --- */}
                <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-full">
                        <Sparkles className="text-blue-400" size={14} />
                        <p className="text-[11px] text-blue-200/70 font-medium">New users get 2 days Premium access!</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}