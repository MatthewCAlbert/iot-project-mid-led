import crypto from 'crypto';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../data/entities/user.entity';

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password: string, hash: string, salt: string) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password: string) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

export type AuthJwtPayload = JwtPayload & {
  username: string
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user: User) {

  const expiresIn = config.jwt.accessExpiration;

  const payload = {
    username: user.username,
    sub: user.id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, config.jwt.secret, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}


export default {
  validPassword, genPassword, issueJWT
}