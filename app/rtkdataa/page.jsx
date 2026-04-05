// 'use client';

// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { addMessage, setChats } from '../rtk/slice/chatSlice';

// export default function Page() {
//     const dispatch = useDispatch();

//     // Redux state access
//     const chats = useSelector(state => state.chat.chats);
//     // const currentChatId = useSelector(state => state.chatt.currentChatId);


//     console.log('data', chats)

//     // Example: Add message
//     const handleAddMessage = () => {
//         if (chats.length === 0) {
//             // Pehle ek chat create kar lo
//             dispatch(setChats([{ id: 1, messages: [], lastMessage: '', participants: [] }]));
//         }
//         dispatch(addMessage({ chatId: 1, message: 'Hello from Next.js page!' }));
//     };

//     return (
//         <div>
//             <h1>Redux Chat Page</h1>
//             <button onClick={handleAddMessage}>Add Message</button>

//             <div>
//                 <h2>Chats:</h2>
//                 {/* {chats.map(chat => (
//                     <div key={chat.id}>
//                         <p>Chat ID: {chat.id}</p>
//                         <p>Last Message: {chat.lastMessage}</p>
//                         <p>Messages:</p>
//                         <ul>
//                             {chat.messages.map((msg, index) => (
//                                 <li key={index}>{msg}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 ))} */}
//             </div>
//         </div>
//     );
// }










import React from 'react'

function page() {
    return (
        <div>page</div>
    )
}

export default page