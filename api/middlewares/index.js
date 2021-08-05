const jwt = require("jsonwebtoken");
const { privateKey } = require("../../config/secrets");
const { findBy } = require("../auth/authModel");

const validateObjects = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);

    next();
  } catch (err) {
    // console.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const checkIfRegValueTaken = async (req, res, next) => {
  // Checks whether email/username already in use during registration
  const { email, username } = req.body;

  const responseHandler = (value) => {
    return res.status(400).json({ message: `${value} already in use` });
  };

  try {
    const usernameTaken = await findBy({ username }).first();
    if (usernameTaken) {
      return responseHandler("Username");
    }

    const emailTaken = await findBy({ email }).first();
    if (emailTaken) {
      return responseHandler("Email");
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Error creating new user" });
  }
};

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: "No credentials provided" });
  }

  const callback = (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  };

  jwt.verify(token, privateKey, callback);
}

module.exports = {
  verifyToken,
  validateObjects,
  checkIfRegValueTaken,
};
