const { findBy } = require("../api/links/linksModel");

async function generateUrlHash() {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const possibleStartIdx = [2, 3, 4, 5];
  const possibleLength = [6, 7];
  const possibleRadix = [33, 34, 35, 36];

  const genHash = () => {
    let startIndex = possibleStartIdx[getRandomInt(4)],
      hashLength = possibleLength[getRandomInt(2)],
      radix = possibleRadix[getRandomInt(4)];

    return Math.random().toString(radix).substr(startIndex, hashLength);
  };

  let hash = genHash();

  let linkObj = await findBy({ short_alias: hash }).first();

  if (linkObj) {
    while (linkObj) {
      // generate new hash until it's new
      hash = genHash();
      linkObj = await findBy({ short_alias: hash }).first();
    }
  }

  return hash;
}

module.exports = {
  generateUrlHash,
};
