const Users = require("./authModel");

const {
  generateHash,
  generateLoginToken,
  checkPasswordValidity,
} = require("../../helpers/auth");
const { intToBool } = require("../../helpers/general");
const { registrationSchema, loginSchema } = require("../../helpers/validators");
const { sendVerificationEmail } = require("../../helpers/emailVerification");

const {
  validateObjects,
  checkIfRegValueTaken,
  validateVerifToken,
} = require("../middlewares");

const router = require("express").Router();

async function registrationController(req, res) {
  const { email, username, password } = req.body;

  try {
    const passwordHash = await generateHash(password);

    const newUser = await Users.insert({
      email,
      username,
      password: passwordHash,
    });

    await sendVerificationEmail(newUser.email);

    res.status(201).json({
      message: "New user created.",
      data: { ...newUser, isVerified: intToBool(newUser.isVerified) },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: err.message });
  }
}

async function loginController(req, res) {
  const { email, username, password } = req.body;

  // Allows login with either email or username
  const filterParam = { [username ? "username" : "email"]: username || email };

  try {
    const userObj = await Users.findBy(filterParam).first();

    if (!userObj) {
      return res.status(401).json({ message: "User does not exist" });
    } else {
      const isPasswordValid = await checkPasswordValidity(
        password,
        userObj.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      } else if (!userObj.isVerified) {
        return res.status(403).json({ message: "Email not verified yet" });
      } else {
        const token = generateLoginToken({
          ...userObj,
          isVerified: intToBool(userObj.isVerified),
        });

        res.status(200).json({ message: "Login successful", token });
      }
    }
  } catch (err) {
    // console.error(err.message);

    res.status(500).json({ message: err.message });
  }
}

async function verificationController(req, res) {
  const { email } = req.body;

  try {
    await Users.updateVerifStatus(email);

    res.status(200).json({ message: "Account verified. Proceed to login" });
  } catch (err) {
    // console.error(err.message);

    res.status(500).json({ message: err.message });
  }
}

// Register endpoint
router.post(
  "/register",
  [validateObjects(registrationSchema), checkIfRegValueTaken],
  registrationController
);

// Login endpoint
router.post("/login", validateObjects(loginSchema), loginController);

// verify email
router.post("/verify", validateVerifToken, verificationController);

module.exports = router;
