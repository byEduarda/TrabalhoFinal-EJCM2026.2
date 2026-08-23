import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

(() => {
  const keysDir = path.join(__dirname, "..", "..", "keys");

  if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });

  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(path.join(keysDir, "id_rsa_pub.pem"), keyPair.publicKey);
  fs.writeFileSync(path.join(keysDir, "id_rsa_priv.pem"), keyPair.privateKey);

  console.log("Keys generated successfully!");
})();
