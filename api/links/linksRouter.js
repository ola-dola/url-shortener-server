const Links = require("./linksModel");
const { validateObjects } = require("../middlewares");
const { linkSchema } = require("../../helpers/validators");
const { generateUrlHash } = require("../../helpers/links");

const router = require("express").Router({ mergeParams: true });

router.post("/", validateObjects(linkSchema), async (req, res) => {
  const { full_url } = req.body;
  const { userId } = req.params;

  // Check hash doesnt exist, or redo.
  const urlHash = await generateUrlHash();

  const finalObj = {
    full_url,
    short_alias: urlHash,
    user_id: userId,
  };

  try {
    const data = await Links.insert(finalObj);

    res.status(201).json({ message: "Short link created", data });
  } catch (err) {
    res.status(500).json({ message: "Error creating new short link" });
  }
});

module.exports = router;
