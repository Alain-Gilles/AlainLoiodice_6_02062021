// Importation des modèles décrivant la base de donnée
// ici le fichier Sauce.js contenant le schéma des objets à vendre
//
const Sauce = require("../models/Sauce");

// Importation du module fs (File System de Node, qui nous donne acces aux fonctions qui permettent
// de modifier le systeme de fichier, notemment supprimer un fichier)
//
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
// l'url complète. On pourrait utiliser localhost:3000 mais cela ne fonctionnerait plus en production
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
// Deux cas sont à traiter dans la modification d'une sauce
// L'utilisateur a modifié l'image de la sauce ou l'utilisateur n'a pas modifié l'image de la sauce
//
// Comment détecte t-on que l'image a été modifiée ?
// par la pésence dans la requête d'un req.file (objet qui contient entre autre le file name
// par ex. filename: 'sauces-tomates-ketchup.jpg1623666210937.jpg')
//
// Si l'utilisateur a modifié l'image de la sauce,
//            il faut supprimer dans le dossier images l'ancienne photo
//            le format de la requête contiendra l'élément form-data ainsi qu'un fichier req.file
//
// Si l'utilisateur n'a pas modifier l'image de la sauce le format de la requête contiendra les données JSON
// Il faut commencer par supprimer l'ancienne image dans le répertoire images
//
// On commence par tester si req.file existe
//    si c'est le cas l'image de la sauce a été modifié
//    on effectue un Sauce.findOne avec comme paramètre de sélection _id contenu dans la base doit-être égal à l'id présent dans les paramètres de la requête
//    Si la sauce est trouvé, on va récupérer dans sauce.imageUrl qui est de type http://localhost:3000/images/sauce-tomate.jpg1623672963145.jpg
//    la chaine de caractères qui suit la chaine '/images/' et qui contient le nom du fichier à supprimer
//    pour se faire on effectue un split autour de /images/ sur sauce.imageUrl ce qui a pour effet de créer un tableau avec en
//    premier élément en index (0) la chaine de caractère qui se trouve avant '/images/' soit http://localhost:3000 et en second
//    élément en index (1) la chaine de caractère qui se trouve après '/images/' et on ne concerve que le second élément du tableau soi
//    sauce-tomate.jpg1623672963145.jpg
//    Ensuite on construit l'adresse du fichier à supprimer en concaténant 'images/' avec sauce-tomate.jpg1623672963145.jpg dans une
//    constante filename et on utilise File System de Node (fs) pour supprimer ce fichier.
//
//
// Ensuite on utilise l'opérateur ternaire sur req.file ( condition ? exprSiVrai : exprSiFaux)
//
// si req.file existe on affecte à sauceObject un object contenant le req.body.sauce parsé et l'url du fichier image
//        que l'on a reconstitué en concatenant http: (req.protocol) avec '://' + localhost:3000 (contenu de la variable req.get("host")) + la chaine
//        /images/ + le contenu de la variable req.file.name se qui nous donne par ex.
//        http://localhost:3000/images/sauce-tomate.jpg1623672963145.jpg
// dans le cas ou le fichier req.file n'existe pas (req.file undefined)
//        on va utiliser l'opérateur spread (three dot ...)  ce permet d'étendre req.body sur les paires de clés-valeurs de sauceObject
//
// En résumé
// Si on trouve un fichier : on récupère la chaine de caractère, on la parse en objet et on modifie l'imageUrl
// sinon on prend simplement le corps de la requête
// dans Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
// ...sauceObject  correspond à l'objet que l'on a créé peut importe son format
//
// req.param()recherche le chemin d'URL, le corps et la chaîne de requête de la demande ( dans cet ordre ) pour le paramètre spécifié
// Route put /api/sauces/:id
//
exports.modifySauce = (req, res, next) => {
  ///
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          console.log(
            "fichier image supprimé ",
            filename,
            " dans le dossier image"
          );
        });
      })
      .catch((error) => res.status(500).json({ error }));
  }
  ///
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
//
// controller pour méthode POST like ou dislikes sauce
//
// Corps (body) de la demande {userId:Chaine, like:Nombre}
//
// Schema de Sauce
//
//const sauceSchema = mongoose.Schema({
//  userId: { type: String, required: true },
//  name: { type: String, required: true },
//  manufacturer: { type: String, required: true },
//  description: { type: String, required: true },
//  mainPepper: { type: String, required: true },
//  imageUrl: { type: String, required: true },
//  heat: { type: Number, required: true },
//  likes: { type: Number, default: 0 },
//  dislikes: { type: Number, default: 0 },
//  usersLiked: [String],      tableau contenant les id des utilisateurs ayant liké
//  usersDisliked: [String],   tableau contenant les id des utilisateurs aynat disliké
//});
//
// A chaque like ou dislike on incrémente ou on décrémente le nbre de like ou de dislike de une unite
// si l'utilisateur ne l'a pas déja fait ( son id n'est pas présent dans usersLiked ou usersDisliked ).
// Un utilisateur ne peut pas aimer ou ne pas aimer une sauce plusieurs fois
// on met à jour dans le tableau usersLiked ou userDisliked l'id de l'utilisateur qui a liké ou disliké
//
exports.likeSauce = (req, res, next) => {
  //
  // on recupère le code like envoyé par l'application 1 like / 2 dislike / 0 annulation like ou dislike
  //
  const aime = req.body.like;

  console.log("req.body", req.body);
  console.log("aime", aime);

  switch (aime) {
    //
    case 1:
      // like = 1 : l'utilisateur aime la sauce
      // l'utilisateur a t-il deja liké ou disliké pour cette sauce ?
      // s'il n'a pas deja liké ou disliké (cet utilisateur est absent des tableaux usersLiked et usersDisliked
      // pour cette sauce) alors
      // mise à jour de la sauce avec userId passé par le body de la requête
      // on ajoute 1 au champ likes de Sauce
      // on met à jour le tableau usersLiked avec son -Id utilisateur
      //
      // On recherche la sauce avec son id

      console.log("Sauce", Sauce);

      Sauce.findOne({
        _id: req.params.id,
      })
        .then((sauce) => {
          //
          // La sauce existe
          // On teste maintenant si l'utilisateur a déja like ou dislike cette sauce
          // La méthode "indexOf" de la classe Array permet de retrouver l'index d'une chaîne dans un tableau.
          // Elle retourne -1 si la valeur en paramètre n'a pas été trouvée.
          // && opérateur logique ET
          //
          if (
            sauce.usersLiked.indexOf(req.body.userId) == -1 &&
            sauce.usersDisliked.indexOf(req.body.userId) == -1
          ) {
            console.log(
              "utilisateur non present dans tableau des likes et dans tableau des non likes"
            );
            //
            // l'utilisateur n'est pas présent dans le tableau usersLiked et n'est pas présent dan le tableau usersDisliked
            //
            // on met a jour les propriétés like du document sauce en ajoutant 1
            // on ajoute en fin de tableau usersLiked du document sauce l'Id de l'utilisateur qui a lické
            // en utilisant la méthode push (ajoute un élément en fin de tableau)
            //
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
            //
            // On utilise la méthode save pour sauvegarder le document sauce que l'on vient de modifier
            //
            sauce
              .save()
              .then(() =>
                res.status(200).json({ message: "Votre like a été mis à jour" })
              )
              .catch((error) => res.status(404).json({ error }));
          } else {
            res.status(200).json({
              message:
                "Votre like ne peut pas être comptabilisé, vous avez déja émis un avis pour cette sauce !",
            });
          }
          //res.status(200).json(sauce);
        })
        .catch((error) => {
          res.status(404).json({ error });
        });

      break;
    //
    case -1:
      // like = -1 : l'utilisateur n'aime pas la sauce
      // l'utilisateur a t-il deja liké ou disliké pour cette sauce ?
      // s'il n'a pas deja liké ou disliké (cet utilisateur est absent des tableaux usersLiked et usersDisliked
      // pour cette sauce) alors
      // mise à jour de la sauce avec userId passé par le body de la requête
      // on ajoute 1 au champ dislikes de Sauce
      // on met à jour le tableau usersDisliked avec son -Id utilisateur
      //

      console.log("Sauce", Sauce);

      Sauce.findOne({
        _id: req.params.id,
      })
        .then((sauce) => {
          //
          // La sauce existe
          // On teste maintenant si l'utilisateur a déja like ou dislike cette sauce
          // La méthode "indexOf" de la classe Array permet de retrouver l'index d'une chaîne dans un tableau.
          // Elle retourne -1 si la valeur en paramètre n'a pas été trouvée.
          // && opérateur logique ET
          //
          if (
            sauce.usersLiked.indexOf(req.body.userId) == -1 &&
            sauce.usersDisliked.indexOf(req.body.userId) == -1
          ) {
            console.log(
              "utilisateur non present dans tableau des likes et dans tableau des non likes"
            );
            //
            // l'utilisateur n'est pas présent dans le tableau usersLiked et n'est pas présent dan le tableau usersDisliked
            //
            // on met a jour les propriétés dislikes du document sauce en ajoutant 1
            // on ajoute en fin de tableau usersDisliked du document sauce l'Id de l'utilisateur qui a dislické
            // en utilisant la méthode push (ajoute un élément en fin de tableau)
            //
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
            //
            // On utilise la méthode save pour sauvegarder le document sauce que l'on vient de modifier
            //
            sauce
              .save()
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Votre Dislike a été mis à jour" })
              )
              .catch((error) => res.status(404).json({ error }));
          } else {
            res.status(200).json({
              message:
                "Votre Dislike ne peut pas être comptabilisé, vous avez déja émis un avis pour cette sauce !",
            });
          }
        })
        .catch((error) => {
          res.status(404).json({ error });
        });

      break;
    //
    default:
      //
      // like = 0 : l'utilisateur annule aime ou n'aime pas
      // vérification si présence de l'utilisateur dans les tableaux userLiked et userDisliked
      // si présence dans usersLiked on enlève l'ID de cet utilisateur du tableau userLiked et on ajoute -1
      // a likes de Sauce si likes >0
      // si présence dans usersDisliked on enlève l'ID de cet utilisateur du tableau userDisliked et on ajoute -1
      // à dislikes de Sauce
      //
      console.log("Sauce", Sauce);

      Sauce.findOne({
        _id: req.params.id,
      })
        .then((sauce) => {
          //
          // La sauce existe
          // On teste maintenant si l'utilisateur a déja like ou dislike cette sauce
          // La méthode "indexOf" de la classe Array permet de retrouver l'index d'une chaîne dans un tableau.
          // Elle retourne -1 si la valeur en paramètre n'a pas été trouvée.
          // || opérateur logique OU
          // !  opérateur logique NOT
          //
          if (
            sauce.usersLiked.indexOf(req.body.userId) !== -1 ||
            sauce.usersDisliked.indexOf(req.body.userId) !== -1
          ) {
            console.log(
              "utilisateur present dans tableau des likes ou dans tableau des non likes"
            );
            //
            // l'utilisateur est présent dans le tableau usersLiked ou dans le tableau usersDisliked
            //
            //
            if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
              //
              // Si le compteur likes de sauce est supérieur à 0 on enlève 1 au compteur likes
              //
              if (sauce.likes > 0) {
                sauce.likes--;
              }
              //
              // on enlève l'id de l'utilisateur du tableau usersLiked
              // utilisation de la méthode array.splice(startIndex, deleteCount)
              // startIndex index à partir duquel les éléments du tableau seront supprimés
              // ici cet index correspond à l'index de l'ID utilisateur dans le tableau userLiked récupéré par la méthode indexOf
              // deletCount correspond au nombre d'éléments que l'on veut supprimer à partir de startIndex, ici 1
              // on ne veut supprimer que cet élément
              //
              sauce.usersLiked.splice(
                sauce.usersLiked.indexOf(req.body.userId),
                1
              );
            } else {
              //
              // Si le compteur dislikes de sauce est supérieur à 0 on enlève 1 au compteur likes
              //
              if (sauce.dislikes > 0) {
                sauce.dislikes--;
              }
              //
              // on enlève l'id de l'utilisateur du tableau usersDisliked
              // utilisation de la méthode array.splice(startIndex, deleteCount)
              // startIndex index à partir duquel les éléments du tableau seront supprimés
              // ici cet index correspond à l'index de l'ID utilisateur dans le tableau userDisliked récupéré par la méthode indexOf
              // deletCount correspond au nombre d'éléments que l'on veut supprimer à partir de startIndex, ici 1
              // on ne veut supprimer que cet élément
              //
              sauce.usersDisliked.splice(
                sauce.usersDisliked.indexOf(req.body.userId),
                1
              );
            }
            //
            // On utilise la méthode save pour sauvegarder le document sauce que l'on vient de modifier
            //
            sauce
              .save()
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Votre like/dislike a été mis à jour" })
              )
              .catch((error) => res.status(404).json({ error }));
          } else {
            res.status(200).json({
              message:
                "Vous n'avez pas émis d'avis, vous ne pouvez donc pas licker ou dislicker !",
            });
          }
        })
        .catch((error) => {
          res.status(404).json({ error });
        });
  }
};
