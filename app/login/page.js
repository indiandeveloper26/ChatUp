"use client";
import { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatContext } from "../context/chatcontext";
import api from "../apicall";
import { User, Lock, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { setMyUsername, setLogin, updatePremium } = useContext(ChatContext);

    const validate = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username zaroori hai";
        if (!password) newErrors.password = "Password enter karein";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setErrors({});

        try {
            const { data } = await api.post("/log", {
                username: username.toLowerCase(),
                password,
            });

            if (data.token) localStorage.setItem("tokenn", data.token);
            if (data.user?.username) {
                localStorage.setItem("username", data.user.username);
                setMyUsername(data.user.username);
            }

            if (data.userdata) {
                if (data.userdata.premiumExpiry)
                    localStorage.setItem("premiumExpiry", data.userdata.premiumExpiry);
                if (data.userdata.isPremium !== undefined) {
                    localStorage.setItem("isPremium", data.userdata.isPremium.toString());
                    updatePremium(data.userdata.isPremium, data.userdata.premiumExpiry);
                }
            }

            toast.success("login successfully");

            setLogin(true);
            router.push("/chatlist");
        } catch (err) {
            console.error(err);
            setErrors({ general: "Invalid Username or Password" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#050505] overflow-hidden p-6">

            {/* --- Animated Mesh Gradients --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="z-10 w-full max-w-[420px]"
            >
                {/* --- Glass Card --- */}
                <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">

                    {/* Glowing Top Edge */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4 transform hover:rotate-6 transition-transform">
                            <Sparkles className="text-white" size={30} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">CodeFlux Chat</h2>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Please enter your details</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {errors.general && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-medium"
                            >
                                {errors.general}
                            </motion.div>
                        )}

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account ID</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value); setErrors({}); }}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-white/[0.05] transition-all"
                                />
                            </div>
                            {errors.username && <p className="text-red-400 text-[10px] ml-1">{errors.username}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Secret Key</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                                    className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-white/[0.05] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-[10px] ml-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-xl shadow-white/5"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Log In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{" "}
                            <span
                                onClick={() => router.push("/singupp")}
                                className="text-white font-semibold cursor-pointer hover:underline underline-offset-4"
                            >
                                Sign Up
                            </span>
                        </p>
                    </div>
                </div>

                {/* Bottom Trust Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="h-[1px] w-8 bg-gray-500" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Secure Encryption Active</span>
                    <div className="h-[1px] w-8 bg-gray-500" />
                </div>
            </motion.div>
        </div>
    );
}