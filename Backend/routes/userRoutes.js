const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    submitRating
} = require("../controllers/userController");

router.post("/rating", verifyToken, submitRating);

module.exports = router;