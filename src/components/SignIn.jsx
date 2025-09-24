import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://smart-purse-pos.onrender.com/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // ✅ Save token + user info
        localStorage.setItem("accessToken", data.session.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Role-based redirect
        const role = data.user.role?.toLowerCase();

        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/users");
        }
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="login-page">
        <div className="login-card shadow p-4">
          {/* Logo + Branding */}
          <div className="text-center mb-3">
            <div className="logo-circle mx-auto mb-2">
              <span className="logo-text">S</span>
            </div>
            <h4 className="brand-name">
              <span className="smart">Smart</span>
              <span className="purse">Purse</span>
            </h4>
            <p className="text-muted mb-1">Already a User?</p>
            <p className="text-muted small">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger py-2 text-center"
              style={{ fontSize: "0.85rem" }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="input-with-icon mb-3">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-with-icon mb-3">
              <FaLock className="input-icon" />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
                className="forgot-link"
              >
                Forgot Password?
              </a>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#88c244",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Bottom link */}
          <div className="text-center mt-3 small">
            <button className="btn btn-primary w-100 create-btn">
              Not yet a User? Create Account Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
