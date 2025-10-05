import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDocs,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import {
  FaHeart,
  FaComment,
  FaPaperPlane,
  FaBookmark,
  FaSpinner,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaUserTie,
  FaSpinner as FaProgress,
  FaCheckCircle,
} from "react-icons/fa";
import SuggestionsBar from "./Sugestionbar";
import { useNavigate } from "react-router-dom";
import geotagphoto from "../assets/geotagMapphoto.webp";
import ScrollNavbar from "./ScrollNavbar";
import verifyTick from "../assets/Blue_tick.png";

// ----------------- Safe Photo Resolver -----------------
const resolvePhotoURL = (val) => {
  if (typeof val !== "string" || !val.trim()) {
    return "/default-avatar.png";
  }
  // Handle data URLs (base64 images) - return as is
  if (val.startsWith("data:")) {
    return val;
  }
  // Handle HTTP/HTTPS URLs - return as is
  if (val.startsWith("http")) {
    return val;
  }
  // Handle placeholder/static images - return as is
  if (val.startsWith("/") || val.includes("placeholder") || val.includes("default-avatar")) {
    return val;
  }
  // Handle base64 strings without data prefix
  if (val.length > 100 && !val.includes('/') && !val.includes('http')) {
    return `data:image/jpeg;base64,${val}`;
  }
  return "/default-avatar.png";
};

// ----------------- User data helper -----------------
const getUserData = async (userId) => {
  if (!userId) {
    return {
      id: "unknown",
      username: "Unknown",
      photoURL: "/default-avatar.png",
      userRole: "user",
    };
  }
  try {
    // First check users collection
    const uRef = doc(db, "users", userId);
    const snap = await getDoc(uRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: userId,
        username: data.username || data.name || "Unknown",
        photoURL: resolvePhotoURL(data.profileImage || data.avatar || "/default-avatar.png"),
        userRole: data.userRole || "user",
      };
    }
    
    // If not found, check civicUsers collection
    const civicRef = doc(db, "civicUsers", userId);
    const civicSnap = await getDoc(civicRef);
    if (civicSnap.exists()) {
      const data = civicSnap.data();
      return {
        id: userId,
        username: data.name || "Unknown",
        photoURL: resolvePhotoURL(data.profileImage || "/default-avatar.png"),
        userRole: "Department",
      };
    }
  } catch (err) {
    console.error("user fetch error:", err);
  }
  return {
    id: "unknown",
    username: "Unknown",
    photoURL: "/default-avatar.png",
    userRole: "user",
  };
};

// ----------------- Enhanced Status Badge Renderer -----------------
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
    case "pending":
  return {
  
    text: "Pending",
    gradient: "from-red-400 via-red-500 to-red-600",
    textColor: "text-white",
    borderColor: "border-indigo-300",
    shadowColor: "shadow-indigo-500/30",
    pulseColor: "animate-pulse",
  };
       
      case "assign":
        return {
          icon: <FaUserTie className="w-3 h-3" />,
          text: "Assigned",
          gradient: "from-amber-400 via-yellow-500 to-orange-500",
          textColor: "text-black",
          borderColor: "border-yellow-300",
          shadowColor: "shadow-yellow-500/40",
          pulseColor: "",
        };
      case "at progress":
      case "in-progress":
        return {
          icon: <FaProgress className="w-3 h-3 animate-spin" />,
          text: "In Progress",
          gradient: "from-blue-500 via-blue-600 to-indigo-600",
          textColor: "text-white",
          borderColor: "border-blue-300",
          shadowColor: "shadow-blue-500/40",
          pulseColor: "",
        };
      case "resolved":
        return {
          icon: <FaCheckCircle className="w-3 h-3" />,
          text: "Resolved",
          gradient: "from-emerald-500 via-green-600 to-green-700",
          textColor: "text-white",
          borderColor: "border-green-300",
          shadowColor: "shadow-green-500/40",
          pulseColor: "",
        };
      case "escalated-approved":
        return {
          icon: <FaExclamationTriangle className="w-3 h-3" />,
          text: "Escalated",
          gradient: "from-orange-500 via-red-500 to-red-600",
          textColor: "text-white",
          borderColor: "border-orange-300",
          shadowColor: "shadow-orange-500/40",
          pulseColor: "animate-pulse",
        };
      case "escalated":
        return {
          icon: <FaExclamationTriangle className="w-3 h-3" />,
          text: "Escalated",
          gradient: "from-purple-500 via-purple-600 to-purple-700",
          textColor: "text-white",
          borderColor: "border-purple-300",
          shadowColor: "shadow-purple-500/40",
          pulseColor: "animate-pulse",
        };
      case "pending-review":
        return {
          icon: <FaProgress className="w-3 h-3 animate-spin" />,
          text: "Under Review",
          gradient: "from-indigo-500 via-blue-600 to-blue-700",
          textColor: "text-white",
          borderColor: "border-blue-300",
          shadowColor: "shadow-blue-500/40",
          pulseColor: "",
        };
      default:
        return {
          icon: <FaExclamationTriangle className="w-3 h-3" />,
          text: status || "Unknown",
          gradient: "from-gray-400 to-gray-500",
          textColor: "text-white",
          borderColor: "border-gray-300",
          shadowColor: "shadow-gray-500/30",
          pulseColor: "",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full 
        bg-gradient-to-r ${config.gradient} ${config.textColor} 
        ${config.borderColor} border ${config.shadowColor} shadow-md 
        backdrop-blur-sm ${config.pulseColor} transform transition-all 
        duration-300 hover:scale-105 hover:shadow-lg`}
    >
      {config.icon}
      <span className="text-[10px] font-semibold uppercase tracking-wide">
        {config.text}
      </span>
    </div>
  );
};

// ----------------- Main PostList --------------------
export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 697);

  const userCache = useRef({});
  const [likes, setLikes] = useState(() =>
    JSON.parse(localStorage.getItem("likes") || "{}")
  );
  const [loadingStates, setLoadingStates] = useState({});
  const [ratingStates, setRatingStates] = useState({});

  const navigate = useNavigate();
  const auth = getAuth();

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 697);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Persist likes
  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  const [commentCounts, setCommentCounts] = useState({});
  
  // Get comment counts from Firebase
  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const post of posts) {
        try {
          const commentsRef = collection(db, 'posts', post.id, 'comments');
          const snapshot = await getDocs(commentsRef);
          counts[post.id] = snapshot.size;
        } catch (error) {
          counts[post.id] = 0;
        }
      }
      setCommentCounts(counts);
    };
    
    if (posts.length > 0) {
      fetchCommentCounts();
    }
  }, [posts]);

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch following
  useEffect(() => {
    if (!currentUserId) {
      setFollowingIds([]);
      return;
    }
    const fetchFollowing = async () => {
      const followingCol = collection(db, "users", currentUserId, "following");
      const snap = await getDocs(followingCol);
      setFollowingIds(snap.docs.map((d) => d.id));
    };
    fetchFollowing();
  }, [currentUserId]);

  // Fetch posts
  useEffect(() => {
    if (!currentUserId) return;
    setLoading(true);

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, async (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const enriched = await Promise.all(
        docs.map(async (p) => {
          const userId = p.userId || p.uid;
          if (!userCache.current[userId]) {
            userCache.current[userId] = await getUserData(userId);
          }
          return {
            ...p,
            user: userCache.current[userId],
            imageUrl: p.imageUrl || p.image || null,
            description: p.description || "",
            tags: p.tags || [],
          };
        })
      );

      setPosts(enriched);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUserId]);

  // Toggle like
  const toggleLike = async (pid) => {
    if (!currentUserId) return;
    
    const postRef = doc(db, 'posts', pid);
    const liked = likes[pid] || false;
    
    try {
      if (liked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUserId)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUserId)
        });
      }
      setLikes((prev) => ({ ...prev, [pid]: !prev[pid] }));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };
  
  // Handle public rating
  const handlePublicRating = async (postId, type, rating) => {
    if (!currentUserId) return;
    
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();
      
      const currentRatings = postData.publicRatings || {};
      const typeRatings = currentRatings[type] || { userRating: {}, total: 0, count: 0 };
      
      // Update user's rating
      const oldRating = typeRatings.userRating[currentUserId] || 0;
      typeRatings.userRating[currentUserId] = rating;
      
      // Recalculate totals
      if (oldRating > 0) {
        typeRatings.total = typeRatings.total - oldRating + rating;
      } else {
        typeRatings.total = (typeRatings.total || 0) + rating;
        typeRatings.count = (typeRatings.count || 0) + 1;
      }
      
      typeRatings.average = typeRatings.total / typeRatings.count;
      
      await updateDoc(postRef, {
        [`publicRatings.${type}`]: typeRatings
      });
      
      // Clear rating state after submission
      setRatingStates(prev => {
        const newState = { ...prev };
        delete newState[`${postId}_${type}`];
        return newState;
      });
      
    } catch (error) {
      console.error('Error updating public rating:', error);
    }
  };

  // Follow/Unfollow
  const handleFollowToggle = async (userId) => {
    if (!currentUserId || !userId) return;

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    const userRef = doc(db, "users", currentUserId);
    const theirUserRef = doc(db, "users", userId);
    const myFollowingDoc = doc(db, "users", currentUserId, "following", userId);
    const theirFollowersDoc = doc(
      db,
      "users",
      userId,
      "followers",
      currentUserId
    );
    const isFollowing = followingIds.includes(userId);

    try {
      const batch = writeBatch(db);
      if (isFollowing) {
        batch.update(userRef, {
          following: arrayRemove(userId),
          followingCount: increment(-1),
        });
        batch.delete(myFollowingDoc);
        batch.delete(theirFollowersDoc);
        await batch.commit();
        await updateDoc(theirUserRef, { followersCount: increment(-1) }).catch(() =>
          setDoc(theirUserRef, { followersCount: 0 }, { merge: true })
        );
        setFollowingIds((prev) => prev.filter((id) => id !== userId));
      } else {
        batch.update(userRef, {
          following: arrayUnion(userId),
          followingCount: increment(1),
        });
        batch.set(myFollowingDoc, { followedAt: serverTimestamp() });
        batch.set(theirFollowersDoc, { followedAt: serverTimestamp() });
        await batch.commit();
        await updateDoc(theirUserRef, { followersCount: increment(1) }).catch(() =>
          setDoc(theirUserRef, { followersCount: 1 }, { merge: true })
        );
        setFollowingIds((prev) => [...prev, userId]);
      }
    } catch (error) {
      console.error("Error updating follow/unfollow:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Guard states
  if (!authChecked)
    return <p className="text-center py-6">Checking authentication...</p>;
  if (!currentUserId)
    return (
      <div className="text-center py-6">
        <p className="text-gray-600">🚀 Please log in to see posts.</p>
      </div>
    );
  if (loading) return <p className="text-center py-6">Loading feed...</p>;

  return (
    <>
      {isMobile && <ScrollNavbar />}

      <div className="max-w-lg mx-auto mt-6 space-y-6">
        <div id="first-section">
          <SuggestionsBar />
        </div>

        {posts.map((post) => {
          const liked = post.likes?.includes(currentUserId) || false;
          const isFollowed = followingIds.includes(post.user?.id);
          const isLoading = loadingStates[post.user?.id] || false;
          const avatar = post.user?.photoURL || "/default-avatar.png";
          const username = post.user?.username || "Unknown";
          const isOwnPost = post.user?.id === currentUserId;

          return (
            <div
              key={post.id}
              className="overflow-hidden bg-[#eaf0ff] shadow-md border border-gray-200 "
            >
              {/* Header */}
              <div className="flex items-start justify-between px-4 pt-3">
                {/* Left User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={avatar}
                    className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover"
                    alt={username}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=40`;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-1">
                      {username}
                      {post.user?.userRole === "Department" && (
                        <img
                          src={verifyTick}
                          alt="verified"
                          className="w-4 h-4"
                          title="Verified Department"
                        />
                      )}
                    </p>
                    <p className="text-xs text-[#782048]">@{username}</p>
                    <p className="text-[10px] text-gray-500">
                      {formatDistanceToNow(
                        post.createdAt?.toDate?.() || new Date(),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Buttons */}
                <div className="flex flex-col items-end gap-2">
                  {!isOwnPost && (
                    <button
                      onClick={() => handleFollowToggle(post.user?.id)}
                      disabled={isLoading}
                      className={`px-4 py-2 text-sm rounded-full font-bold transition ${
                        isFollowed
                          ? "bg-gray-200 text-gray-700"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin inline w-4 h-4" />
                      ) : isFollowed ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Post Image + Extras */}
              {post.imageUrl && (
                <div className="relative px-3 mt-2 mb-5">
                  <div className="relative rounded-4xl overflow-hidden bg-transparent ">
                    <img
                      src={post.imageUrl}
                      className="w-full max-h-[380px] object-cover rounded-t-4xl"
                      alt=""
                    />

                    {/* Floating Status Badge */}
                    {post.status && (
                      <div className="absolute top-3 right-3 z-10">
                        <StatusBadge status={post.status} />
                      </div>
                    )}

                    {/* GeoTag */}
                    {post.geoData && (
                      <div className="w-full text-white flex overflow-hidden bg-black/80">
                        <div className="w-20 sm:w-24 h-16 sm:h-20 bg-transparent flex-shrink-0 overflow-hidden">
                          <img
                            src={geotagphoto}
                            alt="Map Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-white flex flex-col justify-center px-3 py-2 flex-1 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-red-500 w-3 h-3 sm:w-4 sm:h-4" />
                              <p className="font-semibold">
                                {post.geoData.locality || post.geoData.city || post.geoData.district || "Location"}
                              </p>
                              <span className="text-[9px] sm:text-[10px] text-gray-300 ml-2">
                                🌐 {post.geoData.latitude?.toFixed(4)}, {post.geoData.longitude?.toFixed(4)}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] sm:text-xs">
                            {post.geoData.state || post.geoData.region}, {post.geoData.country}
                          </p>
                          {post.geoData.address && (
                            <p className="text-[9px] sm:text-[10px] italic mt-1 truncate">
                              {post.geoData.address}
                            </p>
                          )}
                          <div className="flex items-center justify-end mt-1">
                            {post.geoData.pincode && (
                              <p className="text-[9px] sm:text-[10px]">
                                📍 {post.geoData.pincode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between bg-gray-600 px-4 py-2">
                      <div className="flex gap-6 text-gray-300 text-lg">
                        <div
                          onClick={() => navigate(`/comments/${post.id}`)}
                          className="flex items-center gap-1 cursor-pointer hover:text-blue-300"
                        >
                          <FaComment />
                          <span className="text-sm">
                            {commentCounts[post.id] || 0}
                          </span>
                        </div>
                        <div
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1 cursor-pointer hover:text-red-300"
                        >
                          <FaHeart
                            className={`${liked ? "text-red-500" : ""}`}
                          />
                          <span className="text-sm">{post.likes?.length || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-lg text-gray-300">
                        <FaPaperPlane className="cursor-pointer hover:text-green-500" />
                        <FaBookmark className="cursor-pointer hover:text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Caption & Tags - Outside image */}
              <div className="px-4 mt-3 mb-2">
                {post.description && (
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {post.description}
                  </p>
                )}
                {post.text && (
                  <p className="text-sm text-gray-600 mb-2">{post.text}</p>
                )}
                
                {/* Public Rating System */}
                {(post.isResolved || post.isEscalated) && (
                  <div className="space-y-2 mb-2">
                    {/* Proof of Work Rating */}
                    {post.isResolved && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-700">Rate Work Quality:</span>
                          <span className="text-xs text-blue-600">
                            {post.publicRatings?.work?.count || 0} ratings
                            {post.publicRatings?.work?.average && (
                              <span className="ml-1">
                                | Avg: {post.publicRatings.work.average.toFixed(1)}/5
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRatingStates(prev => ({
                                  ...prev,
                                  [`${post.id}_work`]: star
                                }))}
                                className={`text-lg transition-colors hover:scale-110 ${
                                  star <= (ratingStates[`${post.id}_work`] || post.publicRatings?.work?.userRating?.[currentUserId] || 0)
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300 hover:text-yellow-200'
                                }`}
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                          {ratingStates[`${post.id}_work`] && (
                            <button
                              onClick={() => handlePublicRating(post.id, 'work', ratingStates[`${post.id}_work`])}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Escalation Validity Rating */}
                    {post.isEscalated && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-orange-700">Rate Escalation Validity:</span>
                          <span className="text-xs text-orange-600">
                            {post.publicRatings?.escalation?.count || 0} ratings
                            {post.publicRatings?.escalation?.average && (
                              <span className="ml-1">
                                | Avg: {post.publicRatings.escalation.average.toFixed(1)}/5
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRatingStates(prev => ({
                                  ...prev,
                                  [`${post.id}_escalation`]: star
                                }))}
                                className={`text-lg transition-colors hover:scale-110 ${
                                  star <= (ratingStates[`${post.id}_escalation`] || post.publicRatings?.escalation?.userRating?.[currentUserId] || 0)
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300 hover:text-yellow-200'
                                }`}
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                          {ratingStates[`${post.id}_escalation`] && (
                            <button
                              onClick={() => handlePublicRating(post.id, 'escalation', ratingStates[`${post.id}_escalation`])}
                              className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full hover:bg-orange-700 transition-colors"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <p className="text-sm text-blue-600 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="hover:text-blue-800 cursor-pointer"
                        onClick={() =>
                          navigate(`/explore/tags/${tag.replace("#", "")}`)
                        }
                      >
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}