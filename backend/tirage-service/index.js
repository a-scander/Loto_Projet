// Importation de l'application Express (configurée dans 'app.js')
const app = require("./app");

// Définir le port sur lequel l'application va écouter. Par défaut, on prend 3000 si le port n'est pas défini.
const port = process.env.PORT || 3000;

// Lancer le serveur Express en l'écoutant sur le port défini
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`); // Afficher un message dans la console pour confirmer que le serveur est bien lancé.
});
