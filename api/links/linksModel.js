const db = require("../../data/dbConfig");

async function insert(link) {
  const [id] = await db("links").insert(link);

  return findBy({ id }).first();
}

function findBy(filter) {
  return db("links").where(filter);
}

function getByUser(userId) {
  return findBy({ user_id: userId });
}

module.exports = { insert, findBy, getByUser };
