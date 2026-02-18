import { Router } from "express";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import auth from "../middleware/auth.js";

const router = Router();

// GET /api/friends — get current user's accepted friends
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("friends", "username email");
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/friends/requests — get pending requests sent TO the current user
router.get("/requests", auth, async (req, res) => {
  try {
    const requests = await FriendRequest.find({ to: req.userId, status: "pending" })
      .populate("from", "username email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/friends/sent — get pending requests sent BY the current user
router.get("/sent", auth, async (req, res) => {
  try {
    const requests = await FriendRequest.find({ from: req.userId, status: "pending" })
      .populate("to", "username email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/friends/request/:requestId — cancel a sent request
router.delete("/request/:requestId", auth, async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    if (!request || request.from.toString() !== req.userId) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled" });
    }

    await FriendRequest.findByIdAndDelete(req.params.requestId);
    res.json({ message: "Friend request cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/friends/request — send a friend request by username or email
router.post("/request", auth, async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    const target = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${identifier}$`, "i") } },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }
    if (target._id.toString() === req.userId) {
      return res.status(400).json({ message: "You can't add yourself" });
    }

    // Check if already friends
    const user = await User.findById(req.userId);
    if (user.friends.includes(target._id)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Check for existing pending request in either direction
    const existing = await FriendRequest.findOne({
      $or: [
        { from: req.userId, to: target._id, status: "pending" },
        { from: target._id, to: req.userId, status: "pending" },
      ],
    });
    if (existing) {
      return res.status(400).json({ message: "Friend request already pending" });
    }

    const request = await FriendRequest.create({ from: req.userId, to: target._id });
    res.status(201).json({ message: "Friend request sent", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/friends/accept/:requestId — accept a friend request
router.post("/accept/:requestId", auth, async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    if (!request || request.to.toString() !== req.userId) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled" });
    }

    request.status = "accepted";
    await request.save();

    // Add each user to the other's friends list
    await User.findByIdAndUpdate(req.userId, { $addToSet: { friends: request.from } });
    await User.findByIdAndUpdate(request.from, { $addToSet: { friends: req.userId } });

    const friend = await User.findById(request.from, "username email");
    res.json({ message: "Friend request accepted", friend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/friends/decline/:requestId — decline a friend request
router.post("/decline/:requestId", auth, async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    if (!request || request.to.toString() !== req.userId) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled" });
    }

    request.status = "declined";
    await request.save();

    res.json({ message: "Friend request declined" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/friends/:id — remove a friend (both sides)
router.delete("/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $pull: { friends: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $pull: { friends: req.userId } });
    res.json({ message: "Friend removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
