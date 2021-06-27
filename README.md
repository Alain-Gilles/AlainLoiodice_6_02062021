# AlainLoiodice_6_02062021

Projet 6 OpenClassrooms Sopekocko

Procédure installation du projet Frontend + Backend

Processus
Nous allons tout d'abord installer la partie Frontend du projet dans un nouveau répertoire que nous appellerons op_projet6, vous pouvez bien entendu décider de choisir un autre nom de répertoire dans l'hypothèse ou se répertoire existe déjà ou tout simplement parce que ce nom de répertoire ne vous convient pas.
Dans ce cas toutes les références au répertoire op_projet6 qui seront faite dans ce document d'installation devront faire référence au nom de répertoire que vous aurez donné.

Structure du projet
Le répertoire op_projet6 contiendra deux répertoires
Le répertoire frontend
Et le répertoire backend

Nous allons commencer par installer la partie frontend

Veuillez suivre les instructions qui suivent

===================================
Procédure installation du Frontend
===================================

=======
Etape 1
=======

remarque 1 : dans cette documentation, si vous n'avez pas opté pour op_projet6 comme nom de répertoire à créer , il faudra à chaque fois que vous trouverez une référence au répertoire op_projet6 utiliser le nom que vous avez défini.

remarque 2 : nous utiliserons Cygwin (https://cygwin.com/index.html) comme terminal mais vous pouvez opter pour celui que vous voulez, il faudra peut-être adapter certaines commandes.

Démarrer le terminal Cygwin64

Créer un répertoire nommé par exemple op_projet6 dans c:  
c:/op_projet6

$ cd c: (affiche /cygdrive/c)
$ mkdir op_projet6 (remplacer op_projet6 au besoin si vous le souhaitez)

( si le dossier existait déjà le terminal envoi le message suivant :
mkdir: cannot create directory ‘op_projet6’: File exists

Il faudra alors choisir un nouveau nom de dossier (et faire référence à ce nouveau nom à chaque fois que vous rencontrerez op_projet6)

=======
Etape 2
=======

Se positionner sur le dossier que vous venez de créer

$ cd op_projet6 (remplacer op_projet6 au besoin / affiche /cygdrive/c/op_projet6)

Cloner le frontend

https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git

vérifiez que le terminal est bien positionné sur le dossier op_projet6
$ pwd (renvoi -> cygdrive/c/op_projet6 ou cygdrive/c/votre répertoire )

$ git clone https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git

Voici ce qui apparait sur le terminal

$ git clone https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git
Cloning into 'dwj-projet6'...
remote: Enumerating objects: 117, done.
remote: Counting objects: 100% (24/24), done.
remote: Compressing objects: 100% (24/24), done.
Rremote: Total 117 (delta 13), reused 1 (delta 0), pack-reused 93eceiving object
Receiving objects: 93% (109/117)
Receiving objects: 100% (117/117), 217.99 KiB | 466.00 KiB/s, done.
Resolving deltas: 100% (30/30), done.

Cette commande va créer un dossier dwj-projet6 dans op_projet6 ou dans le répertoire que vous avez choisi si vous ne souhaitiez pas utiliser op_projet6

=======
Etape 3
=======

Nous allons renommer le dossier dwj-projet6 en frontend

Vérifiez que vous êtes bien positionné sur le répertoire op_projet6 ou sur votre répertoire.

$ pwd (renvoi -> cygdrive/c/op_projet6 ou cygdrive/c/votre répertoire )
Si ce n'est pas le cas se positionner dessus $ cd c: puis $ cd op_projet6

$ ls ( retourne le contenu du répertoire sur lequel vous êtes positionné (op_projet6 ou votre repertoire -> doit afficher le contenu de ce dossier soit le répertoire dwj-projet6)
$ mv dwj-projet6 frontend (on renomme le répertoire dwj-projet6 en frontend)
$ ls ( retourne le contenu du répertoire op_projet6 ou de votre répertoire -> frontend)

=======
Etape 4
=======

Vérifier que Node.js est bien installé

$ node -v ou $ node --version ( doit retourner le numéro de version ex v14.15.4 )
(dans l'hypothèse ou node.js n'est pas présent, aller sur https://nodejs.org et télécharger la dernière version stable version LTS (installe entre autres Nodejs, npm package manager …)

Vérifier que npm est bien installé (si vous avez installé node, npm doit-être installé)
$ npm -v ou $ npm --version ( doit retourner le numéro de version ex 6.14.10)

=======
Etape 5
=======

Vérifier que Angular est bien installé

$ ng --version (Affiche après quelques instants n° version "Angular Cli " Angular CLI: 12.0.1)
Si ce n'est pas le cas installer la CLI Angular pour pouvoir faire tourner le serveur de développement sur lequel sera exécuté le code du frontend (ng serve). Pour l'installer, exécutez la commande suivante à partir de votre console : $ npm Install -g @angular/cli

=======
Etape 6
=======

Se positionner sur le dossier frontend

$ pwd (on doit se trouver sur le dossier op_projet6 ou sur votre dossier, sinon se positionner dessus)
$ cd frontend (on doit se positionne sur le dossier frontend /cygdrive/c/op_projet6/frontend ou /cygdrive/c/votre-dossier/frontend )

Exécuter npm install qui va installer les dépendances nécessaires (attention cette opération demande quelques minutes).

$ npm install
Installer node-sass@4.14.1 dans les dépendances de développement

$ npm install node-sass@4.14.1 --save-dev
La partie frontend est installée, pour la démarrer suivre l'étape 7.
Pour que l'application soit fonctionnelle il faudra installer le backend.

=======
Etape 7
=======

Exécuter npm start qui exécute ng serve et compile l'application
$ npm start

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **

Vous pouvez lancer l'application en ouvrant votre browser par exemple google Chrome et en entrant l'adresse suivante :
http://localhost:4200/

==============================================
Le Frontend de votre application est installé
==============================================

Remarque : Pour quitter le terminal et revenir sur l'invite des lignes de commande commande Ctrl + C

===========================
Pour relancer l'application
===========================

Ouvrir votre terminal

Se positionner sur c:/op_projet6/frontend ou si vous n'avez pas utilisé le dossier op_projet6 c:/votre-dossier/frontend

$ cd c:
$ cd op_projet6 (ou votre nom de dossier)
$ cd frontend
$ npm start ( lance ng serve, compile l'application et la rend disponible sur localhost:4200

Puis ouvrir votre browser et entrer l'adresse suivante

http://localhost:4200

========================================================================================================
Nous venons d'installer la partie frontend du projet, nous allons maintenant installer la partie backend

# Veuillez suivre les instructions qui suivent

========
Remarque
========

Pour ce faire vous avez besoin d'ouvrir une nouvelle instance de votre terminal de commande.

En effet nous avons besoin pour le bon fonctionnement de cette application de deux serveurs actifs.
La partie frontend s'exécute sur le localhost:4200 (http://localhost4200)
Cette application est initialisée à partir du premier terminal de commandes

La partie backend ecoute sur le port 3000 (listening on port 3000)
Cette application est initialisée à partir du second terminal de commandes

=================================
Procédure installation du Backend
=================================

=======
Etape 1
=======

Création d'un répertoire dans le dossier contenant le projet op_projet6 (ou votre propre dossier )

=================
Note importante :
=================
Afin d'éviter de le stipuler à chaque commande, veuillez si vous avez utilisé un nom de dossier contenant l'application différent de op_projet6,
à chaque fois que vous trouvez dans cette documentation une référence à op_projet6 la remplacer par votre propre nom de dossier.

Ouvrir une nouvelle instance de votre terminal (nous utiliserons pour notre part Cygwin)
$ cd c:
$ cd op_projet6
$ pwd ( doit envoyer /cygdrive/c/op_projet6 )

$ ls ( affiche le contenu du répertoire => affiche le dossier frontend )

=======
Etape 2
=======

Cloner le backend de l'application à partir de l'adresse suivante

https://github.com/Alain-Gilles/AlainLoiodice_6_02062021.git

vérifiez que le terminal est bien positionné sur le dossier op_projet6

$ pwd (renvoi -> cygdrive/c/op_projet6 ou cygdrive/c/votre répertoire )

$ git clone https://github.com/Alain-Gilles/AlainLoiodice_6_02062021.git

Voici ce qui s'affichera sur le terminal

$ git clone https://github.com/Alain-Gilles/AlainLoiodice_6_02062021.git
Cloning into 'AlainLoiodice_6_02062021'...
remote: Enumerating objects: 108, done.
remote: Counting objects: 100% (108/108), done.
remote: Compressing objects: 100% (78/78), done.
remote: Total 108 (delta 44), reused 82 (delta 27), pack-reused 0
Receiving objects: 100% (108/108), 535.89 KiB | 280.00 KiB/s, done.
Resolving deltas: 100% (44/44), done.

=====================================================================================
Cette commande créait un dossier AlainLoiodice_6_02062021 dans le dossier op_projet6
Nous allons renommer ce dossier en backend
=====================================================================================

=======
Etape 3
=======

Vérifiez que vous êtes bien positionné sur le répertoire op_projet6 ou sur votre répertoire.

$ pwd (renvoi -> cygdrive/c/op_projet6 )
Si ce n'est pas le cas se positionner dessus $ cd c: puis $ cd op_projet6

$ ls ( retourne AlainLoiodice_6_02062021 frontend )
$ mv AlainLoiodice_6_02062021 backend  
(on renomme le dossier AlainLoiodice_6_02062021 en backend)
$ ls ( retourne backend frontend)

=======
Etape 4
=======

Création du répertoire config dans le dossier backend

Commencer par se positionner sur le dossier backend que vous venez de renommer

$ cd backend
Vérifier que vous êtes bien sur le répertoire backend
$ pwd (renvoi -> cygdrive/c/op_projet6/backend )
$ mkdir config
Se positionner sur le repertoire que vous venez de créer
$ cd config
Vérifier
$ pwd (renvoi -> cygdrive/c/op_projet6/backend/config )

=======
Etape 5
=======

Mise en place du fichier environnement

A l'aide du bloc note par exemple, créer un fichier que vous appellerez .env dans le dossier op_projet6/backend/config.

Attention vous ne pouvez pas changer le nom de ce fichier qui doit bien être .env

Ouvrez le bloc note et faire fichier -> enregistrer sous -> sélectionner le disque local C puis le répertoire op_projet6
puis le repertoire backend et enfin le répertoire config.

(Le fichier .env doit être enregistré dans op_projet6/backend/config).

Saisissez dans l'invite Nom du fichier .env puis enregistrer.

Le fichier .env contient les variables d'environnement utilisées par l'API.
Il s'agit de couple de données, chaque couple est constitué par une clé suivie de "=" suivi d'une valeur.
La liste des clés est la suivante (par exemple MONGO_URI est une clé), les valeurs n'ont pas été indiquée ici.

MONGO_URI=
SECRET_KEY=
IV=
KEY=

MONGO_URI=  
doit contenir le nom de l'utilisateur ainsi que son mot de passe ayant accès au cluster de la base de données MongoDB (base de données utilisée pour ce projet) ainsi que l'adresse de connexion au cluster.

SECRET_KEY=
Doit contenir la clé secrète qui est utilisée lors du codage et du décodage du token (jeton) d'authentification.

IV=
Est utilisé lors du cryptage et du décryptage par Crypto-js de l'adresse email. IV contient le sel qui sera rajouté à l'adresse email

KEY=
Est utilisé lors du cryptage et du décryptage par Crypto-js de l'adresse email. Contient la clé de cryptage.

=====================================================================================================================================
Les valeurs qui doivent-être saisies en face des différentes clés sont sensibles.
Nous vous avons envoyé un document par mail séparé (Installation_variables_environnement.txt) qui contient un fichier .env prérempli.
=====================================================================================================================================

Ouvrez votre fichier .env avec le bloc note si vous l'aviez déjà refermé.

Ouvrir le document Installation_variables_environnement.txt et faire un copier des lignes indiquées dans ce document.

Coller ces lignes dans le fichier .env que vous venez de créer, à partir de la ligne 1.

N'oubliez pas ensuite d'enregistrer le fichier .env

=======
Etape 6
=======

Comme vous avez au préalable installé l'environnement frontend, il n'est pas nécessaire de tester si node.js est installé

Positionnez-vous sur le dossier backend

$ cd c:
$ cd op_projet6
$ cd backend
$ pwd (renvoi -> cygdrive/c/op_projet6 )
$ cd backend (renvoi -> cygdrive/c/op_projet6/backend )

Lancer la commande d'installation du projet qui va installer toutes les dépendances nécessaires

$ npm install

=======
Etape 7
=======

Démarrer le backend
$ node server

====================================================================================
Apparté les commandes pour lancer le backend à partir du terminal sont les suivantes

$ cd c:
$ cd op_projet6
$ cd backend
$ node server
===================================================================================

Voici ce qu'affiche le terminal

Listening on port 3000
(node:10120) DeprecationWarning: collection.ensureIndex is deprecated. Use creat
eIndexes instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Connexion à MongoDB réussie !

========================================
Le serveur écoute sur le port 3000
========================================

Pour déconnecter le serveur : Ctrl+C sur la ligne de commande.

======================================================================================================
Pour utiliser l'application le frontend et le backend doivent-être opérationnels

Remarque préalable
Nous vous rappelons que si vous n'avez utilisé op_projet6 comme nom de dossier contenant l'application,
toutes les références à op_projet6 doivent-être remplacées par le nom de dossier que vous aviez choisi
pour contenir l'application.
======================================================================================================

=======
Etape 1
=======

# Démarrer le backend

Afin de pouvoir tester l'application vous devez démarrer le backend à partir d'une première instance de votre terminal de commande.
Ouvrir une instance de votre terminal et entrer les commandes suivantes :

$ cd c:
$ cd op_projet6
$ cd backend
$ node server

=======
Etape 2
=======

# Démarrer le frontend

vous devez démarrer le frontend à partir d'une seconde instance de votre terminal de commande.
Ouvrir une nouvelle instance de votre terminal et entrer les commandes suivantes :

$ cd c:
$ cd op_projet6  
$ cd frontend
$ npm start

=======
Etape 3
=======

# Ouvrir votre browser et entrer l'adresse suivante

http://localhost:4200
Vous êtes prêt à utiliser l'application.

# Remarque

Lorsque vous souhaiterez fermer les serveurs faire un CTRL+C sur chaque terminal
