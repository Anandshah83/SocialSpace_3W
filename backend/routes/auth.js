const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User    = require("../models/User");
const { protect } = require("../middleware/auth");

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("username").trim().isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 chars"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { username, email, password } = req.body;
    try {
      if (await User.findOne({ email })) return res.status(400).json({ message: "Email already in use" });
      if (await User.findOne({ username })) return res.status(400).json({ message: "Username already taken" });

      const user = await User.create({ username, email, password });
      res.status(201).json({
        message: "Account created!",
        token: genToken(user._id),
        user: { _id: user._id, username: user.username, email: user.email, avatar: user.avatar },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: "Invalid email or password" });

      res.json({
        message: "Logged in!",
        token: genToken(user._id),
        user: { _id: user._id, username: user.username, email: user.email, avatar: user.avatar },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json({ _id: req.user._id, username: req.user.username, email: req.user.email, avatar: req.user.avatar });
});

module.exports = router;
