import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

// Chat theme styles (matching the AllUser theme)
const chatStyles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, Arial, sans-serif',
    overflow: 'hidden'
  },
  header: {
    background: "rgba(255,255,255,0.97)",
    backdropFilter: "blur(8px)",
    padding: "30px 0 14px 0",
    borderBottom: "1px solid #e9ecef",
    textAlign: "center",
    boxShadow: "0 2px 12px 0 rgba(78,84,200,0.04)"
  },
  headerTitle: {
    fontSize: "2.1rem",
    fontWeight: 800,
    color: "#4e54c8",
    margin: 0,
    letterSpacing: "0.5px",
    textShadow: "0 2px 8px rgba(102,126,234,0.08)",
  },
  backBtn: {
    position: "absolute",
    left: "24px",
    top: "36px",
    background: "none",
    border: "none",
    color: "#4e54c8",
    fontSize: "1.1rem",
    fontWeight: 700,
    cursor: "pointer",
    padding: "8px 18px",
    borderRadius: "8px",
    transition: "background 0.2s",
  },
  chatBox: {
    flex: 1,
    background: "#f8f9fa",
    padding: "30px 0 0 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  messagesContainer: {
    width: '100%',
    maxWidth: '660px',
    flex: 1,
    padding: '0 18px 0 18px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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
    background: '#ececff',
    color: '#232354',
    fontSize: '1.06rem',
    maxWidth: '70%',
    wordBreak: 'break-word',
    boxShadow: '0 2px 8px rgba(102,126,234,0.08)',
    position: 'relative'
  },
  messageBubbleSelf: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontWeight: 500,
    boxShadow: '0 4px 18px 0 rgba(79,84,200,0.13)',
  },
  messageMeta: {
    fontSize: '0.85rem',
    color: '#999',
    marginTop: '2px',
    marginLeft: '7px'
  },
  messageMetaSelf: {
    color: '#ececff',
    marginLeft: '0',
    marginRight: '7px'
  },
  inputRow: {
    width: '100%',
    maxWidth: '660px',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '32px',
    boxShadow: '0 2px 8px rgba(102,126,234,0.07)',
    padding: '12px 18px',
    margin: '0 0 26px 0',
    border: '1px solid #e9ecef'
  },
  input: {
    flex: 1,
    fontSize: '1.06rem',
    padding: '11px 16px',
    borderRadius: '22px',
    border: '1px solid #e9ecef',
    outline: 'none',
    background: '#f8f9fa',
    transition: 'border 0.2s',
    marginRight: '7px'
  },
  sendBtn: {
    padding: '11px 22px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '1.03rem',
    cursor: 'pointer',
    transition: 'background 0.17s, box-shadow 0.17s, transform 0.17s',
    boxShadow: '0 2px 8px rgba(102,126,234,0.09)',
  },
  sendBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  empty: {
    textAlign: "center",
    color: "#999",
    fontSize: "1.1rem",
    marginTop: "80px"
  }
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
  return user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "U"}&backgroundColor=667eea,764ba2`;
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

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      setErr('');
      try {
        const res = await axios.get(`http://localhost:5000/api/message/${room}`, {
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
  }, [room, user, token]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    setErr('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/message',
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

  if (!user) {
    return (
      <div style={chatStyles.wrapper}>
        <div style={chatStyles.header}>
          <h1 style={chatStyles.headerTitle}>Chat</h1>
        </div>
        <div style={chatStyles.empty}>User not found. Please go back and select a user.</div>
      </div>
    );
  }

  return (
    <div style={chatStyles.wrapper}>
      <div style={chatStyles.header}>
        <button
          style={chatStyles.backBtn}
          onClick={() => window.history.back()}
          aria-label="Go back"
        >← Back</button>
        <img
          src={getAvatar(user)}
          alt={`${user.name}'s avatar`}
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #fff",
            boxShadow: "0 2px 8px rgba(102,126,234,0.11)",
            background: "#ececff",
            marginRight: "12px",
            verticalAlign: "middle"
          }}
        />
        <span style={chatStyles.headerTitle}>Chatting with {user.name}</span>
      </div>
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
          >
            Send
          </button>
        </form>
        {err && (
          <div style={{
            color: "#f44336",
            textAlign: "center",
            fontSize: "0.98rem",
            marginTop: "7px"
          }}>{err}</div>
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