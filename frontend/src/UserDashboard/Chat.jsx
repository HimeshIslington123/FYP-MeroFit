import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const myId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/users/getusers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data.filter(user => user._id !== myId));
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [token, myId]);

  // Socket setup
  useEffect(() => {
    socket.emit("registerUser", myId);

    socket.on("receiveMessage", (msg) => {
      // Add message if it belongs to current chat
      if (
        selectedUser &&
        (msg.senderId === myId && msg.receiverId === selectedUser._id) ||
        (msg.senderId === selectedUser?._id && msg.receiverId === myId)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [myId, selectedUser]);

  // Fetch previous chat when user selected
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/chat/${myId}/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [selectedUser, myId, token]);

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      senderId: myId,
      receiverId: selectedUser._id,
      text: message,
      image: null,
    });

    setMessage("");
  };

  const filteredUsers = users.filter(user =>
    (user.name || user.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedUsers = searchTerm ? filteredUsers : filteredUsers.slice(0, 4);

  return (
    <div className="p-4">
      <h1 className="text-white text-2xl mb-4">Chat</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 w-full rounded border border-gray-400"
      />

      <div className="mb-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
        {displayedUsers.map(user => (
          <button
            key={user._id}
            className={`p-2 text-left rounded ${
              selectedUser?._id === user._id ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </button>
        ))}
      </div>

      {selectedUser && (
        <div>
          <h2 className="text-white mb-2">Chatting with {selectedUser.name}</h2>

          <div className="bg-gray-800 p-3 h-64 overflow-y-auto mb-2">
            {messages.map((m, i) => (
              <p key={i} className="text-white">
                <strong>{m.senderId === myId ? "Me" : "Them"}:</strong> {m.message}
              </p>
            ))}
          </div>

          <div className="flex mt-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 rounded border border-gray-400"
              placeholder="Type message"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 p-2 text-white rounded ml-2"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
