const nodemailer = require("nodemailer");
const contactService = require("../../services/contactService");

// Mock de nodemailer pour éviter d'envoyer de vrais e-mails
jest.mock("nodemailer");

describe("contactService", () => {
  let sendMailMock;

  beforeEach(() => {
    // Configuration du mock de transporteur et de sendMail
    sendMailMock = jest.fn().mockResolvedValue({ success: true });

    // Simuler un transporteur nodemailer qui contient la fonction sendMail
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Nettoyer les mocks après chaque test
  });

  describe("sendEmailContact", () => {
    it("devrait envoyer un e-mail avec succès", async () => {
      // Appel de la fonction avec des paramètres simulés
      const result = await contactService.sendEmailContact(
        "John Doe",
        "john.doe@example.com",
        "This is a test message",
      );

      // Vérification que nodemailer.createTransport a été appelé correctement
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: "gmail",
        auth: {
          user: "scander.ali@gmail.com", // Email du service d'envoi
          pass: "dqtv qeje rdwn kovj", // Mot de passe ou token d'application
        },
      });

      // Vérification que sendMail a été appelé avec les bons paramètres
      expect(sendMailMock).toHaveBeenCalledWith({
        to: "scander.ali@gmail.com",
        subject: "Message de contact de John Doe",
        text: "Nom: John Doe\nEmail: john.doe@example.com\nMessage: This is a test message",
        replyTo: "john.doe@example.com",
      });

      // Vérification que la fonction retourne bien un succès
      expect(result).toEqual({
        success: true,
        message: "Email envoyé avec succès",
      });
    });

    it("devrait renvoyer une erreur si l'envoi échoue", async () => {
      // Simuler un échec de sendMail
      sendMailMock.mockRejectedValueOnce(
        new Error("Erreur lors de l'envoi de l'e-mail"),
      );

      // Appel de la fonction et vérification de l'exception
      await expect(
        contactService.sendEmailContact(
          "John Doe",
          "john.doe@example.com",
          "This is a test message",
        ),
      ).rejects.toThrow("Erreur lors de l'envoi de l'e-mail");

      // Vérification que sendMail a bien été appelé
      expect(sendMailMock).toHaveBeenCalled();
    });
  });
});
