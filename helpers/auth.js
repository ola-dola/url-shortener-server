const bcrypt = require("bcryptjs");

function generateHash(password) {
  return bcrypt.hash(password, 12);
}

module.exports = {
  generateHash,
};
