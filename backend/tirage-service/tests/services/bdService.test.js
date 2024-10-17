const bdService = require("../../services/bdService");
const pool = require("../../config/db");

// Mock de la connexion PostgreSQL
jest.mock("../../config/db");

describe("bdService", () => {
  describe("getAllTirages", () => {
    it("devrait retourner tous les tirages", async () => {
      const mockTirages = [
        { id: 1, pseudo: "user1" },
        { id: 2, pseudo: "user2" },
      ];

      pool.query.mockResolvedValue({ rows: mockTirages });

      const result = await bdService.getAllTirages();

      expect(pool.query).toHaveBeenCalledWith(expect.any(String)); // Vérifie que la requête SQL a été exécutée
      expect(result).toEqual(mockTirages); // Vérifie que le résultat correspond aux tirages mockés
    });

    it("devrait renvoyer une erreur en cas de problème", async () => {
      pool.query.mockRejectedValue(
        new Error("Erreur lors de la récupération des tirages"),
      );

      await expect(bdService.getAllTirages()).rejects.toThrow(
        "Erreur lors de la récupération des tirages",
      );
    });
  });

  describe("getFilteredTirages", () => {
    it("devrait retourner les tirages filtrés selon les critères", async () => {
      const filters = { pseudo: "test" };
      const mockFilteredTirages = [{ id: 1, pseudo: "test" }];

      pool.query.mockResolvedValue({ rows: mockFilteredTirages });

      const result = await bdService.getFilteredTirages(filters);

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual(mockFilteredTirages);
    });

    it("devrait renvoyer une erreur si la récupération échoue", async () => {
      pool.query.mockRejectedValue(
        new Error("Erreur lors de la récupération des tirages filtrés"),
      );

      await expect(bdService.getFilteredTirages({})).rejects.toThrow(
        "Erreur lors de la récupération des tirages filtrés",
      );
    });
  });

  describe("deleteTirage", () => {
    it("devrait supprimer un tirage avec succès", async () => {
      pool.query.mockResolvedValue();

      await bdService.deleteTirage(1);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM participation WHERE id = $1",
        [1],
      );
    });

    it("devrait renvoyer une erreur si la suppression échoue", async () => {
      pool.query.mockRejectedValue(
        new Error("Erreur lors de la suppression du tirage"),
      );

      await expect(bdService.deleteTirage(1)).rejects.toThrow(
        "Erreur lors de la suppression du tirage",
      );
    });
  });

  describe("pseudoExists", () => {
    it("devrait retourner true si le pseudo existe", async () => {
      pool.query.mockResolvedValue({ rows: [{ count: "1" }] });

      const result = await bdService.pseudoExists("testUser");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) FROM utilisateur WHERE LOWER(pseudo) = LOWER($1)",
        ["testUser"],
      );
      expect(result).toBe(true);
    });

    it("devrait retourner false si le pseudo n'existe pas", async () => {
      pool.query.mockResolvedValue({ rows: [{ count: "0" }] });

      const result = await bdService.pseudoExists("testUser");

      expect(result).toBe(false);
    });

    it("devrait renvoyer une erreur si la vérification échoue", async () => {
      pool.query.mockRejectedValue(
        new Error("Erreur lors de la vérification du pseudo"),
      );

      await expect(bdService.pseudoExists("testUser")).rejects.toThrow(
        "Erreur lors de la vérification du pseudo",
      );
    });
  });

  describe("getPseudos", () => {
    it("devrait retourner tous les pseudos", async () => {
      const mockPseudos = [{ pseudo: "user1" }, { pseudo: "user2" }];

      pool.query.mockResolvedValue({ rows: mockPseudos });

      const result = await bdService.getPseudos();

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM utilisateur");
      expect(result).toEqual(mockPseudos);
    });

    it("devrait renvoyer une erreur si la récupération échoue", async () => {
      pool.query.mockRejectedValue(
        new Error("Erreur lors de la récupération des pseudos"),
      );

      await expect(bdService.getPseudos()).rejects.toThrow(
        "Erreur lors de la récupération des pseudos",
      );
    });
  });

  describe("saveTirage", () => {
    let client;

    beforeEach(() => {
      client = {
        query: jest.fn(),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(client);
    });

    it("devrait annuler la transaction en cas d'erreur", async () => {
      client.query.mockRejectedValueOnce(new Error("Erreur transaction"));

      await expect(
        bdService.saveTirage(
          [],
          1000,
          { numeros: [1, 2, 3], etoiles: [4, 5] },
          10,
        ),
      ).rejects.toThrow(
        "Erreur lors de l'enregistrement des tirages et participations",
      );

      expect(client.query).toHaveBeenCalledWith("ROLLBACK"); // Vérifie que le rollback a été appelé
      expect(client.release).toHaveBeenCalled(); // Le client doit être libéré à la fin
    });
  });
});
