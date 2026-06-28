const express = require("express");

const router = express.Router();

const { getOwnerDashboard } = require("../controllers/ownerController");

const verifyToken = require("../middleware/verifyToken");

router.get("/dashboard", verifyToken, getOwnerDashboard);

module.exports = router;