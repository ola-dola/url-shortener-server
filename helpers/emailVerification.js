const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const { privateKey } = require("../config/secrets");

async function sendVerificationEmail(recipient) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const hostUrl = process.env.HOST_URL;

  const token = await generateVerificationToken(recipient);

  const msg = {
    to: recipient,
    from: "URL Shortener Admin <oredolaolamide@gmail.com>",
    subject: "Email Verification",
    html: `<p>
                Click the following link to verify your email and complete account setup.
                ${hostUrl}/verification?token=${token}&email=${recipient}
              </p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

async function generateVerificationToken(email) {
  const payload = {
    sub: email,
    email,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, privateKey, options);
}

module.exports = { sendVerificationEmail };
