const express = require("express");

const router = express.Router();

const { getOwnerDashboard, getRatings } = require("../controllers/ownerController");

const verifyToken = require("../middleware/verifyToken");

router.get("/dashboard", verifyToken, getOwnerDashboard);

router.get("/ratings", verifyToken, getRatings);

module.exports = router;