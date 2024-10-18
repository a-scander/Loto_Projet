const pool = require("../config/db"); // Importer la connexion PostgreSQL

// Fonction pour récupérer tous les tirages
async function getAllTirages() {
  try {
    const result = await pool.query(`
    SELECT 
      p.id AS "id", 
      u.pseudo AS "Pseudo", 
      array_to_string(p.tirage_numero, ', ') AS "Numéro joué", 
      array_to_string(p.tirage_etoile, ', ') AS "Étoile joué", 
      to_char(t.date_tirage, 'DD/MM/YYYY') AS "Date", 
      array_to_string(t.tirage_win_numero, ', ') AS "Numéro gagnant", 
      array_to_string(t.tirage_win_etoile, ', ') AS "Étoile gagnant", 
      p.montant_gagne AS "€",
      t.nombre_participants AS "Nombre de participants",  
      t.montant_tirage AS "Montant du tirage"  
    FROM participation p
    JOIN utilisateur u ON p.utilisateur_id = u.id
    JOIN tirage t ON p.tirage_id = t.id
    ORDER BY u.pseudo;
  `);
    return result.rows; // Retourne les lignes récupérées
  } catch (err) {
    throw new Error("Erreur lors de la récupération des tirages");
  }
}

async function getFilteredTirages(filters) {
  const {
    pseudo = "",
    numJoue = "",
    etoileJoue = "",
    dateMin = "",
    dateMax = "",
    numGagnant = "",
    etoileGagnant = "",
    minAmount = "",
    maxAmount = "",
  } = filters;

  let query = `
    SELECT 
      p.id AS "id", 
      u.pseudo AS "Pseudo", 
      array_to_string(p.tirage_numero, ', ') AS "Numéro joué", 
      array_to_string(p.tirage_etoile, ', ') AS "Étoile joué", 
      to_char(t.date_tirage, 'DD/MM/YYYY') AS "Date", 
      array_to_string(t.tirage_win_numero, ', ') AS "Numéro gagnant", 
      array_to_string(t.tirage_win_etoile, ', ') AS "Étoile gagnant", 
      p.montant_gagne AS "€",
      t.nombre_participants AS "Nombre de participants",  
      t.montant_tirage AS "Montant du tirage" 
    FROM participation p
    JOIN utilisateur u ON p.utilisateur_id = u.id
    JOIN tirage t ON p.tirage_id = t.id
    WHERE 1=1
  `;

  const queryParams = [];

  // Appliquer les filtres dynamiquement
  if (pseudo) {
    query += ` AND LOWER(u.pseudo) LIKE $${queryParams.length + 1}`;
    queryParams.push(`%${pseudo.toLowerCase()}%`);
  }

  if (numJoue) {
    // Conversion de la chaîne en tableau de numéros
    const numJoueArray = numJoue.split(",").map((num) => num.trim());
    if (numJoueArray.length > 0) {
      query += ` AND p.tirage_numero @> $${queryParams.length + 1}`;
      queryParams.push(numJoueArray); // Utiliser l'opérateur @> pour la comparaison
    }
  }

  if (etoileJoue) {
    // Conversion de la chaîne en tableau d'étoiles
    const etoileJoueArray = etoileJoue.split(",").map((num) => num.trim());
    if (etoileJoueArray.length > 0) {
      query += ` AND p.tirage_etoile @> $${queryParams.length + 1}`;
      queryParams.push(etoileJoueArray); // Utiliser l'opérateur @> pour la comparaison
    }
  }

  if (dateMin) {
    query += ` AND t.date_tirage >= $${queryParams.length + 1}`;
    queryParams.push(dateMin);
  }

  if (dateMax) {
    query += ` AND t.date_tirage <= $${queryParams.length + 1}`;
    queryParams.push(dateMax);
  }

  if (numGagnant) {
    // Conversion de la chaîne en tableau de numéros gagnants
    const numGagnantArray = numGagnant.split(",").map((num) => num.trim());
    if (numGagnantArray.length > 0) {
      query += ` AND t.tirage_win_numero @> $${queryParams.length + 1}`;
      queryParams.push(numGagnantArray); // Utiliser l'opérateur @> pour la comparaison
    }
  }

  if (etoileGagnant) {
    // Conversion de la chaîne en tableau d'étoiles gagnantes
    const etoileGagnantArray = etoileGagnant
      .split(",")
      .map((num) => num.trim());
    if (etoileGagnantArray.length > 0) {
      query += ` AND t.tirage_win_etoile @> $${queryParams.length + 1}`;
      queryParams.push(etoileGagnantArray); // Utiliser l'opérateur @> pour la comparaison
    }
  }

  if (minAmount) {
    query += ` AND p.montant_gagne >= $${queryParams.length + 1}`;
    queryParams.push(minAmount);
  }

  if (maxAmount) {
    query += ` AND p.montant_gagne <= $${queryParams.length + 1}`;
    queryParams.push(maxAmount);
  }
    // Ajout de l'ORDER BY sur le pseudo
    query += ` ORDER BY u.pseudo`;
  // Exécuter la requête et renvoyer les résultats
  try {
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (err) {
    throw new Error("Erreur lors de la récupération des tirages filtrés");
  }
}

async function deleteTirage(tirageId) {
  try {
    await pool.query("DELETE FROM participation WHERE id = $1", [tirageId]);
  } catch (err) {
    throw new Error("Erreur lors de la suppression du tirage");
  }
}
// Fonction pour vérifier si un pseudo existe
async function pseudoExists(pseudo) {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM utilisateur WHERE LOWER(pseudo) = LOWER($1)",
      [pseudo],
    );
    return result.rows[0].count > 0; // Renvoie true si le pseudo existe
  } catch (err) {
    throw new Error("Erreur lors de la vérification du pseudo");
  }
}
async function getPseudos() {
  try {
    const result = await pool.query("SELECT * FROM utilisateur"); // Requête SQL
    return result.rows; // Retourner uniquement les pseudos
  } catch (error) {
    console.error("Erreur lors de la récupération des pseudos:", error);
    throw error;
  }
}

// Service pour enregistrer les tirages et les informations supplémentaires en base de données
async function saveTirage(
  tirages,
  montantPartie,
  tirageGagnant,
  totalParticipants,
) {
  const client = await pool.connect(); // Utilisation d'une transaction pour garantir la cohérence des données

  try {
    // Démarrer la transaction
    await client.query("BEGIN");

    // 1. Insérer le tirage gagnant avec la date d'aujourd'hui, le montant total et le nombre de participants
    const now = new Date(); // Date actuelle
    const insertTirageResult = await client.query(
      `
      INSERT INTO tirage (date_tirage, tirage_win_numero, tirage_win_etoile, montant_tirage, nombre_participants)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `,
      [
        now,
        tirageGagnant.numeros,
        tirageGagnant.etoiles,
        montantPartie,
        totalParticipants,
      ],
    );

    // Récupérer l'ID du tirage inséré pour l'utiliser dans les participations
    const tirageId = insertTirageResult.rows[0].id;

    // 2. Pour chaque tirage manuel, enregistrer la participation
    for (const tirage of tirages) {
      // Vérifier si le pseudo existe dans la table utilisateur
      let utilisateurId;
      const checkUserResult = await client.query(
        `
        SELECT id FROM utilisateur WHERE pseudo = $1;
      `,
        [tirage.pseudo],
      );

      if (checkUserResult.rows.length > 0) {
        // Si le pseudo existe, récupérer l'id
        utilisateurId = checkUserResult.rows[0].id;
      } else {
        // Si le pseudo n'existe pas, l'insérer et récupérer l'id
        const insertUserResult = await client.query(
          `
          INSERT INTO utilisateur (pseudo) VALUES ($1) RETURNING id;
        `,
          [tirage.pseudo],
        );

        utilisateurId = insertUserResult.rows[0].id;
      }

      // 3. Insérer la participation avec l'utilisateur_id, le tirage_id, numéros, étoiles et gain
      await client.query(
        `
        INSERT INTO participation (utilisateur_id, tirage_id, tirage_numero, tirage_etoile, montant_gagne)
        VALUES ($1, $2, $3, $4, $5);
      `,
        [utilisateurId, tirageId, tirage.numeros, tirage.etoiles, tirage.gain],
      );
    }

    // Valider la transaction
    await client.query("COMMIT");
  } catch (err) {
    // En cas d'erreur, annuler la transaction
    await client.query("ROLLBACK");
    console.error(
      "Erreur lors de l'enregistrement des tirages et participations:",
      err,
    );
    throw new Error(
      "Erreur lors de l'enregistrement des tirages et participations",
    );
  } finally {
    client.release(); // Libérer le client de la transaction
  }
}

module.exports = {
  getAllTirages,
  getFilteredTirages,
  deleteTirage,
  pseudoExists,
  getPseudos,
  saveTirage,
};
