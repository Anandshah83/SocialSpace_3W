import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Typography, Button, CircularProgress, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getPosts } from "../api";
import { useAuth } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts]       = useState([]);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [total, setTotal]       = useState(0);

  const fetchPosts = useCallback(async (pageNum = 1, replace = false) => {
    setLoading(true); setError("");
    try {
      const { data } = await getPosts(pageNum, 10);
      setPosts((prev) => replace ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setTotal(data.totalPosts);
      setPage(pageNum);
    } catch { setError("Failed to load posts. Please refresh."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(1, true); }, [fetchPosts]);

  return (
    <Box sx={{ 
      bgcolor: "#020617", 
      minHeight: "calc(100vh - 64px)", 
      py: { xs: 3, md: 5 },
      background: "radial-gradient(circle at 50% -20%, #1e1b4b 0%, #020617 100%)"
    }}>
      <Container maxWidth="md">
        <Box sx={{
          mb: 3,
          p: { xs: 3, sm: 4 },
          borderRadius: 6,
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ 
                background: "linear-gradient(90deg, #6366F1 0%, #EC4899 100%)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent"
              }}>SocialSpace</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                Explore a smooth, high-fidelity feed tailored for your digital expression.
                {total > 0 && <Box component="span" fontWeight={700} sx={{ color: "#6366F1" }}> {total} posts shared so far.</Box>}
              </Typography>
            </Box>
            <Button variant="contained" size="medium" startIcon={<RefreshIcon />} onClick={() => fetchPosts(1, true)} disabled={loading} 
              sx={{ 
                borderRadius: 4, px: 3, fontWeight: 700,
                background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.4)",
                "&:hover": { background: "rgba(99, 102, 241, 0.2)" }
              }}>
              Refresh feed
            </Button>
          </Box>
        </Box>

        {user && <CreatePost onPostCreated={(p) => { setPosts((prev) => [p, ...prev]); setTotal((t) => t + 1); }} />}

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>{error}</Alert>}

        {/* Empty state */}
        {posts.length === 0 && !loading ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>No posts yet 🌱</Typography>
            <Typography variant="body2" color="text.secondary">Be the first to share something!</Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onPostDeleted={(id) => { setPosts((prev) => prev.filter((p) => p._id !== id)); setTotal((t) => t - 1); }} />
            ))}

            {loading && <Box textAlign="center" py={3}><CircularProgress size={28} /></Box>}

            {!loading && hasMore && (
              <Box textAlign="center" py={2}>
                <Button variant="outlined" onClick={() => fetchPosts(page + 1)} sx={{ borderRadius: 4 }}>Load more</Button>
              </Box>
            )}

            {!hasMore && posts.length > 0 && (
              <Box textAlign="center" py={3}>
                <Typography variant="caption" color="text.secondary">You've seen all posts ✨</Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
