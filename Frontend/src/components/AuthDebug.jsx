import React from "react";
import { useSelector } from "react-redux";

const AuthDebug = () => {
  const authState = useSelector((state) => state.auth);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <h4>Auth Debug Info:</h4>
      <div>isAuthenticated: {authState.isAuthenticated ? "true" : "false"}</div>
      <div>isLoading: {authState.isLoading ? "true" : "false"}</div>
      <div>hasCheckedAuth: {authState.hasCheckedAuth ? "true" : "false"}</div>
      <div>user: {authState.user ? authState.user.email : "null"}</div>
      <div>error: {authState.error || "none"}</div>
    </div>
  );
};

export default AuthDebug;
