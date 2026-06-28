const express = require("express");
const router = express.Router();
const { addStore, getAllStores } = require("../controllers/storeController");

router.post("/", addStore);
router.get("/", getAllStores);

module.exports = router;