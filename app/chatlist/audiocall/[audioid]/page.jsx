"use client";

import { ChatContext } from "@/app/context/chatcontext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, User } from "lucide-react";

export default function AudioCallPage() {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const params = useParams();
    const { audioid } = params; // Outgoing call target
    const router = useRouter();

    const pc = useRef(null);
    const remoteAudioRef = useRef(null);
    const timerRef = useRef(null);

    const { socket, incomingUser, myUsername, roomid } = useContext(ChatContext);
    const ROOM_ID = roomid;

    // --- DYNAMIC NAME LOGIC ---
    // Agar incomingUser hai (aapko call aayi hai), toh uska naam dikhao.
    // Agar nahi hai (aapne call ki hai), toh params se audioid dikhao.
    const displayName = incomingUser?.from || audioid || "Unknown User";

    useEffect(() => {
        if (remoteStream) {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setSeconds(0);
        }
        return () => clearInterval(timerRef.current);
    }, [remoteStream]);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!socket || !ROOM_ID) return;

        const pcInstance = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        pc.current = pcInstance;

        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then(stream => {
                setLocalStream(stream);
                stream.getTracks().forEach(track => {
                    pcInstance.addTrack(track, stream);
                });
            })
            .catch(err => console.error("Mic Access Error:", err));

        pcInstance.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
            }
        };

        pcInstance.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("webrtc-candidate", { roomId: ROOM_ID, candidate: e.candidate });
            }
        };

        socket.on("webrtc-offer", async ({ sdp }) => {
            await pcInstance.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp }));
            const answer = await pcInstance.createAnswer();
            await pcInstance.setLocalDescription(answer);
            socket.emit("webrtc-answer", { roomId: ROOM_ID, sdp: answer.sdp });
        });

        socket.on("webrtc-answer", async ({ sdp }) => {
            if (pcInstance.signalingState !== "stable") {
                await pcInstance.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp }));
            }
        });

        socket.on("webrtc-candidate", async ({ candidate }) => {
            try {
                await pcInstance.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) { console.error("ICE Error", err); }
        });

        socket.on("end-call", () => endCall(false));

        socket.emit("join-room", { roomId: ROOM_ID });

        const negTimer = setTimeout(async () => {
            if (pcInstance.signalingState === "stable" && !remoteStream) {
                const offer = await pcInstance.createOffer();
                await pcInstance.setLocalDescription(offer);
                socket.emit("webrtc-offer", { roomId: ROOM_ID, sdp: offer.sdp });
            }
        }, 1500);

        return () => {
            clearTimeout(negTimer);
            cleanup();
            socket.off("webrtc-offer");
            socket.off("webrtc-answer");
            socket.off("webrtc-candidate");
            socket.off("end-call");
        };
    }, [socket, ROOM_ID]);

    const cleanup = () => {
        if (pc.current) {
            pc.current.close();
            pc.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    };

    const endCall = (shouldEmit = true) => {
        if (shouldEmit && socket?.connected) {
            socket.emit("end-call", {
                from: myUsername,
                to: audioid || incomingUser?.from
            });
        }
        cleanup();
        setRemoteStream(null);
        router.push("/chatlist");
    };

    const toggleMic = () => {
        const audioTrack = localStream?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    return (
        <div className="relative h-screen w-full bg-[#0b0f1a] flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Pulsing Background Rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className={`absolute border border-blue-500 rounded-full animate-ping ${remoteStream ? 'w-[400px] h-[400px]' : 'w-[200px] h-[200px]'}`}></div>
                {remoteStream && <div className="absolute w-[600px] h-[600px] border border-blue-400 rounded-full animate-pulse"></div>}
            </div>

            <audio ref={remoteAudioRef} autoPlay playsInline />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Avatar with Status Color */}
                <div className={`w-44 h-44 bg-slate-800 rounded-full flex items-center justify-center border-4 transition-all duration-700 shadow-2xl 
                    ${remoteStream ? 'border-green-500 scale-105 shadow-green-900/20' : 'border-blue-500 animate-pulse'}`}>
                    <User size={100} className="text-slate-500" />
                </div>

                <div className="text-center">
                    {/* Rendered Name */}
                    <h2 className="text-3xl font-bold tracking-tight capitalize">
                        {displayName}
                    </h2>

                    <div className="mt-3 h-10 flex flex-col items-center">
                        {remoteStream ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in">
                                <span className="text-green-400 font-mono text-2xl tracking-[0.2em]">{formatTime(seconds)}</span>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-1">On Air</span>
                            </div>
                        ) : (
                            <p className="text-slate-400 animate-pulse tracking-widest uppercase text-sm">
                                {incomingUser ? "Incoming Call..." : "Calling..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-16 flex gap-12 z-10 items-center">
                <button onClick={toggleMic} className={`p-5 rounded-full transition-all duration-300 ${isMuted ? 'bg-red-500 shadow-lg' : 'bg-slate-800 hover:bg-slate-700'}`}>
                    {isMuted ? <MicOff size={30} /> : <Mic size={30} />}
                </button>
                <button onClick={() => endCall(true)} className="p-7 bg-red-600 hover:bg-red-500 rounded-full shadow-2xl group transition-all transform active:scale-95">
                    <PhoneOff size={36} className="group-hover:rotate-[135deg] transition-transform duration-500" />
                </button>
            </div>
        </div>
    );
}