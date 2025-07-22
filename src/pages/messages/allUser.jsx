import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure react-router-dom is used for useNavigate

// Enhanced styles with modern glassmorphic design
const styles = {
  wrapper: {
    width: "100vw",
    minHeight: "100vh", // Use minHeight to allow content to expand
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    overflow: "hidden", // Keep overflow hidden for the main wrapper
    position: "relative",
    boxSizing: "border-box",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    background: `
      radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, #667eea 0%, transparent 50%)
    `,
    animation: "pulse 8s ease-in-out infinite alternate",
  },
  header: {
    background: "rgba(255, 255, 255, 0.08)", // Glassmorphic background
    backdropFilter: "blur(20px)",
    padding: "40px 0 24px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    position: "relative", // Ensure header is above background pattern
    zIndex: 2,
  },
  headerTitle: {
    fontSize: "2.8rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
    letterSpacing: "-0.02em",
    textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(255, 255, 255, 0.7)",
    margin: "12px 0 0 0",
    fontWeight: 500,
    letterSpacing: "0.3px",
  },
  content: {
    flex: 1,
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1, // Ensure content is above background pattern
  },
  searchBar: {
    padding: "24px 32px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    justifyContent: "center",
    position: "relative", // Ensure searchBar is above background pattern
    zIndex: 2,
  },
  searchInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "16px 24px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    fontSize: "1.1rem",
    outline: "none",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    boxSizing: "border-box",
    color: "#ffffff",
    fontFamily: "inherit",
    fontWeight: 500,
  },
  searchInputFocused: {
    borderColor: "rgba(99, 102, 241, 0.6)",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1), 0 8px 25px rgba(0, 0, 0, 0.15)",
    background: "rgba(255, 255, 255, 0.15)",
  },
  userList: {
    listStyle: "none",
    padding: "20px", // Adjusted padding for better spacing
    margin: 0,
    flex: 1,
    background: "transparent",
    overflowY: "auto", // Keep scroll functionality
    gap: "16px", // Increased gap between items
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: "20px 24px",
    borderRadius: "18px",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    background: "rgba(255, 255, 255, 0.08)", // Glassmorphic background
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  userItemHover: {
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 30px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)",
    transform: "translateY(-2px) scale(1.01)",
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  userItemRecent: {
    background: "rgba(99, 102, 241, 0.1)", // Accent background for recent
    borderColor: "rgba(99, 102, 241, 0.3)",
    boxShadow: "0 4px 25px rgba(99, 102, 241, 0.15)",
  },
  avatar: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    marginRight: "20px",
    objectFit: "cover",
    border: "3px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    background: "rgba(99, 102, 241, 0.2)", // Placeholder background
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    letterSpacing: "0.02em",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },
  userStatus: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.7)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 500,
  },
  messageTime: {
    fontSize: "0.9rem",
    color: "#6366f1",
    marginLeft: "8px",
    fontWeight: 600,
    background: "rgba(99, 102, 241, 0.2)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "4px 12px",
    alignSelf: "flex-start",
    marginTop: "2px",
    border: "1px solid rgba(99, 102, 241, 0.3)",
  },
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
    position: "relative", // Ensure error is above background pattern
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
    position: "relative", // Ensure loading is above background pattern
    zIndex: 2,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "rgba(255, 255, 255, 0.7)",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    margin: "20px",
    position: "relative", // Ensure emptyState is above background pattern
    zIndex: 2,
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "20px",
    opacity: 0.6,
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
  },
  emptyText: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "12px",
    color: "#ffffff",
  },
  emptySubtext: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: 500,
  },
};

function formatDate(dateStr) {
  // Accepts ISO string, returns "YYYY-MM-DD HH:mm"
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
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("id");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentUserIds, setRecentUserIds] = useState([]);
  const [recentUserTimes, setRecentUserTimes] = useState({});
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUser, setHoveredUser] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (!token || !userId) {
      
      navigate("/login"); // Redirect to login if no token or userId
      return;
    }
    
    const fetchUsers = async () => {
      setLoading(true);
      setErr("");
      try {
        // Fetch all users
        const res = await axios.get(`https://socket-io-87f1.onrender.com/api/users`, {
          
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.users || res.data;
        setUsers(userData);
        setFilteredUsers(userData);

        // Fetch recent message info
        const latest = await axios.get(
          `https://socket-io-87f1.onrender.com/api/message/latest/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Extract user IDs and message times from recent messages
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
      } catch (error) {
        setErr("Unable to load users. Please check your connection or try again later.");
        // Optional: Redirect to login on severe error or token expiry
        // setTimeout(() => navigate("/"), 2000); 
      }
      setLoading(false);
    };
    
    fetchUsers();
  }, [token, navigate, userId]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const goToChat = (user) => {
    navigate(`/chat/${user._id}`, { state: { user } });
  };

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
                        src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=6366f1,8`}
                        alt={user.name}
                        style={styles.avatar}
                        onError={(e) => {
                          // Fallback to DiceBear if user.avatar fails to load
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=6366f1,8`;
                          // Set onerror to null to prevent infinite loops if fallback also fails
                          e.target.onerror = null; 
                        }}
                      />
                      <div style={styles.userInfo}>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userStatus}>
                          {hasRecentMessages ? "Recent chat" : "New contact"}
                          {messageTime && (
                            <span style={styles.messageTime}>{messageTime}</span>
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
//all ok