//
// On aura besoin du package dotenv pour récupérer les variables environnement
// Pour gérer les variables d'environnement on a besoin d'importer le package dotenv
// Il s'agit de variables locales mises à disposition d'une application.
// Ce module charge les variables d'environnement à partir d'un fichier .env que vous créez et
// les ajoute à l'objet process.env qui est mis à la disposition de l'application.
//
require("dotenv").config({ path: "./config/.env" });
//

// middleware d'authentification
//
// On aura besoin du package jsonwebtoken pour vérifier les token
//
const jwt = require("jsonwebtoken");
//
// On va exporter un middleware classique : une fonction qui prend la requete, la reponse et la fonction next
// Dans cette requête étant donné que de nombreux problèmes peuvent se produire,
// nous insérons tout à l'intérieur d'un bloc try...catch ;
// Dans le bloc try
// La première chose à faire est de recupérer le token dans le header authorization
// Dans le header on a le mot Bearer un espace et ensuite le token
// On extrait le token du header Authorization de la requête entrante.
// Nous utilisons split pour récupérer dans un tableau tout ce qui se trouve autour de l'espace dans le header
// C'est à dire un tableau avec Bearer en premier element et le token en second
// on va récupérer simplement le deuxième élément c'est à dire le token (indice du tableau égal à 1, un tableau débute à l'indice 0)
//
module.exports = (req, res, next) => {
  try {
    // S'il y a la moindre erreur dans un des traitement contenu dans le bloc try, la requete sera renvoyé vers le bloc .catch
    // le premier cas ou l'on peut avoir une erreur (le header n'existe pas, si split retourne une erreur... )
    //
    const token = req.headers.authorization.split(" ")[1];
    //
    // La deuxième étape c'est de décoder le token.
    // Utilisation du package jsonwebtoken (jwt) et la fonction verify avec en premier argument ce que l'on veut vérifier (ici le token)
    // le deuxième argument contient la clé secrète de codage/décodage (remarque en production la clé sera plus longue et plus complexe)
    // le token décodé devient un objet javascript classique
    // On va pouvoir récupérer le userId qui est dedans, car on la encodé exprès dans le token
    //
    //const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    // On veut vérifier que s'il y a un userId dans le corps de la requête il corresponde bien à celui du token
    // donc s'il y a un userId dans le corps de la requête et que cet userId est différent du userId contenu dans le token
    // On renvoie l'erreur (throw) Invalid user ID
    // L'instruction throw permet de lever une exception définie par l'utilisateur.
    // L'exécution de la fonction courante sera stoppée (les instructions situées après l'instruction throw ne seront pas exécutées)
    // et le contrôle sera passé au premier bloc catch de la pile d'appels.
    //
    // Sinon si tout va bien on appelle next() pour passer la requête au prochain middleware
    //
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
