// middleware d'authentification
// middleware (fonction) signup pour la création de nouveaux utilisateurs user dans la base de donnée
// à partir de l'inscription depuis l'application Frontend
//
// On aura besoin du package dotenv pour récupérer les variables environnement
// Pour gérer les variables d'environnement on a besoin d'importer le package dotenv
// Il s'agit de variables locales mises à disposition d'une application.
// Ce module charge les variables d'environnement à partir d'un fichier .env que vous créez et
// les ajoute à l'objet process.env qui est mis à la disposition de l'application.
//
require("dotenv").config({ path: "./config/.env" });
//
//
// importation du package de cryptage pour les mots de passe
//
const bcrypt = require("bcrypt");
//
// importation du package qui va permettre de créer des token et de les vérifier
//
const jwt = require("jsonwebtoken");
//
// On aura besoin de notre modèle User car on va enregister et lire des users dans ce middleware
//
const User = require("../models/User");
//
// On va utiliser crypto-js pour Encrypter les e-mail  $ npm install crypto-js
//
// Nous allons utiliser l'algorithmes de chiffrement AES (Advanced Encryption System).
//
const CryptoJS = require("crypto-js");
//
// Utilisation du packgae email-validator pour controler la validité de l'email transmis par le frontend
//
var validator = require("email-validator");
//
exports.signup = (req, res, next) => {
  //
  //
  // Logique de la fonction signup
  // La fonction signup va crypter le mot de passe et créer un nouveau user avec le mot de passe crypté
  // passé dans le corps de la requête. Le signup on va commencer par hacher le mot de passe.
  // nous appelons pour cela la fonction de hachage de bcrypt
  // et lui demandons de « saler » le mot de passe 10 fois.
  // Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé.
  // Il s'agit d'une fonction asynchrone donc qui prend du temps, on commence par ce processus.
  // On va hacher le mot de passe et avec le hash créé par bcrypt on va entrer le user dans la base de données.
  // on appelle bcrypt.hash() on lui passe en paramètre le mot de passe du corps de la requête passé par le Frontend
  // (on salera l'algorithme 10 fois. Comme il s'agit d'une méthode asynchrone on a un bloc then() et un bloc catch().
  // Dans le bloc catch on capte l'erreur, ici on va dire qu'il s'agit d'une erreur 500 (Internal Server Error) et on envoie l'erreur dans un objet
  // Dans le bloc then on va récupérer le hash de mot de passe qu'on va enregister dans un nouveau user dans la base de données.
  // On creait le nouvel utilisateur avec le modèle Mongoose.
  // Comme adresse email on va passer l'adresse qui est fournie dans le corps de la requête.
  // Comme mot de passe on va enregister le hash qui est crypté
  //

  /////////////////////////////////////////////////////
  //
  // Test validation du mot de passe
  // Importation du package password-validator
  // Package qui permet de tester la validation d'un mot de passe selon un certain nombre
  // de règles paramétrables
  //
  var passwordValidator = require("password-validator");
  // Create a schema
  var schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values
  //
  //
  console.log("req.body.password", req.body.password);
  console.log(
    "schema.validate(req.body.password)",
    schema.validate(req.body.password)
  );
  //
  // On teste  la vailidité de l'email envoyé par le frontend
  //
  if (validator.validate(req.body.email)) {
    //
    // l'email est valide
    //
    //
    // On teste la validité du mot de passe par appel du module password-validator
    // On lui passe la chaine de caractères à valider ici req.body.password
    // on a auparavant défini dans la variable shéma le schéma des controles que l'on veut effectuer
    // Le mot de passe doit être au minimum de 8 caractères et de 100 caractères au maximum
    // Il doit contenir des Majuscules et des minuscules
    // et au mons deux chiffres
    // Les espaces ne sont pas autorisés
    //
    /////////////////////////////////////////////////////
    //
    // Si le mot de passe correspond au schéma (il est considéré comme valide)
    //
    if (schema.validate(req.body.password)) {
      //
      ////////////////////////////////////////////////////
      //
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          //
          // encryptage de l'email
          //
          key = process.env.KEY;
          iv = process.env.IV;
          var ciphertext = CryptoJS.AES.encrypt(
            req.body.email,
            CryptoJS.enc.Base64.parse(key),
            { iv: CryptoJS.enc.Base64.parse(iv) }
          ).toString();
          console.log("signup ciphertext  :", ciphertext);
          //
          // const user = new User({
          //   email: req.body.email,
          //   password: hash,
          // });
          const user = new User({
            email: ciphertext,
            password: hash,
          });
          //
          // on utilise la methode save de notre user pour l'enregistrer dans la base de données
          // dans le then on renvoie un status 201 pour une création de ressources et un message : utilisateur créé
          // dans le catch on renvoie un code status 400 (Bad Request )
          //
          user
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
      //
      ////////////////////////////////////////////////////
      //
      // Le mot de passe ne correspond pas au shema (donc considéré comme invalide)
      //
      // L'instruction try...catch regroupe des instructions à exécuter et définit une réponse si l'une de ces instructions provoque une exception.
      // L'instruction throw permet de lever une exception définie par l'utilisateur.
      // L'exécution de la fonction courante sera stoppée (les instructions situées après l'instruction throw ne seront pas exécutées)
      // et le contrôle sera passé au premier bloc catch de la pile d'appels.
      //
    } else {
      try {
        throw "Le mot de passe est erroné de 8 à 100 caractères, dont Majuscules, minuscules, au moins 2 chiffres et pas espace !";
      } catch (error) {
        res.status(400).json({ error });
      }
    }
  } else {
    try {
      throw "L'email saisie n'est pas un email valide";
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  //
  /////////////////////////////////////////////////////
  //
};

// login : middleware (fonction) login qui permet aux utilisateurs existants de se connecter à l'application
// Fonction qui récupère l'utilisateur de la base qui correspond à l'adresse mail entrée.
// Si l'email n'est pas trouvé dans la base on retourne une erreur.
// Sinon on compare le mot de passe entrée avec le hash contenu dans la base de données.
// Si la comparaison n'est pas concluente on renvoie une erreur.
// Si la comparaison est OK, l'utilisateur a rentré des identifiants valables, on lui renvoie
// son user_id et un token qui servira de token d'authentification
//
// On va commencer par trouver le user dans la base de donnée qui correspont à l'adresse email qui est rentrée
// et si jamais l'utilisateur n'existe pas on renvoie une erreur.
// On va utiliser la méthode findOne pour trouver un seul utilisateur de la base de donnée et comme l'adresse mail est unique
// on sait que si l'utilisateur est trouvé ce sera le bon.
// En argument de findOne on va mettre l'objet filtre (objet de comparaison). On veut que ce soit l'utilisateur pour qui l'adresse mail
// correspond à celle envoyée dans la requête.
// Findone est une fonction asynchrone qui retourne une promise donc on aura un .then() et un .catch().
// Le .catch() va indiquer qu'il y a un problème de connexion, un problème lié à mongo DB. On renverra un status 500 pour une
// erreur serveur.
// Dans le .then() on doit vérifier si un user correspondant à l'adresse mail a été trouvé
// Si on a pas trouvé de user on va renvoyer un status 401 pour dire  Utilisateur non trouvé
// Sinon un utilisateur a bien été trouvé. Il faut utiliser bcrypt pour comparer le mot de passe envoyé par l'utilisateur
// qui essaye de se connecter avec le hash qui est enregistré dans la base de donnée pour le user que l'on a reçu.
// On va réutiliser le package bcrypt mais cette fois ci on utilise la fonction compare pour comparer.
// Cette fonction est asynchrone, retourne une promise. Donc .then() et .catch().
// Le .catch() => problème erreur serveur
// .then() on reçoit un booléan pour savoir si la comparaison est valable ou non.
// Si ce n'est pas valable, l'utilisateur a rentré le mauvais mot de passe on retourne une erreur status 401
// avec message mot de passe incorrect.
// Dans le cas contraire le mot de passe est OK. On renvoie un status 200 OK et on renvoie un objet JSON qui contient
// un user._id    id de l'utilisateur pour la base ainsi qu'un 'TOKEN'. La réponse sera envoyée, la connexion sera validée.
// token : on va appeler une fonction de jsonwebtoken, la fonction sign() creait la signature du JWT avec comme premier argument les données que l'on
// veut transmettre à l'application (le payload) ici un objet avec le userId qui sera l'identifiant du user comme cela on est sur que cette
// requete corresponde bien au userId.
// Le second argument c'est la clé secrète pour la génération de la signature
// Le troisème argument est un argument de configuration ou l'on va appliquer une expiration pour notre token de 24 heures.
// Chaque token durear 24h , s'il a plus de 24h il ne sera plus considéré comme valable.
//
exports.login = (req, res, next) => {
  //
  // Encodage de email passé dans req.body
  //
  key = process.env.KEY;
  iv = process.env.IV;
  var ciphertext = CryptoJS.AES.encrypt(
    req.body.email,
    CryptoJS.enc.Base64.parse(key),
    { iv: CryptoJS.enc.Base64.parse(iv) }
  ).toString();
  console.log("login ciphertext  :", ciphertext);
  //
  //
  // User.findOne({ email: req.body.email })
  User.findOne({ email: ciphertext })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
