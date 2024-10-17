const bdService = require("../services/bdService");

// Contrôleur pour lister tous les tirages
exports.listeTirage = async (req, res) => {
  try {
    const tirages = await bdService.getAllTirages(); // Appelle la fonction du service pour récupérer les tirages
    res.json(tirages); // Retourne les tirages en format JSON
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des tirages" });
  }
};

exports.applyAdvancedFilters = async (req, res) => {
  const filters = req.body;  // Récupérer les filtres depuis le corps de la requête
  
  try {
    const filteredTirages = await bdService.getFilteredTirages(filters);  // Appliquer les filtres dans le service
    res.json(filteredTirages);  // Retourner les résultats
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'application des filtres avancés" });
  }
};


// Contrôleur pour supprimer un tirage
exports.supprimerTirage = async (req, res) => {
  const tirageId = req.params.id;
  
  try {
    await bdService.deleteTirage(tirageId); // Appelle le service pour supprimer le tirage
    res.status(200).json({ message: "Tirage supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du tirage" });
  }
};

// Contrôleur pour vérifier si un pseudo existe
exports.checkPseudo = async (req, res) => {
  const { pseudo } = req.params;
  try {
    const exists = await bdService.pseudoExists(pseudo); // Appelle le service pour vérifier le pseudo
    res.json({ exists }); // Renvoie true si le pseudo existe, sinon false
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la vérification du pseudo" });
  }
};

exports.getPseudos = async ( req,res) => {
  try {
    const pseudos = await bdService.getPseudos(); // Appel au service pour récupérer les pseudos
    res.json(pseudos); // Retourner la liste des pseudos en réponse
  } catch (error) {
    console.error('Erreur lors de la récupération des pseudos:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des pseudos' });
  }
};



// Contrôleur pour enregistrer les tirages avec les informations supplémentaires
exports.saveTirage = async (req, res) => {
  const { tirages, montantPartie, tirageGagnant, totalParticipants } = req.body;

  try {
    // Appel au service pour enregistrer les tirages
    await bdService.saveTirage(tirages, montantPartie, tirageGagnant, totalParticipants);
    res.status(200).json({ message: 'Tirages et informations supplémentaires enregistrés avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement des tirages:', err);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement des tirages' });
  }
};
