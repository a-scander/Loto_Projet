const bdController = require("../../controllers/bdController"); // Importer le contrôleur de la base de données
const bdService = require("../../services/bdService"); // Importer le service de la base de données

// Mock du service pour éviter d'appeler les vraies fonctions
jest.mock("../../services/bdService");

describe("bdController", () => {
  let req, res; // Définition des variables req et res pour les simulations

  // Cette fonction est appelée avant chaque test pour réinitialiser req et res
  beforeEach(() => {
    // Simule les objets req et res pour chaque test
    req = {
      body: {}, // Simule req.body
      params: {}, // Simule req.params
    };
    res = {
      json: jest.fn(), // Simule la fonction res.json
      status: jest.fn().mockReturnThis(), // Simule la fonction res.status et fait en sorte qu'elle retourne res
    };
  });

  // Tests pour la fonction listeTirage
  describe("listeTirage", () => {
    // Test : devrait retourner la liste des tirages
    it("devrait retourner la liste des tirages", async () => {
      const mockTirages = [
        { id: 1, name: "Tirage 1" },
        { id: 2, name: "Tirage 2" },
      ]; // Simule une liste de tirages
      bdService.getAllTirages.mockResolvedValue(mockTirages); // Mock de la fonction getAllTirages du service

      await bdController.listeTirage(req, res); // Appel du contrôleur

      expect(bdService.getAllTirages).toHaveBeenCalled(); // Vérifie que le service a été appelé
      expect(res.json).toHaveBeenCalledWith(mockTirages); // Vérifie que la réponse contient les tirages
    });

    // Test : devrait retourner une erreur 500 si le service échoue
    it("devrait retourner une erreur 500 si le service échoue", async () => {
      bdService.getAllTirages.mockRejectedValue(new Error("Erreur service")); // Simule une erreur dans le service

      await bdController.listeTirage(req, res); // Appel du contrôleur

      expect(bdService.getAllTirages).toHaveBeenCalled(); // Vérifie que le service a été appelé
      expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut de la réponse est 500
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération des tirages",
      }); // Vérifie le message d'erreur
    });
  });

  // Tests pour la fonction applyAdvancedFilters
  describe("applyAdvancedFilters", () => {
    // Test : devrait appliquer les filtres et retourner les tirages filtrés
    it("devrait appliquer les filtres et retourner les tirages filtrés", async () => {
      const mockFilters = { filterKey: "filterValue" }; // Simule des filtres
      const mockFilteredTirages = [{ id: 3, name: "Tirage Filtré" }]; // Simule une liste de tirages filtrés
      req.body = mockFilters; // Assigne les filtres à req.body
      bdService.getFilteredTirages.mockResolvedValue(mockFilteredTirages); // Mock du service

      await bdController.applyAdvancedFilters(req, res); // Appel du contrôleur

      expect(bdService.getFilteredTirages).toHaveBeenCalledWith(mockFilters); // Vérifie que les filtres ont été passés au service
      expect(res.json).toHaveBeenCalledWith(mockFilteredTirages); // Vérifie que la réponse contient les tirages filtrés
    });

    // Test : devrait retourner une erreur 500 si le service échoue
    it("devrait retourner une erreur 500 si le service échoue", async () => {
      bdService.getFilteredTirages.mockRejectedValue(
        new Error("Erreur service"),
      ); // Simule une erreur

      await bdController.applyAdvancedFilters(req, res); // Appel du contrôleur

      expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut est 500
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de l'application des filtres avancés",
      }); // Vérifie le message d'erreur
    });
  });

  // Tests pour la fonction supprimerTirage
  describe("supprimerTirage", () => {
    // Test : devrait supprimer un tirage avec succès
    it("devrait supprimer un tirage avec succès", async () => {
      req.params.id = "123"; // Simule un ID de tirage
      bdService.deleteTirage.mockResolvedValue(); // Simule la suppression réussie

      await bdController.supprimerTirage(req, res); // Appel du contrôleur

      expect(bdService.deleteTirage).toHaveBeenCalledWith("123"); // Vérifie que le service a été appelé avec l'ID correct
      expect(res.status).toHaveBeenCalledWith(200); // Vérifie que le statut est 200
      expect(res.json).toHaveBeenCalledWith({
        message: "Tirage supprimé avec succès",
      }); // Vérifie que la réponse contient le message de succès
    });

    // Test : devrait retourner une erreur 500 si le service échoue
    it("devrait retourner une erreur 500 si le service échoue", async () => {
      bdService.deleteTirage.mockRejectedValue(new Error("Erreur service")); // Simule une erreur

      await bdController.supprimerTirage(req, res); // Appel du contrôleur

      expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut est 500
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression du tirage",
      }); // Vérifie le message d'erreur
    });
  });

  // Tests pour la fonction checkPseudo
  describe("checkPseudo", () => {
    // Test : devrait vérifier si un pseudo existe
    it("devrait vérifier si un pseudo existe", async () => {
      req.params.pseudo = "testUser"; // Simule un pseudo
      bdService.pseudoExists.mockResolvedValue(true); // Simule que le pseudo existe

      await bdController.checkPseudo(req, res); // Appel du contrôleur

      expect(bdService.pseudoExists).toHaveBeenCalledWith("testUser"); // Vérifie que le service a été appelé avec le pseudo correct
      expect(res.json).toHaveBeenCalledWith({ exists: true }); // Vérifie que la réponse contient le bon résultat
    });

    // Test : devrait retourner une erreur 500 si le service échoue
    it("devrait retourner une erreur 500 si le service échoue", async () => {
      bdService.pseudoExists.mockRejectedValue(new Error("Erreur service")); // Simule une erreur

      await bdController.checkPseudo(req, res); // Appel du contrôleur

      expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut est 500
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la vérification du pseudo",
      }); // Vérifie le message d'erreur
    });
  });

  // Tests pour la fonction getPseudos
  describe("getPseudos", () => {
    // Test : devrait retourner la liste des pseudos
    it("devrait retourner la liste des pseudos", async () => {
      const mockPseudos = ["user1", "user2"]; // Simule une liste de pseudos
      bdService.getPseudos.mockResolvedValue(mockPseudos); // Mock du service

      await bdController.getPseudos(req, res); // Appel du contrôleur

      expect(bdService.getPseudos).toHaveBeenCalled(); // Vérifie que le service a été appelé
      expect(res.json).toHaveBeenCalledWith(mockPseudos); // Vérifie que la réponse contient les pseudos
    });

    // Test : devrait retourner une erreur 500 si le service échoue
    it("devrait retourner une erreur 500 si le service échoue", async () => {
      bdService.getPseudos.mockRejectedValue(new Error("Erreur service")); // Simule une erreur

      await bdController.getPseudos(req, res); // Appel du contrôleur

      expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut est 500
      expect(res.json).toHaveBeenCalledWith({
        error: "Erreur serveur lors de la récupération des pseudos",
      }); // Vérifie le message d'erreur
    });
  });

  // Tests pour la fonction saveTirage
  describe("saveTirage", () => {
    // Test : devrait enregistrer les tirages avec succès
    it("devrait enregistrer les tirages avec succès", async () => {
      req.body = {
        tirages: [{ id: 1 }, { id: 2 }], // Simule des tirages
        montantPartie: 1000, // Simule le montant de la partie
        tirageGagnant: { id: 1 }, // Simule le tirage gagnant
        totalParticipants: 100, // Simule le nombre total de participants
      };
      bdService.saveTirage.mockResolvedValue(); // Simule un enregistrement réussi

      await bdController.saveTirage(req, res); // Appel du contrôleur

      expect(bdService.saveTirage).toHaveBeenCalledWith(
        req.body.tirages,
        req.body.montantPartie,
        req.body.tirageGagnant,
        req.body.totalParticipants,
      ); // Vérifie que le service a été appelé avec les bons paramètres
      expect(res.status).toHaveBeenCalledWith(200); // Vérifie que le statut est 200
      expect(res.json).toHaveBeenCalledWith({
        message:
          "Tirages et informations supplémentaires enregistrés avec succès",
      }); // Vérifie le message de succès
    });

    // Test : devrait retourner une erreur 500 si le service échoue
    it("devrait retourner une erreur 500 si le service échoue", async () => {
      bdService.saveTirage.mockRejectedValue(new Error("Erreur service")); // Simule une erreur

      await bdController.saveTirage(req, res); // Appel du contrôleur

      expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut est 500
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de l'enregistrement des tirages",
      }); // Vérifie le message d'erreur
    });
  });
});
