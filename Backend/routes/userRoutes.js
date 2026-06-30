const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    submitRating, updateProfile, changePassword
} = require("../controllers/userController");

router.post("/rating", verifyToken, submitRating);
router.put("/profile", updateProfile);
router.post("/change-password", changePassword);

module.exports = router;
