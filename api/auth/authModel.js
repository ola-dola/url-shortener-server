const db = require("../../data/dbConfig");

async function insert(user) {
  const [id] = await db("users").insert(user);

  return findBy({ id }).first();
}

function findBy(filter) {
  return db("users").where(filter);
}

module.exports = { insert, findBy };
