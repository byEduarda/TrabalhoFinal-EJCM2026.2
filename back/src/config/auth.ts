import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import jsonwebtoken from "jsonwebtoken";

const keysDir = path.resolve(__dirname, "..", "..", "keys");

const PRIV_KEY_PATH = path.join(keysDir, "id_rsa_priv.pem");
const PUB_KEY_PATH = path.join(keysDir, "id_rsa_pub.pem");

const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf-8");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf-8");

const generatePassword = (password: string) => {
  try {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    return { salt: salt, hash: hash };
  } catch (error) {
    throw new Error("Error generating password");
  }
};

const checkPassword = (password: string, hash: string, salt: string) => {
  try {
    const hashFromRequest = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    return hashFromRequest === hash;
  } catch (error) {
    throw new Error("Error checking password");
  }
};

const generateJWT = (userId: number) => {
  try {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    };

    const encondedPayload = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: "7d", algorithm: "RS256" });

    return encondedPayload;
  } catch (error) {
    throw new Error("Error generating token");
  }
};

const decodeJWT = (token: string) => {
  try {
    const decodedPayload = jsonwebtoken.verify(token, PUB_KEY, { algorithms: ["RS256"] });

    return decodedPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export default {
  generatePassword,
  checkPassword,
  generateJWT,
  decodeJWT,
};

