// "use client";

// import React, { useEffect, useRef, useState, useContext } from "react";
// import { ChatContext } from "../component/contexapi";

// export default function VideoCall({ userId }) {
//     const { socket, myUsername, currentCall } = useContext(ChatContext);

//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);
//     const pc = useRef(new RTCPeerConnection({
//         iceServers: [
//             { urls: "stun:stun.l.google.com:19302" },
//             { urls: "stun:stun1.l.google.com:19302" },
//         ],
//     }));

//     const [localStream, setLocalStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
//     const [isMuted, setIsMuted] = useState(false);

//     // 1️⃣ Get local media
//     useEffect(() => {
//         async function startLocalStream() {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//                 setLocalStream(stream);
//                 if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//                 stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
//             } catch (e) {
//                 console.log("Camera/Mic error:", e);
//             }
//         }
//         startLocalStream();
//     }, []);

//     // 2️⃣ Handle ICE candidates and remote tracks
//     useEffect(() => {
//         if (!pc.current) return;

//         pc.current.ontrack = (event) => {
//             setRemoteStream(event.streams[0]);
//             if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
//         };

//         pc.current.onicecandidate = (event) => {
//             if (event.candidate) {
//                 socket.emit("webrtc-candidate", { to: userId, candidate: event.candidate });
//             }
//         };

//         socket.on("webrtc-offer", async ({ from, sdp }) => {
//             await pc.current.setRemoteDescription({ type: "offer", sdp });
//             const answer = await pc.current.createAnswer();
//             await pc.current.setLocalDescription(answer);
//             socket.emit("webrtc-answer", { to: from, sdp: answer.sdp });
//         });

//         socket.on("webrtc-answer", async ({ sdp }) => {
//             await pc.current.setRemoteDescription({ type: "answer", sdp });
//         });

//         socket.on("webrtc-candidate", async ({ candidate }) => {
//             try {
//                 await pc.current.addIceCandidate(candidate);
//             } catch (e) {
//                 console.log("ICE error:", e);
//             }
//         });

//         return () => {
//             pc.current.close();
//             socket.off("webrtc-offer");
//             socket.off("webrtc-answer");
//             socket.off("webrtc-candidate");
//         };
//     }, [localStream]);

//     // 3️⃣ Initiate call if current user is initiator
//     useEffect(() => {
//         if (currentCall?.from === myUsername && localStream) {
//             const startCall = async () => {
//                 const offer = await pc.current.createOffer();
//                 await pc.current.setLocalDescription(offer);
//                 socket.emit("webrtc-offer", { to: userId, sdp: offer.sdp });
//             };
//             startCall();
//         }
//     }, [localStream]);

//     // 4️⃣ Toggle mic
//     const toggleMic = () => {
//         if (!localStream) return;
//         const audioTrack = localStream.getAudioTracks()[0];
//         if (audioTrack) {
//             audioTrack.enabled = !audioTrack.enabled;
//             setIsMuted(!isMuted);
//         }
//     };

//     const endCall = () => {
//         socket.emit("end-call", { to: userId });
//         pc.current.close();
//         localStream?.getTracks().forEach(t => t.stop());
//         setRemoteStream(null);
//         setLocalStream(null);
//     };

//     return (
//         <div style={{ background: "#000", height: "100vh", position: "relative" }}>
//             <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//             <video
//                 ref={localVideoRef}
//                 autoPlay
//                 muted
//                 playsInline
//                 style={{ width: 200, height: 150, position: "absolute", top: 20, right: 20, border: "2px solid white", borderRadius: 8 }}
//             />
//             <button onClick={endCall} style={{ position: "absolute", bottom: 50, left: "50%", transform: "translateX(-50%)", backgroundColor: "#EF4444", color: "#fff", padding: "12px 20px", borderRadius: 50 }}>End Call</button>
//             <button onClick={toggleMic} style={{ position: "absolute", bottom: 50, left: 50, backgroundColor: "#1F2937", color: "#fff", padding: "12px 20px", borderRadius: 50 }}>
//                 {isMuted ? "Mic Off" : "Mic On"}
//             </button>
//         </div>
//     );
// }










import React from 'react'

export default function video() {
    return (
        <div>video</div>
    )
}
