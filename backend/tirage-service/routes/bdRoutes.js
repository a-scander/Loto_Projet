const express = require("express");
const router = express.Router();
const bdController = require("../controllers/bdController");

// Route pour récupérer tous les tirages
router.get("/liste-tirage", bdController.listeTirage);

// Route pour ajouter un nouveau tirage
router.post("/add-tirage", bdController.addTirage);

module.exports = router;
