const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports.sendConfirmationEmail = async (email) => {
  transport
    .sendMail({
      from: `${process.env.SMTP_USER}`,
      to: email,
      secure: false,
      subject: "confirmation product",
      html: `<h1>Confirmation Command</h1>
            <h2>HI SIR</h2>
            <p>your command has already delivered </p>
            `,
    })
    .catch((err) => console.log(err));
};
