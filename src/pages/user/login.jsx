import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

// A simple style object for the wrapper and elements
const styles = {
  wrapper: {
    maxWidth: "400px",
    margin: "4rem auto",
    padding: "32px 28px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Inter, Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    marginTop: "6px",
    background: "#f7f7f7",
    transition: "border 0.2s",
    outline: "none",
  },
  inputContainer: {
    width: "100%",
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    fontWeight: 500,
    marginBottom: "4px",
    color: "#22223b",
  },
  passwordContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  showBtn: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#1976d2",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    outline: "none",
    padding: "0 4px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "1.1rem",
    marginTop: "12px",
    cursor: "pointer",
    transition: "background 0.2s",
    boxShadow: "0 2px 8px rgba(79,84,200,0.10)",
    letterSpacing: "1px",
  },
  link: {
    marginTop: "22px",
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    display: "inline-block",
    textAlign: "center",
    width: "100%",
  },
  error: {
    color: "#f44336",
    background: "#fff0f0",
    borderRadius: "6px",
    padding: "8px 12px",
    marginBottom: "10px",
    width: "100%",
    textAlign: "center",
    fontSize: "0.97rem",
  },
};

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      // const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await axios.post(`https://socket-io-87f1.onrender.com/api/auth/`, form);
      const token = res.data.token;
     const user = res.data.user;
     console.log("User:", user);
     console.log("id", user.id);
     
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id);
        navigate("https://socket-io-amk8.onrender.com/users");
      } else {
        setErrorMsg("Login failed. No token received.");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.msg ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>Sign In</div>
      {errorMsg && <div style={styles.error}>{errorMsg}</div>}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={styles.inputContainer}>
          <label htmlFor="email" style={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            style={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="username"
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <div style={styles.passwordContainer}>
            <input
              id="password"
              style={styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              style={styles.showBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" style={styles.submitBtn}>
          Login
        </button>
      </form>
      <a href="/register" style={styles.link}>
        Don&apos;t have an account? <span style={{ color: "#4e54c8" }}>Register</span>
      </a>
    </div>
  );
}

export default Login;