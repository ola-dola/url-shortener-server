const Links = require("./linksModel");
const { validateObjects } = require("../middlewares");
const { linkSchema } = require("../../helpers/validators");
const { generateUrlHash } = require("../../helpers/links");

const router = require("express").Router({ mergeParams: true });

router.post("/", validateObjects(linkSchema), async (req, res) => {
  const { full_url } = req.body;
  const { userId } = req.params;

  const urlHash = await generateUrlHash();

  const linkObj = {
    full_url,
    short_alias: urlHash,
    user_id: userId,
  };

  try {
    const newLink = await Links.insert(linkObj);

    res.status(201).json({ message: "Short link created", newLink });
  } catch (err) {
    res.status(500).json({ message: "Error creating new short link" });
  }
});

// Get all links by user
router.get("/", async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await Links.getByUser(userId);

    res.status(200).json({ message: "Successful", data });
  } catch (err) {
    res.status(500).json({ message: "Error fetching short links" });
  }
});

module.exports = router;
