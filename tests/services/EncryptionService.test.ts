import EncryptionService from "../../src/services/EncryptionService";

describe("EncryptionService", () => {
  describe("encrypt", () => {
    it("should encrypt text", () => {
      // Mock process.env
      process.env.AES_ENCRYPTION_KEY =
        "2b7b4010d251a423fcb8f0e001054947984b168a13530aae9bf86e2dd49c5089";
      process.env.IV = "3abced922499f896a83d6f979c608c95";

      const encryptedText = EncryptionService.encrypt("hello");

      // Assert the encrypted text
      expect(encryptedText).toEqual("2c4c861dce9a87a778f607849241b154");
      expect(encryptedText).not.toEqual("hello"); // Ensure text is encrypted
    });

    it("should return original text if environment variables are not set", () => {
      delete process.env.AES_ENCRYPTION_KEY;
      delete process.env.IV;

      const originalText = "hello";
      const encryptedText = EncryptionService.encrypt(originalText);

      // Assert the encrypted text
      expect(encryptedText).toEqual(originalText);
    });
  });

  describe("decrypt", () => {
    it("should decrypt encrypted text", () => {
      // Mock process.env
      process.env.AES_ENCRYPTION_KEY =
        "2b7b4010d251a423fcb8f0e001054947984b168a13530aae9bf86e2dd49c5089";
      process.env.IV = "3abced922499f896a83d6f979c608c95";

      const encryptedText = "2c4c861dce9a87a778f607849241b154";
      const decryptedText = EncryptionService.decrypt(encryptedText);

      // Assert the decrypted text
      expect(decryptedText).toEqual("hello");
    });

    it("should return original text if environment variables are not set", () => {
      delete process.env.AES_ENCRYPTION_KEY;
      delete process.env.IV;

      const originalText = "hello";
      const decryptedText = EncryptionService.decrypt(originalText);

      // Assert the decrypted text
      expect(decryptedText).toEqual(originalText);
    });
  });
});
