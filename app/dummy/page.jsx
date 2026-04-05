"use client"
"use client";
import React, { useState, useRef, useEffect } from "react";

export default function WhatsAppTopbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="relative flex items-center justify-between px-4 py-2 bg-[#075E54] text-white shadow-md">
            {/* Left side - Title */}
            <h1 className="text-lg font-semibold tracking-wide">WhatsApp</h1>

            {/* Right side - Icons */}
            <div className="flex items-center gap-4 relative" ref={menuRef}>
                {/* Search icon */}
                <button className="hover:text-gray-200" title="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z" />
                    </svg>
                </button>

                {/* Add icon */}
                <button className="hover:text-gray-200" title="New chat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                {/* 3-dot menu */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="hover:text-gray-200"
                    title="Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute right-0 top-10 w-40 bg-white text-black rounded-md shadow-lg overflow-hidden z-20">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            New group
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            New broadcast
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            Linked devices
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            Settings
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
