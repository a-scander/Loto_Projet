const express = require("express");
const router = express.Router();
const tirageController = require("../controllers/tirageController");

// Nouvelle route pour classer tirages, positions et gains en une seule requête
router.post(
  "/classement-et-gains",
  tirageController.classerTiragesPositionsEtGains,
);

module.exports = router;
