import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

// Styles for enhanced look and feel
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
  success: {
    color: "#388e3c",
    background: "#e8f5e9",
    borderRadius: "6px",
    padding: "8px 12px",
    marginBottom: "10px",
    width: "100%",
    textAlign: "center",
    fontSize: "0.97rem",
  },
};

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        form
      );

      if (res.data.success) {
        setSuccessMsg("Registration successful! You can now log in.");
        setTimeout(() => navigate("/"), 1500); // Redirect after short delay
      } else {
        setErrorMsg(
          res.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>Create Account</div>
      {errorMsg && <div style={styles.error}>{errorMsg}</div>}
      {successMsg && <div style={styles.success}>{successMsg}</div>}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={styles.inputContainer}>
          <label htmlFor="name" style={styles.label}>
            Name
          </label>
          <input
            id="name"
            style={styles.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
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
            required
            autoComplete="username"
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            style={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" style={styles.submitBtn}>
          Register
        </button>
      </form>
      <a href="/" style={styles.link}>
        Already have an account?{" "}
        <span style={{ color: "#4e54c8" }}>Sign In</span>
      </a>
    </div>
  );
}

export default Register;
