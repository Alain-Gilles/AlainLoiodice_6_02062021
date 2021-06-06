// schéma de données qui contient le schéma de données userSchema qui définit les utilisateurs
// Importation de mongoose
// Mongoose est un framework JavaScript couramment utilisé dans une application Node.js avec une base de données MongoDB.
// Mongoose est un outil de modélisation d'objets MongoDB conçu pour fonctionner dans un environnement asynchrone.
//
const mongoose = require("mongoose");
//
// Pour s'assurer que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail,
// nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema
// Importation du package de validation pour pré-valider les informations avant de les enregistrer
// mongoose-unique-validator
//
const uniqueValidator = require("mongoose-unique-validator");
//
// Création du Schéma de données de User
//
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//
userSchema.plugin(uniqueValidator);
//
// exportation du modèle User
//
module.exports = mongoose.model("User", userSchema);
