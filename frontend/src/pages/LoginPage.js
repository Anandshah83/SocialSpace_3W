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
    <Box sx={{ 
      background: "radial-gradient(circle at 0% 0%, #1e1b4b 0%, #020617 100%)", 
      minHeight: "calc(100vh - 64px)", 
      display: "flex", 
      alignItems: "center", 
      py: { xs: 4, md: 6 },
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Glow */}
      <Box sx={{ 
        position: "absolute", top: "-10%", right: "-10%", width: "40%", height: "40%", 
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)", 
        filter: "blur(60px)", zIndex: 0 
      }} />

      <Container maxWidth="sm">
        <Box sx={{
          mb: 3,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: "rgba(15,23,42,0.94)",
          border: "1px solid rgba(99,102,241,0.18)",
          boxShadow: "0 30px 80px rgba(15,23,42,0.35)"
        }}>
          <Typography variant="h4" fontWeight={900} sx={{ 
            background: "linear-gradient(90deg, #6366F1 0%, #EC4899 100%)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em"
          }}>
            SocialSpace
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="left" mt={1}>
            A premium 3D-inspired social experience with fresh gradients and motion-ready style.
          </Typography>
        </Box>

        <Card sx={{ 
          borderRadius: 6, 
          overflow: "hidden", 
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#fff"
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h5" fontWeight={700} mb={3}>Welcome back 👋</Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} required fullWidth autoFocus size="small" 
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "rgba(255,255,255,0.02)" }, "& label": { color: "rgba(255,255,255,0.6)" }, "& input": { color: "#fff" } }} />
              
              <TextField label="Password" name="password" type={showPass ? "text" : "password"} value={form.password} onChange={onChange} required fullWidth size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "rgba(255,255,255,0.02)" }, "& label": { color: "rgba(255,255,255,0.6)" }, "& input": { color: "#fff" } }}
                InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass((v) => !v)} edge="end" size="small">{showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }} />

              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                endIcon={loading && <CircularProgress size={16} color="inherit" />} 
                sx={{ 
                  mt: 1, borderRadius: 3, py: 1.2, fontWeight: 700,
                  background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
                  boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
                  "&:hover": { transform: "translateY(-2px)", transition: "all 0.2s" }
                }}>
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
