const express = require("express"); // Importation d'Express pour créer le routeur
const router = express.Router(); // Création d'une instance de routeur Express
const bdController = require("../controllers/bdController"); // Importation du contrôleur pour les tirages et autres opérations liées à la base de données

// Route pour récupérer tous les tirages
// Cette route appelle la méthode `listeTirage` du contrôleur pour récupérer tous les tirages disponibles
router.get("/liste-tirage", bdController.listeTirage);

// Route pour récupérer la liste des pseudos
// Cette route appelle la méthode `getPseudos` du contrôleur pour obtenir tous les pseudos d'utilisateurs
router.get("/pseudos", bdController.getPseudos);

// Route pour appliquer des filtres avancés sur les tirages
// La méthode `applyAdvancedFilters` est appelée pour filtrer les tirages selon certains critères envoyés dans le corps de la requête
router.post("/apply-filters", bdController.applyAdvancedFilters);

// Route pour supprimer un tirage spécifique
// Cette route appelle la méthode `supprimerTirage` du contrôleur en utilisant un identifiant de tirage passé en paramètre pour le supprimer
router.delete("/delete/:id", bdController.supprimerTirage);

// Route pour vérifier l'existence d'un pseudo
// La méthode `checkPseudo` est appelée pour vérifier si un pseudo existe dans la base de données. Le pseudo est envoyé dans l'URL en tant que paramètre
router.get("/check-pseudo/:pseudo", bdController.checkPseudo);

// Route pour enregistrer un tirage avec des informations supplémentaires
// La méthode `saveTirage` est appelée pour sauvegarder les informations d'un tirage, telles que les numéros, montants, etc., envoyées dans le corps de la requête
router.post("/save-tirage", bdController.saveTirage);

module.exports = router; // Exportation du routeur pour l'utiliser dans l'application principale
