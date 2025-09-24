import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          console.log("Password recovery session created", session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#3c51a1",
            fontWeight: "600",
          }}
        >
          Reset Password
        </h3>

        {error && (
          <div
            className="alert alert-danger text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            className="alert alert-success text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter New Password"
            className="form-control mb-3"
            style={{
              borderRadius: "6px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#88c244",
              color: "white",
              border: "none",
              borderRadius: "6px",
              width: "100%",
              padding: "10px",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#555",
          }}
        >
          <a href="/" style={{ color: "#3c51a1", textDecoration: "none" }}>
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
