const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");

exports.sendPasswordResetLink = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res
      .status(404)
      .json({ message: "Cet email n'est pas associé à un compte." });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // Expiration en une heure
  await user.save();

  const resetPasswordLink = `www.salta3.com/reset-password/${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Réinitialisation de mot de passe",
    html: `
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien suivant pour le réinitialiser : <a href="${resetPasswordLink}">${resetPasswordLink}</a>.</p>
        <p>Ce lien expire dans une heure.</p>
        <p>Cordialement,</p>
        <p>L'équipe de votre application.</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      message:
        "Un email de réinitialisation de mot de passe a été envoyé à votre adresse email.",
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Le lien de réinitialisation de mot de passe est invalide ou a expiré.",
      });
    }

    user.hash_password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Le mot de passe a été réinitialisé avec succès." });
  } catch (error) {
    return next(error);
  }
};
