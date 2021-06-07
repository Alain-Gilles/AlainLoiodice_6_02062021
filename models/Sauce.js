// Importation de mongoose
// Mongoose est un framework JavaScript couramment utilisé dans une application Node.js avec une base de données MongoDB.
// Mongoose est un outil de modélisation d'objets MongoDB conçu pour fonctionner dans un environnement asynchrone.
//
const mongoose = require("mongoose");
//
// Création du Schéma de données de Sauce
//
// Tout dans Mongoose commence par un schéma.
// Chaque schéma correspond à une collection MongoDB et définit la forme
// des documents au sein de cette collection.
// Par défaut, Mongoose ajoute une propriété _id à vos schémas.
// Lorsque vous créez un nouveau document avec la propriété _id ajoutée automatiquement ,
// Mongoose crée un nouveau _id type ObjectId dans votre document.
// Dans MongoDB et Mongoose , les identifiants sont des objets par défaut.
//
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [String],
  usersDisliked: [String],
});

module.exports = mongoose.model("Sauce", sauceSchema);
