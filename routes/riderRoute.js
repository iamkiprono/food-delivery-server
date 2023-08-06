import { createRider, loginRider, updateRider, deleteRider, resetPassword, updatePassword, getRider, getRiders, getRidersByVendor } from "../controllers/riderController.js";
import express from "express";
import multer from "multer";
const upload = multer({ dest: 'uploads/'})
const router = express.Router()

router.route("/register").post(upload.single('image'), createRider)
router.route("/login").post(loginRider)
router.route("/update/:id").put(upload.single('image'), updateRider)
router.route("/reset").post(resetPassword)
router.route("/update-password").put(updatePassword)
router.route("/").get(getRiders)
router.route("/riders/:vendorId").get(getRidersByVendor)
router.route("/delete/:id").delete(deleteRider)
router.route("/:id").get(getRider)

export default router