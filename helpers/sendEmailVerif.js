const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(recipient, token) {
  const hostUrl = process.env.HOST_URL;

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

module.exports = { sendVerificationEmail };
