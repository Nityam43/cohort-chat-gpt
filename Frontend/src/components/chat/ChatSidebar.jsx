import React from "react";
import { useSelector } from "react-redux";
import "./ChatSidebar.css";

const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  open,
}) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside
      className={"chat-sidebar " + (open ? "open" : "")}
      aria-label="Previous chats"
    >
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>
          New
        </button>
      </div>
      <nav className="chat-list" aria-live="polite">
        {chats.map((c) => (
          <button
            key={c._id}
            className={
              "chat-list-item " + (c._id === activeChatId ? "active" : "")
            }
            onClick={() => onSelectChat(c._id)}
          >
            <span className="title-line">{c.title}</span>
          </button>
        ))}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>

      {/* User info (no logout button) */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.fullName?.firstName?.charAt(0) ||
              user?.email?.charAt(0) ||
              "U"}
          </div>
          <div className="user-details">
            <div className="user-name">
              {user?.fullName?.firstName && user?.fullName?.lastName
                ? `${user.fullName.firstName} ${user.fullName.lastName}`
                : user?.email || "User"}
            </div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
