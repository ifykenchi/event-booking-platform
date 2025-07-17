import bcrypt from "bcrypt";
import { hash, isMatch } from "../../../src/utilities/hash.util";

jest.mock("bcrypt");

describe("Hash Utility", () => {
  const mockPassword = "testPassword123";
  const mockHashedPassword = "$2b$10$mockhashmockhashmockhashmo";

  describe("hash()", () => {
    it("exists", () => {
    expect(hash).toBeDefined();
    })

    it("should generate a salt and hash the password", async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("mockedSalt");
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const result = await hash(mockPassword);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, "mockedSalt");
      expect(result).toBe(mockHashedPassword);
    });

    it("should throw an error if hashing fails", async () => {
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error("Hashing failed"));

      await expect(hash(mockPassword)).rejects.toThrow("Hashing failed");
    });
  });

  describe("isMatch()", () => {
    it("exists", () => {
        expect(isMatch).toBeDefined();
    })

    it("should return true for matching passwords", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await isMatch(mockPassword, mockHashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
      expect(result).toBe(true);
    });

    it("should return false for non-matching passwords", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await isMatch("wrongPassword", mockHashedPassword);
      expect(result).toBe(false);
    });

    it("should throw an error if comparison fails", async () => {
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error("Comparison failed"));

      await expect(isMatch(mockPassword, mockHashedPassword))
        .rejects.toThrow("Comparison failed");
    });

    it("should handle empty password inputs", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await isMatch("", mockHashedPassword);
      expect(result).toBe(false);
    });
  });
});