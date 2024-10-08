export class Tirage {
  pseudo: string;
  numeros: number[]; // Tableau pour stocker les 5 numéros
  etoiles: number[]; // Tableau pour stocker les 2 étoiles

  // Constructeur pour initialiser les numéros et étoiles
  constructor(pseudo: string, numeros: number[], etoiles: number[]) {
    this.pseudo = pseudo;
    this.numeros = numeros;
    this.etoiles = etoiles;
  }
}
