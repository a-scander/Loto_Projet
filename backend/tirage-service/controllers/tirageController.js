const tirageService = require("../services/tirageService");

// Contrôleur pour classer les tirages, les positions et calculer les gains en une seule requête
exports.classerTiragesPositionsEtGains = (req, res) => {
  const { tirages, tirageWin,montant } = req.body;

  if (!tirages || !tirageWin || !montant) {
    return res
      .status(400)
      .json({ message: "Tirages ou tirage gagnant ou montant manquant." });
  }

  // 1. Classer les tirages
  const classement = tirageService.classerTirages(tirages, tirageWin);

  // 2. Classer les positions des tirages
  const positions = tirageService.classerPosition(classement,tirageWin);

  // 3. Calculer les gains selon les positions
  const gains = tirageService.calculerGainsParPosition(positions,montant);

  // Retourner tout en un seul objet : classement, positions et gains
  res.json({
    classement, // Tirages classés
    positions, // Positions attribuées
    gains, // Gains calculés
  });
};
