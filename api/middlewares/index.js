const jwt = require("jsonwebtoken");
const Joi = require("joi");

const {
  accessTokenPrivateKey,
  verifTokenKey,
} = require("../../config/secrets");

const { findBy } = require("../auth/authModel");
const { findBy: findLinkBy } = require("../links/linksModel");

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

function validateAccessToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: "No credentials provided" });
  }

  const callback = (err, decodedToken) => {
    if (err) {
      if (err.name && err.name == "TokenExpiredError") {
        res
          .status(401)
          .json({ message: "Token expired. Login again to continue" });
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  };

  jwt.verify(token, accessTokenPrivateKey, callback);
}

async function validateShortLink(req, res, next) {
  // checks if url path is of the right shape

  const path = req.originalUrl.slice(1); // remove the leading '/'

  const schema = Joi.object({
    hash: Joi.string().alphanum().min(5).max(7),
  });

  try {
    const { hash } = await schema.validateAsync({ hash: path });

    req.validHash = hash;

    next();
  } catch (err) {
    res.status(404).send(`<h1>Error page. Seems you're lost (^_^)</h1>`);
  }
}

async function findFullUrl(req, res, next) {
  // checks if hash exists in database

  try {
    const { full_url } = await findLinkBy({
      short_alias: req.validHash,
    }).first();

    req.fullUrl = full_url;

    next();
  } catch (err) {
    res.status(404).send(`<h1>Error page. Seems you're lost (^_^)</h1>`);
  }
}

async function validateVerifToken(req, res, next) {
  const { token, email } = req.body;

  if (!token || !email) {
    return res.status(400).json({ message: "Missing required credentials" });
  }


  const callback = (err, tokenDecoded) => {
    if (err) {
      if (err.name && err.name == "TokenExpiredError") {
        // If token has expired
        res
          .status(401)
          .json({ message: "Token expired. Account verification failed" });
      } else {
        // Other reasons e.g invalid signature
        res
          .status(401)
          .json({ message: "Invalid token. Account verification failed" });
      }
    } else {

      if (tokenDecoded.email !== email) {
        // If the email sent does not match the decoded email.
        // Which would mean attempt to use a valid token to verify another account.
        return res
          .status(401)
          .json({ message: "Invalid token. Account verification failed" });
      }

      // both token and email is valid.
      next();
    }
  };

  jwt.verify(token, verifTokenKey, callback);

}

module.exports = {
  findFullUrl,
  validateObjects,
  validateShortLink,
  validateAccessToken,
  validateVerifToken,
  checkIfRegValueTaken,
};