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


## Intégrer Firebase à notre application

On installe Firebase avec NPM
    npm install firebase --save

Pour cette application on va créer un nouveau projet sur Firebase, . 
Une fois que ça sera créé, la console Firebase nous proposera le 3 choix.

    - Ajouter Firebase à votre application iOS ( le symbole est iOS)
    - Ajouter Firebase à votre application Android ( le symbole est un genre de sale tête)
    - Ajouter Firebase à votre application Web ( le symbole est </>)


On va choissir `Ajouter Firebase à votre application Web` et copier/coller la configuration (Ajouter le SDK Firebase) dans le constructeur de notre `AppComponent`.

avant angular 6 :
(en ajoutant `import * as firebase from 'firebase';` en haut du fichier, mettant à disposition la méthode initializeApp()).

après angular 6 :
(en ajoutant `import firebase from '@firebase/app';` en haut du fichier, mettant à disposition la méthode initializeApp()).

il y a ça aussi, si on veut :

    // import Firebase Authentication (optional)
`    import '@firebase/auth';`

    // import Firebase Realtime Database (optional)
`    import '@firebase/database';`

    // import Cloud Firestore (optional)
`    import '@firebase/firestore';`


Dans `app.component.ts`
    import { Component } from '@angular/core';
    `import firebase from '@firebase/app';` import * as firebase from 'firebase';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
    export class AppComponent {
        constructor() {
 `           // Your web app's Firebase configuration`
            var firebaseConfig = {
                apiKey: "AIzaSyDtvIO_SEyG8ETGS4qtnCWL0qKf_AYDnBU",
                authDomain: "booksheles-8317f.firebaseapp.com",
                projectId: "booksheles-8317f",
                storageBucket: "booksheles-8317f.appspot.com",
                messagingSenderId: "212096825665",
                appId: "1:212096825665:web:7eda10bd0c27ae242849c0"
            };
`            // Initialize Firebase`
            firebase.initializeApp(firebaseConfig);
        }
    }

grace a tous ça , notre application Angular est maintenant liée a notre projet Firebase, et on pourra intégrer tous les services dont on a besoin.

## Authentification 

On va utiliser l'authentification par adresse mail et mot de passe proposée par Firebase.
Pour ce la , il faut d'abord l'activer dans la console firebase.

`Dans firebase , on clic sur le lien Authentication, puis cliqué sur le bouton commencé et après dans Sing-in methodn on clic sur le lien Adresse e-mail/Mot de passe pour l'activer `
S'il n'y a pas le bouton commencé, il y aura un bouton nommé `Configurer un mode de connexion`

L'authentification Firebase emploie un système de token : 
un jeton d'authentification est stocké dans le navigateur, et est envoyé avec chaque requête nécessitant l'authentification.

---------------------------------------------------------------------

Dans `auth.service.ts` , on va crée 3 méthodes
    - une méthode permettant de créer un nouvel utilisateur ,
    - une méthode permettant de connecter un utilisateur existant,
    - une méthode permettant la déconnexion de l'utilisateur

Puisque les opérations de création, de connexion et de déconnexion sont asyncrones, 
c-a-d qu'elles n'ont pas un résultat instantané, 
les méthodes qu'on va va créer pour les gérer retournerons des promise, 
ce qui permettra de gérer les situation d'erreurs .

`On importe firebase dans AuthService`
Ensuite, `on crée la méthode createNewUser()` pour créer un nouvel utilisateur, 
qui prendra comme argument une adresse mail et un mot de passe, 
et qui retournera une Promise qui résoudra si la création réussit, 
et sera rejetée avec le message d'erreur si elle ne réussit pas .

`Toutes les méthodes liées à l'authentification Firebase se trouvent dans  firebase.auth().`

On crée également `signInUser()`, méthode très similaire, qui s'occupera de connecter un utilisateur déjà existant.

et on crée un simple `signOutUser()` pour la déconnexion

dans `authService.ts`

    import { Injectable } from '@angular/core';
    import firebase from '@firebase/app';

    @Injectable({
    providedIn: 'root'
    })
    export class AuthService {

        constructor() { } 

        /**
        * crée un utilisateur
        * @param {string} email
        * @param {string} password
        */
`        createNewUser(email: string, password: string)`
        {
            return new Promise(
                (resolve, reject) => {

                    firebase.auth()
                        .createUserWithEmailAndPassword(email, password)
                        .then(
                            () => {
                                resolve(true);
                            },
                            (error) => {
                                reject(error);
                            }
                        );
                }
            );
        }

        /**
        * Connexion d'un utilisateur
        * @param {string} email 
        * @param {string} password 
        */
`        signInUser(email: string, password: string)`
        {
            return new Promise(
                (resolve, reject) => {
                    
                    firebase.auth()
                        .signInWithEmailAndPassword(email, password)
                        .then(
                            () => {
                                resolve(true);
                            },
                            (error) => {
                                reject(error);
                            }
                        );
                }
            );
        }

        /**
        * Deconnexion d'un utilisateur
        */
`        signOutUser()`
        {
            firebase.auth().signOut();
        }
    }

------------------------------------------------------------------------

Maintenant on peut s'occupé de `SignupComponent  et  SigninComponent` , 
`intégrer l'authentification dans HeaderComponent afin de montrer les bons liens`, 
et `implémenter AuthGuard pour protéger la route /books et toutes ses sous-routes.`

On commence par SignupComponent

Dans ce component

`    - On génére le formulaire selon la méthode réactive`
        - les deux champs,  `email  et  password , sont requis` — 
            le champ email utilise Validators.email  pour obliger un string sous format d'adresse email ; 
            le champ password emploie  Validators.pattern pour obliger au moins 6 caractères alphanumériques, ce qui correspond au minimum requis par Firebase ;

    - On gére la soumission du formulaire, envoyant les valeurs rentrées par l'utilisateur à la méthode  createNewUser()
        - si la création fonctionne, vous redirigez l'utilisateur vers  /books ;

        - si elle ne fonctionne pas, vous affichez le message d'erreur renvoyé par Firebase.

dans `signup.component.ts`

    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { Router } from '@angular/router';
    import { AuthService } from 'src/app/services/auth/auth.service';

    @Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styles: [
    ]
    })
    export class SignupComponent implements OnInit {

        signupForm: FormGroup;
        errorMessage: string;

        constructor(
            private formBuilder: FormBuilder,
            private authService: AuthService,
            private router: Router
        ) { }

        ngOnInit(): void 
        {
            this.initForm();
        }

        /**
        * On génére le formulaire selon la méthode réactive
        * les deux champs,  email  et  password , sont requis
        */
`        initForm()`
        {
            this.signupForm = this.formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
            });
        }

        /**
        * On envoie les infomation que l'utilisateur entre dans le formulaire 
        * et on appel la méthode CreateNewUser qui est dans authService,
        * si tout est bon, on envoies l'utilisateur vers la page /books 
        * sinon, on evoie une erreur 
        */
`        onSubmit()`
        {
            const email = this.signupForm.get('email').value;
            const password = this.signupForm.get('password').value;

            this.authService.createNewUser(email, password).then(

                () => {
                    this.router.navigate(['/books']);
                },
                (error) => {
                    this.errorMessage = error;
                }
            );
        }

    }


dans `signup.component.html`

Il s'agit d'un formulaire selon la méthode réactive qu'on a vu dans le chapitre correspondant.  
Il y a, en supplément, le paragraphe contenant l'éventuel message d'erreur rendu par Firebase.

    <div class="row">
    <div class="col-sm-8 col-sm-offset-2">
        <h2>Créer un compte</h2>
`        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">`

            <div class="form-group">
                <label for="email">Adresse mail</label>
                <input type="text"
                    id="email"
                    class="form-control"
                    formControlName="email">
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password"
                    id="password"
                    class="form-control"
                    formControlName="password">
            </div>
            <button class="btn btn-primary"
                    type="submit"
                    [disabled]="signupForm.invalid">Créer mon compte</button>
            </form>
`            <p class="text-danger">{{ errorMessage }}</p>`

        </div>
    </div>


On peut créer un template presque identique pour SignInComponent pour la connexion d'un utilisateur déjà existant.  
`Il suffit de renommer signupForm en signinForm et d'appeler la méthode signInUser() plutôt que  createNewUser() .`


----------------------------------------------------------------------------------------------------

Ensuite, on modifie HeaderComponent pour afficher de manière contextuelle les liens de connexion, 
de création d'utilisateur et de déconnexion

Ici, `On utilise onAuthStateChanged(), qui permet d'observer l'état de l'authentification de l'utilisateur : à chaque changement d'état,`
la fonction qu'on passe en argument est exécutée.  
Si l'utilisateur est bien authentifié, onAuthStateChanged() reçoit l'objet de type firebase.User  correspondant à l'utilisateur.  
On peut ainsi baser la valeur de la variable locale `isAuth ` selon l'état d'authentification de l'utilisateur, 
et afficher les liens correspondant à cet état.

dans `header.component.ts`

    import { Component, OnInit } from '@angular/core';
    import { AuthService } from 'src/app/services/auth/auth.service';
    import firebase from '@firebase/app';

    @Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: [
    ]
    })
    export class HeaderComponent implements OnInit {

        isAuth: boolean;

        constructor(private authService: AuthService) { }

        ngOnInit(): void 
        {
            firebase.auth().onAuthStateChanged(

                (user) => {
                    if (user) {
                        this.isAuth = true;
                    }
                    else{
                        this.isAuth = false;
                    }
                }
            );
        }

        onSignOut(){
            this.authService.signOutUser();
        }

    }


dans `header.component.html`

    <nav class="navbar navbar-default">
        <div class="container-fluid">

            <ul class="nav navbar-nav">
                <li routerLinkActive="active" > <a routerLink="books" > Livres</a></li>
            </ul>

            <ul class="nav navbar-nav narbar-right">
                <li routerLinkActive="active" *ngIf="!isAuth"> <a routerLink="auth/signup"> Créer un compte </a></li>
                <li routerLinkActive="active" *ngIf="!isAuth"> <a routerLink="auth/signin"> Connexion </a></li>
                <li> <a (click)="onSignOut()" style="cursor:pointer" *ngIf="isAuth"> Déconnexion </a></li>
            </ul>

        </div>
    </nav>

-----------------------------------------------

Dans AuthGuardService, Puisque la vérification de l'authentification est asynchrone, notre service retournera une Promise :

daus `auth-guard.service.ts`

    import { Injectable } from '@angular/core';
    import { Router } from '@angular/router';
    // import { resolve } from 'dns';
    import { Observable } from 'rxjs';
    import firebase from '@firebase/app';

    @Injectable({
    providedIn: 'root'
    })
    export class AuthGuardService {

        constructor(private router: Router) { }

        canActivate(): Observable<boolean> | Promise<boolean> | boolean
        {
            return new Promise(
                (resolve, reject) => {
                    firebase.auth().onAuthStateChanged(
                        (user) => {
                            if (user) {
                                resolve(true);
                            }
                            else{
                                this.router.navigate(['/auth', 'signin']);
                                resolve(false);
                            }
                        }
                    );
                }
            );
        }
    }


dans `app.modules.ts`

on met les canActivate pour sécuriser certaines routes

    const appRoutes: Routes = [
    { path: 'auth/signup', component: SignupComponent },
    { path: 'auth/signin', component: SigninComponent },
    { path: 'books', canActivate: [AuthGuardService], component: BookListComponent },
    { path: 'books/new', canActivate: [AuthGuardService], component: BookFormComponent },
    { path: 'books/view/:id', canActivate: [AuthGuardService], component: SingleBookComponent },
    { path: '', redirectTo: 'books', pathMatch: 'full' },
    { path: '**', redirectTo: 'books' }
    ];






vidéo stoppé a 33:00