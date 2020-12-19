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


## Structurer l'application

On va créer notre projet : 
    ng new my-first-project --style=scss --skip-tests=true

--style=scss  = on va travailler avec des fichiers scss

--skip-tests=true = on ne veut utiliser les fichiers de tests

Puis pour cette application, On va utiliser le CLI pour la création des components.  
L'arborescence sera la suivante :

    ng g c components/auth/signup
    ng g c components/auth/signin
    ng g c components/book-list
    ng g c components/book-list/single-book
    ng g c components/book-list/book-form
    ng g c components/header
    ng g s services/auth/auth
    ng g s services/books/books
    ng g s services/auth-guard/auth-guard   


`Les services ne sont pas automatiquement mis dans l'array providers d'AppModule `, donc on les ajoute maintenant.  
Pendant qu'on travaille sur AppModule, `on va ajouté également FormsModule, ReactiveFormsModule et  HttpClientModule`  : `Ne pas oublié d'ajouter les imports en haut du fichier !`

dans app.module.ts
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [AuthService, BooksService, AuthGuardService],


on install bootstrap
    npm install bootstrap --save

pour ce cour on va utiliser la version 3.3.7 de bootstrap
    npm install bootstrap@3.3.7 --save


dans `styles : [], qui est dans angular.json`  on va mettre le chemin du bootstrap.css qui ce trouve dans node_modules

    "styles": [
        "node_modules/bootstrap/dist/css/bootstrap.css",
        "styles.css"
    ],


On va intégrer dès maintenant le routing sans guard afin de pouvoir accéder à toutes les sections de l'application pendant le développement :

dans appModules
    const appRoutes: Routes = [
        { path: 'auth/signup', component: SignupComponent },
        { path: 'auth/signin', component: SigninComponent },
        { path: 'books', component: BookListComponent },
        { path: 'books/new', component: BookFormComponent },
        { path: 'books/view/:id', component: SingleBookComponent }
    ];

    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
`        RouterModule.forRoot(appRoutes)`
    ],


On va Générer également un dossier appelé models et créer le fichier book.model.ts  :

    export class Book {
        photo: string;
        synopsis: string;
        constructor(public title: string, public author: string) {}
    }


Puis, on prépare HeaderComponent avec un menu de navigation, 
avec les routerLink et AppComponent qui l'intègre avec le router-outlet  :


