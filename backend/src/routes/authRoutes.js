import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfilePhoto,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import profilePhotoUpload from "../utils/profilePhotoUploader.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put(
  "/profile/photo",
  authMiddleware,
  profilePhotoUpload.single("profilePhoto"),
  updateProfilePhoto
);

export default router;
