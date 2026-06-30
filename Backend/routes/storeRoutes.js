const express = require("express");
const router = express.Router();
const { addStore, getAllStores, assignStoreOwner, updateStore, deleteStore } = require("../controllers/storeController");

router.post("/", addStore);
router.get("/", getAllStores);
router.put("/:id/owner", assignStoreOwner);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);

module.exports = router;
