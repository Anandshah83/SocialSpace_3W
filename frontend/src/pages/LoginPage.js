import React, { useState } from "react";
import { Box, Container, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress, Link, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]           = useState({ email: "", password: "" });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const onChange = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await login(form);
      loginUser(data.token, data.user);
      navigate("/feed");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="sm">
        <Box sx={{
          mb: 3,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: "rgba(15,23,42,0.94)",
          border: "1px solid rgba(99,102,241,0.18)",
          boxShadow: "0 30px 80px rgba(15,23,42,0.35)"
        }}>
          <Typography variant="h4" fontWeight={800} color="primary" textAlign="left">🌐 SocialSpace</Typography>
          <Typography variant="body2" color="text.secondary" textAlign="left" mt={1}>
            A premium 3D-inspired social experience with fresh gradients and motion-ready style.
          </Typography>
        </Box>
        <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 22px 55px rgba(15,23,42,0.08)" }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" fontWeight={700} mb={2.5}>Welcome back 👋</Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} required fullWidth autoFocus size="small" />
              <TextField label="Password" name="password" type={showPass ? "text" : "password"} value={form.password} onChange={onChange} required fullWidth size="small"
                InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass((v) => !v)} edge="end" size="small">{showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }} />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                endIcon={loading && <CircularProgress size={16} color="inherit" />} sx={{ mt: 0.5, borderRadius: 3, boxShadow: "0 14px 30px rgba(108,99,255,0.18)" }}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </Box>
            <Box textAlign="center" mt={2.5}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/signup" fontWeight={600}>Sign up</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
