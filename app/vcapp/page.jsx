"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
    const [email, setEmail] = useState("");
    const [roomId, setRoomId] = useState("");
    const router = useRouter();

    const handleJoin = () => {
        if (!email || !roomId) return;
        router.push(`vcapp/${roomId}`)
    };

    return (
        <div>
            <h2>Join Chat</h2>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="Room ID"
                onChange={(e) => setRoomId(e.target.value)}
            />

            <button onClick={handleJoin}>Join</button>
        </div>
    );
}
