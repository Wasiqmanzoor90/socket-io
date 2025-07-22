import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ... (keep all your existing styles object as is) ...
const styles = {
  wrapper: {
    width: "100vw",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    overflow: "hidden",
    position: "relative",
    boxSizing: "border-box",
  },
  // ... (include all other styles from your original code) ...
  error: {
    color: "#ff6b6b",
    textAlign: "center",
    margin: "20px",
    background: "rgba(255, 107, 107, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "16px 20px",
    borderRadius: "16px",
    fontSize: "1rem",
    fontWeight: 600,
    border: "1px solid rgba(255, 107, 107, 0.2)",
    position: "relative",
    zIndex: 2,
  },
  loading: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    margin: "60px 20px",
    fontSize: "1.2rem",
    fontWeight: 600,
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    zIndex: 2,
  },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
}

export default function AllUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentUserIds, setRecentUserIds] = useState([]);
  const [recentUserTimes, setRecentUserTimes] = useState({});
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUser, setHoveredUser] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Add state for token and userId to handle client-side hydration
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("id");
    
    console.log("Token from localStorage:", storedToken);
    console.log("UserId from localStorage:", storedUserId);
    
    setToken(storedToken);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    // Only run if we're on client side and have token/userId
    if (!isClient || !token || !userId) {
      if (isClient && (!token || !userId)) {
        console.log("No token or userId found, redirecting to login");
        navigate("/");
      }
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setErr("");
      
      try {
        console.log("Making request with token:", token);
        
        // Test the token first with a simple request
        const testRes = await axios.get(
          "https://socket-io-87f1.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log("API Response:", testRes.data);
        const userData = testRes.data.users || testRes.data;
        setUsers(userData);
        setFilteredUsers(userData);

        // Fetch recent message info
        try {
          const latest = await axios.get(
            `https://socket-io-87f1.onrender.com/api/message/latest/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            }
          );
          
          const latestIds = [];
          const latestTimes = {};
          latest.data.forEach((msg) => {
            const otherUserId =
              msg.lastMessage.sender === userId
                ? msg.lastMessage.receiver
                : msg.lastMessage.sender;
            latestIds.push(otherUserId);
            if (msg.lastMessage.date) {
              latestTimes[otherUserId] = formatDate(msg.lastMessage.date);
            }
          });
          setRecentUserIds(latestIds);
          setRecentUserTimes(latestTimes);
        } catch (latestError) {
          console.log("Failed to fetch recent messages:", latestError);
          // Don't fail the whole component for recent messages
        }
        
      } catch (error) {
        console.error("Fetch users error:", error);
        console.error("Error response:", error.response);
        
        if (error.response?.status === 401) {
          setErr("Your session has expired. Please log in again.");
          // Clear invalid token
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          setTimeout(() => navigate("/"), 2000);
        } else if (error.code === 'ECONNABORTED') {
          setErr("Request timeout. Please check your internet connection.");
        } else {
          setErr("Unable to load users. Please check your connection or try again later.");
        }
      }
      setLoading(false);
    };

    fetchUsers();
  }, [token, userId, isClient, navigate]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const goToChat = (user) => {
    navigate(`/chat/${user._id}`, { state: { user } });
  };

  // Show loading while waiting for client-side hydration
  if (!isClient) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Sort users: recent first
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aIsRecent = recentUserIds.includes(a._id);
    const bIsRecent = recentUserIds.includes(b._id);
    if (aIsRecent && !bIsRecent) return -1;
    if (!aIsRecent && bIsRecent) return 1;
    return 0;
  });

  return (
    <>
      {/* Include your existing styles here */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
          background-clip: content-box;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.03;
          }
          50% {
            opacity: 0.08;
          }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.15) inset !important;
          -webkit-text-fill-color: #ffffff !important;
        }
      `}</style>

      <div style={styles.wrapper}>
        <div style={styles.backgroundPattern}></div>

        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Your Chats</h1>
          <div style={styles.subtitle}>
            {users.length} contacts &middot; Let's get chatting!
          </div>
        </header>

        <div style={styles.content}>
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                ...styles.searchInput,
                ...(searchFocused ? styles.searchInputFocused : {}),
              }}
            />
          </div>

          {err && <div style={styles.error}>{err}</div>}

          {loading ? (
            <div style={styles.loading}>✨ Loading conversations...</div>
          ) : (
            <ul style={styles.userList}>
              {sortedUsers.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>👥</div>
                  <div style={styles.emptyText}>
                    {searchTerm ? "No matches found" : "No users available"}
                  </div>
                  <div style={styles.emptySubtext}>
                    {searchTerm
                      ? "Try a different search term"
                      : "Check back later for new contacts"}
                  </div>
                </div>
              ) : (
                sortedUsers.map((user) => {
                  const hasRecentMessages = recentUserIds.includes(user._id);
                  const messageTime = recentUserTimes[user._id];
                  return (
                    <li
                      key={user._id}
                      style={{
                        ...styles.userItem,
                        ...(hoveredUser === user._id ? styles.userItemHover : {}),
                        ...(hasRecentMessages ? styles.userItemRecent : {}),
                      }}
                      onClick={() => goToChat(user)}
                      onMouseEnter={() => setHoveredUser(user._id)}
                      onMouseLeave={() => setHoveredUser(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Start chat with ${user.name}`}
                    >
                      <img
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=6366f1,8`
                        }
                        alt={user.name}
                        style={styles.avatar}
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=6366f1,8`;
                          e.target.onerror = null;
                        }}
                      />
                      <div style={styles.userInfo}>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userStatus}>
                          {hasRecentMessages ? "Recent chat" : "New contact"}
                          {messageTime && (
                            <span style={styles.messageTime}>
                              {messageTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}