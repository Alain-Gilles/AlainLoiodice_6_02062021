// on a besoin d'express afin de créer un router
//
const express = require("express");
//
// on creait le router avec la fonction Router d'express
//
const router = express.Router();
//
// importation du controller pour associer les fonctions aux différentes routes User
//
const userCtrl = require("../controllers/User");
//
// on créait deux routes POST
//
// Création d'un utilisateur
//
// La première route verbe POST  Paramètres /api/auth/signup
// Le chemin principal a été défini dans app.js (app.use("/api/auth", userRoutes);)
// le chemin sera donc ici /signup
// Corps de la demande {email:string, password: string}
// Reponse attendue {message:string}
// Fonction : Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base de données
//
// Connexion d'un utilisateur
//
// La seconde route verbe POST  Paramètres /api/auth/login
// Le chemin principal a été défini dans app.js (app.use("/api/auth", userRoutes);)
// le chemin sera donc ici /login
// Corps de la demande {email:string, password: string}
// Reponse attendue {userID:string, token:string}
// Fonction : Vérifie les informations d'identification de l'utilisateur
// en renvoyant l'identifiant userID depuis la base de données et un jeton
// Web JSON signé contenant également l'identifiant userID
//
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
//
// on exporte ce router, comme cela on peut l'importer dans app.js
//
module.exports = router;
