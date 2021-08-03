const { findBy } = require("../auth/authModel");

const validateObjects = (schema) => async (req, res, next) => {
  const { username, password, repeat_password, email } = req.body;

  try {
    await schema.validateAsync({ username, password, repeat_password, email });

    next();
  } catch (err) {
    // console.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const checkIfValuesExists = async (req, res, next) => {
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

module.exports = {
  validateObjects,
  checkIfValuesExists,
};
