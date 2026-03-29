import { useState } from "react";
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
        <h2 style={styles.title}>Đăng nhập quản trị viên</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6fa",
  },
  form: {
    width: 360,
    padding: 24,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 14,
  },
  button: {
    width: "100%",
    padding: "10px 0",
    marginTop: 10,
    cursor: "pointer",
  },
  error: {
    background: "#ffe5e5",
    color: "#c0392b",
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
    textAlign: "center",
  },
};
