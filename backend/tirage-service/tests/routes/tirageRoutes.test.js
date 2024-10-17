const request = require("supertest"); // Utilisé pour simuler des requêtes HTTP
const express = require("express"); // Utilisé pour créer une application express fictive
const tirageRoutes = require("../../routes/tirageRoutes"); // Importation des routes de tirage
const tirageController = require("../../controllers/tirageController"); // Importation du contrôleur de tirage

// Créer une application Express fictive pour tester les routes
const app = express();
app.use(express.json()); // Middleware pour traiter les requêtes en JSON
app.use("/tirage", tirageRoutes); // Utiliser les routes de tirage

// Mocker la fonction du contrôleur
jest.mock("../../controllers/tirageController");

describe("Tests des routes de tirage", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
  });

  // Test de la route POST /tirage/classement-et-gains pour classer tirages et gains
  test("devrait classer les tirages et calculer les gains via /tirage/classement-et-gains", async () => {
    // Simuler une réponse réussie du contrôleur
    tirageController.classerTiragesPositionsEtGains.mockImplementation(
      (req, res) => {
        res.status(200).json({
          classement: ["tirage1", "tirage2"],
          positions: [1, 2],
          gains: [100, 50],
        });
      },
    );

    // Simuler une requête POST avec des données valides
    const response = await request(app)
      .post("/tirage/classement-et-gains")
      .send({
        tirages: [
          { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2], pseudo: "user1" },
          { numeros: [1, 2, 3, 6, 7], etoiles: [1, 3], pseudo: "user2" },
        ],
        tirageWin: { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
        montant: 150,
      });

    // Vérifier que le statut de la réponse est 200 (succès)
    expect(response.status).toBe(200);

    // Vérifier que la réponse contient bien les classements, positions et gains
    expect(response.body).toEqual({
      classement: ["tirage1", "tirage2"],
      positions: [1, 2],
      gains: [100, 50],
    });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(tirageController.classerTiragesPositionsEtGains).toHaveBeenCalled();
    expect(
      tirageController.classerTiragesPositionsEtGains,
    ).toHaveBeenCalledTimes(1);
  });

  // Test pour vérifier la gestion des champs manquants
  test("devrait retourner une erreur 400 si des champs sont manquants", async () => {
    // Simuler une réponse d'erreur de validation du contrôleur
    tirageController.classerTiragesPositionsEtGains.mockImplementation(
      (req, res) => {
        res
          .status(400)
          .json({ message: "Tirages ou tirage gagnant ou montant manquant." });
      },
    );

    // Simuler une requête POST avec des champs manquants
    const response = await request(app)
      .post("/tirage/classement-et-gains")
      .send({
        tirages: [], // Manque des tirages valides
        tirageWin: { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
        montant: 150,
      });

    // Vérifier que le statut de la réponse est 400 (erreur de validation)
    expect(response.status).toBe(400);

    // Vérifier que la réponse contient bien le message d'erreur
    expect(response.body).toEqual({
      message: "Tirages ou tirage gagnant ou montant manquant.",
    });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(tirageController.classerTiragesPositionsEtGains).toHaveBeenCalled();
    expect(
      tirageController.classerTiragesPositionsEtGains,
    ).toHaveBeenCalledTimes(1);
  });

  // Test pour vérifier la gestion des erreurs internes du serveur
  test("devrait retourner une erreur 500 en cas de problème serveur", async () => {
    // Simuler une réponse d'erreur serveur du contrôleur
    tirageController.classerTiragesPositionsEtGains.mockImplementation(
      (req, res) => {
        res.status(500).json({ message: "Erreur interne du serveur" });
      },
    );

    // Simuler une requête POST valide mais provoquant une erreur serveur
    const response = await request(app)
      .post("/tirage/classement-et-gains")
      .send({
        tirages: [
          { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2], pseudo: "user1" },
          { numeros: [1, 2, 3, 6, 7], etoiles: [1, 3], pseudo: "user2" },
        ],
        tirageWin: { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
        montant: 150,
      });

    // Vérifier que le statut de la réponse est 500 (erreur serveur)
    expect(response.status).toBe(500);

    // Vérifier que la réponse contient bien le message d'erreur serveur
    expect(response.body).toEqual({ message: "Erreur interne du serveur" });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(tirageController.classerTiragesPositionsEtGains).toHaveBeenCalled();
    expect(
      tirageController.classerTiragesPositionsEtGains,
    ).toHaveBeenCalledTimes(1);
  });
});
