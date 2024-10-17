const request = require("supertest"); // Utilisé pour simuler des requêtes HTTP
const express = require("express"); // Utilisé pour créer une application express pour tester
const contactRoutes = require("../../routes/contactRoutes"); // Importation des routes de contact
const contactController = require("../../controllers/contactController"); // Importation du contrôleur de contact

// Créer une application Express fictive pour tester les routes
const app = express();
app.use(express.json()); // Middleware pour traiter les requêtes en JSON
app.use("/contact", contactRoutes); // Utiliser les routes de contact

// Mocker la fonction du contrôleur
jest.mock("../../controllers/contactController");

describe("Tests des routes de contact", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
  });

  // Test de la route POST /contact/send pour envoyer un message de contact
  test("devrait appeler le contrôleur pour envoyer un message via /contact/send", async () => {
    // Mocker la réponse du contrôleur pour simuler une réponse réussie
    contactController.sendContactMessage.mockImplementation((req, res) => {
      res.status(200).json({ message: "Message envoyé avec succès" });
    });

    // Simuler une requête POST vers /contact/send avec des données valides
    const response = await request(app).post("/contact/send").send({
      name: "John Doe",
      email: "john.doe@example.com",
      message: "Ceci est un message de test",
    });

    // Vérifier que le statut de la réponse est bien 200
    expect(response.status).toBe(200);

    // Vérifier que la réponse contient bien le message de succès
    expect(response.body).toEqual({ message: "Message envoyé avec succès" });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(contactController.sendContactMessage).toHaveBeenCalled();
    expect(contactController.sendContactMessage).toHaveBeenCalledTimes(1);
  });

  // Test de la validation pour les champs manquants
  test("devrait retourner une erreur 400 si des champs sont manquants", async () => {
    // Mocker la réponse du contrôleur pour simuler une erreur de validation
    contactController.sendContactMessage.mockImplementation((req, res) => {
      res.status(400).json({ message: "Tous les champs sont obligatoires" });
    });

    // Simuler une requête POST avec un champ manquant (email vide ici)
    const response = await request(app).post("/contact/send").send({
      name: "John Doe",
      email: "", // Champ email manquant
      message: "Ceci est un message de test",
    });

    // Vérifier que le statut de la réponse est 400 (erreur de validation)
    expect(response.status).toBe(400);

    // Vérifier que la réponse contient bien le message d'erreur
    expect(response.body).toEqual({
      message: "Tous les champs sont obligatoires",
    });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(contactController.sendContactMessage).toHaveBeenCalled();
    expect(contactController.sendContactMessage).toHaveBeenCalledTimes(1);
  });

  // Test de gestion des erreurs internes du serveur
  test("devrait retourner une erreur 500 en cas de problème serveur", async () => {
    // Mocker la réponse du contrôleur pour simuler une erreur interne
    contactController.sendContactMessage.mockImplementation((req, res) => {
      res.status(500).json({ message: "Erreur lors de l'envoi du message" });
    });

    // Simuler une requête POST avec des données valides mais qui cause une erreur serveur
    const response = await request(app).post("/contact/send").send({
      name: "John Doe",
      email: "john.doe@example.com",
      message: "Ceci est un message de test",
    });

    // Vérifier que le statut de la réponse est 500 (erreur serveur)
    expect(response.status).toBe(500);

    // Vérifier que la réponse contient bien le message d'erreur
    expect(response.body).toEqual({
      message: "Erreur lors de l'envoi du message",
    });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(contactController.sendContactMessage).toHaveBeenCalled();
    expect(contactController.sendContactMessage).toHaveBeenCalledTimes(1);
  });
});
