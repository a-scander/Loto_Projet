const pool = require('../config/db'); // Importer la connexion PostgreSQL

// Fonction pour récupérer tous les tirages
async function getAllTirages() {
  try {
    const result = await pool.query('SELECT * FROM Tirage'); // Requête SQL pour obtenir tous les tirages
    return result.rows; // Retourne les lignes récupérées
  } catch (err) {
    throw new Error("Erreur lors de la récupération des tirages");
  }
}

// Fonction pour ajouter un nouveau tirage
async function addNewTirage(tirageData) {
  const { pseudo, tirage_numero, tirage_etoile, tirage_win_numero, tirage_win_etoile, montant_tirage } = tirageData;
  
  try {
    const result = await pool.query(
      'INSERT INTO Tirage (pseudo, tirage_numero, tirage_etoile, date_tirage, tirage_win_numero, tirage_win_etoile, montant_tirage) VALUES ($1, $2, $3, NOW(), $4, $5, $6) RETURNING *',
      [pseudo, tirage_numero, tirage_etoile, tirage_win_numero, tirage_win_etoile, montant_tirage]
    );
    return result.rows[0]; // Retourne le tirage ajouté
  } catch (err) {
    throw new Error("Erreur lors de l'ajout du tirage");
  }
}

module.exports = {
  getAllTirages,
  addNewTirage,
};
