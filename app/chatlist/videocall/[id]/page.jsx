"use client";

import { ChatContext } from "@/app/context/chatcontext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, User } from "lucide-react";

export default function VideoCallPage() {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);

    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const pc = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const { socket, myUsername, roomid } = useContext(ChatContext);
    const ROOM_ID = roomid

    useEffect(() => {
        if (!socket || !ROOM_ID) return;

        const startMedia = async () => {
            try {
                // Check if browser supports mediaDevices
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Browser does not support camera/mic access.");
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Peer Connection Setup
                const pcInstance = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
                });
                pc.current = pcInstance;

                // Add Tracks
                stream.getTracks().forEach(track => {
                    pcInstance.addTrack(track, stream);
                });

                // Listen for Remote Tracks
                pcInstance.ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        setRemoteStream(event.streams[0]);
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = event.streams[0];
                        }
                    }
                };

                // ICE Candidates
                pcInstance.onicecandidate = (e) => {
                    if (e.candidate) {
                        socket.emit("webrtc-candidate", {
                            roomId: ROOM_ID,
                            candidate: e.candidate
                        });
                    }
                };

                // WebRTC Signaling Handlers
                socket.on("webrtc-offer", async ({ sdp }) => {
                    await pcInstance.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp }));
                    const answer = await pcInstance.createAnswer();
                    await pcInstance.setLocalDescription(answer);
                    socket.emit("webrtc-answer", { roomId: ROOM_ID, sdp: answer.sdp });
                });

                socket.on("webrtc-answer", async ({ sdp }) => {
                    await pcInstance.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp }));
                });

                socket.on("webrtc-candidate", async ({ candidate }) => {
                    try {
                        await pcInstance.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) { console.error("Error adding ice candidate", e); }
                });

                socket.on("end-call", handleEndCallLocally);

                socket.emit("join-room", { roomId: ROOM_ID });

                // Start call if you are the initiator (Optional: small delay)
                setTimeout(async () => {
                    if (pc.current?.signalingState === "stable") {
                        const offer = await pc.current.createOffer();
                        await pc.current.setLocalDescription(offer);
                        socket.emit("webrtc-offer", { roomId: ROOM_ID, sdp: offer.sdp });
                    }
                }, 1500);

            } catch (err) {
                console.error("Media/WebRTC Error:", err);
                alert("Could not access camera or microphone. Please check permissions.");
            }
        };

        startMedia();

        return () => {
            handleEndCallLocally();
        };
    }, [socket, ROOM_ID]);

    const handleEndCallLocally = () => {
        if (pc.current) {
            pc.current.close();
            pc.current = null;
        }
        // Local stream stop
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        socket?.off("webrtc-offer");
        socket?.off("webrtc-answer");
        socket?.off("webrtc-candidate");
        socket?.off("end-call");
    };

    const toggleMic = () => {
        const audioTrack = localStream?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const endCall = () => {
        if (socket?.connected) {
            socket.emit("end-call", { from: myUsername, to: id });
        }
        handleEndCallLocally();
        router.push("/chatlist");
    };

    return (
        <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Remote Video (Main Screen) */}
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />

            {!remoteStream && (
                <div className="z-10 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
                        <User size={48} className="text-gray-400" />
                    </div>
                    <div className="text-gray-400 font-medium animate-pulse text-lg">Calling {id}...</div>
                </div>
            )}

            {/* Local Video (PiP) */}
            <div className="absolute top-6 right-6 w-32 h-48 md:w-40 md:h-56 bg-gray-900 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-20">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover mirror-mode"
                />
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 flex gap-6 z-30">
                <button
                    onClick={toggleMic}
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500' : 'bg-gray-700/80 hover:bg-gray-600'}`}
                >
                    {isMuted ? <MicOff color="white" /> : <Mic color="white" />}
                </button>

                <button
                    onClick={endCall}
                    className="p-5 bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-lg active:scale-90"
                >
                    <PhoneOff color="white" fill="white" />
                </button>

                <button className="p-4 bg-gray-700/80 hover:bg-gray-600 rounded-full">
                    <Video color="white" />
                </button>
            </div>

            <style jsx>{`
                .mirror-mode {
                    transform: scaleX(-1);
                }
            `}</style>
        </div>
    );
}