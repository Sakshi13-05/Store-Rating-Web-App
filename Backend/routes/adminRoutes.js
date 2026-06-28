const express = require("express");
const router = express.Router();

const { getDashboardStats, getAllUsers, addUser, getOwners } = require("../controllers/adminController");

router.get("/dashboard", getDashboardStats);

router.get("/users", getAllUsers);

router.post("/users", addUser);

router.get("/owners", getOwners);

module.exports = router;