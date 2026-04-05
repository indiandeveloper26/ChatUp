// "use client";
// import { useEffect, useState, useContext } from "react";
// import { useRouter } from "next/navigation";
// import { ChatContext } from "../context/chatcontext.jsx";
// import { motion } from "framer-motion";
// import api from "../apicall.js";

// const GroupsScreen = () => {
//     const [groups, setGroups] = useState([]);
//     const { myUsername } = useContext(ChatContext);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const res = await (await api.post("/crategroup/usergrouplist", { username: myUsername })).data
//                 console.log("Fetched groups:", res.userWithGroups.grouparr
//                 )



//                 // agar backend return karta hai { groups: [...] }
//                 setGroups(res.userWithGroups.grouparr || []);
//             } catch (err) {
//                 console.error("Error fetching groups:", err);
//             }
//         };

//         if (myUsername) fetchGroups();
//     }, [myUsername]);

//     const openGroup = (groupId) => {

//         router.push(`/grouplist/${groupId.name}`);
//     };

//     return (
//         <div className="bg-black text-white min-h-screen p-4">
//             <h1 className="text-2xl font-bold mb-6 text-center">Your Groups</h1>

//             {groups.length === 0 ? (
//                 <p className="text-gray-400  size-88 text-center mt-10">loding-group.........</p>
//             ) : (
//                 <div className="space-y-4">
//                     {groups.map((group) => (
//                         <motion.div
//                             key={group._id}
//                             whileHover={{ scale: 1.02 }}
//                             transition={{ type: "spring", stiffness: 300 }}
//                             className="flex items-center justify-between p-4 rounded-xl bg-gray-800 cursor-pointer shadow-md hover:shadow-lg"
//                             onClick={() => openGroup(group)}
//                         >
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
//                                     <span className="font-bold text-lg uppercase">{group.name.charAt(0)}</span>
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-lg">{group.name}</p>
//                                     <p className="text-gray-400 text-sm">{group.usersgroup?.length || 0} members</p>
//                                 </div>
//                             </div>
//                             <p className="text-gray-400 text-lg">➡</p>
//                         </motion.div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GroupsScreen;





















"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { ChatContext } from "../context/chatcontext.jsx";
import { motion } from "framer-motion";
import api from "../apicall.js";

const GroupsScreen = () => {
    const [groups, setGroups] = useState([]);
    const { myUsername } = useContext(ChatContext);
    const router = useRouter();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await (await api.post("/crategroup/usergrouplist", { username: myUsername })).data;
                setGroups(res.userWithGroups.grouparr || []);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };

        if (myUsername) fetchGroups();
    }, [myUsername]);

    const openGroup = (group) => {
        router.push(`/grouplist/${group.name}`);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                Your Groups
            </h1>

            {groups.length === 0 ? (
                <p className="text-gray-500 text-center mt-10 text-sm">Loading groups...</p>
            ) : (
                <div className="space-y-3">
                    <div>
                        <button onClick={() => router.push('chatlist')}>
                            all chstlist
                        </button>
                    </div>
                    {groups.map((group) => (
                        <motion.div
                            key={group._id}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200"
                            onClick={() => openGroup(group)}
                        >
                            <div className="flex items-center space-x-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg uppercase">
                                    {group.name.charAt(0)}
                                </div>

                                {/* Group info */}
                                <div>
                                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{group.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {group.usersgroup?.length || 0} members
                                    </p>
                                </div>
                            </div>

                            {/* Chevron */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupsScreen;
