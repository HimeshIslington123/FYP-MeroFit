import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:4000");

const Chat = () => {
  const { trainerId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [file, setFile] = useState(null);
  const scrollRef = useRef();

  const myId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/users/getusers",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const filteredUsers = res.data.filter((user) => user._id !== myId);
        setUsers(filteredUsers);

        if (trainerId) {
          const trainer = filteredUsers.find((u) => u._id === trainerId);
          if (trainer) setSelectedUser(trainer);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [token, myId, trainerId]);

  // Socket setup
  useEffect(() => {
    if (!myId) return;
    socket.emit("registerUser", myId);

    socket.on("receiveMessage", (msg) => {
      if (
        selectedUser &&
        ((msg.senderId === myId && msg.receiverId === selectedUser._id) ||
          (msg.senderId === selectedUser._id && msg.receiverId === myId))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [myId, selectedUser]);

  // Fetch messages
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/chat/${myId}/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [selectedUser, myId, token]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() && !file) return;

    let fileData = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:4000/api/chat/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      fileData = res.data.fileData;
    }

    const msgObj = {
      senderId: myId,
      receiverId: selectedUser._id,
      message,
      file: fileData,
    };

    socket.emit("sendMessage", msgObj);
    setMessages((prev) => [...prev, msgObj]);
    setMessage("");
    setFile(null);
  };

  const filteredUsers = users.filter((user) =>
    (user.name || user.email).toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const displayedUsers = searchTerm ? filteredUsers : filteredUsers.slice(0, 4);

  return (
    <div className="p-4">
      <h1 className="text-white text-2xl mb-4">Chat</h1>

      {/* Search Users */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 w-full rounded border border-gray-400"
      />

      {/* Users List */}
      <div className="mb-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
        {displayedUsers.map((user) => (
          <button
            key={user._id}
            className={`p-2 text-left rounded ${
              selectedUser?._id === user._id
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </button>
        ))}
      </div>

      {/* Chat Box */}
      {selectedUser && (
        <div>
          <h2 className="text-white mb-2">Chatting with {selectedUser.name}</h2>
          <div className="bg-gray-800 p-3 h-64 overflow-y-auto mb-2">
            {messages.map((m, i) => (
              <div key={i} ref={scrollRef} className="text-white mb-2">
                <strong>
                  {m.senderId === myId ? "Me" : selectedUser.name}:
                </strong>{" "}
                {m.message}
                {m.file && m.file.data && (
                  <img
                    src={`data:${m.file.contentType};base64,${m.file.data}`}
                    alt={m.file.name}
                    className="w-[300px] h-[200px]  mt-1 rounded"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex mt-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 rounded border border-gray-400"
              placeholder="Type message"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="ml-2"
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
