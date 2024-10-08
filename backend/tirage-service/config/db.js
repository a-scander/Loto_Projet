const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Remplace par ton utilisateur PostgreSQL
  host: 'localhost', // L'adresse de ton serveur PostgreSQL
  database: 'projetloto', // Remplace par le nom de ta base de données
  password: 'root', // Remplace par ton mot de passe PostgreSQL
  port: 5432, // Le port par défaut de PostgreSQL
});

// Test de la connexion
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erreur de connexion à la base de données PostgreSQL', err.stack);
  }
  console.log('Connexion réussie à PostgreSQL !');
  release();
});

module.exports = pool;