import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Styles object containing all component styling
const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter, Arial, sans-serif",
    overflow: "hidden",
  },
  header: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    padding: "34px 0 17px 0",
    borderBottom: "1px solid #e9ecef",
    textAlign: "center",
    boxShadow: "0 2px 12px 0 rgba(78,84,200,0.04)",
  },
  headerTitle: {
    fontSize: "2.6rem",
    fontWeight: 900,
    color: "#4e54c8",
    margin: 0,
    letterSpacing: "0.5px",
    textShadow: "0 2px 8px rgba(102,126,234,0.08)",
  },
  subtitle: {
    fontSize: "1.02rem",
    color: "#888",
    margin: "7px 0 0 0",
    fontStyle: "italic",
    letterSpacing: "0.1px",
  },
  content: {
    flex: 1,
    background: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
  },
  searchBar: {
    padding: "18px 0",
    background: "#fff",
    borderBottom: "1px solid #e9ecef",
    display: "flex",
    justifyContent: "center",
  },
  searchInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "14px 22px",
    border: "1px solid #e9ecef",
    borderRadius: "26px",
    fontSize: "1.1rem",
    outline: "none",
    background: "#f8f9fa",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  userList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    flex: 1,
    background: "#fff",
    overflowY: "auto",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: "18px 36px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.17s, box-shadow 0.17s, transform 0.17s",
    background: "#fff",
  },
  userItemHover: {
    background: "#ececff",
    boxShadow: "0 4px 16px 0 rgba(78,84,200,0.08)",
    transform: "scale(1.02)",
  },
  avatar: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    marginRight: "18px",
    objectFit: "cover",
    border: "3px solid #fff",
    boxShadow: "0 2px 8px rgba(102,126,234,0.11)",
    background: "#ececff",
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "1.21rem",
    fontWeight: 700,
    color: "#232354",
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    letterSpacing: "0.04em",
  },
  userStatus: {
    fontSize: "0.97rem",
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  messageTime: {
    fontSize: "0.93rem",
    color: "#764ba2",
    marginLeft: "6px",
    fontWeight: 600,
    background: "#ececff",
    borderRadius: "9px",
    padding: "2px 10px",
    alignSelf: "flex-start",
    marginTop: "4px",
  },
  error: {
    color: "#f44336",
    textAlign: "center",
    margin: "20px",
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "0.95rem",
  },
  loading: {
    color: "#666",
    textAlign: "center",
    margin: "40px 20px",
    fontSize: "1.15rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#666",
  },
  emptyIcon: {
    fontSize: "2.3rem",
    marginBottom: "14px",
    opacity: 0.45,
  },
  emptyText: {
    fontSize: "1.08rem",
    fontWeight: 600,
    marginBottom: "8px",
  },
  emptySubtext: {
    fontSize: "0.95rem",
    color: "#999",
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
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recentUserIds, setRecentUserIds] = useState([]);
  const [recentUserTimes, setRecentUserTimes] = useState({});
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUser, setHoveredUser] = useState(null);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/");
      return;
    }
    const fetchUsers = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.users || res.data;
        setUsers(userData);
        setFilteredUsers(userData);
        // Get recent message info
        const latest = await axios.get(
          `http://localhost:5000/api/message/latest/${userId}`,
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
        setErr("Unable to load users. Please check your connection.");
        setTimeout(() => navigate("/"), 2000);
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
    <div style={styles.wrapper}>
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
            style={{
              ...styles.searchInput,
              borderColor: searchTerm ? "#667eea" : "#e9ecef",
              background: searchTerm ? "#fff" : "#f8f9fa",
            }}
          />
        </div>
        {err && <div style={styles.error}>{err}</div>}
        {loading ? (
          <div style={styles.loading}>Loading conversations...</div>
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
                      boxShadow: hasRecentMessages
                        ? "0 4px 18px 0 rgba(79,84,200,0.13)"
                        : styles.userItem.boxShadow,
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
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=667eea,764ba2`
                      }
                      alt={`${user.name}'s avatar`}
                      style={styles.avatar}
                      loading="lazy"
                    />
                    <div style={styles.userInfo}>
                      <div
                        style={{
                          ...styles.userName,
                          fontWeight: hasRecentMessages ? 900 : 700,
                        }}
                      >
                        {user.name}
                      </div>

                      <div style={styles.userStatus}>
                        {user.email || "Available for chat"}
                        {recentUserTimes[user._id] && (
                          <span style={styles.messageTime}>
                            {recentUserTimes[user._id]}
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
      {/* Hide scrollbars globally */}
      <style>{`
        ::-webkit-scrollbar { width: 0 !important; background: transparent !important;}
        html { scrollbar-width: none !important; }
        body { -ms-overflow-style: none !important; }
      `}</style>
    </div>
  );
}
