// Importation du module Express pour créer l'application web
const express = require("express");

// Importation de 'cors' pour permettre les requêtes entre des domaines différents (Cross-Origin Resource Sharing)
const cors = require("cors");

// Importation des routes pour le service de tirage
const tirageRoutes = require("./routes/tirageRoutes");
const bdRoutes = require("./routes/bdRoutes");
const contactRoutes = require("./routes/contactRoutes");
// Initialisation de l'application Express
const app = express();

// Utilisation des middlewares
// Autorise les requêtes provenant de localhost:4200
app.use(
  cors({
    origin: "http://localhost:4200", // Remplace par l'origine de ton front-end
  }),
);
app.use(express.json()); // Permet à l'application de comprendre les requêtes avec un corps JSON (important pour traiter les données envoyées par le front)
app.options("*", (req, res) => {
  res.sendStatus(200); // Renvoie une réponse 200 pour les requêtes OPTIONS
});
// Définition des routes associées au service de tirage
// Quand une requête commence par '/api/tirages', on utilise les routes définies dans tirageRoutes
app.use("/api/tirages", tirageRoutes);

// Routes pour les opérations en base de données
app.use("/api/bd", bdRoutes); // Utilisation des nouvelles routes pour la base de données

app.use("/api/contact", contactRoutes); // Route pour le formulaire de contact
// Exportation de l'application pour qu'elle puisse être utilisée dans 'index.js'
module.exports = app;
