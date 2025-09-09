import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { checkAuthStatus } from "../store/authSlice";

const AuthRedirect = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, hasCheckedAuth, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!hasCheckedAuth) {
      console.log("Dispatching checkAuthStatus from AuthRedirect");

      // Test API connectivity first in production
      if (import.meta.env.PROD) {
        console.log("Testing API connectivity...");
        fetch(
          `${
            import.meta.env.VITE_API_URL ||
            "https://cohort-chat-gpt.onrender.com"
          }/health`
        )
          .then((res) => res.json())
          .then((data) => console.log("API Health check:", data))
          .catch((err) => console.error("API Health check failed:", err));
      }

      dispatch(checkAuthStatus());
    }
  }, [dispatch, hasCheckedAuth]);

  // Add a fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCheckedAuth) {
        console.log("Auth check timeout - forcing redirect to login");
        // Force set hasCheckedAuth to true to break out of loading state
        dispatch({ type: "auth/setHasCheckedAuth", payload: true });
      }
    }, 12000); // 12 second fallback timeout

    return () => clearTimeout(timeout);
  }, [hasCheckedAuth, dispatch]);

  // Additional fallback for production
  useEffect(() => {
    if (import.meta.env.PROD) {
      const productionTimeout = setTimeout(() => {
        if (!hasCheckedAuth) {
          console.log("Production fallback - forcing auth check completion");
          dispatch({ type: "auth/setHasCheckedAuth", payload: true });
        }
      }, 8000); // 8 second production fallback

      return () => clearTimeout(productionTimeout);
    }
  }, [hasCheckedAuth, dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading || !hasCheckedAuth) {
    console.log(
      "AuthRedirect: Showing loading state. isLoading:",
      isLoading,
      "hasCheckedAuth:",
      hasCheckedAuth
    );
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
    console.log("User is authenticated, redirecting to /home");
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, redirect to login (not register)
  console.log(
    "User is not authenticated, redirecting to /login. Error:",
    error
  );
  return <Navigate to="/login" replace />;
};

export default AuthRedirect;
