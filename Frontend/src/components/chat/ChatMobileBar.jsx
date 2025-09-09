import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import "./ChatMobileBar.css";
import "./ChatLayout.css";

const ChatMobileBar = ({ onToggleSidebar, onNewChat }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="chat-mobile-bar">
      <button
        className="chat-icon-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle chat history"
      >
        ☰
      </button>
      <h1 className="chat-app-title">Chat</h1>
      <div className="mobile-actions">
        <button
          className="chat-icon-btn"
          onClick={onNewChat}
          aria-label="New chat"
        >
          ＋
        </button>
        <button
          className="chat-icon-btn logout-icon"
          onClick={handleLogout}
          disabled={isLoading}
          aria-label="Logout"
          title="Logout"
        >
          {isLoading ? "⋯" : "↗"}
        </button>
      </div>
    </header>
  );
};

export default ChatMobileBar;
