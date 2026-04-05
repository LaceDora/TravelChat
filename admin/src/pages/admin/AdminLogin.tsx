import { useState } from "react";
import logo from "../../assets/admin.png";
import { useNavigate } from "react-router-dom";
import fetchClient from "../../utils/fetchClient";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await fetchClient("/admin/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Đăng nhập admin thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.logoWrap}>
          <img
            src={logo}
            alt="Admin Logo"
            style={styles.logo}
            width={90}
            height={90}
          />
        </div>
        <h2 style={styles.title}>Đăng nhập quản trị viên</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="Nhập email quản trị"
            autoComplete="username"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f5f6fa 100%)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  form: {
    width: 380,
    padding: 32,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(60,60,120,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    position: "relative",
    animation: "fadeIn 0.7s",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
    background: "#f0f4ff",
    padding: 6,
    objectFit: "cover",
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 22,
    color: "#2d3a4a",
    letterSpacing: 0.5,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 18,
    gap: 6,
  },
  label: {
    fontWeight: 500,
    color: "#3b4252",
    marginBottom: 2,
    fontSize: 15,
  },
  input: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 15,
    outline: "none",
    background: "#f8fafc",
    transition: "border 0.2s, box-shadow 0.2s",
    boxShadow: "0 1px 2px rgba(60,60,120,0.04)",
    marginTop: 2,
    marginBottom: 2,
  },
  button: {
    width: "100%",
    padding: "12px 0",
    marginTop: 10,
    cursor: "pointer",
    background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
    transition: "background 0.2s, box-shadow 0.2s, opacity 0.2s",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  error: {
    background: "#ffe5e5",
    color: "#c0392b",
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
    textAlign: "center",
    fontWeight: 500,
    fontSize: 15,
    boxShadow: "0 1px 4px rgba(220,38,38,0.07)",
  },
};
