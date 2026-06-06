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
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: "1px solid rgba(0,0,0,0.08)", color: "text.primary" }}>
      <Toolbar sx={{ maxWidth: 860, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.25 } }}>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, cursor: "pointer", color: "primary.main" }} onClick={() => navigate("/feed")}>
          🌐 SocialSpace
        </Typography>

        {user ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, color: "text.secondary" }}>
              @{user.username}
            </Typography>
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor(user.username), fontSize: 14, fontWeight: 700 }}>
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
            <Button variant="outlined" size="small" onClick={() => navigate("/login")}>Login</Button>
            <Button variant="contained" size="small" onClick={() => navigate("/signup")}>Sign Up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
