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
    <Box sx={{ bgcolor: "background.default", minHeight: "calc(100vh - 64px)", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Box sx={{
          mb: 3,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: "rgba(15,23,42,0.88)",
          border: "1px solid rgba(99,102,241,0.18)",
          boxShadow: "0 30px 80px rgba(15,23,42,0.32)",
          backdropFilter: "blur(12px)"
        }}>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={800} gutterBottom>🌐 SocialSpace</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                Your feed is now styled like a modern 3D social surface, with brand-aligned content and a standout left-hand identity.
                {total > 0 && ` ${total} post${total !== 1 ? "s" : ""} shared so far.`}
              </Typography>
            </Box>
            <Button variant="contained" size="small" startIcon={<RefreshIcon />} onClick={() => fetchPosts(1, true)} disabled={loading} sx={{ borderRadius: 4, whiteSpace: "nowrap" }}>
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
