const express = require("express");

const router = express.Router();

const {
  createUser,
  loginUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

// Health/Test route
router.get("/", (req, res) => {
  res.send("user routes working");
});

// Register user
router.post("/users", createUser);

// Login user
router.post("/login", loginUser);

// Protected profile route
router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected route accessed",
      user: req.user,
    });
  }
);

// Admin-only route
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

module.exports = router;