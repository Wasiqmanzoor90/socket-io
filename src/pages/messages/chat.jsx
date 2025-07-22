import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

// Chat theme styles (matching the AllUser theme)
const chatStyles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', // Consistent background
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, Arial, sans-serif',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
  },
  backgroundPattern: { // Consistent background pattern
    position: 'absolute',
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
    position: "relative",
    zIndex: 2, // Ensure header is above background pattern
  },
  headerTitle: {
    fontSize: "2.1rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)", // White gradient for text
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
    letterSpacing: "0.5px",
    textShadow: "0 2px 8px rgba(0,0,0,0.1)", // Subtle text shadow
    verticalAlign: "middle", // Align with avatar
  },
  backBtn: {
    position: "absolute",
    left: "24px",
    top: "36px",
    background: "rgba(255, 255, 255, 0.15)", // Translucent background
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#ffffff", // White text
    fontSize: "1.1rem",
    fontWeight: 700,
    cursor: "pointer",
    padding: "8px 18px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  backBtnHover: {
    background: "rgba(255, 255, 255, 0.25)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transform: "translateY(-1px)",
  },
  chatBox: {
    flex: 1,
    background: "transparent", // Allow background pattern to show
    padding: "30px 0 0 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },
  messagesContainer: {
    width: '100%',
    maxWidth: '660px',
    flex: 1,
    padding: '0 18px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px', // Increased gap for better spacing
    marginBottom: '10px',
  },
  messageRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: '6px 0',
  },
  messageRowSelf: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.15)', // Glassmorphic background for incoming
    backdropFilter: 'blur(15px)',
    color: '#ffffff', // White text for incoming
    fontSize: '1.06rem',
    maxWidth: '70%',
    wordBreak: 'break-word',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  messageBubbleSelf: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', // Accent gradient for outgoing
    color: '#fff',
    fontWeight: 500,
    boxShadow: '0 4px 18px 0 rgba(99,102,241,0.2)', // Stronger shadow for self
  },
  messageMeta: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)', // Lighter color for meta
    marginTop: '4px', // Increased margin
    marginLeft: '7px',
  },
  messageMetaSelf: {
    color: 'rgba(255, 255, 255, 0.8)', // Slightly different for self
    marginLeft: '0',
    marginRight: '7px',
  },
  inputRow: {
    width: '100%',
    maxWidth: '660px',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.1)', // Glassmorphic input row
    backdropFilter: 'blur(15px)',
    borderRadius: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '12px 18px',
    margin: '0 0 26px 0',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  input: {
    flex: 1,
    fontSize: '1.06rem',
    padding: '11px 16px',
    borderRadius: '22px',
    border: '1px solid rgba(255, 255, 255, 0.2)', // Translucent border
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.05)', // Translucent input background
    backdropFilter: 'blur(5px)',
    transition: 'border 0.2s',
    marginRight: '7px',
    color: '#ffffff', // White text
  },
  sendBtn: {
    padding: '11px 22px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', // Accent gradient
    color: '#fff',
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '1.03rem',
    cursor: 'pointer',
    transition: 'background 0.17s, box-shadow 0.17s, transform 0.17s',
    boxShadow: '0 4px 12px rgba(99,102,241,0.2)', // Stronger shadow
  },
  sendBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)', // Greyed out gradient
    boxShadow: 'none',
  },
  empty: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)", // Lighter color
    fontSize: "1.1rem",
    marginTop: "80px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  error: { // Error styling consistent with AllUser
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

function getAvatar(user) {
  // Use a more vibrant color palette for DiceBear initials
  return user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "U"}&backgroundColor=6366f1,8b5cf6,667eea&backgroundType=gradientLinear&randomizeIds=true`;
}

export default function Chat() {
  const { id: receiverId } = useParams();
  const location = useLocation();
  const user = location.state?.user;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const senderId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const room = [senderId, receiverId].sort().join('_');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Redirect if user object is missing (e.g., direct access without user state)
    if (!user || !token || !senderId) {
      navigate("/"); // Redirect to home/login
      return;
    }

    const fetchMessages = async () => {
      setErr('');
      try {
        const res = await axios.get(`https://socket-io-87f1.onrender.com/api/message/${room}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        setErr("Failed to fetch messages. Please try again.");
      }
    };

    fetchMessages();
    // Optionally, poll for new messages every few seconds for "live" chat
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [room, user, token, senderId, navigate]); // Added navigate to dependency array

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    setErr('');
    try {
      const res = await axios.post(
        'https://socket-io-87f1.onrender.com/api/message',
        {
          senderId,
          room,
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      setErr('Failed to send message. Please try again.');
    }
    setSending(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page in history (AllUser list)
  };

  if (!user) {
    return (
      <div style={chatStyles.wrapper}>
        <div style={chatStyles.backgroundPattern}></div> {/* Add background pattern here too */}
        <div style={chatStyles.header}>
          <h1 style={chatStyles.headerTitle}>Chat</h1>
        </div>
        <div style={{...chatStyles.empty, margin: 'auto', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)'}}>
          <div style={{ fontSize: '2.3rem', marginBottom: '12px', opacity: 0.45 }}>⚠️</div>
          User not found or session expired. Please go back and select a user.
          <button
            style={{
              ...chatStyles.sendBtn, // Reusing sendBtn style for a consistent look
              marginTop: '20px',
              maxWidth: '200px',
              margin: '20px auto 0 auto',
              display: 'block',
            }}
            onClick={() => navigate('/')} // Go to login/home
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={chatStyles.wrapper}>
      <div style={chatStyles.backgroundPattern}></div>
      
      <header style={chatStyles.header}>
        <button
          style={chatStyles.backBtn}
          onClick={handleBackClick} // Use navigate(-1)
          aria-label="Go back"
          onMouseEnter={(e) => e.currentTarget.style.cssText += `
            background: ${chatStyles.backBtnHover.background};
            box-shadow: ${chatStyles.backBtnHover.boxShadow};
            transform: ${chatStyles.backBtnHover.transform};
          `}
          onMouseLeave={(e) => e.currentTarget.style.cssText += `
            background: ${chatStyles.backBtn.background};
            box-shadow: ${chatStyles.backBtn.boxShadow};
            transform: none;
          `}
        >← Back</button>
        <img
          src={getAvatar(user)}
          alt={`${user.name}'s avatar`}
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid rgba(255, 255, 255, 0.3)", // Glassmorphic border
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)", // Stronger shadow
            background: "rgba(99,102,241,0.3)", // Placeholder background
            marginRight: "12px",
            verticalAlign: "middle"
          }}
          onError={(e) => {
            e.target.src = getAvatar(user); // Fallback to DiceBear if user.avatar fails
            e.target.onerror = null; 
          }}
        />
        <span style={chatStyles.headerTitle}>Chatting with {user.name}</span>
      </header>
      <div style={chatStyles.chatBox}>
        <div style={chatStyles.messagesContainer}>
          {messages.length === 0 && (
            <div style={chatStyles.empty}>
              <div style={{ fontSize: '2.3rem', marginBottom: '12px', opacity: 0.45 }}>💬</div>
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((msg, idx) => {
            const isSelf = msg.sender._id === senderId;
            return (
              <div
                key={idx}
                style={{
                  ...chatStyles.messageRow,
                  ...(isSelf ? chatStyles.messageRowSelf : {}),
                }}
              >
                <div
                  style={{
                    ...chatStyles.messageBubble,
                    ...(isSelf ? chatStyles.messageBubbleSelf : {}),
                  }}
                  tabIndex={0}
                  aria-label={`${isSelf ? "Your" : user.name + "'s"} message: ${msg.content}`}
                >
                  {msg.content}
                </div>
                <div
                  style={{
                    ...chatStyles.messageMeta,
                    ...(isSelf ? chatStyles.messageMetaSelf : {})
                  }}
                >
                  {formatDate(msg.date)}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
        <form
          style={chatStyles.inputRow}
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
          aria-label="Send message"
        >
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a message..."
            style={chatStyles.input}
            autoFocus
            disabled={sending}
            aria-label="Message input"
          />
          <button
            onClick={sendMessage}
            style={{
              ...chatStyles.sendBtn,
              ...(sending || !newMessage.trim() ? chatStyles.sendBtnDisabled : {})
            }}
            disabled={sending || !newMessage.trim()}
            type="submit"
            aria-label="Send"
            onMouseEnter={(e) => {
              if (!sending && newMessage.trim()) {
                e.currentTarget.style.cssText += `
                  transform: translateY(-2px);
                  box-shadow: 0 8px 20px rgba(99,102,241,0.3);
                `;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.cssText += `
                transform: none;
                box-shadow: ${chatStyles.sendBtn.boxShadow};
              `;
            }}
          >
            Send
          </button>
        </form>
        {err && (
          <div style={chatStyles.error}>{err}</div>
        )}
      </div>
      {/* Global CSS for scrollbars and autofill */}
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
    </div>
  );
}
