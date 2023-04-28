const express = require("express");
const router = express.Router();
const passwordResetController = require("../controller/resetPassword");

// Route pour l'envoi du mail de réinitialisation de mot de passe
router.post("/forgot-password", passwordResetController.sendPasswordResetLink);

// Route pour la saisie d'un nouveau mot de passe et sa confirmation
router.post("/reset-password/:token", passwordResetController.resetPassword);

module.exports = router;
