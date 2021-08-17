const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { accessTokenPrivateKey } = require("../config/secrets");

function generateHash(password) {
  return bcrypt.hash(password, 12);
}

function generateLoginToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };

  const options = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, accessTokenPrivateKey, options);
}

function checkPasswordValidity(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  generateHash,
  generateLoginToken,
  checkPasswordValidity,
};
