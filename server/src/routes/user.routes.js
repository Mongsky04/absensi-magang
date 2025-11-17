import express from "express";
import * as userController from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import User from "../models/User.js";

const router = express.Router();

// =========================
// USER ROUTES
// =========================

// GET PROFILE USER LOGIN
router.get("/me", auth, userController.getProfile);
router.put("/me", auth, userController.updateProfile);

// Ambil daftar mentor (user dengan isMentor=true). Bisa diakses semua user untuk dropdown.
router.get("/mentors", auth, async (req, res) => {
	try {
		const mentors = await User.find({ isMentor: true }).select("nama email foto");
		return res.status(200).json({ message: "Berhasil mengambil data mentor", data: mentors });
	} catch (err) {
		return res.status(500).json({ message: "Server error", error: err.message });
	}
});

// GET ALL USERS (ADMIN ONLY)
router.get("/all", auth, adminOnly, userController.getAllUsers);

// CREATE USER (ADMIN ONLY)
router.post("/", auth, adminOnly, userController.createUserAdmin);

// UPDATE USER (ADMIN ONLY)
router.put("/:id", auth, adminOnly, userController.updateUserAdmin);

// DELETE USER (ADMIN ONLY)
router.delete("/:id", auth, adminOnly, userController.deleteUserAdmin);

export default router;
