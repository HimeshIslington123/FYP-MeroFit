import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Paperclip, Search, ArrowLeft, User, Image as ImageIcon } from "lucide-react";
import Navbar from "../AdminDashboardComponent/Navbar";

const socket = io("http://localhost:4000");

const Adminchat = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [file, setFile] = useState(null);
  const scrollRef = useRef();
  const [payment, setPayment] = useState(null);

  const myId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users/getusers", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

useEffect(() => {
  const token = localStorage.getItem("token");

  const verifyPayment = async () => {
    try {
      const res = await axios.get("http://localhost:4000/esewa/getPayment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayment(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  verifyPayment();
}, []);

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


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = async () => {
     if (!message.trim() && !file) {
    alert("Please enter a message or attach a file");
    return;
  }

    let fileData = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axios.post("http://localhost:4000/api/chat/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        fileData = res.data.fileData;
      } catch (err) {
        console.log("File upload error:", err);
      }
    }

    const msgObj = { senderId: myId, receiverId: selectedUser._id, message, file: fileData };
    socket.emit("sendMessage", msgObj);
    setMessages((prev) => [...prev, msgObj]);
    setMessage("");
    setFile(null);
  };

  const displayedUsers = users.filter((u) =>
    (u.name || u.email).toLowerCase().includes(searchTerm.toLowerCase())
  );
if (!payment) return null; // wait for API


  return (<>
  <Navbar></Navbar>
    <div className=" bg-[#f8fafb] p-4 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[85vh]">

        {/* --- SIDEBAR --- */}
        <div className="w-full md:w-80 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#2bb3a3] font-bold mb-4 text-sm">
              <ArrowLeft size={16} strokeWidth={3} /> Back
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                placeholder="Search trainers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#2bb3a3]/20 outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {displayedUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  selectedUser?._id === user._id ? "bg-[#e8f7f6] border border-[#2bb3a3]/10" : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-slate-400" />}
                </div>
                <div className="text-left">
                  <p className={`font-bold text-sm ${selectedUser?._id === user._id ? "text-[#2bb3a3]" : "text-slate-700"}`}>{user.name}</p>
                  <p className="text-xs text-slate-400 font-medium">Available for chat</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-5 border-b border-gray-50 flex items-center gap-4 bg-white/80 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-[#e8f7f6] flex items-center justify-center text-[#2bb3a3]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedUser.name}</h3>
                  <div className="flex items-center gap-1.5">
                  
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafbfc]/50">
                {messages.map((m, i) => {
                  const isMe = m.senderId === myId;
                  return (
                    <div key={i} ref={scrollRef} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                        isMe ? "bg-[#2bb3a3] text-white rounded-tr-none" : "bg-white text-slate-700 border border-gray-100 rounded-tl-none"
                      }`}>
                        {m.message}

                        {m.file && m.file.data && (
                          <>
                            {m.file.contentType.startsWith("image/") ? (
                              <img
                                src={`data:${m.file.contentType};base64,${m.file.data}`}
                                alt={m.file.name}
                                className="w-full max-w-[250px] mt-2 rounded-xl border border-white/20"
                              />
                            ) : (
                              <a
                                href={`data:${m.file.contentType};base64,${m.file.data}`}
                                download={m.file.name}
                                className="text-sm text-[#2bb3a3] mt-2 block"
                              >
                                📄 {m.file.name}
                              </a>
                            )}
                          </>
                        )}

                        <p className={`text-[9px] mt-1 font-bold uppercase opacity-60 ${isMe ? "text-right" : "text-left"}`}>
                          {isMe ? "Sent" : selectedUser.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-6 bg-white border-t border-gray-50">
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[1.5rem] border border-gray-100 focus-within:ring-4 focus-within:ring-[#2bb3a3]/5 transition-all">
                  <label className="p-3 text-slate-400 hover:text-[#2bb3a3] cursor-pointer transition-colors">
                    <Paperclip size={20} />
                    <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                  </label>
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent py-3 outline-none text-slate-700 font-medium placeholder:text-slate-300"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  {file && <span className="text-[10px] bg-[#e8f7f6] text-[#2bb3a3] px-2 py-1 rounded-lg font-bold">File Attached</span>}
                  <button
                    onClick={sendMessage}
                    className="bg-[#2bb3a3] p-3 text-white rounded-xl shadow-lg shadow-[#2bb3a3]/20 hover:bg-[#229e8f] transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
              <div className="p-6 bg-gray-50 rounded-full">
                <ImageIcon size={48} className="opacity-20" />
              </div>
              <p className="font-bold uppercase tracking-widest text-xs">Select  to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Adminchat;