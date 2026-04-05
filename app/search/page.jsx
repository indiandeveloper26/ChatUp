"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "../apicall";

export default function page() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const debounceTimeout = useRef(null);
    const router = useRouter();

    // Dark mode detection
    const isDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

    useEffect(() => {
        // Fetch username from localStorage
        const uname = localStorage.getItem("username");
        if (uname) setUsername(uname.toLowerCase());
    }, []);

    const fetchSearchResults = async (text) => {
        if (!text.trim()) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/search", { username: text });
            if (response?.data?.username) {
                setData([{ username: response.data.username }]);
            } else {
                setData([]);
            }
        } catch (err) {
            console.log("Search Error:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInput = (text) => {
        setSearchTerm(text);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => fetchSearchResults(text), 400);
    };

    const handleUserClick = (clickedUsername) => {
        if (!username) {
            alert("Please login first.");
            return;
        }
        router.push(`/chatlist/${clickedUsername.username}`);
    };

    return (
        <div style={{
            minHeight: "100vh",
            padding: "2rem",
            background: isDark ? "linear-gradient(to right, #000428, #004e92)" : "linear-gradient(to right, #00c6ff, #0072ff)",
            color: "#fff",
            fontFamily: "sans-serif",
        }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>🔍 Find Friends</h1>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search username..."
                style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "none",
                    marginBottom: "1rem",
                    backgroundColor: isDark ? "#ffffff11" : "#ffffff22",
                    color: "#fff",
                }}
            />

            {loading ? (
                <div style={{ marginTop: "2rem" }}>Loading...</div>
            ) : data.length ? (
                <div style={{ marginTop: "1rem" }}>
                    {data.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleUserClick(item)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0.75rem 1rem",
                                marginBottom: "0.5rem",
                                borderRadius: "12px",
                                backgroundColor: isDark ? "#1f1f1fbb" : "#ffffffdd",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ marginRight: "1rem", fontSize: "1.5rem" }}>👤</div>
                            <strong style={{ color: isDark ? "#fff" : "#333" }}>{item.username}</strong>
                        </div>
                    ))}
                </div>
            ) : searchTerm.length > 0 ? (
                <div style={{ marginTop: "2rem", textAlign: "center", color: "#eee" }}>No user found.</div>
            ) : null}
        </div>
    );
}
