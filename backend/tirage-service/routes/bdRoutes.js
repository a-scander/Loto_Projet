const express = require("express");
const router = express.Router();
const bdController = require("../controllers/bdController");

// Route pour récupérer tous les tirages
router.get("/liste-tirage", bdController.listeTirage);

router.get('/pseudos', bdController.getPseudos);
router.post("/apply-filters", bdController.applyAdvancedFilters);
// Route pour ajouter un nouveau tirage

router.delete("/delete/:id", bdController.supprimerTirage);

router.get("/check-pseudo/:pseudo", bdController.checkPseudo);

router.post("/save-tirage", bdController.saveTirage);

module.exports = router;
