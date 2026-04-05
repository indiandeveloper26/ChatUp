// "use client";
// import { useEffect, useState } from "react";
// import api from "../apicall";

// export default function ProfilePage() {
//     const [user, setUser] = useState(null);
//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         async function fetchProfile() {
//             let userid = localStorage.getItem("id"); // user id jo login pe save hua hai
//             console.log("userid", userid);

//             try {
//                 const res = await api.post("/useralldata", { id: userid });

//                 setUser(res.data.data);
//                 setPosts(res.data.data.posts);

//                 console.log("Profile Data:", res.data.data);
//             } catch (err) {
//                 console.error("Error fetching profile:", err);
//             }
//         }
//         fetchProfile();
//     }, []);

//     if (!user) return <p>Loading...</p>;

//     return (
//         <div className="max-w-3xl mx-auto p-4">
//             {/* User Info */}
//             <div className="flex items-center gap-4 border-b pb-4 mb-6">
//                 <img
//                     src={user.avatar || "/default-avatar.png"}
//                     alt={user.name}
//                     className="w-20 h-20 rounded-full border"
//                 />
//                 <div>
//                     <h1 className="text-2xl font-bold">{user.name}</h1>
//                     <p className="text-gray-600">{user.email}</p>
//                     <p className="text-gray-500">{posts.length} posts</p>
//                 </div>
//             </div>

//             {/* Posts Grid (Instagram style) */}
//             <div className="grid grid-cols-3 gap-2">
//                 {posts.map((post) => (
//                     <div key={post._id} className="relative aspect-square bg-gray-100">
//                         {post.image ? (
//                             <img
//                                 src={`http://localhost:5000${post.image}`} // server ka address + image path
//                                 alt="post"
//                                 className="object-cover w-full h-full"
//                             />

//                         ) : (
//                             <p className="text-sm p-2">{post.content}</p>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }















"use client";

import { useEffect, useState } from "react";
import api from "../apicall";

export default function ProfilePage({ profileUserId }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        const loggedInId = localStorage.getItem("id");
        setCurrentUserId(loggedInId);
    }, []);

    useEffect(() => {
        if (!profileUserId && !currentUserId) return;

        const fetchProfile = async () => {
            try {
                const idToFetch = profileUserId || currentUserId;
                const res = await api.post("/useralldata", { id: idToFetch });

                setUser(res.data.data);
                setPosts(res.data.data.posts);

                console.log('apicallinf', res)

                setIsFollowing(
                    res.data.data.followers?.includes(currentUserId)
                );
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileUserId, currentUserId]);

    const handleFollowToggle = async () => {
        if (!user || !currentUserId) return;
        setButtonLoading(true);

        try {
            const action = isFollowing ? "unfollow" : "follow";
            const res = await api.post("/follow", {
                userId: currentUserId,
                targetUserId: user._id,
                action,
            });

            setUser((prev) => ({
                ...prev,
                followers: res.data.followers,
                following: res.data.following,
            }));

            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error(err);
        } finally {
            setButtonLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6 mb-6">
                <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-gray-300"
                />

                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        {user._id !== currentUserId && (
                            <button
                                onClick={handleFollowToggle}
                                disabled={buttonLoading}
                                className={`px-4 py-1 rounded-lg shadow text-white text-sm transition ${isFollowing
                                    ? "bg-gray-400 hover:bg-gray-500"
                                    : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                            >
                                {buttonLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>

                    <div className="flex gap-6 text-gray-700 mb-2">
                        <span><b>{posts.length}</b> posts</span>
                        <span><b>{user.followers?.length || 0}</b> followers</span>
                        <span><b>{user.following?.length || 0}</b> following</span>
                    </div>

                    {user.bio && <p className="text-gray-600 text-sm">{user.bio}</p>}
                </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-3 gap-2">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="relative aspect-square bg-gray-100 overflow-hidden rounded"
                    >
                        {post.image ? (
                            <img
                                src={post.image}
                                alt="post"
                                className="object-cover w-full h-full hover:scale-105 transition-transform"
                            />
                        ) : (
                            <p className="text-sm p-2">{post.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
