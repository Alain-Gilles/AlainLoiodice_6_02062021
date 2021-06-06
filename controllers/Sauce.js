// Importation des modèles décrivant la base de donnée
// ici le fichier Sauce.js contenant le schéma des objets à vendre
//
const Sauce = require("../models/Sauce");

// Importation du package fs (File System de Node, qui nous donne acces aux fonctions qui permettent
// de modifier le systeme de fichier, notemment supprimer un fichier)
const fs = require("fs");
//
// controller pour méthode POST
//
// Sur le corps de la requête on aura req.body.sauce qui sera un objet JavaScript sous forme de chaine de caractères
// on va analyser cette chaine et la transformer en objet par la methode JSON.parse
// On va mettre la chaine parse dans sauceObject
// On enlève l'_id de sauceObject (delete)
// ...sauceObject
// L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
// userId, name, manufacturer, description, mainPepper, imageUrl, heat, likes, dislikes, usersLiked, userDisliked.
// Evite le code userId: req.body.userId, description: req.body.description, name: req.body.name ....
// La syntaxe Spread peut être utilisée lorsque tous les éléments d'un objet ou d'un tableau
// doivent être inclus dans une liste quelconque.
//
// Il faut rajouter une étape car le frontend ne sait pas quelle est l'url de l'image maintenant car c'est le middleware
// multer qui a généré ce nom de fichier
// on va modifier l'url de l'image  imageUrl
// on a accès au nom du fichier avec req.file.filename mais cela ne suffit pas car on aura que le nom du fichier et pas
// l'url complète. On porrait utiliser localhost:3000 mais cela ne fonctionnerait plus en production
// il faut quelque chose de dynamique qui va récupérer les segments de l'url ou se trouve notre image
// on créait une chaine complexe (altGr+7+espace  ``)
// on commence par req.protocol  ici il s'agit soit de http soit de https généralement ensuite ://
// le prochain segment sera req.get('host') dans notre cas il s'agit de localhost:3000 mais sur le deploiement ce sera la racine du serveur
// ensuite on ajoute /images/ et on ajoute enfin le contenu de req.file.filename
// Voila comment on génère l'url de l'image
//
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};
//
// controller pour methode GET ID  Récupérer la sauce correspondant à id de la requête
//
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
//
// Controller pour méthode PUT
//
// Deux cas sont à traiter l'utilisateur a modifié des informations sans rajouter de nouvelles images
// et deuxième cas l'utilisateur a rajouté une nouvelle image
// Le format de la requête ne sera pas le même dans le premier cas nous recevons uniquement les données JSON
// dans le second cas nous recevons l'élément form-data et le fichier modifié (on aura un req.file)
//
// On rajoute une constante sauceObject et on utilise l'opérateur ternaire ( condition ? exprSiVrai : exprSiFaux)
// pour savoir si req.file existe. S'il existe on aura
// un type d'objet et s'il n'existe pas on aura un autre type d'objet
// const sauceObject = req.file ?
//   { } : { };
// Si req.file n'existe pas on va simplement faire une copie de res.body { } : { ...req.body };
// Si le fichier existe on va récupérer avec ...JSON.parse(req.body.sauce) les informations sur l'objet
// qui sont dans cette partie de la requête
// et on va générer l'image url car c'est une nouvelle image
// En résumé
// Si on trouve un fichier : on récupère la chaine de caractère, on la parse en objet et on modifie l'imageUrl
// sinon on prend simplement le corps de la requête
// et dans Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
// ...sauceObject  correspond à l'objet que l'on a créé peut importe son format
//
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};
//
// controller pour méthode DELETE
//
// Avant de supprimer l'objet de la base, on va aller le chercher pour avoir l'url de l'image pour avoir
// accès au nom du fichier image et  ainsi pouvoir le supprimer
// on va faire un Sauce.findOne() pour le trouver. On veut trouver celui qui a l'id qui correspond à celui dans
// les paramètres de la requête. On utilise un .then() et un .catch() en cas d'erreur ici erreur 500 (erreur serveur).
// dans le .then on va récupérer un sauce et avec ce sauce on veut récupérer le nom précis du fichier. Il faut donc extraire le nom
// de l'imageUrl du sauce retourné par la base. On sait que imageUrl aura une chaine /images/ donc on peut spliter autour de cette
// chaine. Ce split va retourner un tableau de 2 éléments, premier élément correspondra à ce qui vient avant /images/
// second élément tous ce qui vient après '/images/' donc finalement le nom du fichier (correspond à l'indice 1 du tableau)
// Rappel les indices de tableau débute à 0
// Avec ce nom de fichier on appelle une fonction du package fs ( fs.unlink ) pour supprimer un fichier
// le premier argument de fs.unlink c'est la chaine de caractères qui correspond au chemin au chemin de ce fichier
// et le deuxième argument c'est le callback (ce qu'il faut faire une fois le fichier supprimé. Ce que l'on veut faire une fois le
// fichier supprimé c'est supprimer le thing de la base de donnée)
//
// Pour récapituler
// On va d'abord trouver l'objet dans la base de donnée
// Quand on le trouve on extrait le nom du fichier à supprimer
// Avec ce nom de fichier on le supprime avec fs.unlink
// et dans le callBack de fs.unlink (une fois que le fichier est supprimé) on supprime l'objet thing dans la base
//
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
//
// Controller pour méthode GET récupération de toutes les sauces
//
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
