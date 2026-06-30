const express = require("express");
const router = express.Router();

const { getDashboardStats, getAllUsers, addUser, getOwners, updateUser, deleteUser } = require("../controllers/adminController");

router.get("/dashboard", getDashboardStats);

router.get("/users", getAllUsers);
router.post("/users", addUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/owners", getOwners);

module.exports = router;
