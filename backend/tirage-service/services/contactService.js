const nodemailer = require("nodemailer");

// Fonction pour envoyer un e-mail
async function sendEmailContact(name, email, message) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // Utilisez le service d'email que vous souhaitez (Gmail, Outlook, etc.)
      auth: {
        user: "scander.ali@gmail.com", // Remplacez par votre email
        pass: "dqtv qeje rdwn kovj", // Remplacez par votre mot de passe ou token d'application
      },
    });

    let mailOptions = {
      to: "scander.ali@gmail.com", // Remplacez par l'email du destinataire
      subject: `Message de contact de ${name}`,
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,
    };

    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email envoyé avec succès" };
  } catch (error) {
    throw new Error("Erreur lors de l'envoi de l'e-mail");
  }
}

module.exports = {
  sendEmailContact,
};
