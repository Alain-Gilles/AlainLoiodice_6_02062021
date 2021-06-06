// Application utilisant l'environnement NodeJS
// NodeJS est un environnement d'exécution permettant d’utiliser le JavaScript côté serveur.
// Il permet de concevoir des applications en réseau performantes, telles qu'un serveur web, une API
//
// importation des modules dont à besoin l'application app pour fonctionner
//
// modules express
// un framework reposant sur Node.js qui fournit un ensemble de fonctionnalités pour créer des applications Web et mobiles
// basées sur Node.js. C'est le framework standard pour le développement de serveure Node.js
//
const express = require("express");
//
// Pour gérer les demande POST provenant des applications frontend, nous devrons être capables d'extraire l'objet JSON de la demande.
// Pour ce faire nous utiliseront le package  body-parser.
//
const bodyParser = require("body-parser");
//
// Mongoose est un framework JavaScript couramment utilisé dans une application Node.js avec une base de données MongoDB.
// Mongoose est un outil de modélisation d'objets MongoDB conçu pour fonctionner dans un environnement asynchrone.
// Mongoose prend en charge à la fois les promesses et les rappels.
//
// MongoDB est une base de données qui stocke vos données sous forme de documents.
// Le plus souvent, ces documents ressemblent à une structure de type JSON
//
const mongoose = require("mongoose");
//
// Afin de pouvoir traiter les requêtes vers la route/images, il faut rendre le dossier images static
// il faut donc tout d'abord récupérer le chemin du serveur
//
const path = require("path");
//
// importation du router dans app que nous appelons saucesRoutes
//
// Le router permet de séparer les routes du fichier index.js principal
// Ils aident à construire un code maintenable. Vous devez définir vos routes relatives à une entité dans un seul fichier
// et l'inclure en utilisant la méthode ci-dessous dans votre fichier index.js .
//
const sauceRoutes = require("./routes/Sauce");
//
// importation du router user dans app que nous appelons userRoutes
//
const userRoutes = require("./routes/User");
//
// Pour ce projet nous utilisons la bse de donnée Mongo DB
// parametrage de l'acces à mongo bd addresse serveur et MP
//
// avec mongoose connect nous précisons sur quelle base de données nous allons travailler
//
mongoose
  .connect(
    "mongodb+srv://user-oc-projet6:DyrI2qSavAoDfC0s@cluster0.buaka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//
// app est une application express
//
const app = express();

// CORS  Cross Origin Ressource Sharing
// La sécurité CORS est une mesure de sécurité par défaut pour empêcher l'utilisation de ressources
// par des origines non-autorisées.
// Le CORS est nécessaire à partir du moment où le Front End et le Back End ne partagent pas la même origine
// Le systeme de sécurité bloque les appels HTTP effectués entre des serveurs différents,
// ce qui empêche les requêtes malveillantes d'accéder à des ressources sensibles.
// Dans le projet nous avons deux origines : localhost:3000 (backend) et localhost:4200 (frontend) ,
// et nous souhaiterions qu'elles puissent communiquer entre elles.
// Pour cela, nous devons ajouter des headers (des entêtes) à notre objet  response
// que l'on renvoi au navigateur pour dire que tout va bien vous pouvez utiliser cet API.
//
// Header de sécurité, rajouté sur l'objet reponse res
// L'entête Access-Control-Allow-Origin renvoie une réponse indiquant si les ressources peuvent être partagées avec une origine donnée.
// Deux objets ont la même origine seulement quand le schéma (protocole), l'hôte (domaine) et le port correspondent
// Pour les demandes sans informations d’identification, le serveur peut spécifier « * » comme
// un caractère générique, permettant ainsi à n’importe quelle origine d'accéder à la ressource
//
// Ici on a défini "Access-Control-Allow-Origin" avec "*" , ce qui permet d'accéder à la ressource depuis n'importe quelle origine
//
// L'entête de réponse Access-Control-Allow-Methods spécifie les méthodes autorisées quand on accède à la ressource
// en réponse à une requête de pré-vérification
// ici on autorise les méthodes GET PUT POST DELETE PATCH OPTIONS
//
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//
// utilisation du package  body-parser.
//
app.use(bodyParser.json());
//
// Il faut indiquer à Express qu'il faut gérer la ressource images de manière static
// (un sous répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle
// reçoit une requête vers la route /images.
app.use("/images", express.static(path.join(__dirname, "images")));
//
// Nous voulons que pour la route /api/sauces on utilise le router sauceRoutes
// et que pour la route /api/auth on utilise le router userRoutes
//
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
//
// exportation de l'application
//
module.exports = app;