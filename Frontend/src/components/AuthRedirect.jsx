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
      dispatch(checkAuthStatus());
    }
  }, [dispatch, hasCheckedAuth]);

  // Add a fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasCheckedAuth && !isLoading) {
        console.log("Auth check timeout - forcing redirect to login");
        // Force set hasCheckedAuth to true to break out of loading state
        dispatch({ type: "auth/setHasCheckedAuth", payload: true });
      }
    }, 15000); // 15 second fallback timeout

    return () => clearTimeout(timeout);
  }, [hasCheckedAuth, isLoading, dispatch]);

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
