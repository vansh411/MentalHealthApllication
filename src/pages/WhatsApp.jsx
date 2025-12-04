// src/pages/WhatsApp.jsx
import React, { useState, useEffect, useRef } from "react";
import { auth, googleProvider, db, storage } from "./firebase";
import { signInWithPopup } from "firebase/auth";

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";

export default function WhatsApp() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [usersOnline, setUsersOnline] = useState({});
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);

  // ----- Auth observer -----
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        await setDoc(doc(db, "users", u.uid), { email: u.email, avatar: u.photoURL || null, online: true }, { merge: true });
      } else setUser(null);
    });
    return unsub;
  }, []);

  // ----- Sign in -----
  const signIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const u = res.user;
      setUser(u);
      await setDoc(doc(db, "users", u.uid), { email: u.email, avatar: u.photoURL || null, online: true }, { merge: true });
    } catch (e) { console.error("Sign-in error:", e); }
  };

  // ----- Sign out -----
  const signOut = async () => {
    if (user) await updateDoc(doc(db, "users", user.uid), { online: false });
    await auth.signOut();
    setUser(null);
  };

  // ----- Listen users online -----
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.docs.forEach(d => (map[d.id] = d.data()));
      setUsersOnline(map);
    });
    return unsub;
  }, []);

  // ----- Listen groups -----
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "groups"), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // ----- Restore selected group -----
  useEffect(() => {
    const savedGroup = localStorage.getItem("selectedGroup");
    if (savedGroup) setSelectedGroup(JSON.parse(savedGroup));
  }, []);

  // ----- Listen messages -----
  useEffect(() => {
    if (!selectedGroup) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, "groups", selectedGroup.id, "messages"), orderBy("timestamp"));
    const unsub = onSnapshot(q, async (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

      if (user) {
        const updatePromises = [];
        msgs.forEach((m) => {
          if (!m.readBy || !m.readBy.includes(user.uid)) {
            const mRef = doc(db, "groups", selectedGroup.id, "messages", m.id);
            updatePromises.push(updateDoc(mRef, { readBy: arrayUnion(user.uid) }).catch(() => {}));
          }
        });
        if (updatePromises.length) await Promise.all(updatePromises);
      }
    });
    return unsub;
  }, [selectedGroup, user]);

  // ----- Listen typing users -----
  useEffect(() => {
    if (!selectedGroup) { setTypingUsers([]); return; }
    const unsub = onSnapshot(doc(db, "groups", selectedGroup.id), (snap) => {
      const data = snap.data() || {};
      setTypingUsers(data.typing || []);
    });
    return unsub;
  }, [selectedGroup]);

  // ----- Typing signal -----
  const sendTypingSignal = async () => {
    if (!selectedGroup || !user) return;
    const gRef = doc(db, "groups", selectedGroup.id);
    try {
      await updateDoc(gRef, { typing: arrayUnion(user.email) });
      setTimeout(async () => { await updateDoc(gRef, { typing: arrayRemove(user.email) }).catch(() => {}); }, 1600);
    } catch (e) {}
  };

  // ----- Create group -----
  const createGroup = async () => {
    if (!newGroupName.trim() || !user) return;
    const gRef = doc(collection(db, "groups"));
    await setDoc(gRef, { name: newGroupName.trim(), members: [user.uid], typing: [] });
    setNewGroupName("");
    setShowCreateGroup(false);
  };

  // ----- Join / Leave group -----
  const toggleJoin = async (group) => {
    if (!user) return;
    const gRef = doc(db, "groups", group.id);
    const members = group.members || [];
    if (members.includes(user.uid)) {
      await updateDoc(gRef, { members: arrayRemove(user.uid) });
      if (selectedGroup?.id === group.id) { setSelectedGroup(null); localStorage.removeItem("selectedGroup"); }
    } else {
      await updateDoc(gRef, { members: arrayUnion(user.uid) });
      setSelectedGroup(group);
      localStorage.setItem("selectedGroup", JSON.stringify(group));
    }
  };

  // ----- Send message -----
  const sendMessage = async (fileUrl = null) => {
    if (!selectedGroup || (!newMsg.trim() && !fileUrl)) return;
    const payload = {
      text: newMsg || "",
      sender: user.email,
      senderUid: user.uid,
      senderAvatar: user.photoURL || null,
      timestamp: serverTimestamp(),
      fileUrl: fileUrl || null,
      readBy: [user.uid],
    };
    await addDoc(collection(db, "groups", selectedGroup.id, "messages"), payload);
    setNewMsg("");
    setShowEmojiPicker(false);
  };

  // ----- File upload -----
  const handleFileUpload = async (file) => {
    if (!file || !user || !selectedGroup) return;
    setUploading(true); setUploadProgress(0);
    try {
      const path = `group_files/${selectedGroup.id}/${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);
      task.on(
        "state_changed",
        (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        (err) => console.error("Upload error", err),
        async () => {
          const url = await getDownloadURL(sRef);
          await sendMessage(url);
        }
      );
    } catch (e) { console.error(e); }
    finally { setUploading(false); setUploadProgress(0); }
  };

  // ----- Emoji add -----
  const addEmoji = (emoji) => setNewMsg((p) => p + (emoji.native || ""));

  // ----- Read receipts -----
  const renderReadReceipt = (msg) => {
    if (!msg.readBy) return "";
    const members = selectedGroup?.members || [];
    const allRead = members.length > 0 && members.every((m) => msg.readBy.includes(m));
    if (allRead) return "✓✓";
    if (msg.readBy.includes(user?.uid) && msg.readBy.length > 1) return "✓✓";
    return "✓";
  };

  // ----- Dark toggle -----
  const toggleDark = () => { localStorage.setItem("darkMode", (!darkMode).toString()); setDarkMode((d) => !d); };

  // ----- Auto-scroll -----
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // ----- Filter groups -----
  const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  // ----- Palette & Styles -----
  const palette = darkMode
    ? { bg: "#07101a", panel: "#0b1420", sidebar: "#071824", card: "#0f1b24", text: "#e6eef3", muted: "#9fb4c8", myBubble: "#2b8a3e", otherBubble: "#0f2a3a" }
    : { bg: "#f5f5f5", panel: "#ffffff", sidebar: "#ffffff", card: "#ffffff", text: "#0b1220", muted: "#6b7280", myBubble: "#dcf8c6", otherBubble: "#ffffff" };

  const styles = {
    root: { display: "flex", height: "100vh", fontFamily: "Inter, Arial", background: palette.bg, color: palette.text },
    sidebar: { width: 320, borderRight: "1px solid rgba(0,0,0,0.06)", background: palette.sidebar, padding: 16, boxSizing: "border-box", overflowY: "auto" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    userInfo: { display: "flex", alignItems: "center", gap: 12 },
    avatar: { width: 48, height: 48, borderRadius: 999 },
    groupList: { marginTop: 8, display: "grid", gap: 10 },
    groupCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10, background: palette.card, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    main: { flex: 1, display: "flex", flexDirection: "column", background: palette.panel },
    chatHeader: { padding: "12px 16px", borderBottom: `1px solid rgba(0,0,0,0.06)`, display: "flex", justifyContent: "space-between", alignItems: "center", background: palette.panel },
    messages: { flex: 1, padding: 16, overflowY: "auto", background: darkMode ? "#07101a" : "#e5ddd5" },
    msgRow: { display: "flex", marginBottom: 12 },
    msgBubble: { padding: "10px 12px", borderRadius: 16, maxWidth: "68%", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" },
    inputRow: { padding: 12, borderTop: `1px solid rgba(0,0,0,0.06)`, display: "flex", gap: 8, alignItems: "center", background: palette.panel },
    textInput: { flex: 1, padding: "10px 12px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)", outline: "none", background: darkMode ? "#071826" : "#fff", color: palette.text },
    actionBtn: { padding: "8px 12px", borderRadius: 16, border: "none", cursor: "pointer", background: "#0b93f6", color: "#fff" },
    smallMuted: { color: palette.muted, fontSize: 12 },
    typing: { fontStyle: "italic", color: palette.muted, fontSize: 13 },
    emojiWrapper: { position: "absolute", bottom: 80, left: 24, zIndex: 9999 },
  };

  // ----- Not signed in UI -----
  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: palette.bg }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: palette.text }}>Welcome — sign in to join the community</h2>
          <button onClick={signIn} style={{ padding: "10px 18px", borderRadius: 8, background: "#0b93f6", color: "#fff", border: "none", cursor: "pointer" }}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // ----- Main UI -----
  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img src={user.photoURL || "https://via.placeholder.com/48"} alt="me" style={styles.avatar} />
            <div>
              <div style={{ fontWeight: 700 }}>{user.email.split("@")[0]}</div>
              <div style={styles.smallMuted}>{usersOnline[user.uid]?.online ? "Online" : "Offline"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={toggleDark} style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer" }}>{darkMode ? "🌤️" : "🌙"}</button>
            <button onClick={signOut} style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer" }}>Logout</button>
          </div>
        </div>

        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <input placeholder="Search groups..." style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setShowCreateGroup(true)} style={{ padding: 8, borderRadius: 8 }}>+ New</button>
        </div>

        <div style={styles.groupList}>
          {filteredGroups.map((g) => (
            <div key={g.id} style={styles.groupCard}>
              <div>
                <div style={{ fontWeight: 700 }}>{g.name}</div>
                <div style={styles.smallMuted}>{(g.members || []).length} members</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => toggleJoin(g)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                  {(g.members || []).includes(user.uid) ? "Leave" : "Join"}
                </button>
                <button onClick={() => { setSelectedGroup(g); localStorage.setItem("selectedGroup", JSON.stringify(g)); }} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: "#0b93f6", color: "#fff", cursor: "pointer" }}>
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <main style={styles.main}>
        <div style={styles.chatHeader}>
          <div>
            <div style={{ fontWeight: 700 }}>{selectedGroup ? selectedGroup.name : "Select a group"}</div>
            <div style={styles.smallMuted}>
              {selectedGroup ? `${(selectedGroup.members || []).length} members • ${typingUsers.filter(t => t !== user.email).join(", ")}` : "Open a group to start chatting"}
            </div>
          </div>
        </div>

        <div style={styles.messages}>
          {!selectedGroup && <div style={{ color: palette.muted }}>No group selected — open or join one from the left</div>}
          {selectedGroup && messages.map((msg) => {
            const mine = msg.senderUid === user.uid;
            const bubbleStyle = { ...styles.msgBubble, background: mine ? palette.myBubble : palette.otherBubble };
            return (
              <div key={msg.id} style={{ ...styles.msgRow, justifyContent: mine ? "flex-end" : "flex-start" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  {!mine && <img src={msg.senderAvatar || "https://via.placeholder.com/40"} style={{ width: 36, height: 36, borderRadius: 999 }} alt="" />}
                  <div style={bubbleStyle}>
                    {!mine && <div style={{ fontWeight: 700, marginBottom: 4 }}>{msg.sender.split("@")[0]}</div>}
                    <div>{msg.text}</div>
                    {msg.fileUrl && (
                      <div style={{ marginTop: 8 }}>
                        {/\.(jpe?g|png|gif|webp)$/i.test(msg.fileUrl) ? (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer"><img src={msg.fileUrl} alt="file" style={{ maxWidth: 220, borderRadius: 8 }} /></a>
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#0b93f6" }}>📎 Download file</a>
                        )}
                      </div>
                    )}
                    <div style={{ fontSize: 12, marginTop: 4, textAlign: "right" }}>{renderReadReceipt(msg)}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef}></div>
          {typingUsers.filter(t => t !== user.email).length > 0 && <div style={styles.typing}>{typingUsers.filter(t => t !== user.email).join(", ")} typing...</div>}
        </div>

        {selectedGroup && (
          <div style={styles.inputRow}>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ cursor: "pointer" }}>😀</button>
            <input
              style={styles.textInput}
              placeholder="Type a message"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={() => sendTypingSignal()}
              onKeyPress={(e) => { if (e.key === "Enter") sendMessage(); }}
            />
            <input type="file" style={{ display: "none" }} id="fileUpload" onChange={(e) => handleFileUpload(e.target.files[0])} />
            <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>📎</label>
            <button onClick={() => sendMessage()} style={styles.actionBtn}>Send</button>
          </div>
        )}

        {showEmojiPicker && <div style={styles.emojiWrapper}><Picker data={emojiData} onEmojiSelect={addEmoji} /></div>}
      </main>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: palette.panel, padding: 24, borderRadius: 12 }}>
            <h3>Create New Group</h3>
            <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Group name" style={{ padding: 8, marginTop: 12, width: "100%", borderRadius: 8 }} />
            <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreateGroup(false)} style={{ padding: 8, borderRadius: 8 }}>Cancel</button>
              <button onClick={createGroup} style={{ padding: 8, borderRadius: 8, background: "#0b93f6", color: "#fff" }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
