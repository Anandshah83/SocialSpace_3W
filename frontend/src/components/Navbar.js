import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const avatarColor = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360},60%,50%)`;
};

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  const handleLogout = () => { setAnchor(null); logoutUser(); navigate("/login"); };

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      background: "rgba(2, 6, 23, 0.7)", 
      backdropFilter: "blur(12px)", 
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)", 
      color: "#fff" 
    }}>
      <Toolbar sx={{ maxWidth: 860, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}>
        <Typography variant="h6" fontWeight={900} sx={{ 
          flexGrow: 1, 
          cursor: "pointer", 
          background: "linear-gradient(90deg, #6366F1 0%, #EC4899 100%)", 
          WebkitBackgroundClip: "text", 
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em"
        }} onClick={() => navigate("/feed")}>
          SocialSpace
        </Typography>

        {user ? (
          <Box display="flex" alignItems="center" gap={1} sx={{ 
            bgcolor: "rgba(255, 255, 255, 0.05)", 
            borderRadius: 10, 
            pl: { xs: 0.5, sm: 2 }, 
            pr: 0.5, 
            py: 0.5, 
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "all 0.2s",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(99, 102, 241, 0.3)" }
          }}>
            <Typography variant="body2" fontWeight={600} sx={{ display: { xs: "none", sm: "block" }, color: "rgba(255,255,255,0.8)" }}>
              @{user.username}
            </Typography>
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ 
                width: 34, 
                height: 34, 
                bgcolor: avatarColor(user.username), 
                fontSize: 14, 
                fontWeight: 700,
                boxShadow: "0 0 10px rgba(0,0,0,0.3)"
              }}>
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}>
              <MenuItem disabled><Typography variant="body2" color="text.secondary">@{user.username}</Typography></MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button variant="text" size="small" onClick={() => navigate("/login")} sx={{ color: "#fff", fontWeight: 600 }}>Login</Button>
            <Button variant="contained" size="small" onClick={() => navigate("/signup")} sx={{ 
              borderRadius: 3, 
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)",
                transform: "translateY(-1px)"
              }
            }}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
