const crypto = require('crypto');
const fs = require('fs');

const ALGORITHM = 'aes-256-cbc';

/**
 * Derive a 32-byte key from JWT_SECRET (or a fallback string).
 */
const getEncryptionKey = () => {
  const secret = process.env.JWT_SECRET || 'eT3ck_Pr0j3ct_M4n4g3m3nt_S3cr3t_K3y_2024!@#$%^&*';
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypt a file buffer with AES-256-CBC.
 * The output starts with the 16-byte random IV, followed by the ciphertext.
 */
function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(16);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

/**
 * Decrypt a file buffer. If decryption fails (e.g. legacy plain text files),
 * fallback to returning the original buffer.
 */
function decryptBuffer(buffer) {
  try {
    if (buffer.length < 16) {
      return buffer; // Too short to be encrypted, return as is
    }
    const iv = buffer.slice(0, 16);
    const ciphertext = buffer.slice(16);
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted;
  } catch (error) {
    // Fallback: If decryption fails, treat it as legacy plain text
    return buffer;
  }
}

/**
 * Encrypt a file in-place on the disk.
 */
function encryptFileInPlace(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath);
  const encrypted = encryptBuffer(content);
  fs.writeFileSync(filePath, encrypted);
}

/**
 * Decrypt a file on disk and return its content as a decrypted buffer.
 */
function decryptFileToBuffer(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }
  const content = fs.readFileSync(filePath);
  return decryptBuffer(content);
}

module.exports = {
  encryptBuffer,
  decryptBuffer,
  encryptFileInPlace,
  decryptFileToBuffer
};
