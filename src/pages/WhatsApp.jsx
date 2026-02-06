import React, { useState, useEffect, useRef } from "react";
import { auth, googleProvider, db, storage } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  where,
  limit,
} from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";

export default function PeerSupport() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState("General");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [usersOnline, setUsersOnline] = useState({});
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [replyTo, setReplyTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [reactions, setReactions] = useState({});
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const unsubscribes = useRef([]);

  const categories = ["All", "General", "Depression Support", "Anxiety Support", "ADHD", "PTSD", "Wellness"];

  // Reset state
  const resetAllState = () => {
    setUser(null);
    setGroups([]);
    setSelectedGroup(null);
    setMessages([]);
    setTypingUsers([]);
    localStorage.removeItem("selectedGroup");
    unsubscribes.current.forEach(fn => fn && fn());
    unsubscribes.current = [];
  };

  // Auth observer
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        await setDoc(
          doc(db, "users", u.uid),
          {
            email: u.email,
            displayName: u.displayName || u.email.split("@")[0],
            avatar: u.photoURL || null,
            online: true,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      } else resetAllState();
    });
    unsubscribes.current.push(unsubAuth);
    return () => unsubAuth();
  }, []);

  // Sign in
  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Sign-in error:", e);
    }
  };

  // Sign out
  const signOut = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        online: false,
        lastSeen: serverTimestamp(),
      });
    }
    await auth.signOut();
    resetAllState();
  };

  // Listen users online
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.docs.forEach(d => (map[d.id] = d.data()));
      setUsersOnline(map);
    });
    unsubscribes.current.push(unsub);
    return () => unsub();
  }, []);

  // Listen groups
  useEffect(() => {
    const q = query(collection(db, "groups"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    unsubscribes.current.push(unsub);
    return () => unsub();
  }, []);

  // Restore selected group
  useEffect(() => {
    const savedGroup = localStorage.getItem("selectedGroup");
    if (savedGroup) setSelectedGroup(JSON.parse(savedGroup));
  }, []);

  // Listen messages
  useEffect(() => {
    if (!selectedGroup) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, "groups", selectedGroup.id, "messages"),
      orderBy("timestamp")
    );
    const unsub = onSnapshot(q, async (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

      // Mark as read
      if (user) {
        msgs.forEach((m) => {
          if (!m.readBy?.includes(user.uid)) {
            const mRef = doc(db, "groups", selectedGroup.id, "messages", m.id);
            updateDoc(mRef, { readBy: arrayUnion(user.uid) }).catch(() => {});
          }
        });
      }
    });
    unsubscribes.current.push(unsub);
    return () => unsub();
  }, [selectedGroup, user]);

  // Listen typing
  useEffect(() => {
    if (!selectedGroup) {
      setTypingUsers([]);
      return;
    }
    const unsub = onSnapshot(doc(db, "groups", selectedGroup.id), (snap) => {
      setTypingUsers(snap.data()?.typing || []);
    });
    unsubscribes.current.push(unsub);
    return () => unsub();
  }, [selectedGroup]);

  // Typing signal
  const sendTypingSignal = async () => {
    if (!selectedGroup || !user) return;
    const gRef = doc(db, "groups", selectedGroup.id);
    try {
      await updateDoc(gRef, { typing: arrayUnion(user.email) });
      setTimeout(async () => {
        await updateDoc(gRef, { typing: arrayRemove(user.email) }).catch(() => {});
      }, 1600);
    } catch (e) {}
  };

  // Create group
  const createGroup = async () => {
    if (!newGroupName.trim() || !user) return;
    try {
      const gRef = doc(collection(db, "groups"));
      await setDoc(gRef, {
        name: newGroupName.trim(),
        description: newGroupDesc.trim() || "No description",
        category: newGroupCategory,
        members: [user.uid],
        admins: [user.uid],
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        typing: [],
        isPublic: true,
        memberCount: 1,
      });
      setNewGroupName("");
      setNewGroupDesc("");
      setShowCreateGroup(false);
    } catch (e) {
      console.error("Create group error:", e);
    }
  };

  // Join/Leave group
  const toggleJoin = async (group) => {
    if (!user) return;
    const gRef = doc(db, "groups", group.id);
    const members = group.members || [];
    try {
      if (members.includes(user.uid)) {
        await updateDoc(gRef, {
          members: arrayRemove(user.uid),
          memberCount: Math.max(0, (group.memberCount || 1) - 1),
        });
        if (selectedGroup?.id === group.id) {
          setSelectedGroup(null);
          localStorage.removeItem("selectedGroup");
        }
      } else {
        await updateDoc(gRef, {
          members: arrayUnion(user.uid),
          memberCount: (group.memberCount || 0) + 1,
        });
      }
    } catch (e) {
      console.error("Toggle join error:", e);
    }
  };

  // Send message
  const sendMessage = async (fileUrl = null) => {
    if (!selectedGroup || (!newMsg.trim() && !fileUrl)) return;
    
    try {
      const payload = {
        text: newMsg.trim() || "",
        sender: user.displayName || user.email.split("@")[0],
        senderEmail: user.email,
        senderUid: user.uid,
        senderAvatar: user.photoURL || null,
        timestamp: serverTimestamp(),
        fileUrl: fileUrl || null,
        readBy: [user.uid],
        reactions: {},
        replyTo: replyTo || null,
        edited: false,
      };

      if (editingMsg) {
        // Edit existing message
        await updateDoc(
          doc(db, "groups", selectedGroup.id, "messages", editingMsg.id),
          { text: newMsg.trim(), edited: true, editedAt: serverTimestamp() }
        );
        setEditingMsg(null);
      } else {
        // New message
        await addDoc(collection(db, "groups", selectedGroup.id, "messages"), payload);
      }

      setNewMsg("");
      setReplyTo(null);
      setShowEmojiPicker(false);
    } catch (e) {
      console.error("Send message error:", e);
    }
  };

  // File upload
  const handleFileUpload = async (file) => {
    if (!file || !user || !selectedGroup) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const path = `group_files/${selectedGroup.id}/${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);
      task.on(
        "state_changed",
        (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        (err) => {
          console.error("Upload error", err);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(sRef);
          await sendMessage(url);
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  };

  // Add emoji
  const addEmoji = (emoji) => {
    setNewMsg((p) => p + (emoji.native || ""));
    setShowEmojiPicker(false);
  };

  // Add reaction
  const addReaction = async (msgId, emoji) => {
    if (!selectedGroup || !user) return;
    const mRef = doc(db, "groups", selectedGroup.id, "messages", msgId);
    try {
      const msg = messages.find(m => m.id === msgId);
      const currentReactions = msg?.reactions || {};
      const userReactions = currentReactions[emoji] || [];
      
      if (userReactions.includes(user.uid)) {
        // Remove reaction
        await updateDoc(mRef, {
          [`reactions.${emoji}`]: arrayRemove(user.uid)
        });
      } else {
        // Add reaction
        await updateDoc(mRef, {
          [`reactions.${emoji}`]: arrayUnion(user.uid)
        });
      }
    } catch (e) {
      console.error("Reaction error:", e);
    }
  };

  // Delete message
  const deleteMessage = async (msgId) => {
    if (!selectedGroup) return;
    try {
      await deleteDoc(doc(db, "groups", selectedGroup.id, "messages", msgId));
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  // Dark mode toggle
  const toggleDark = () => {
    localStorage.setItem("darkMode", (!darkMode).toString());
    setDarkMode((d) => !d);
  };

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unread count
  const getUnreadCount = (group) => {
    // Implement unread logic here if needed
    return 0;
  };

  // Palette
  const palette = darkMode
    ? {
        bg: "#0a0f1a",
        panel: "#111827",
        sidebar: "#1f2937",
        card: "#374151",
        text: "#f9fafb",
        muted: "#9ca3af",
        myBubble: "#667eea",
        otherBubble: "#374151",
        border: "#4b5563",
        input: "#1f2937",
      }
    : {
        bg: "#f3f4f6",
        panel: "#ffffff",
        sidebar: "#ffffff",
        card: "#f9fafb",
        text: "#111827",
        muted: "#6b7280",
        myBubble: "#667eea",
        otherBubble: "#ffffff",
        border: "#e5e7eb",
        input: "#f9fafb",
      };

  // Not signed in
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "60px 80px",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>💬</div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "#1f2937",
              marginBottom: "12px",
            }}
          >
            Peer Support Community
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "32px" }}>
            Connect, share, and support each other on your mental health journey
          </p>
          <button
            onClick={signIn}
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            🚀 Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Inter', sans-serif",
        background: palette.bg,
        color: palette.text,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 360,
          borderRight: `1px solid ${palette.border}`,
          background: palette.sidebar,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "20px", borderBottom: `1px solid ${palette.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={user.photoURL || "https://ui-avatars.com/api/?name=" + user.email}
                  alt="me"
                  style={{ width: 48, height: 48, borderRadius: "12px", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#10b981",
                    border: `2px solid ${palette.sidebar}`,
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px" }}>
                  {user.displayName || user.email.split("@")[0]}
                </div>
                <div style={{ color: palette.muted, fontSize: "13px" }}>Online</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={toggleDark}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background: palette.card,
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                title="Toggle theme"
              >
                {darkMode ? "🌤️" : "🌙"}
              </button>
              <button
                onClick={() => setShowUserProfile(true)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: palette.card,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                ⚙️
              </button>
              <button
                onClick={signOut}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <input
              placeholder="🔍 Search groups..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: `1px solid ${palette.border}`,
                background: palette.input,
                color: palette.text,
                fontSize: "14px",
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "none",
                  background: selectedCategory === cat ? palette.myBubble : palette.card,
                  color: selectedCategory === cat ? "#fff" : palette.text,
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Create Group Button */}
          <button
            onClick={() => setShowCreateGroup(true)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ➕ Create New Group
          </button>
        </div>

        {/* Groups List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredGroups.map((g) => {
              const isMember = (g.members || []).includes(user?.uid);
              const isActive = selectedGroup?.id === g.id;
              
              return (
                <motion.div
                  key={g.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    if (isMember) {
                      setSelectedGroup(g);
                      localStorage.setItem("selectedGroup", JSON.stringify(g));
                    }
                  }}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    background: isActive ? palette.myBubble : palette.card,
                    cursor: isMember ? "pointer" : "default",
                    border: `2px solid ${isActive ? palette.myBubble : "transparent"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: isActive ? "#fff" : palette.text, marginBottom: "4px" }}>
                        {g.name}
                      </div>
                      <div style={{ fontSize: "12px", color: isActive ? "rgba(255,255,255,0.8)" : palette.muted, marginBottom: "6px" }}>
                        {g.description}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            background: isActive ? "rgba(255,255,255,0.2)" : palette.border,
                            color: isActive ? "#fff" : palette.text,
                            fontWeight: 600,
                          }}
                        >
                          {g.category}
                        </span>
                        <span style={{ fontSize: "12px", color: isActive ? "rgba(255,255,255,0.8)" : palette.muted }}>
                          👥 {g.memberCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleJoin(g);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: "none",
                        background: isMember ? "#ef4444" : "#10b981",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {isMember ? "Leave" : "Join"}
                    </button>
                    {isMember && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroup(g);
                          localStorage.setItem("selectedGroup", JSON.stringify(g));
                        }}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: "none",
                          background: palette.myBubble,
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Open
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: palette.panel }}>
        {/* Chat Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${palette.border}`,
            background: palette.panel,
          }}
        >
          {selectedGroup ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {selectedGroup.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "16px" }}>{selectedGroup.name}</div>
                  <div style={{ color: palette.muted, fontSize: "13px" }}>
                    {selectedGroup.memberCount || 0} members
                    {typingUsers.filter(t => t !== user.email).length > 0 &&
                      ` • ${typingUsers.filter(t => t !== user.email).join(", ")} typing...`}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: palette.muted }}>
              <h3>Select a group to start chatting</h3>
              <p style={{ fontSize: "14px" }}>Join a group or create one to begin</p>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            background: darkMode ? "#0a0f1a" : "#f3f4f6",
          }}
        >
          {!selectedGroup && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: palette.muted,
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
              <h2>Welcome to Peer Support</h2>
              <p>Select a group from the sidebar to start connecting with peers</p>
            </div>
          )}

          {selectedGroup && messages.length === 0 && (
            <div style={{ textAlign: "center", color: palette.muted, paddingTop: "40px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>👋</div>
              <h3>No messages yet</h3>
              <p>Be the first to start the conversation!</p>
            </div>
          )}

          {selectedGroup &&
            messages.map((msg) => {
              const mine = msg.senderUid === user.uid;
              const reactions = msg.reactions || {};
              const hasReactions = Object.keys(reactions).some(emoji => reactions[emoji].length > 0);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    marginBottom: "16px",
                    justifyContent: mine ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px", maxWidth: "70%", alignItems: "flex-end" }}>
                    {!mine && (
                      <img
                        src={msg.senderAvatar || "https://ui-avatars.com/api/?name=" + msg.sender}
                        style={{ width: 36, height: 36, borderRadius: "10px", objectFit: "cover" }}
                        alt=""
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      {msg.replyTo && (
                        <div
                          style={{
                            fontSize: "12px",
                            padding: "8px",
                            borderRadius: "8px",
                            background: palette.card,
                            marginBottom: "6px",
                            borderLeft: `3px solid ${palette.myBubble}`,
                          }}
                        >
                          <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                            Replying to {msg.replyTo.sender}
                          </div>
                          <div style={{ color: palette.muted }}>{msg.replyTo.text.slice(0, 50)}...</div>
                        </div>
                      )}
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: mine ? palette.myBubble : palette.otherBubble,
                          color: mine ? "#fff" : palette.text,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                          position: "relative",
                        }}
                      >
                        {!mine && (
                          <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "6px", color: palette.myBubble }}>
                            {msg.sender}
                          </div>
                        )}
                        <div style={{ fontSize: "15px", lineHeight: 1.5, wordBreak: "break-word" }}>
                          {msg.text}
                        </div>
                        {msg.fileUrl && (
                          <div style={{ marginTop: "10px" }}>
                            {/\.(jpe?g|png|gif|webp)$/i.test(msg.fileUrl) ? (
                              <a href={msg.fileUrl} target="_blank" rel="noreferrer">
                                <img
                                  src={msg.fileUrl}
                                  alt="file"
                                  style={{ maxWidth: 280, borderRadius: "10px", cursor: "pointer" }}
                                />
                              </a>
                            ) : (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: mine ? "#fff" : palette.myBubble, textDecoration: "underline" }}
                              >
                                📎 View file
                              </a>
                            )}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: "11px",
                            marginTop: "8px",
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            {msg.timestamp?.toDate?.().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {msg.edited && " (edited)"}
                          </span>
                          {mine && (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                onClick={() => {
                                  setEditingMsg(msg);
                                  setNewMsg(msg.text);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteMessage(msg.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Quick reaction buttons */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: -12,
                            right: mine ? "auto" : 16,
                            left: mine ? 16 : "auto",
                            display: "flex",
                            gap: "4px",
                            background: palette.card,
                            padding: "4px 8px",
                            borderRadius: "20px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {["👍", "❤️", "😊", "🎉"].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(msg.id, emoji)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                opacity: reactions[emoji]?.includes(user.uid) ? 1 : 0.5,
                                transform: reactions[emoji]?.includes(user.uid) ? "scale(1.2)" : "scale(1)",
                                transition: "all 0.2s",
                              }}
                              title={`React with ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                          <button
                            onClick={() => setReplyTo(msg)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                            title="Reply"
                          >
                            ↩️
                          </button>
                        </div>
                      </div>

                      {/* Display reactions */}
                      {hasReactions && (
                        <div style={{ display: "flex", gap: "6px", marginTop: "18px", flexWrap: "wrap" }}>
                          {Object.entries(reactions)
                            .filter(([_, users]) => users.length > 0)
                            .map(([emoji, users]) => (
                              <div
                                key={emoji}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "16px",
                                  background: palette.card,
                                  fontSize: "13px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  border: users.includes(user.uid) ? `2px solid ${palette.myBubble}` : "none",
                                }}
                              >
                                <span>{emoji}</span>
                                <span style={{ fontWeight: 600, fontSize: "11px" }}>{users.length}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          <div ref={bottomRef}></div>
        </div>

        {/* Input Area */}
        {selectedGroup && (
          <div style={{ borderTop: `1px solid ${palette.border}`, background: palette.panel }}>
            {/* Reply preview */}
            {replyTo && (
              <div
                style={{
                  padding: "12px 24px",
                  background: palette.card,
                  borderBottom: `1px solid ${palette.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: palette.myBubble }}>
                    Replying to {replyTo.sender}
                  </div>
                  <div style={{ fontSize: "13px", color: palette.muted }}>{replyTo.text.slice(0, 50)}...</div>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Editing preview */}
            {editingMsg && (
              <div
                style={{
                  padding: "12px 24px",
                  background: palette.card,
                  borderBottom: `1px solid ${palette.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: palette.myBubble }}>Editing message</div>
                </div>
                <button
                  onClick={() => {
                    setEditingMsg(null);
                    setNewMsg("");
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Upload progress */}
            {uploading && (
              <div style={{ padding: "12px 24px", background: palette.card }}>
                <div style={{ fontSize: "13px", marginBottom: "8px", color: palette.muted }}>
                  Uploading... {uploadProgress}%
                </div>
                <div style={{ width: "100%", height: "4px", background: palette.border, borderRadius: "2px" }}>
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: "100%",
                      background: palette.myBubble,
                      borderRadius: "2px",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Main input */}
            <div style={{ padding: "16px 24px", display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={() => setShowEmojiPicker((s) => !s)}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: palette.card,
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                😀
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: palette.card,
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                📎
              </button>
              <input
                placeholder={editingMsg ? "Edit your message..." : "Type a message..."}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "24px",
                  border: `1px solid ${palette.border}`,
                  background: palette.input,
                  color: palette.text,
                  fontSize: "15px",
                }}
                value={newMsg}
                onChange={(e) => {
                  setNewMsg(e.target.value);
                  sendTypingSignal();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!newMsg.trim() && !editingMsg}
                style={{
                  padding: "12px 24px",
                  borderRadius: "24px",
                  border: "none",
                  background: newMsg.trim() || editingMsg ? palette.myBubble : palette.card,
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: newMsg.trim() || editingMsg ? "pointer" : "not-allowed",
                }}
              >
                {editingMsg ? "Save" : "Send"}
              </button>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div style={{ position: "absolute", bottom: 80, left: 380, zIndex: 1000 }}>
            <Picker data={emojiData} onEmojiSelect={addEmoji} theme={darkMode ? "dark" : "light"} />
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: palette.panel,
                padding: "32px",
                borderRadius: "20px",
                width: 450,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              }}
            >
              <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: 700 }}>Create New Group</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
                    Group Name *
                  </label>
                  <input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., Anxiety Warriors"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: `1px solid ${palette.border}`,
                      background: palette.input,
                      color: palette.text,
                      fontSize: "15px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
                    Description
                  </label>
                  <textarea
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="What is this group about?"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: `1px solid ${palette.border}`,
                      background: palette.input,
                      color: palette.text,
                      fontSize: "15px",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
                    Category
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: `1px solid ${palette.border}`,
                      background: palette.input,
                      color: palette.text,
                      fontSize: "15px",
                    }}
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
                  <button
                    onClick={() => setShowCreateGroup(false)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      border: "none",
                      background: palette.card,
                      color: palette.text,
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createGroup}
                    disabled={!newGroupName.trim()}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      border: "none",
                      background: newGroupName.trim() ? palette.myBubble : palette.card,
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: newGroupName.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
