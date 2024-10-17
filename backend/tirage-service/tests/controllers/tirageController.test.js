const tirageController = require("../../controllers/tirageController"); // Importer le contrôleur de tirage
const tirageService = require("../../services/tirageService"); // Importer le service de tirage

// Mock du service pour éviter les appels réels aux méthodes du service
jest.mock("../../services/tirageService");

describe("tirageController", () => {
  let req, res; // Variables pour simuler req (requête) et res (réponse)

  // Avant chaque test, initialiser req et res avec des valeurs simulées
  beforeEach(() => {
    // Simule les données dans req.body pour chaque test
    req = {
      body: {
        tirages: [{ id: 1 }, { id: 2 }], // Simule une liste de tirages
        tirageWin: { id: 1, numbers: [1, 2, 3, 4, 5] }, // Simule le tirage gagnant
        montant: 1000, // Simule un montant pour calculer les gains
      },
    };

    // Simule les méthodes de res (la réponse HTTP)
    res = {
      json: jest.fn(), // Simule la méthode json pour renvoyer les réponses
      status: jest.fn().mockReturnThis(), // Simule la méthode status pour définir le statut HTTP
    };
  });

  // Test pour vérifier que le contrôleur renvoie une erreur 400 si des données sont manquantes
  it("devrait renvoyer une erreur 400 si des données sont manquantes", () => {
    // Simule une requête avec des valeurs manquantes dans req.body
    req.body = { tirages: null, tirageWin: null, montant: null };

    // Appeler la méthode du contrôleur classerTiragesPositionsEtGains
    tirageController.classerTiragesPositionsEtGains(req, res);

    // Vérifie que le contrôleur renvoie un code 400 pour les requêtes mal formées
    expect(res.status).toHaveBeenCalledWith(400);
    // Vérifie que le message d'erreur correct est renvoyé dans la réponse
    expect(res.json).toHaveBeenCalledWith({
      message: "Tirages ou tirage gagnant ou montant manquant.",
    });
  });

  // Test pour vérifier que le contrôleur classe correctement les tirages, positions et gains
  it("devrait classer les tirages, positions et gains correctement", () => {
    // Mock les méthodes du service tirageService pour qu'elles renvoient des valeurs simulées
    tirageService.classerTirages.mockReturnValue([{ id: 1 }, { id: 2 }]); // Simule le classement des tirages
    tirageService.classerPosition.mockReturnValue([1, 2]); // Simule le classement des positions
    tirageService.calculerGainsParPosition.mockReturnValue([500, 500]); // Simule les gains calculés

    // Appeler la méthode du contrôleur classerTiragesPositionsEtGains
    tirageController.classerTiragesPositionsEtGains(req, res);

    // Vérifie que la méthode classerTirages du service a été appelée avec les bons arguments
    expect(tirageService.classerTirages).toHaveBeenCalledWith(
      req.body.tirages,
      req.body.tirageWin,
    );
    // Vérifie que la méthode classerPosition du service a été appelée avec le bon classement et le tirage gagnant
    expect(tirageService.classerPosition).toHaveBeenCalledWith(
      [{ id: 1 }, { id: 2 }],
      req.body.tirageWin,
    );
    // Vérifie que la méthode calculerGainsParPosition du service a été appelée avec les positions et le montant
    expect(tirageService.calculerGainsParPosition).toHaveBeenCalledWith(
      [1, 2],
      req.body.montant,
    );

    // Vérifie que la réponse JSON contient les bons résultats (classement, positions et gains)
    expect(res.json).toHaveBeenCalledWith({
      classement: [{ id: 1 }, { id: 2 }], // Classement simulé
      positions: [1, 2], // Positions simulées
      gains: [500, 500], // Gains simulés
    });
  });
});
