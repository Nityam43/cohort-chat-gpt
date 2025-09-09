import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { checkAuthStatus } from "../store/authSlice";

const AuthRedirect = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, hasCheckedAuth } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!hasCheckedAuth) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, hasCheckedAuth]);

  // Show loading spinner while checking authentication
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="center-min-h-screen">
        <div className="auth-card">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #007bff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            ></div>
            <p>Loading...</p>
            {import.meta.env.PROD && (
              <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                Checking authentication...
              </p>
            )}
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // If authenticated, redirect to home (chat interface)
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, redirect to register (first-time users)
  return <Navigate to="/register" replace />;
};

export default AuthRedirect;
