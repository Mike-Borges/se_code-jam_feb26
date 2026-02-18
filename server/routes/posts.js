import { Router } from "express";
import multer from "multer";
import path from "path";
import Post from "../models/Post.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "server/uploads/",
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error("Only image files are allowed"), ext && mime);
  },
});

// POST /api/posts — create a memory
router.post("/", auth, upload.array("photos", 5), async (req, res) => {
  try {
    const { type, month, day, year, text } = req.body;

    if (!type || !month || !day || !year) {
      return res.status(400).json({ message: "Type and date fields are required" });
    }
    if (type === "photo" && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: "At least one photo is required" });
    }
    if (type === "text" && !text) {
      return res.status(400).json({ message: "Text content is required" });
    }

    const post = await Post.create({
      author: req.userId,
      type,
      memoryDate: { month: Number(month), day: Number(day), year: Number(year) },
      text: text || "",
      images: req.files ? req.files.map((f) => f.filename) : [],
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts — get own + friends' memories (newest first)
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const visibleAuthors = [req.userId, ...user.friends];

    const posts = await Post.find({ author: { $in: visibleAuthors } })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
