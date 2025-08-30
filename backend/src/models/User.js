import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import ROLES from "../config/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.BORROWER],
      default: ROLES.BORROWER,
    },
    isApproved: {
      type: Boolean,
      default: function () {
        // Librarians are auto-approved, others need approval
        return this.role === ROLES.LIBRARIAN;
      },
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
