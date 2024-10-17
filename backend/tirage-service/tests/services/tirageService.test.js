// tirageService.test.js
const {
  classerTirages,
  classerPosition,
  calculerGainsParPosition,
} = require("../../services/tirageService");

describe("Tirage Service Tests", () => {
  describe("classerTirages", () => {
    test("devrait trier les tirages correctement en fonction des numéros et étoiles correspondants", () => {
      const tirages = [
        { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
        { numeros: [1, 2, 3, 9, 10], etoiles: [1, 3] },
      ];
      const tirageWin = { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] };
      const result = classerTirages(tirages, tirageWin);

      // Vérifiez que le tri fonctionne comme attendu
      expect(result[0].numeros).toEqual([1, 2, 3, 4, 5]);
      expect(result[0].etoiles).toEqual([1, 2]);
    });
  });

  describe("classerPosition", () => {
    test("devrait attribuer les bonnes positions selon les scores", () => {
      const tirages = [
        { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
        { numeros: [1, 2, 3, 9, 10], etoiles: [1, 3] },
      ];
      const tirageWin = { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] };
      const classement = classerTirages(tirages, tirageWin);
      const result = classerPosition(classement, tirageWin);

      // Vérifier que la première position est correcte
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2);
    });
  });

  describe("calculerGainsParPosition", () => {
    test("devrait calculer correctement les gains", () => {
      const positions = [1, 2, 3];
      const montant = 1000;
      const result = calculerGainsParPosition(positions, montant);

      // Testez que les gains sont calculés correctement
      expect(result[0]).toBeGreaterThan(result[1]); // Le premier devrait gagner plus
      expect(result[1]).toBeGreaterThan(result[2]); // Le deuxième devrait gagner plus que le troisième
    });

    test("devrait calculer les gains correctement avec moins de 10 positions", () => {
      const positions = [1, 2];
      const montant = 1000;
      const result = calculerGainsParPosition(positions, montant);

      expect(result.length).toBe(2);
      expect(result[0]).toBeGreaterThan(result[1]);
    });
  });
});
