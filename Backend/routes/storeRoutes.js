const express = require("express");
const router = express.Router();
const { addStore, getAllStores, assignStoreOwner } = require("../controllers/storeController");

router.post("/", addStore);
router.get("/", getAllStores);
router.put("/:id/owner", assignStoreOwner);

module.exports = router;