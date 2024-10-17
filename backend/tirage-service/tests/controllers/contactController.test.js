const request = require("supertest"); // Importer supertest pour simuler les requêtes HTTP
const express = require("express"); // Importer express pour créer une application simulée
const contactController = require("../../controllers/contactController"); // Importer le contrôleur de contact
const contactService = require("../../services/contactService"); // Importer le service de contact

// Crée une instance d'express pour simuler les requêtes HTTP
const app = express();
app.use(express.json()); // Middleware express pour traiter les requêtes avec un corps en JSON
app.post("/contact", contactController.sendContactMessage); // Définir la route POST pour envoyer un message via le formulaire de contact

// Mock du service contactService pour éviter d'envoyer réellement des emails pendant les tests
jest.mock("../../services/contactService");

describe("ContactController - sendContactMessage", () => {
  // Test pour vérifier que le contrôleur renvoie une erreur 400 si des champs sont manquants
  it("devrait renvoyer une erreur 400 si des champs sont manquants", async () => {
    // Simule une requête POST avec des champs vides
    const res = await request(app)
      .post("/contact")
      .send({ name: "", email: "", message: "" });

    // Vérifie que le code de statut HTTP 400 est renvoyé
    expect(res.statusCode).toEqual(400);
    // Vérifie que le message d'erreur approprié est renvoyé
    expect(res.body).toHaveProperty(
      "message",
      "Tous les champs sont obligatoires",
    );
  });

  // Test pour vérifier que le message de succès est renvoyé si les données sont valides
  it("devrait envoyer un message de succès si les données sont valides", async () => {
    // Mock la réponse du service pour simuler l'envoi d'un email réussi
    contactService.sendEmailContact.mockResolvedValue("Email envoyé");

    // Simule une requête POST avec des données valides
    const res = await request(app)
      .post("/contact")
      .send({ name: "John Doe", email: "john@example.com", message: "Hello" });

    // Vérifie que le code de statut HTTP 200 est renvoyé
    expect(res.statusCode).toEqual(200);
    // Vérifie que le message de succès est bien dans la réponse
    expect(res.body).toHaveProperty("message", "Message envoyé avec succès");
    // Vérifie que le résultat de l'email est bien "Email envoyé"
    expect(res.body).toHaveProperty("emailResult", "Email envoyé");
  });

  // Test pour vérifier que le contrôleur renvoie une erreur 500 si le service échoue
  it("devrait renvoyer une erreur 500 si le service échoue", async () => {
    // Mock le service pour simuler un échec d'envoi d'email
    contactService.sendEmailContact.mockRejectedValue(
      new Error("Service indisponible"),
    );

    // Simule une requête POST avec des données valides mais avec le service en échec
    const res = await request(app)
      .post("/contact")
      .send({ name: "John Doe", email: "john@example.com", message: "Hello" });

    // Vérifie que le code de statut HTTP 500 est renvoyé
    expect(res.statusCode).toEqual(500);
    // Vérifie que le message d'erreur approprié est renvoyé
    expect(res.body).toHaveProperty("message", "Service indisponible");
  });
});
