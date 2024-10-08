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

// Contrôleur pour ajouter un nouveau tirage
exports.addTirage = async (req, res) => {
  const { pseudo, tirage_numero, tirage_etoile, tirage_win_numero, tirage_win_etoile, montant_tirage } = req.body;
  
  if (!pseudo || !tirage_numero || !tirage_etoile) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  try {
    const newTirage = await bdService.addNewTirage({
      pseudo,
      tirage_numero,
      tirage_etoile,
      tirage_win_numero,
      tirage_win_etoile,
      montant_tirage,
    });
    res.status(201).json(newTirage); // Retourne le tirage ajouté en JSON
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du tirage" });
  }
};
