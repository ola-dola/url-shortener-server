const db = require("../../data/dbConfig");

async function insert(user) {
  const [id] = await db("users").insert(user);

  return findBy({ id }).first();
}

function findBy(filter) {
  return db("users").where(filter);
}

function updateVerifStatus(email) {
  return db("users").where({ email }).update({ isVerified: true });
}

module.exports = { insert, findBy, updateVerifStatus };
