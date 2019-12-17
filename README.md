# scrutari_workshop_2019
Workshop 2019 visant à proposer une amélioration du moteur de recherche Scrutari

# Qu'est-ce que Scrutari ? 

# Organisation du repo 
## Deux dossiers 
Le dossier client représente l'API 
le dossier portal représente le site web 

## Les branches 
- Une branche master : iso prod, ce qui est livré est mergé sur master 
- une branche develop : la branche évolutive stable ayant nos fonctionnalités non livrés 
- une branche par membre de l'équipe : chaque membre a une branche pour travailler 
    - elle doit être créee depuis "master" 
    - toujours faire un "git pull --rebase" pour être sûr de ne pas avoir un écart avec la branche distante origin (master dans notre cas) 
    - les commit doivent avoir un sens pour comprendre ce qui est développé et livré 



# Comment installer le projet ? 

## portal 

## client 
### Compilation

La compilation se fait avec Jake. Pour installer Jake, il faut d'abord installer npm (présent dans toutes les distributions), vérifier que la commande zip fonctionne puis installer Jake avec :

  npm install -g jake

Il faut alors se rendre dans le répertoire racine du projet et taper :

  jake build[$version]

où $version doit être remplacé par le numéro de version (Exemple : jake build[1.0.1])

La compilation va créer un répertoire dist/ et un répertoire pkg/. Le répertoire dist/ comprend les fichiers compilés et le répertoire pkg contient un fichier compressé au format zip du répertoire dist/.

Le répertoire dist/ est vidé à chaque compilation, ce qui n'est pas le cas du répertoire pkg/.


### Téléchargement

Les versions stables de ScrutariJs sont disponibles à partir de la page du wiki [Téléchargement](https://framagit.org/Scrutari/scrutarijs/wikis/Téléchargement)


#### Installation

L'installation est décrite sur la page du wiki [Installation](https://framagit.org/Scrutari/scrutarijs/wikis/installation)


#### Adaptation

Pour adapter l'interface, la première chose est de surcharger le CSS. Toutes les classes de css/scrutarijs.css sont préfixées par scrutari-, il est donc simple de les remplacer en CSS sans risque d'altération du style existant.

La deuxième étape consiste à reformuler les éléments de structure et les gabarits comme indiqué à la page du wiki [Adaptation](https://framagit.org/Scrutari/scrutarijs/wikis/adaptation)

