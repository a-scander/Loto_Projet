// Fonction pour classer les tirages en fonction du tirage gagnant
function classerTirages(tirages, tirageWin) {
    const tiragesTries = tirages.sort((tirageA, tirageB) => {
        const comparisonA = scoreInclude(tirageA, tirageWin);
        const comparisonB = scoreInclude(tirageB, tirageWin);

        // Comparaison par nombre de numéros, puis par étoiles en cas d'égalité
        if (comparisonA.numMatching !== comparisonB.numMatching) {
            return comparisonB.numMatching - comparisonA.numMatching; // Priorité aux numéros
        } else if (comparisonA.etoilesMatching !== comparisonB.etoilesMatching) {
            return comparisonB.etoilesMatching - comparisonA.etoilesMatching; // Si mêmes numéros, on compare les étoiles
        } else {
            // Si ex aequo sur numéros et étoiles, on compare la distance avec le tirage gagnant
            return scoreNonInclude(tirageA, tirageWin) - scoreNonInclude(tirageB, tirageWin);
        }
    });




    return tiragesTries;
}

// Fonction utilitaire pour compter combien de numéros et étoiles correspondent
function scoreInclude(tirage, tirageWin) {
    const numMatching = tirage.numeros.filter(num => tirageWin.numeros.includes(num)).length; // Correspondance des numéros
    const etoilesMatching = tirage.etoiles.filter(star => tirageWin.etoiles.includes(star)).length; // Correspondance des étoiles

    // Retourner un objet avec les deux types de correspondances
    return { numMatching, etoilesMatching };
}

// Fonction pour calculer la somme des écarts pour les numéros et étoiles non inclus
function scoreNonInclude(tirage, tirageWin) {
    const numNonMatching = tirage.numeros.filter(num => !tirageWin.numeros.includes(num));
    const numNonMatchingWin = tirageWin.numeros.filter(num => !tirage.numeros.includes(num));

    const etoileNonMatching = tirage.etoiles.filter(star => !tirageWin.etoiles.includes(star));
    const etoileNonMatchingWin = tirageWin.etoiles.filter(star => !tirage.etoiles.includes(star));

    let somme = 0;

    // Calcul de la somme des écarts pour les numéros
    if (numNonMatching.length > 0 && numNonMatchingWin.length > 0) {
        for (let i = 0; i < numNonMatching.length; i++) {
            for (let j = 0; j < numNonMatchingWin.length; j++) {
                somme += Math.abs(numNonMatching[i] - numNonMatchingWin[j]);
            }
        }
    }

    // Calcul de la somme des écarts pour les étoiles
    if (etoileNonMatching.length > 0 && etoileNonMatchingWin.length > 0) {
        for (let i = 0; i < etoileNonMatching.length; i++) {
            for (let j = 0; j < etoileNonMatchingWin.length; j++) {
                somme += Math.abs(etoileNonMatching[i] - etoileNonMatchingWin[j]);
            }
        }
    }

    return somme;
}


function classerPosition(tirages,tiragewin) {
    let indexActuel = 1;
    let tableauPosition = [];

    // Attribution de la position après tri avec une boucle for
    for (let index = 0; index < tirages.length; index++) {
        if (index === 0) {
            // Le premier tirage obtient toujours la première position
            tableauPosition[index] = indexActuel;
        } else {
            // Comparer le tirage courant avec le tirage précédent
            if (scoreNonInclude(tirages[index - 1], tiragewin) === scoreNonInclude(tirages[index],tiragewin)) {
                // Si les tirages ont le même score, ils ont la même position
                tableauPosition[index] = indexActuel;
            } else {
                // Si les tirages sont différents, on prend l'index + 1
                indexActuel = index + 1;
                tableauPosition[index] = indexActuel;
            }
        }
    }

    return tableauPosition;  // Retourne le tableau des positions
}

function calculerGainsParPosition(positions) {
  const TOTAL_GAINS = 3000000; // 3 millions d'euros à répartir

  // Barème de répartition selon la position
  const pourcentagesGains = {
    1: 40,
    2: 20,
    3: 12,
    4: 7,
    5: 6,
    6: 5,
    7: 4,
    8: 3,
    9: 2,
    10: 1,
  };

  let gains = new Array(positions.length).fill(0); // Initialiser un tableau de gains
if(positions.length <10){

let somme=0;
  for(let i=1 ;i<=positions.length;i++){
   somme += pourcentagesGains[i];
  
}
let pourcentageequilibre = 100/ somme; 

for(let i=1 ;i<=positions.length;i++){
  pourcentagesGains[i] = pourcentagesGains[i]*pourcentageequilibre;
 
}

}
  // Étape 1 : Créer un objet pour compter combien de joueurs sont à chaque position
  const positionCounts = {};
  positions.forEach((position) => {
    if (positionCounts[position]) {
      positionCounts[position]++;
    } else {
      positionCounts[position] = 1;
    }
  });

  // Étape 2 : Calculer les gains en tenant compte des égalités
  let currentPosition = 1; // Position actuelle dans le classement
  for (let i = 0; i < positions.length; ) {
    let nbJoueursMemePosition = positionCounts[currentPosition] || 0;

    if (nbJoueursMemePosition > 0) {
      // Étape 3 : Additionner les pourcentages pour les joueurs qui se partagent cette position
      let totalPourcentage = 0;
      for (let j = 0; j < nbJoueursMemePosition; j++) {
        totalPourcentage += pourcentagesGains[currentPosition + j] || 0;
      }

      // Étape 4 : Calculer le gain total et le diviser entre les joueurs
      const gainTotal = (TOTAL_GAINS * totalPourcentage) / 100;
      const gainParJoueur =
        Math.trunc((gainTotal / nbJoueursMemePosition) * 100) / 100;
      // Attribuer les gains aux joueurs
      for (let j = 0; j < nbJoueursMemePosition; j++) {
        gains[i + j] = gainParJoueur;
      }

      // Avancer l'index pour traiter les joueurs suivants
      i += nbJoueursMemePosition;
      currentPosition += nbJoueursMemePosition;
    } else {
      currentPosition++;
    }
  }

  return gains;
}




module.exports = {
    classerTirages,
    classerPosition,
    calculerGainsParPosition

};
