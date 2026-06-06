import React, { useState, useRef } from "react";
import { Card, CardContent, Box, TextField, Button, Avatar, IconButton, Tooltip, Typography, CircularProgress, Alert } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { createPost } from "../api";
import { useAuth } from "../context/AuthContext";

const avatarColor = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360},60%,50%)`;
};

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText]       = useState("");
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const fileRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => { setImage(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; };

  const handleSubmit = async () => {
    if (!text.trim() && !image) { setError("Add some text or an image."); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      if (text.trim()) fd.append("text", text.trim());
      if (image) fd.append("image", image);
      const { data } = await createPost(fd);
      setText(""); removeImage();
      onPostCreated(data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally { setLoading(false); }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 4, overflow: "hidden", boxShadow: "0 18px 40px rgba(15,23,42,0.08)" }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" gap={1.5} alignItems="flex-start">
          <Avatar sx={{ bgcolor: avatarColor(user?.username), width: 42, height: 42, fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <TextField
              fullWidth multiline minRows={2} maxRows={6}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={text} onChange={(e) => setText(e.target.value)}
              inputProps={{ maxLength: 1000 }} variant="outlined" size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "rgba(0,0,0,0.02)" } }}
            />

            {preview && (
              <Box mt={1.5} position="relative" display="inline-block">
                <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: 250, borderRadius: 8, display: "block", objectFit: "cover" }} />
                <IconButton size="small" onClick={removeImage}
                  sx={{ position: "absolute", top: 6, right: 6, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {error && <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }} onClose={() => setError("")}>{error}</Alert>}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
              <Box>
                <input type="file" accept="image/*" ref={fileRef} onChange={handleImage} style={{ display: "none" }} />
                <Tooltip title="Add image">
                  <IconButton onClick={() => fileRef.current?.click()} color={image ? "primary" : "default"} size="small">
                    <ImageIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption" color="text.secondary" ml={0.5}>{image ? "Image added ✓" : "Add photo"}</Typography>
              </Box>
              <Button variant="contained" size="small"
                endIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit} disabled={loading || (!text.trim() && !image)}
                sx={{ borderRadius: 3, backgroundImage: "linear-gradient(135deg, #6C63FF, #FF6584)", boxShadow: "0 14px 28px rgba(108,99,255,0.22)" }}>
                {loading ? "Posting…" : "Post"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
