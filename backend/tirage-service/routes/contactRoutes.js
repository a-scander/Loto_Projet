const express = require("express");
const contactController = require("../controllers/contactController");

const router = express.Router();

// Route pour envoyer un message via le formulaire de contact
router.post("/send", contactController.sendContactMessage);

module.exports = router;
