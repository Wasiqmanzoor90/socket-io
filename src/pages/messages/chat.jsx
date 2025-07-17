import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

function Chat() {
  const { id: receiverId } = useParams();
  const location = useLocation();
  const user = location.state?.user;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const senderId = localStorage.getItem('id'); // you should set this on login
  console.log("Sender ID:", senderId);
  const token = localStorage.getItem('token');

  const room = [senderId, receiverId].sort().join('_'); // consistent room ID

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/message/${room}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [room, user, token]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

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
      console.error('Failed to send message', err);
    }
  };

  if (!user) {
    return <div>User not found. Please go back and select a user.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Chatting with {user.name}</h2>
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        height: '400px',
        overflowY: 'auto',
        marginBottom: '16px',
        background: '#f9f9f9'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.sender._id === senderId ? 'right' : 'left',
            margin: '10px 0'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '20px',
              background: msg.sender._id === senderId ? '#4e54c8' : '#e0e0e0',
              color: msg.sender._id === senderId ? '#fff' : '#000'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '16px',
            borderRadius: '20px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: '#4e54c8',
            color: '#fff',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
