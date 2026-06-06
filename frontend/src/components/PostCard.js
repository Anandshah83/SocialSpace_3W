import React, { useState } from "react";
import {
  Card, CardContent, CardMedia, CardActions, Box, Avatar, Typography,
  IconButton, TextField, Collapse, Divider, Tooltip, Menu, MenuItem, CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import TimeAgo from "react-timeago";
import { likePost, addComment, deletePost, deleteComment } from "../api";
import { useAuth } from "../context/AuthContext";

const avatarColor = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360},60%,50%)`;
};

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [likes, setLikes]               = useState(post.likes || []);
  const [comments, setComments]         = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const [liking, setLiking]             = useState(false);
  const [commenting, setCommenting]     = useState(false);
  const [anchor, setAnchor]             = useState(null);

  const isLiked = user && likes.includes(user.username);
  const isOwner = user && user.username === post.username;

  // Toggle like with optimistic update
  const handleLike = async () => {
    if (!user || liking) return;
    setLiking(true);
    const prev = [...likes];
    setLikes(isLiked ? likes.filter((u) => u !== user.username) : [...likes, user.username]);
    try {
      const { data } = await likePost(post._id);
      setLikes(data.likes);
    } catch { setLikes(prev); }
    finally { setLiking(false); }
  };

  // Add comment
  const handleComment = async () => {
    if (!commentText.trim() || commenting) return;
    setCommenting(true);
    try {
      const { data } = await addComment(post._id, commentText.trim());
      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
    } catch (err) { console.error(err); }
    finally { setCommenting(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } };

  // Delete comment
  const handleDeleteComment = async (cid) => {
    try { await deleteComment(post._id, cid); setComments((prev) => prev.filter((c) => c._id !== cid)); }
    catch (err) { console.error(err); }
  };

  // Delete post
  const handleDeletePost = async () => {
    setAnchor(null);
    try { await deletePost(post._id); onPostDeleted(post._id); }
    catch (err) { console.error(err); }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 55px rgba(15,23,42,0.06)" }}>
      <CardContent sx={{ pb: 0 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: avatarColor(post.username), width: 42, height: 42, fontSize: 16, fontWeight: 700 }}>
              {post.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>@{post.username}</Typography>
              <Typography variant="caption" color="text.secondary"><TimeAgo date={post.createdAt} /></Typography>
            </Box>
          </Box>
          {isOwner && (
            <>
              <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}><MoreVertIcon fontSize="small" /></IconButton>
              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} PaperProps={{ sx: { borderRadius: 2 } }}>
                <MenuItem onClick={handleDeletePost} sx={{ color: "error.main", gap: 1 }}>
                  <DeleteIcon fontSize="small" /> Delete Post
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Post text */}
        {post.text && (
          <Typography variant="body1" sx={{ mt: 1.5, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {post.text}
          </Typography>
        )}
      </CardContent>

      {/* Post image */}
      {post.imageUrl && (
        <CardMedia component="img" image={post.imageUrl} alt="post"
          sx={{ maxHeight: 500, objectFit: "contain", bgcolor: "rgba(0,0,0,0.03)", mt: 1.5, borderRadius: 2 }} />
      )}

      <CardActions sx={{ px: 2, pt: 0.5, pb: 0.5, gap: 1 }}>
        {/* Like */}
        <Tooltip title={likes.length > 0 ? `Liked by: ${likes.slice(0, 5).join(", ")}` : "No likes yet"}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton size="small" onClick={handleLike} disabled={!user || liking} color={isLiked ? "secondary" : "default"}>
              {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">{likes.length}</Typography>
          </Box>
        </Tooltip>

        {/* Comment toggle */}
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton size="small" onClick={() => setShowComments((v) => !v)}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">{comments.length}</Typography>
        </Box>
      </CardActions>

      {/* Likes summary */}
      {likes.length > 0 && (
        <Box px={2} pb={0.5}>
          <Typography variant="caption" color="text.secondary">
            ❤️ {likes.length === 1 ? `${likes[0]} liked this` : `${likes[0]} and ${likes.length - 1} other${likes.length - 1 > 1 ? "s" : ""} liked this`}
          </Typography>
        </Box>
      )}

      {/* Comments section */}
      <Collapse in={showComments}>
        <Divider />
        <Box px={2} pt={1} pb={1.5}>
          {comments.length === 0 ? (
            <Typography variant="caption" color="text.secondary">No comments yet. Be the first!</Typography>
          ) : (
            <Box mb={1.5} display="flex" flexDirection="column" gap={1}>
              {comments.map((c) => (
                <Box key={c._id} display="flex" gap={1} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: avatarColor(c.username), width: 28, height: 28, fontSize: 12, flexShrink: 0 }}>
                    {c.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box flex={1} bgcolor="rgba(0,0,0,0.04)" borderRadius={2} px={1.5} py={0.75}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" fontWeight={700}>@{c.username}</Typography>
                      {user?.username === c.username && (
                        <IconButton size="small" onClick={() => handleDeleteComment(c._id)} sx={{ p: 0 }}>
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>{c.text}</Typography>
                    <Typography variant="caption" color="text.secondary"><TimeAgo date={c.createdAt} /></Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Add comment input */}
          {user ? (
            <Box display="flex" gap={1} alignItems="flex-start">
              <Avatar sx={{ bgcolor: avatarColor(user.username), width: 30, height: 30, fontSize: 12, flexShrink: 0 }}>
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
              <TextField fullWidth size="small" placeholder="Write a comment…"
                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown} inputProps={{ maxLength: 500 }} multiline maxRows={3}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "rgba(0,0,0,0.03)" } }} />
              <IconButton size="small" onClick={handleComment} disabled={!commentText.trim() || commenting} color="primary">
                {commenting ? <CircularProgress size={18} /> : <SendIcon fontSize="small" />}
              </IconButton>
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary">Login to leave a comment.</Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}
