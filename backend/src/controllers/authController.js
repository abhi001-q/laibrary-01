import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import ROLES from "../config/roles.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || ROLES.BORROWER,
      isApproved: role !== ROLES.LIBRARIAN,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.isBanned) {
        return res
          .status(403)
          .json({ message: "Your account has been banned." });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isApproved: req.user.isApproved,
      profilePhoto: req.user.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved,
      profilePhoto: updatedUser.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile photo is required" });
    }

    const profilePhotoUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: profilePhotoUrl },
      { new: true }
    );

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved,
      profilePhoto: updatedUser.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
