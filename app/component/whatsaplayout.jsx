








"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChatContext } from "../context/chatcontext";
import api from "../apicall";
import {
    Search,
    MoreVertical,
    ArrowLeft,
    LogOut,
    Settings,
    UserPlus,
    Users,
    Loader2,
    X,
    MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppLayout() {
    const pathname = usePathname();
    const hideLayout = pathname.startsWith("/chatlist/");

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const debounceTimeout = useRef(null);
    const { myUsername, login, setLogin } = useContext(ChatContext);
    const router = useRouter();

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, []);

    const logout = () => {
        localStorage.clear();
        setLogin(false)
        router.push("/login");
    };

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setUsers([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/search", { username: query });
            const data = response?.data;
            if (Array.isArray(data)) setUsers(data);
            else if (data && typeof data === "object" && !data.error) setUsers([data]);
            else setUsers([]);
        } catch (e) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInput = (text) => {
        setSearchQuery(text);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => searchUsers(text), 400);
    };

    const closeSearchModal = () => {
        setSearchOpen(false);
        setSearchQuery("");
        setUsers([]);
    };

    if (!login) return null;

    if (hideLayout) return null;

    return (
        <nav className="sticky top-0 z-50 bg-[#121b22] border-b border-slate-800/50 px-4 py-3 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    {/* WhatsApp Style Icon Container */}
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                        <MessageCircle
                            size={24}
                            className="text-white fill-white/20"
                            strokeWidth={2.5}
                        />
                    </div>

                    <div>
                        <h1 className="text-slate-100 font-black text-lg leading-tight tracking-tight">
                            Chat App
                        </h1>
                        <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {myUsername || "Guest"}
                        </p>
                    </div>
                </div>

                {/* Desktop/Tablet Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-all active:scale-90"
                    >
                        <Search size={22} />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`p-2.5 rounded-xl transition-all active:scale-90 ${menuOpen ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <MoreVertical size={22} />
                        </button>

                        {/* Animated Dropdown Menu */}
                        <AnimatePresence>
                            {menuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-14 right-0 bg-[#1f2c33] border border-slate-700 p-2 rounded-2xl shadow-2xl w-56 z-20 overflow-hidden"
                                    >
                                        {[
                                            { label: "New Group", icon: Users },
                                            { label: "Linked Devices", icon: UserPlus },
                                            { label: "Settings", icon: Settings },
                                        ].map((item, idx) => (
                                            <button
                                                key={idx}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 text-sm hover:bg-slate-700/50 rounded-xl transition-colors"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <item.icon size={18} className="text-slate-500" />
                                                {item.label}
                                            </button>
                                        ))}
                                        <div className="h-[1px] bg-slate-700 my-1 mx-2" />
                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 text-sm hover:bg-red-400/10 rounded-xl transition-colors font-semibold"
                                            onClick={logout}
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* --- Fullscreen Search Modal --- */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#0b0e11] z-[60] flex flex-col"
                    >
                        {/* Search Header */}
                        <div className="bg-[#121b22] p-4 flex items-center gap-4 shadow-xl">
                            <button onClick={closeSearchModal} className="p-2 text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft size={24} />
                            </button>
                            <div className="flex-1 relative group">
                                <input
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    placeholder="Search people..."
                                    className="w-full bg-[#202c33] text-white rounded-2xl py-3 pl-12 pr-4 outline-none ring-1 ring-slate-700 focus:ring-emerald-500/50 transition-all"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center mt-20 gap-3 text-slate-500">
                                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                                    <p className="text-sm font-medium">Searching users...</p>
                                </div>
                            ) : users.length > 0 ? (
                                <div className="space-y-2 max-w-2xl mx-auto">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-2 mb-4">Results</p>
                                    {users.map((user, index) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={user._id || index}
                                            onClick={() => {
                                                router.push(`/chatlist/${user._id || user.username}`);
                                                closeSearchModal();
                                            }}
                                            className="flex items-center p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl cursor-pointer hover:bg-slate-800 hover:border-emerald-500/30 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{user.username}</div>
                                                <div className="text-[12px] text-slate-500">Available to chat</div>
                                            </div>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md font-bold">START CHAT</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : searchQuery.trim().length > 0 ? (
                                <div className="text-center mt-20">
                                    <div className="text-4xl mb-4 text-slate-700 flex justify-center">😕</div>
                                    <p className="text-slate-400">No user found with "<span className="text-white">{searchQuery}</span>"</p>
                                </div>
                            ) : (
                                <div className="text-center mt-20 flex flex-col items-center opacity-30">
                                    <Search size={64} className="mb-4 text-slate-600" />
                                    <p className="text-slate-500 max-w-[200px]">Find your friends by their username</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}