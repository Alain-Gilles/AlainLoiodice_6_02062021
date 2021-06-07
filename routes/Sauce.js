//
// Router Sauce
//
// importation de express
//
const express = require("express");
//
// importation de express Router de créer un router
//
const router = express.Router();
//
// importation du middleware d'authentificationqui sert à protéger une route
//
const auth = require("../middleware/auth");
//
// importation du middleware multer pour gérer les fichiers envoyés avec des requettes http vers notre API
//
const multer = require("../middleware/multer-config");
//
// importation du controller Sauce qui contient la logique (le traitement à effectuer)
//
const sauceCtrl = require("../controllers/Sauce");
//
// on applique le middleware auth à toutes les routes de l'application
// en ajoutant auth apres la route et avant l'appel de la fonction a exécuter
//
// Le middleware auth gère les fichiers entrant on va donc appliquer ce middleware
// aux routes concernées (route POST , route DELETE, route PUT )
// Attention l'ordre des middleware est important, il faut placer multer après le
// middleware d'authentification
// Si multer est enregistré avant un middleware d'authentification, tout fichier contenu dans une requête,
// même non authentifiée, sera enregistré sur le système de fichiers.
// Il est donc essentiel, dans cette situation, d'enregistrer multer après le middleware d'authentification.
//
// Définition des différentes routes
//
// Récupération de toutes les sauces
//
// verbe GET  Paramètres /api/sauces
// Le chemin principal a été défini dans app.js app.use("/api/sauces", sauceRoutes);
// le chemin sera donc ici "/"
// Corps de la demande  -
// Reponse attendue Tableau des sauces
// Fonction : Renvoie le tableau de toutes les sauces dans la base de données
//
// auth sert à appliquer le middleware qui va protéger la route
//
router.get("/", auth, sauceCtrl.getAllSauces);
//
// Enregistrer une sauce
//
// verbe POST  Paramètres /api/sauces
// Le chemin principal a été défini dans app.js app.use("/api/sauces", sauceRoutes);
// le chemin sera donc ici "/"
// Corps de la demande  {sauce:Chaine, image:Fichier}
// Reponse attendue {message:Chaine}
// Fonction : Capture et enregistre l'image de la sauce, analyse la sauce en utilisant
// une chaine de caractères et l'enregistre dans la base de données, en définissant
// correctement son image URL.
// Remet les sauces aimées (lickées) et celles détestée (dislickées) à 0, et les
// sauces usersliked et celles usersdisliked aux tableaux vides
//
// auth sert à appliquer le middleware qui va protéger la route
// multer sert à gérer le fichier image importé
//
router.post("/", auth, multer, sauceCtrl.createSauce);
//
//
// Récupération d'une seule sauce
//
// verbe GET  Paramètres /api/sauces/:id
// Le chemin principal a été défini dans app.js app.use("/api/sauces", sauceRoutes);
// le chemin sera donc ici "/:id"
// Corps de la demande  -
// Reponse attendue Sauce unique
// Fonction : Renvoie la sauce correspondant à l'Id fourni
//
// auth sert à appliquer le middleware qui va protéger la route
//
router.get("/:id", auth, sauceCtrl.getOneSauce);
//
// Mise à jour d'une sauce
//
// verbe PUT  Paramètres /api/sauces/:id
// Le chemin principal a été défini dans app.js app.use("/api/sauces", sauceRoutes);
// le chemin sera donc ici "/:id"
// Corps de la demande  selon que qu'une image est jointe ou non
// Sauce comme JSON (pas d'image) ou {sauce:Chaîne, image:Fichier}
// Reponse attendue {message:Chaîne}
// Fonction : Met à jour la sauce avec l'identifiant fourni
// Si une image est téléchargée, capturez la et mettez à jour l'image URL des sauces.
// Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans
// le corps de la demande (req.body.name, req.body.heat etc...)
// Si un fichier est fourni, la sauce avec la chaine est en req.body.sauce
//
// auth sert à appliquer le middleware qui va protéger la route
// multer sert à gérer le fichier image importé
//
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//
// Suppression d'une sauce
//
// verbe DELETE  Paramètres /api/sauces/:id
// Le chemin principal a été défini dans app.js app.use("/api/sauces", sauceRoutes);
// le chemin sera donc ici "/:id"
// Corps de la demande  -
// Reponse attendue {message:Chaîne}
// Fonction : Supprime la sauce avec l'ID fourni
//
// auth sert à appliquer le middleware qui va protéger la route
// multer sert à gérer le fichier image importé
//
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);
//
// Définition du statut "J'aime" pour le userID fourni
//
// Si j'aime = 1, l'utilisateur aime la sauce.
// Si j'aime = 0 , l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas
// Si j'aime = -1, l'utilisateur n'aime pas la sauce
// L'identifiant de l'utilisateur doit-être ajouté ou supprimé du tableau approprié, en
// gardant une trace de ses préférences et en l'empéchant d'aimer ou de na pas aimer la
// même sauce plusieurs fois.
// Nombre total de j'aime et de je n'aime pas à mettre à jur avec chaque j'aime
//
// verbe POST  Paramètres /api/sauces/:id/like
// Le chemin principal a été défini dans app.js app.use("/api/sauces", sauceRoutes);
// le chemin sera donc ici "/:id/like"
// Corps de la demande  { userId:Chaine, j'aime:Nombre}
// Reponse attendue {message:Chaîne}
// Fonction : Définition du statut "J'aime" pour le userID fourni
//
// auth sert à appliquer le middleware qui va protéger la route
// multer sert à gérer le fichier image importé
router.post("/:id/like", auth, multer, sauceCtrl.likeSauce);
//
// exportation du router
//
module.exports = router;
