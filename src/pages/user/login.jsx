import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [hoveredButton, setHoveredButton] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.05,
      background: `
        radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)
      `
    },
    wrapper: {
      maxWidth: '440px',
      width: '100%',
      padding: '40px',
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
      opacity: isLoaded ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      position: 'relative',
      zIndex: 1
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #4e54c8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      marginBottom: '8px',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '32px',
      fontSize: '1rem',
      fontWeight: 500
    },
    formDiv: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '8px',
      transition: 'color 0.2s ease'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      background: '#ffffff',
      transition: 'all 0.3s ease',
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
    },
    inputError: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    },
    passwordContainer: {
      position: 'relative'
    },
    showBtn: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#6366f1',
      fontWeight: 600,
      fontSize: '0.875rem',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '6px',
      transition: 'all 0.2s ease'
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      background: isSubmitting
        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 700,
      fontSize: '1.1rem',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px',
      boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden'
    },
    submitBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)'
    },
    registerLink: {
      textAlign: 'center',
      marginTop: '24px',
      color: '#64748b',
      fontSize: '0.95rem'
    },
    link: {
      color: '#6366f1',
      textDecoration: 'none',
      fontWeight: 600,
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    },
    message: {
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '20px',
      fontSize: '0.9rem',
      fontWeight: 500,
      textAlign: 'center',
      animation: 'slideIn 0.3s ease-out'
    },
    error: {
      color: '#dc2626',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      border: '1px solid #fecaca'
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://socket-io-87f1.onrender.com/api/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.token) {
        // ✅ Store token
        localStorage.setItem("authToken", data.token);

        // ✅ Delay navigation so localStorage is written (important for Vercel)
        setTimeout(() => {
          navigate("/users");
        }, 300);
      } else {
        setErrorMsg(data.message || "Login failed. No token received.");
      }
    } catch (error) {
      setErrorMsg(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Function to handle navigation to the register page
  const handleRegisterClick = () => {
    navigate("/register"); // Navigate to the /register route
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #374151 !important;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        
        <div style={styles.wrapper}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue your journey</p>

          {errorMsg && (
            <div style={{...styles.message, ...styles.error}}>
              {errorMsg}
            </div>
          )}

          <div style={styles.formDiv}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
                style={{
                  ...styles.input,
                  ...(focusedInput === 'email' ? styles.inputFocus : {}),
                }}
                placeholder="Enter your email"
                autoComplete="username"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'password' ? styles.inputFocus : {}),
                  }}
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
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              style={{
                ...styles.submitBtn,
                ...(hoveredButton && !isSubmitting ? styles.submitBtnHover : {})
              }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div style={styles.registerLink}>
            Don't have an account?{' '}
            <span style={styles.link} onClick={handleRegisterClick}>
              Register here
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;