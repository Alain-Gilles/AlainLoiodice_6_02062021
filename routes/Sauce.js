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
// importation du middleware qui sert à protéger une route
//
const auth = require("../middleware/auth");
//
// importation du middleware multer
//
const multer = require("../middleware/multer-config");
//
// importation des controllers
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
router.get("/", auth, sauceCtrl.getAllSauces);
// route POST  auth sert à appliquer le middleware qui va protéger la route
router.post("/", auth, multer, sauceCtrl.createSauce);
// route GET pour un id particulier
router.get("/:id", auth, sauceCtrl.getOneSauce);
// route PUT modification objet
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
// route DELETE suppression
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);

// exportation du router
module.exports = router;
