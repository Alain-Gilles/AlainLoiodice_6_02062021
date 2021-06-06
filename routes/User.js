// on a besoin d'express afin de créer un router
//
const express = require("express");
//
// on creait le router avec la fonction Router d'express
//
const router = express.Router();
//
// importation du controller pour associer les fonctions aux différentes routes
//
const userCtrl = require("../controllers/User");
//
// on créait deux routes POST
// le premier sera à /signup et on va utiliser la méthode signup
// le second à /login et on va utiliser la méthode login
// ce sera des routes POST car le fontend va aussi envoyer des informations
// l'adresse mail et le mot de passe
//
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
//
// on exporte ce router, comme cela on peut l'importer dans app.js
//
module.exports = router;
