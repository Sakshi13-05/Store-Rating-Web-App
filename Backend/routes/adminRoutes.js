const express = require("express");
const router = express.Router();

const { getDashboardStats, getAllUsers, addUser } = require("../controllers/adminController");

router.get("/dashboard", getDashboardStats);

router.get("/users", getAllUsers);

router.post("/users", addUser);

module.exports = router;