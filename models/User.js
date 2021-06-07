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
// Création du Schéma de données de User qui définit les utilisateurs
//
// Tout dans Mongoose commence par un schéma.
// Chaque schéma correspond à une collection MongoDB et définit la forme
// des documents au sein de cette collection.
// Par défaut, Mongoose ajoute une propriété _id à vos schémas.
// Lorsque vous créez un nouveau document avec la propriété _id ajoutée automatiquement ,
// Mongoose crée un nouveau _id type ObjectId dans votre document.
// Dans MongoDB et Mongoose , les identifiants sont des objets par défaut.
//
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//
// Le schema utilise le package mongoose-unique-validator importé plus haut
//
userSchema.plugin(uniqueValidator);
//
// exportation du modèle User
//
module.exports = mongoose.model("User", userSchema);
