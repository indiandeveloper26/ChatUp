"use client"


import React, { useState, useEffect } from "react";
import api from "../apicall"

export default function FollowingModal({ userId, onClose }) {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const res = await api.get(`/following/${userId}`);
                setFollowing(res.data.following);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFollowing();
    }, [userId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-80 max-h-[70vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Following</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    following.map(u => (
                        <div key={u._id} className="flex items-center gap-3 mb-2">
                            <img
                                src={`http://localhost:5000${u.avatar || "/default-avatar.png"}`}
                                alt={u.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <span>{u.name}</span>
                        </div>
                    ))
                )}
                <button onClick={onClose} className="mt-4 px-3 py-1 bg-gray-300 rounded">Close</button>
            </div>
        </div>
    );
}
