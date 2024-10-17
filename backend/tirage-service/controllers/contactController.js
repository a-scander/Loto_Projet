const contactService = require("../services/contactService");

// Contrôleur pour gérer la soumission du formulaire de contact
exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Validation des données
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires" });
  }

  try {
    // Appel du service pour envoyer l'e-mail
    const emailResult = await contactService.sendEmailContact(
      name,
      email,
      message,
    );

    // Retourne une réponse au front-end
    res.status(200).json({
      message: "Message envoyé avec succès",
      emailResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
