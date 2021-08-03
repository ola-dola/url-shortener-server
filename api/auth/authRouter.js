const Users = require("./authModel");
const { generateHash } = require("../../helpers/auth");
const { registrationSchema } = require("./validators");
const { validateObjects, checkIfValuesExists } = require("../middlewares/auth");

const router = require("express").Router();

async function handleRegistration(req, res) {
  const { email, username, password } = req.body;

  try {
    const passwordHash = await generateHash(password);

    const data = await Users.insert({
      email,
      username,
      password: passwordHash,
    });

    res.status(201).json({ message: "New user created", data: data });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: err.message });
  }
}

// Register endpoint
router.post(
  "/register",
  validateObjects(registrationSchema),
  checkIfValuesExists,
  handleRegistration
);

module.exports = router;
