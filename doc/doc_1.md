# Créez une application complète avec Angular et Firebase


Ici, nous allons créer une nouvelle application et appliquer des connaissances que nous avons apprises tout au long du cours Angular d'OpenClasRoom, 
ainsi que quelques fonctionnalités qu'on n'a pas encore rencontrées.  
On va créer une application simple qui recense les livres qu'on a chez nous, dans votre bibliothèque.  
On peut ajouter une photo de chaque livre.  
L'utilisateur devra être authentifié pour utiliser l'application.


## Penser à la structure de l'application

On va prendre le temps de réfléchir à la construction de l'application.  
Quels seront les components dont on aura besoin ? Les services ? Les modèles de données ?


L'application nécessite l'authentification.  
Il faudra donc :
    - un component pour la création d'un nouvel utilisateur, 
    - et un autre pour s'authentifier, 
    - avec un service gérant les interactions avec le backend.


Les livres pourront être consultés sous forme d'une liste complète, puis individuellement.  
Il faut également pouvoir ajouter et supprimer des livres.  
Il faudra donc :
    - un component pour la liste complète, 
    - un autre pour la vue individuelle 
    - et un dernier comportant un formulaire pour la création/modification.  
    - Il faudra un service pour gérer toutes les fonctionnalités liées à ces components, 
        y compris les interactions avec le serveur.


On va aussi `créer un component séparé pour la barre de navigation` afin d'y intégrer une logique séparée.


Pour les modèles de données, `il y aura un modèle pour les livres`, comportant :
    - le titre, 
    - le nom de l'auteur 
    - et la photo, qui sera facultative.


Il faudra également `ajouter du routing à cette application`, permettant l'accès aux différentes parties, 
`avec une guard pour toutes les routes sauf l'authentification`, empêchant les utilisateurs non authentifiés d'accéder à la bibliothèque.