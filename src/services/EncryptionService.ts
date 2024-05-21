const crypto = require("crypto");
class EncryptionService {
  public static encrypt(text: string): string {
    const key: string | undefined = process.env.AES_ENCRYPTION_KEY;
    const iv: string | undefined = process.env.IV;
    if (key && iv) {
      const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(key, "hex"),
        Buffer.from(iv, "hex")
      );
      let encrypted: string = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    }
    return text;
  }

  public static decrypt(text: string): string {
    const key: string | undefined = process.env.AES_ENCRYPTION_KEY;
    const iv: string | undefined = process.env.IV;
    if (key && iv) {
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(key, "hex"),
        Buffer.from(iv, "hex")
      );

      let decrypted: string = decipher.update(text, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    }
    return text;
  }
}
export default EncryptionService;
