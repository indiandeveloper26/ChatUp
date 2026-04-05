// // // "use client";
// // // import { useContext, useState, useEffect, useRef } from "react";
// // // import { useParams, useRouter } from "next/navigation";
// // // import { ChatContext } from "../../context/chatcontext.jsx";
// // // import { FaPhone, FaVideo, FaUserPlus } from "react-icons/fa";
// // // import api from "@/app/apicall.js";

// // // export default function ChatRoom() {
// // //     const { id } = useParams();
// // //     const router = useRouter();
// // //     const { messages, myUsername, sendMessage, onlineUsers, startCalling, socket, typingUser } =
// // //         useContext(ChatContext);

// // //     const [input, setInput] = useState("");
// // //     const [previewImg, setPreviewImg] = useState(null);
// // //     const [showAddPopup, setShowAddPopup] = useState(false);
// // //     const [newUser, setNewUser] = useState("");
// // //     const messagesEndRef = useRef();

// // //     const filtered = messages.filter(
// // //         (m) => (m.from === myUsername && m.to === id) || (m.from === id && m.to === myUsername)
// // //     );

// // //     const displayMessages =
// // //         typingUser === id ? [...filtered, { id: "typing", from: id, message: "" }] : filtered;

// // //     useEffect(() => {
// // //         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // //     }, [displayMessages]);

// // //     const handleSend = () => {
// // //         if (input.trim()) {
// // //             sendMessage(id, input.trim(), "text");
// // //             setInput("");
// // //         }
// // //     };

// // //     const handleTyping = (text) => {
// // //         setInput(text);
// // //         if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
// // //     };

// // //     const handlePickImage = async (e) => {
// // //         const file = e.target.files[0];
// // //         if (!file) return;
// // //         const formData = new FormData();
// // //         formData.append("file", file);
// // //         try {
// // //             const res = await fetch("https://chat-app-server-render-v-1.onrender.com/upload", {
// // //                 method: "POST",
// // //                 body: formData,
// // //             });
// // //             const data = await res.json();
// // //             sendMessage(id, data.url, "image");
// // //         } catch (err) {
// // //             console.log("Upload failed:", err);
// // //             alert("Upload failed");
// // //         }
// // //     };

// // //     const startAudioCall = () => {
// // //         router.push(`/chatlist/${id}/call/audio`);
// // //     };

// // //     const startVideoCall = () => {
// // //         try {
// // //             startCalling(id);
// // //         } catch (error) {
// // //             console.log("error starting call");
// // //         }
// // //     };



// // //     const handleAddUser = async (groupId, username) => {


// // //         // console.log(id, newUser)
// // //         try {
// // //             const res = await (await api.post("/crategroup/addusergroup", { groupId: id, username: newUser })).data


// // //             console.log(res);
// // //         } catch (err) {
// // //             console.error(err);
// // //         }
// // //     };


// // //     return (
// // //         <div className="flex flex-col h-screen bg-black text-white">
// // //             {/* Header */}
// // //             <div className="flex justify-between p-4 bg-gray-900 items-center">
// // //                 <div>
// // //                     <h2 className="font-bold text-lg">{id}</h2>
// // //                     <p
// // //                         className={`text-sm ${onlineUsers.includes(id) ? "text-green-400" : "text-gray-400"
// // //                             }`}
// // //                     >
// // //                         {onlineUsers.includes(id) ? "Online" : "Offline"}
// // //                     </p>
// // //                 </div>

// // //                 <div className="flex space-x-3">
// // //                     <button
// // //                         onClick={() => setShowAddPopup(true)}
// // //                         className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-700"
// // //                     >
// // //                         <FaUserPlus size={18} />
// // //                     </button>
// // //                     <button
// // //                         onClick={startAudioCall}
// // //                         className="p-2 rounded-full bg-green-600 hover:bg-green-700"
// // //                     >
// // //                         <FaPhone size={18} />
// // //                     </button>
// // //                     <button
// // //                         onClick={startVideoCall}
// // //                         className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"
// // //                     >
// // //                         <FaVideo size={18} />
// // //                     </button>
// // //                     <button onClick={() => router.back()} className="text-red-500 p-2">
// // //                         Back
// // //                     </button>
// // //                 </div>
// // //             </div>

// // //             {/* Chat Messages */}
// // //             <div className="flex-1 overflow-y-auto p-4 space-y-2">
// // //                 {displayMessages.map((msg) => {
// // //                     const isMine = msg.from === myUsername;
// // //                     const isTyping = msg.id === "typing";
// // //                     return (
// // //                         <div
// // //                             key={msg.id}
// // //                             className={`flex ${isMine ? "justify-end" : "justify-start"}`}
// // //                         >
// // //                             <div
// // //                                 className={`p-3 rounded-xl max-w-[60%] ${isMine
// // //                                     ? "bg-green-500 rounded-br-none"
// // //                                     : "bg-gray-800 rounded-bl-none"
// // //                                     }`}
// // //                             >
// // //                                 {isTyping ? (
// // //                                     <div className="flex space-x-1">
// // //                                         <span className="animate-bounce">•</span>
// // //                                         <span className="animate-bounce delay-150">•</span>
// // //                                         <span className="animate-bounce delay-300">•</span>
// // //                                     </div>
// // //                                 ) : msg.type === "image" ? (
// // //                                     <img
// // //                                         src={msg.message}
// // //                                         alt="sent"
// // //                                         className="w-48 h-48 object-cover rounded-lg cursor-pointer"
// // //                                         onClick={() => setPreviewImg(msg.message)}
// // //                                     />
// // //                                 ) : (
// // //                                     <p>{msg.message}</p>
// // //                                 )}
// // //                                 {isMine && !isTyping && (
// // //                                     <p className="text-xs mt-1">
// // //                                         {msg.seen ? "✓✓ Seen" : "✓ Sent"}
// // //                                     </p>
// // //                                 )}
// // //                             </div>
// // //                         </div>
// // //                     );
// // //                 })}
// // //                 <div ref={messagesEndRef} />
// // //             </div>

// // //             {/* Input Bar */}
// // //             <div className="flex p-4 bg-gray-900 items-center space-x-2">
// // //                 <input type="file" accept="image/*" onChange={handlePickImage} />
// // //                 <input
// // //                     value={input}
// // //                     onChange={(e) => handleTyping(e.target.value)}
// // //                     placeholder="Type a message..."
// // //                     className="flex-1 p-2 rounded-full bg-gray-800 text-white outline-none"
// // //                 />
// // //                 <button
// // //                     onClick={handleSend}
// // //                     className="ml-2 bg-green-500 px-4 py-2 rounded-full font-bold"
// // //                 >
// // //                     Send
// // //                 </button>
// // //             </div>

// // //             {/* Preview Image Modal */}
// // //             {previewImg && (
// // //                 <div
// // //                     className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center"
// // //                     onClick={() => setPreviewImg(null)}
// // //                 >
// // //                     <img
// // //                         src={previewImg}
// // //                         className="max-h-[90%] max-w-[90%] object-contain"
// // //                     />
// // //                 </div>
// // //             )}

// // //             {/* Add User Popup */}
// // //             {showAddPopup && (
// // //                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
// // //                     <div className="bg-gray-800 p-6 rounded-2xl w-80 text-center">
// // //                         <h3 className="text-lg font-bold mb-4">Add User to Group</h3>
// // //                         <input
// // //                             type="text"
// // //                             value={newUser}
// // //                             onChange={(e) => setNewUser(e.target.value)}
// // //                             placeholder="Enter username"
// // //                             className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
// // //                         />
// // //                         <div className="flex justify-around">
// // //                             <button
// // //                                 onClick={handleAddUser}
// // //                                 className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
// // //                             >
// // //                                 Add
// // //                             </button>
// // //                             <button
// // //                                 onClick={() => setShowAddPopup(false)}
// // //                                 className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
// // //                             >
// // //                                 Cancel
// // //                             </button>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // }















// // "use client";
// // import { useContext, useState, useEffect, useRef } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import { ChatContext } from "../../context/chatcontext.jsx";
// // import { FaPhone, FaVideo, FaUserPlus } from "react-icons/fa";
// // import api from "@/app/apicall.js";

// // export default function ChatRoom() {
// //     const { id } = useParams();
// //     const router = useRouter();
// //     const { messages, myUsername, sendMessage, groupMessages, sendGroupMessage, joinGroup, leaveGroup, onlineUsers, startCalling, socket, typingUser } =
// //         useContext(ChatContext);

// //     const [input, setInput] = useState("");
// //     const [previewImg, setPreviewImg] = useState(null);
// //     const [showAddPopup, setShowAddPopup] = useState(false);
// //     const [newUser, setNewUser] = useState("");
// //     const messagesEndRef = useRef();

// //     console.log('groupmessinrorom', groupMessages.newgrop

// //     )


// //     // groupMessages.newgrop.map((item) => {
// //     //     return console.log(item.text)
// //     // })

// //     useEffect(() => {


// //         // groupMessages.forEach(element => {
// //         //     console.log('messgrom')
// //         // });
// //     }, [])


// //     useEffect(() => {

// //         joinGroup(id)
// //     }, [])

// //     useEffect(() => {
// //         console.log('grmes', groupMessages)
// //     }, [])



// //     const filtered = messages.filter(
// //         (m) => (m.from === myUsername && m.to === id) || (m.from === id && m.to === myUsername)
// //     );

// //     const displayMessages =
// //         typingUser === id ? [...filtered, { id: "typing", from: id, message: "" }] : filtered;

// //     useEffect(() => {



// //         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //     }, [displayMessages]);

// //     useEffect(() => {

// //         console.log(groupMessages)

// //     }, [])


// //     const handleSend = () => {
// //         if (input.trim()) {
// //             sendGroupMessage(id, myUsername, input)
// //             // sendMessage(id, input.trim(), "text");
// //             setInput("");
// //         }
// //     };

// //     const handleTyping = (text) => {
// //         setInput(text);
// //         if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
// //     };

// //     const handlePickImage = async (e) => {
// //         const file = e.target.files[0];
// //         if (!file) return;
// //         const formData = new FormData();
// //         formData.append("file", file);
// //         try {
// //             const res = await fetch("https://chat-app-server-render-v-1.onrender.com/upload", {
// //                 method: "POST",
// //                 body: formData,
// //             });
// //             const data = await res.json();
// //             sendMessage(id, data.url, "image");
// //         } catch (err) {
// //             console.log("Upload failed:", err);
// //             alert("Upload failed");
// //         }
// //     };

// //     const startAudioCall = () => {
// //         router.push(`/chatlist/${id}/call/audio`);
// //     };

// //     const startVideoCall = () => {
// //         try {
// //             startCalling(id);
// //         } catch (error) {
// //             console.log("error starting call");
// //         }
// //     };

// //     const handleAddUser = async () => {
// //         try {
// //             const res = await (await api.post("/crategroup/addusergroup", { groupId: id, username: newUser })).data;
// //             console.log(res);
// //             setShowAddPopup(false);
// //             setNewUser("");
// //         } catch (err) {
// //             console.error(err);
// //         }
// //     };

// //     return (
// //         <div className="flex flex-col h-screen bg-black text-white">
// //             {/* Header */}
// //             <div className="flex justify-between items-center p-3 sm:p-2 bg-gray-900 flex-wrap">
// //                 <div>
// //                     <h2 className="font-bold text-lg sm:text-base">{id}</h2>
// //                     <p
// //                         className={`text-sm sm:text-xs ${onlineUsers.includes(id) ? "text-green-400" : "text-gray-400"
// //                             }`}
// //                     >
// //                         {onlineUsers.includes(id) ? "Online" : "Offline"}
// //                     </p>
// //                 </div>

// //                 {/* Buttons */}
// //                 <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
// //                     <button
// //                         onClick={() => setShowAddPopup(true)}
// //                         className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-700"
// //                     >
// //                         <FaUserPlus size={18} />
// //                     </button>
// //                     <button
// //                         onClick={startAudioCall}
// //                         className="p-2 rounded-full bg-green-600 hover:bg-green-700"
// //                     >
// //                         <FaPhone size={18} />
// //                     </button>
// //                     <button
// //                         onClick={startVideoCall}
// //                         className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"
// //                     >
// //                         <FaVideo size={18} />
// //                     </button>
// //                     <button onClick={() => router.back()} className="text-red-500 p-2">
// //                         Back
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Chat Messages */}
// //             <div className="flex-1 overflow-y-auto p-3 sm:p-2 space-y-2">
// //                 {displayMessages.map((msg) => {
// //                     const isMine = msg.from === myUsername;
// //                     const isTyping = msg.id === "typing";
// //                     return (
// //                         <div
// //                             key={msg.id}
// //                             className={`flex ${isMine ? "justify-end" : "justify-start"}`}
// //                         >
// //                             <div
// //                                 className={`p-3 rounded-xl max-w-[80%] sm:max-w-[70%] ${isMine ? "bg-green-500 rounded-br-none" : "bg-gray-800 rounded-bl-none"
// //                                     }`}
// //                             >
// //                                 {isTyping ? (
// //                                     <div className="flex space-x-1">
// //                                         <span className="animate-bounce">•</span>
// //                                         <span className="animate-bounce delay-150">•</span>
// //                                         <span className="animate-bounce delay-300">•</span>
// //                                     </div>
// //                                 ) : msg.type === "image" ? (
// //                                     <img
// //                                         src={msg.message}
// //                                         alt="sent"
// //                                         className="w-full max-w-xs sm:max-w-[200px] h-auto object-cover rounded-lg cursor-pointer"
// //                                         onClick={() => setPreviewImg(msg.message)}
// //                                     />
// //                                 ) : (
// //                                     <p className="text-sm sm:text-base break-words">{msg.message}</p>
// //                                 )}
// //                                 {isMine && !isTyping && (
// //                                     <p className="text-xs mt-1">{msg.seen ? "✓✓ Seen" : "✓ Sent"}</p>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     );
// //                 })}
// //                 <div ref={messagesEndRef} />
// //             </div>

// //             {/* Input Bar */}
// //             <div className="flex flex-col sm:flex-row p-3 sm:p-2 bg-gray-900 items-center gap-2">
// //                 <input
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handlePickImage}
// //                     className="text-xs sm:text-sm"
// //                 />
// //                 <input
// //                     value={input}
// //                     onChange={(e) => handleTyping(e.target.value)}
// //                     placeholder="Type a message..."
// //                     className="flex-1 p-2 rounded-full bg-gray-800 text-white outline-none text-sm sm:text-base"
// //                 />
// //                 <button
// //                     onClick={handleSend}
// //                     className="ml-0 sm:ml-2 bg-green-500 px-4 py-2 rounded-full font-bold text-sm sm:text-base"
// //                 >
// //                     Send
// //                 </button>
// //             </div>

// //             {/* Preview Image Modal */}
// //             {previewImg && (
// //                 <div
// //                     className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
// //                     onClick={() => setPreviewImg(null)}
// //                 >
// //                     <img
// //                         src={previewImg}
// //                         className="max-h-[90%] max-w-[90%] object-contain rounded-lg"
// //                     />
// //                 </div>
// //             )}

// //             {/* Add User Popup */}
// //             {showAddPopup && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
// //                     <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-sm text-center">
// //                         <h3 className="text-lg font-bold mb-4">Add User to Group</h3>
// //                         <input
// //                             type="text"
// //                             value={newUser}
// //                             onChange={(e) => setNewUser(e.target.value)}
// //                             placeholder="Enter username"
// //                             className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
// //                         />
// //                         <div className="flex flex-col sm:flex-row justify-around gap-2">
// //                             <button
// //                                 onClick={handleAddUser}
// //                                 className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
// //                             >
// //                                 Add
// //                             </button>
// //                             <button
// //                                 onClick={() => setShowAddPopup(false)}
// //                                 className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
// //                             >
// //                                 Cancel
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }












// // "use client";
// // import { useContext, useState, useEffect, useRef } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import { ChatContext } from "../../context/chatcontext.jsx";
// // import { FaPhone, FaVideo, FaUserPlus } from "react-icons/fa";
// // import api from "@/app/apicall.js";

// // export default function ChatRoom() {
// //     const { id } = useParams();
// //     const router = useRouter();
// //     const {
// //         groupMessages,
// //         myUsername,
// //         sendGroupMessage,
// //         joinGroup,
// //         onlineUsers,
// //         startCalling,
// //         socket,
// //         typingUser
// //     } = useContext(ChatContext);

// //     const [input, setInput] = useState("");
// //     const [previewImg, setPreviewImg] = useState(null);
// //     const [showAddPopup, setShowAddPopup] = useState(false);
// //     const [newUser, setNewUser] = useState("");
// //     const messagesEndRef = useRef();

// //     // Join group on mount
// //     useEffect(() => {
// //         joinGroup(id);
// //     }, [id]);

// //     // Scroll to bottom when messages update
// //     useEffect(() => {
// //         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //     }, [groupMessages, typingUser]);

// //     // Filter messages for this group
// //     const displayMessages = groupMessages?.newgrop?.filter((msg) => msg.groupId === id) || [];

// //     const handleSend = () => {
// //         if (input.trim()) {
// //             sendGroupMessage(id, myUsername, input, "text");
// //             setInput("");
// //         }
// //     };

// //     const handleTyping = (text) => {
// //         setInput(text);
// //         if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
// //     };

// //     const handlePickImage = async (e) => {
// //         const file = e.target.files[0];
// //         if (!file) return;
// //         const formData = new FormData();
// //         formData.append("file", file);

// //         try {
// //             const res = await fetch("https://chat-app-server-render-v-1.onrender.com/upload", {
// //                 method: "POST",
// //                 body: formData,
// //             });
// //             const data = await res.json();
// //             sendGroupMessage(id, myUsername, data.url, "image");
// //         } catch (err) {
// //             console.log("Upload failed:", err);
// //             alert("Upload failed");
// //         }
// //     };

// //     const startAudioCall = () => router.push(`/chatlist/${id}/call/audio`);
// //     const startVideoCall = () => startCalling(id);

// //     const handleAddUser = async () => {
// //         try {
// //             const res = await (await api.post("/crategroup/addusergroup", { groupId: id, username: newUser })).data;
// //             console.log(res);
// //             setShowAddPopup(false);
// //             setNewUser("");
// //         } catch (err) {
// //             console.error(err);
// //         }
// //     };

// //     return (
// //         <div className="flex flex-col h-screen bg-black text-white">
// //             {/* Header */}
// //             <div className="flex justify-between items-center p-3 sm:p-2 bg-gray-900 flex-wrap">
// //                 <div>
// //                     <h2 className="font-bold text-lg sm:text-base">{id}</h2>
// //                     <p className={`text-sm sm:text-xs ${onlineUsers.includes(id) ? "text-green-400" : "text-gray-400"}`}>
// //                         {onlineUsers.includes(id) ? "Online" : "Offline"}
// //                     </p>
// //                 </div>

// //                 <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
// //                     <button onClick={() => setShowAddPopup(true)} className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-700">
// //                         <FaUserPlus size={18} />
// //                     </button>
// //                     <button onClick={startAudioCall} className="p-2 rounded-full bg-green-600 hover:bg-green-700">
// //                         <FaPhone size={18} />
// //                     </button>
// //                     <button onClick={startVideoCall} className="p-2 rounded-full bg-blue-600 hover:bg-blue-700">
// //                         <FaVideo size={18} />
// //                     </button>
// //                     <button onClick={() => router.back()} className="text-red-500 p-2">Back</button>
// //                 </div>
// //             </div>

// //             {/* Chat Messages */}
// //             <div className="flex-1 overflow-y-auto p-3 sm:p-2 space-y-2">
// //                 {displayMessages.map((msg, index) => {
// //                     const key = index || `${msg.from || msg.username}-${msg.message || msg.text}-${index}`;
// //                     const isMine = (msg.from || msg.username) === myUsername;
// //                     const isTyping = msg.id === "typing";

// //                     return (
// //                         <div key={key} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
// //                             <div className={`p-3 rounded-xl max-w-[80%] sm:max-w-[70%] ${isMine ? "bg-green-500 rounded-br-none" : "bg-gray-800 rounded-bl-none"}`}>
// //                                 {isTyping ? (
// //                                     <div className="flex space-x-1">
// //                                         <span className="animate-bounce">•</span>
// //                                         <span className="animate-bounce delay-150">•</span>
// //                                         <span className="animate-bounce delay-300">•</span>
// //                                     </div>
// //                                 ) : (msg.type === "image") ? (
// //                                     <img
// //                                         src={msg.message || msg.text}
// //                                         alt="sent"
// //                                         className="w-full max-w-xs sm:max-w-[200px] h-auto object-cover rounded-lg cursor-pointer"
// //                                         onClick={() => setPreviewImg(msg.message || msg.text)}
// //                                     />
// //                                 ) : (
// //                                     <div className="flex flex-col">
// //                                         <p className="text-xs text-gray-400 mb-1">{msg.username || msg.from}</p>
// //                                         <p className="text-sm sm:text-base break-words">{msg.message || msg.text}</p>
// //                                     </div>

// //                                 )}
// //                                 {isMine && !isTyping && (
// //                                     <p className="text-xs mt-1">{msg.seen ? "✓✓ Seen" : "✓ Sent"}</p>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     );
// //                 })}
// //                 <div ref={messagesEndRef} />
// //             </div>

// //             {/* Input Bar */}
// //             <div className="flex flex-col sm:flex-row p-3 sm:p-2 bg-gray-900 items-center gap-2">
// //                 <input type="file" accept="image/*" onChange={handlePickImage} className="text-xs sm:text-sm" />
// //                 <input
// //                     value={input}
// //                     onChange={(e) => handleTyping(e.target.value)}
// //                     placeholder="Type a message..."
// //                     className="flex-1 p-2 rounded-full bg-gray-800 text-white outline-none text-sm sm:text-base"
// //                 />
// //                 <button onClick={handleSend} className="ml-0 sm:ml-2 bg-green-500 px-4 py-2 rounded-full font-bold text-sm sm:text-base">Send</button>
// //             </div>

// //             {/* Preview Image Modal */}
// //             {previewImg && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setPreviewImg(null)}>
// //                     <img src={previewImg} className="max-h-[90%] max-w-[90%] object-contain rounded-lg" />
// //                 </div>
// //             )}

// //             {/* Add User Popup */}
// //             {showAddPopup && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
// //                     <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-sm text-center">
// //                         <h3 className="text-lg font-bold mb-4">Add User to Group</h3>
// //                         <input
// //                             type="text"
// //                             value={newUser}
// //                             onChange={(e) => setNewUser(e.target.value)}
// //                             placeholder="Enter username"
// //                             className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
// //                         />
// //                         <div className="flex flex-col sm:flex-row justify-around gap-2">
// //                             <button onClick={handleAddUser} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Add</button>
// //                             <button onClick={() => setShowAddPopup(false)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Cancel</button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }



















// "use client";
// import { useContext, useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { ChatContext } from "../../context/chatcontext.jsx";
// import { FaPhone, FaVideo, FaUserPlus } from "react-icons/fa";
// import api from "@/app/apicall.js";

// export default function ChatRoom() {
//     const { id } = useParams();
//     const router = useRouter();
//     const {
//         groupMessages,
//         myUsername,
//         sendGroupMessage,
//         joinGroup,
//         onlineUsers,
//         startCalling,
//         socket,
//         typingUser
//     } = useContext(ChatContext);

//     const [input, setInput] = useState("");
//     const [previewImg, setPreviewImg] = useState(null);
//     const [showAddPopup, setShowAddPopup] = useState(false);
//     const [newUser, setNewUser] = useState("");
//     const messagesEndRef = useRef();

//     // Join group
//     useEffect(() => joinGroup(id), [id]);

//     // Scroll to bottom
//     useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [groupMessages, typingUser]);

//     const displayMessages = groupMessages?.newgrop?.filter(msg => msg.groupId === id) || [];

//     const handleSend = () => {
//         if (!input.trim()) return;
//         sendGroupMessage(id, myUsername, input, "text");
//         setInput("");
//     };

//     const handleTyping = text => {
//         setInput(text);
//         if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
//     };

//     const handlePickImage = async e => {
//         const file = e.target.files[0];
//         if (!file) return;
//         const formData = new FormData();
//         formData.append("file", file);
//         try {
//             const res = await fetch("https://chat-app-server-render-v-1.onrender.com/upload", { method: "POST", body: formData });
//             const data = await res.json();
//             sendGroupMessage(id, myUsername, data.url, "image");
//         } catch (err) {
//             console.log(err);
//             alert("Upload failed");
//         }
//     };

//     const startAudioCall = () => router.push(`/chatlist/${id}/call/audio`);
//     const startVideoCall = () => startCalling(id);

//     const handleAddUser = async () => {
//         try {
//             await api.post("/crategroup/addusergroup", { groupId: id, username: newUser });
//             setShowAddPopup(false);
//             setNewUser("");
//         } catch (err) { console.error(err); }
//     };

//     return (
//         <div className="flex flex-col h-screen bg-black text-white">
//             {/* Header */}
//             <div className="flex justify-between items-center p-3 bg-gray-900 flex-wrap gap-2">
//                 <div>
//                     <h2 className="font-bold text-lg truncate max-w-xs">{id}</h2>
//                     <p className={`text-sm ${onlineUsers.includes(id) ? "text-green-400" : "text-gray-400"}`}>
//                         {onlineUsers.includes(id) ? "Online" : "Offline"}
//                     </p>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                     <button onClick={() => setShowAddPopup(true)} className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-700"><FaUserPlus size={18} /></button>
//                     <button onClick={startAudioCall} className="p-2 rounded-full bg-green-600 hover:bg-green-700"><FaPhone size={18} /></button>
//                     <button onClick={startVideoCall} className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"><FaVideo size={18} /></button>
//                     <button onClick={() => router.back()} className="p-2 text-red-500">Back</button>
//                 </div>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-1 overflow-y-auto p-3 space-y-2">
//                 {displayMessages.map((msg, i) => {
//                     const isMine = (msg.from || msg.username) === myUsername;
//                     const isTyping = msg.id === "typing";
//                     return (
//                         <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
//                             <div className={`p-3 rounded-xl max-w-[80%] sm:max-w-[70%] ${isMine ? "bg-green-500 rounded-br-none" : "bg-gray-800 rounded-bl-none"}`}>
//                                 {isTyping ? (
//                                     <div className="flex space-x-1">
//                                         <span className="animate-bounce">•</span>
//                                         <span className="animate-bounce delay-150">•</span>
//                                         <span className="animate-bounce delay-300">•</span>
//                                     </div>
//                                 ) : msg.type === "image" ? (
//                                     <img
//                                         src={msg.message || msg.text}
//                                         alt="sent"
//                                         className="w-full max-w-xs sm:max-w-[200px] h-auto object-cover rounded-lg cursor-pointer"
//                                         onClick={() => setPreviewImg(msg.message || msg.text)}
//                                     />
//                                 ) : (
//                                     <div className="flex flex-col">
//                                         <p className="text-xs text-gray-400 mb-1">{msg.username || msg.from}</p>
//                                         <p className="text-sm sm:text-base break-words">{msg.message || msg.text}</p>
//                                     </div>
//                                 )}
//                                 {isMine && !isTyping && <p className="text-xs mt-1">{msg.seen ? "✓✓ Seen" : "✓ Sent"}</p>}
//                             </div>
//                         </div>
//                     );
//                 })}
//                 <div ref={messagesEndRef} />
//             </div>

//             {/* Input Bar */}
//             <div className="flex flex-col sm:flex-row p-3 bg-gray-900 items-center gap-2">
//                 <input type="file" accept="image/*" onChange={handlePickImage} className="text-xs sm:text-sm" />
//                 <input
//                     value={input}
//                     onChange={e => handleTyping(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 p-2 rounded-full bg-gray-800 text-white outline-none text-sm sm:text-base"
//                 />
//                 <button onClick={handleSend} className="ml-0 sm:ml-2 bg-green-500 px-4 py-2 rounded-full font-bold text-sm sm:text-base">Send</button>
//             </div>

//             {/* Preview Image */}
//             {previewImg && (
//                 <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setPreviewImg(null)}>
//                     <img src={previewImg} className="max-h-[90%] max-w-[90%] object-contain rounded-lg" />
//                 </div>
//             )}

//             {/* Add User Popup */}
//             {showAddPopup && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//                     <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-sm text-center">
//                         <h3 className="text-lg font-bold mb-4">Add User to Group</h3>
//                         <input
//                             type="text"
//                             value={newUser}
//                             onChange={e => setNewUser(e.target.value)}
//                             placeholder="Enter username"
//                             className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
//                         />
//                         <div className="flex flex-col sm:flex-row justify-around gap-2">
//                             <button onClick={handleAddUser} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Add</button>
//                             <button onClick={() => setShowAddPopup(false)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }



















"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatContext } from "../../context/chatcontext.jsx";
import { FaPhone, FaVideo, FaUserPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/apicall.js";

export default function ChatRoom() {
    const { id } = useParams();
    const router = useRouter();
    const {
        groupMessages,
        myUsername,
        sendGroupMessage,
        joinGroup,
        onlineUsers,
        startCalling,
        socket,
        typingUser
    } = useContext(ChatContext);

    const [input, setInput] = useState("");
    const [previewImg, setPreviewImg] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newUser, setNewUser] = useState("");
    const messagesEndRef = useRef();

    // Join group
    useEffect(() => joinGroup(id), [id]);

    // Scroll to bottom
    useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [groupMessages, typingUser]);

    const displayMessages = groupMessages?.newgrop?.filter(msg => msg.groupId === id) || [];

    const handleSend = () => {
        if (!input.trim()) return;
        sendGroupMessage(id, myUsername, input, "text");
        setInput("");
    };

    const handleTyping = text => {
        setInput(text);
        if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
    };

    const handlePickImage = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("https://chat-app-server-render-v-1.onrender.com/upload", { method: "POST", body: formData });
            const data = await res.json();
            sendGroupMessage(id, myUsername, data.url, "image");
        } catch (err) { console.log(err); alert("Upload failed"); }
    };

    const startAudioCall = () => router.push(`/chatlist/${id}/call/audio`);
    const startVideoCall = () => startCalling(id);

    const handleAddUser = async () => {
        try {
            await api.post("/crategroup/addusergroup", { groupId: id, username: newUser });
            setShowAddPopup(false);
            setNewUser("");
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center px-4 h-16 bg-[#075E54] text-white">
                <div className="flex items-center truncate">
                    <button onClick={() => router.back()} className="mr-3">←</button>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">{id.charAt(0).toUpperCase()}</div>
                    <div className="ml-3 flex flex-col truncate">
                        <span className="font-semibold truncate">{id}</span>
                        <span className={`text-xs truncate ${onlineUsers.includes(id) ? "text-green-400" : "text-gray-300"}`}>
                            {onlineUsers.includes(id) ? "Online" : "Offline"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setShowAddPopup(true)} className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-700"><FaUserPlus size={18} /></button>
                    <button onClick={startAudioCall} className="p-2 rounded-full bg-green-600 hover:bg-green-700"><FaPhone size={18} /></button>
                    <button onClick={startVideoCall} className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"><FaVideo size={18} /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <AnimatePresence initial={false}>
                    {displayMessages.map((msg, i) => {
                        const isMine = (msg.from || msg.username) === myUsername;
                        const isTyping = msg.id === "typing";
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`p-3 rounded-xl max-w-[80%] sm:max-w-[70%] ${isMine ? "bg-green-500 rounded-br-none text-white" : "bg-white rounded-bl-none text-black"}`}>
                                    {isTyping ? (
                                        <div className="flex space-x-1">
                                            <span className="animate-bounce">•</span>
                                            <span className="animate-bounce delay-150">•</span>
                                            <span className="animate-bounce delay-300">•</span>
                                        </div>
                                    ) : msg.type === "image" ? (
                                        <img
                                            src={msg.message || msg.text}
                                            alt="sent"
                                            className="w-full max-w-xs sm:max-w-[200px] h-auto object-cover rounded-lg cursor-pointer"
                                            onClick={() => setPreviewImg(msg.message || msg.text)}
                                        />
                                    ) : (
                                        <p className="text-sm break-words">{msg.message || msg.text}</p>
                                    )}
                                    {isMine && !isTyping && <p className="text-xs mt-1">{msg.seen ? "✓✓ Seen" : "✓ Sent"}</p>}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row p-3 bg-gray-200 items-center gap-2">
                <input type="file" accept="image/*" onChange={handlePickImage} className="text-xs sm:text-sm" />
                <input
                    value={input}
                    onChange={e => handleTyping(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-full border border-gray-300 outline-none text-sm sm:text-base"
                />
                <button onClick={handleSend} className="bg-green-500 px-4 py-2 rounded-full font-bold text-white hover:bg-green-600">Send</button>
            </div>

            {/* Preview Image */}
            {previewImg && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2"
                    onClick={() => setPreviewImg(null)}
                >
                    <img src={previewImg} className="max-h-[90%] max-w-[90%] object-contain rounded-lg" />
                </motion.div>
            )}

            {/* Add User Popup */}
            {showAddPopup && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                >
                    <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-sm text-center">
                        <h3 className="text-lg font-bold mb-4">Add User to Group</h3>
                        <input
                            type="text"
                            value={newUser}
                            onChange={e => setNewUser(e.target.value)}
                            placeholder="Enter username"
                            className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
                        />
                        <div className="flex flex-col sm:flex-row justify-around gap-2">
                            <button onClick={handleAddUser} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Add</button>
                            <button onClick={() => setShowAddPopup(false)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Cancel</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
