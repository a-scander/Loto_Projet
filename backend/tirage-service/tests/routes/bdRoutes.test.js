const request = require("supertest"); // Utilisé pour simuler des requêtes HTTP
const express = require("express"); // Utilisé pour configurer l'application express
const contactRoutes = require("../../routes/contactRoutes"); // Importation des routes de contact
const contactController = require("../../controllers/contactController"); // Importation du contrôleur de contact

// Créer une application Express fictive pour tester les routes
const app = express();
app.use(express.json()); // Middleware pour traiter les requêtes JSON
app.use("/contact", contactRoutes); // Ajouter les routes de contact à l'application

// Mocker la fonction sendContactMessage du contrôleur
jest.mock("../../controllers/contactController");

describe("Contact Routes Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialise tous les mocks avant chaque test
  });

  // Test pour vérifier que la route POST /contact/send fonctionne correctement
  test("devrait appeler le contrôleur pour envoyer un message via /contact/send", async () => {
    // Mocker la réponse du contrôleur pour renvoyer un succès
    contactController.sendContactMessage.mockImplementation((req, res) => {
      res.status(200).json({ message: "Message envoyé avec succès" });
    });

    // Simuler une requête POST vers /contact/send avec des données de formulaire
    const response = await request(app).post("/contact/send").send({
      name: "John Doe",
      email: "john.doe@example.com",
      message: "Bonjour, c'est un message de test",
    });

    // Vérifier que la réponse a un statut 200
    expect(response.status).toBe(200);

    // Vérifier que la réponse contient le message de succès
    expect(response.body).toEqual({ message: "Message envoyé avec succès" });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(contactController.sendContactMessage).toHaveBeenCalled();
    expect(contactController.sendContactMessage).toHaveBeenCalledTimes(1);
  });

  // Test pour vérifier que la validation de la route fonctionne correctement
  test("devrait retourner une erreur 400 si des champs sont manquants", async () => {
    // Mocker la réponse du contrôleur pour renvoyer une erreur de validation
    contactController.sendContactMessage.mockImplementation((req, res) => {
      res.status(400).json({ message: "Tous les champs sont obligatoires" });
    });

    // Simuler une requête POST avec des champs manquants
    const response = await request(app).post("/contact/send").send({
      name: "John Doe",
      email: "", // Champ email vide
      message: "Bonjour, c'est un message de test",
    });

    // Vérifier que la réponse a un statut 400
    expect(response.status).toBe(400);

    // Vérifier que la réponse contient le message d'erreur
    expect(response.body).toEqual({
      message: "Tous les champs sont obligatoires",
    });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(contactController.sendContactMessage).toHaveBeenCalled();
    expect(contactController.sendContactMessage).toHaveBeenCalledTimes(1);
  });

  // Test pour vérifier la gestion des erreurs internes du serveur
  test("devrait retourner une erreur 500 en cas de problème serveur", async () => {
    // Mocker le contrôleur pour qu'il lance une erreur
    contactController.sendContactMessage.mockImplementation((req, res) => {
      res.status(500).json({ message: "Erreur lors de l'envoi du message" });
    });

    // Simuler une requête POST avec des données valides mais qui cause une erreur serveur
    const response = await request(app).post("/contact/send").send({
      name: "John Doe",
      email: "john.doe@example.com",
      message: "Bonjour, c'est un message de test",
    });

    // Vérifier que la réponse a un statut 500
    expect(response.status).toBe(500);

    // Vérifier que la réponse contient le message d'erreur
    expect(response.body).toEqual({
      message: "Erreur lors de l'envoi du message",
    });

    // Vérifier que la fonction du contrôleur a bien été appelée
    expect(contactController.sendContactMessage).toHaveBeenCalled();
    expect(contactController.sendContactMessage).toHaveBeenCalledTimes(1);
  });
});
