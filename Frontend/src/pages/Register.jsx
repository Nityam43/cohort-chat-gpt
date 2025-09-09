import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/authSlice";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearError());
    dispatch(
      registerUser({
        email: form.email,
        fullName: {
          firstName: form.firstname,
          lastName: form.lastname,
        },
        password: form.password,
      })
    );
  }

  return (
    <div className="center-min-h-screen">
      <div className="auth-card" role="main" aria-labelledby="register-heading">
        <header className="auth-header">
          <h1 id="register-heading">Create account</h1>
          <p className="auth-sub">Join us and start exploring.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid-2">
            <div className="field-group">
              <label htmlFor="firstname">First name</label>
              <input
                id="firstname"
                name="firstname"
                placeholder="Jane"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="lastname">Last name</label>
              <input
                id="lastname"
                name="lastname"
                placeholder="Doe"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
