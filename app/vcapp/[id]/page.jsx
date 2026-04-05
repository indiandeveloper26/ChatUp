"use client";
import { useContext, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ChatContext } from "@/app/context/chatcontext";


export default function VideoCall() {
    const localVideo = useRef();
    const remoteVideo = useRef();
    const peerRef = useRef();

    let { socket } = useContext(ChatContext)



    // 1️⃣ JOIN ROOM
    useEffect(() => {
        console.log('roomid set')


        socket.emit("join-room", { roomId: "123456" })



        console.log('rooid seting')

    }, [socket]);


    useEffect(() => {


        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localVideo.current.srcObject = stream;

                peerRef.current = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                stream.getTracks().forEach((track) =>
                    peerRef.current.addTrack(track, stream)
                );

                peerRef.current.ontrack = (e) => {
                    remoteVideo.current.srcObject = e.streams[0];
                };

                peerRef.current.onicecandidate = (e) => {
                    if (e.candidate) {
                        socket.emit("ice", {
                            roomId,
                            candidate: e.candidate,
                        });
                    }
                };
            });

        socket.on("offer", async (offer) => {
            await peerRef.current.setRemoteDescription(offer);
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);

            socket.emit("answer", { roomId, answer });
        });

        socket.on("answer", (answer) => {
            peerRef.current.setRemoteDescription(answer);
        });

        socket.on("ice", (candidate) => {
            peerRef.current.addIceCandidate(candidate);
        });
    }, [roomId]);

    const startCall = async () => {
        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
    };

    return (
        <div>
            <h2>Room: {roomId}</h2>

            <video ref={localVideo} autoPlay muted width="200" />
            <video ref={remoteVideo} autoPlay width="200" />

            <button onClick={startCall}>Start Video Call</button>
        </div>
    );
}
