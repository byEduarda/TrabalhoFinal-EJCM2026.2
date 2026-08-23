import * as fs from "node:fs";
import * as path from "node:path";

import passport from "passport";
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { prisma } from "../config/prisma";

const keysDir = path.resolve(__dirname, "..", "..", "keys");

const PUB_KEY_PATH = path.join(keysDir, "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, "utf-8");

type JwtPayload = {
  sub: string;
};

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PUB_KEY,
      algorithms: ["RS256"],
      ignoreExpiration: false,
    },
    async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        const userId = String(payload.sub);

        if (!userId) return done(null, false);

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

export const authenticateJWT = passport.authenticate("jwt", {
  session: false,
});
