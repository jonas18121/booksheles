# Créer une application complète avec Angular et Firebase

## Base de données

`Créer une base de donnée dans notre compte dans firebase.com`, pour que ça s'enregistre dans le site

Dans ce chapitre, on va créer les fonctionnalités de l'application : 
    - la création, 
    - la visualisation 
    - et la suppression des livres, 
le tout lié directement à la base de données Firebase.

`Pour créer BooksService :`

    - on aura un array local books et un Subject pour l'émettre ;

    - on aura des méthodes :
        - pour enregistrer la liste des livres sur le serveur,
        - pour récupérer la liste des livres depuis le serveur,
        - pour récupérer un seul livre,
        - pour créer un nouveau livre,
        - pour supprimer un livre existant.


ici on ce concentre sur `BooksService.ts`, 
On va utiliser une méthode mise à disposition par Firebase pour enregistrer la liste sur un node de la base de données 
`— la méthode set()`
    `La méthode ref()` retourne une référence au node demandé de la base de données, 
    et `set()` fonctionne plus ou moins comme put() pour le HTTP : 
        il écrit et remplace les données au node donné.


On crée :
    - la `methode saveBooks()` pour enregistrer la liste , 
    - la `méthode getBooks()` pour récupérer la liste entière des livres 
    - la `méthode getSingleBook()` pour récupérer un seul livre, 
    - la `méthode createNewBook()` pour créer un nouveau livre,
    - la `méthode removeBook()` pour supprimer un livre,
    
On utilise les deux fonctions proposées par Firebase : `on() et once()`
    - la `méthode on() qui est dans getBooks()`:
        - `le premier argument de la méthode on() est 'value'` qui :
            demande à Firebase d'exécuter le callback à chaque modification de valeur enregistrée au endpoint choisi : 
            cela veut dire que si on modifie quelque chose depuis un appareil, 
            la liste sera automatiquement mise à jour sur tous les appareils connectés.
            Ensuite, on ajoute un constructor au service pour appeler getBooks() au démarrage de l'application
.        
        - `Le deuxième argument de la méthode on() est la fonction callback, qui reçoit ici une DataSnapshot` : 
            `Le DataSnapshot` c'est un objet correspondant au node demandé, 
            comportant plusieurs membres et méthodes (`il faut importer DataSnapshot depuis firebase.database.DataSnapshot => import DataSnapshot = firebase.database.DataSnapshot;` ).   
        La méthode qui nous intéresse ici est val(), qui retourne la valeur des données, tout simplement.  
        Notre callback prend également en compte le cas où le serveur ne retourne rien pour éviter les bugs potentiels.
.
    - la `méthode once() qui est dans getSingleBook()`:
    once() fait qu'une seule requête de données.
    Du coup, elle ne prend pas une fonction callback en argument mais retourne une Promise, permettant l'utilisation de .then() pour retourner les données reçues.


Dans `BooksService.ts`
    import { Injectable } from '@angular/core';
    import { Subject } from 'rxjs';
    import { Book } from 'src/app/models/book.model';
    import firebase from 'firebase/app';

`    import DataSnapshot = firebase.database.DataSnapshot;`

    @Injectable({
        providedIn: 'root'
    })
    export class BooksService {
        
        books: Book[] = [];
        booksSubject = new Subject<Book[]>();

        constructor() {
            this.getBooks();
        }

        /**
        *  qui réagit lorsque le service reçoit de nouvelles données, 
        *  puis qui émet ces données par le Subject et 
        *  qui appele cette méthode dans toutes les méthodes qui en ont besoin ;
        */
        emitBooks(){
            this.booksSubject.next(this.books);
        }

        saveBooks(){
`            firebase.database().ref('/books').set(this.books);`
        }

        /**
        * afficher la liste des livres
        */
`        getBooks(){`
            firebase.database().ref('/books')
`               .on('value', (data: DataSnapshot ) => {`

                    this.books = data.val() ? data.val() : [];
                    this.emitBooks();
                });
        }

        /**
        * afficher un livre précis
        * @param {number} id 
        */
 `       getSingleBook(id: number)`
        {
            return new Promise(
                (resolve, reject) => {
`                    firebase.database().ref('/books/' + id).once('value').then(`
                        (data: DataSnapshot) => {
                            resolve(data.val());
                        }, (error) => {
                            reject(error);
                        }
                    );
                }
            );
        }

        /**
        * Créer un nouveau livre
        * @param {Book} newBook 
        */
`        createNewBook(newBook: Book)`
        {
            this.books.push(newBook);
            this.saveBooks();
            this.emitBooks();
        }

`        removeBook(book: Book)`
        {
            const bookIndexToRemove = this.books.findIndex(
                (bookEl) => {
                    if(bookEl === book) {
                        return true
                    }
                }
            );

            this.books.splice(bookIndexToRemove,1);
            this.saveBooks();
            this.emitBooks();
        }
    }


Ensuite, on va créer `BookListComponent`, qui :

    - souscrit au Subject du service et déclenche sa première émission ;
    - affiche la liste des livres, où chaque livre peut être cliqué pour en voir la page  SingleBookComponent ;
    - permet de supprimer chaque livre en utilisant  removeBook() ;
    - permet de naviguer vers  BookFormComponent  pour la création d'un nouveau livre. 

dans `book-list.component.ts`

    import { Component, OnDestroy, OnInit } from '@angular/core';
    import { Router } from '@angular/router';
    import { Subscription } from 'rxjs';
    import { Book } from 'src/app/models/book.model';
    import { BooksService } from 'src/app/services/books/books.service';

    @Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styles: [
    ]
    })
    export class BookListComponent implements OnInit, OnDestroy {

        books: Book[];
        booksSubscription: Subscription;

        constructor(private booksService: BooksService, private router: Router) { }

        /**
        * souscrit au Subject du service et déclenche sa première émission ;
        */
        ngOnInit(): void {
            this.booksSubscription = this.booksService.booksSubject.subscribe(
                (books: Book[]) => {
                    this.books = books;
                }
            );
            this.booksService.emitBooks();
        }

        /**
        * naviguer vers  BookFormComponent  pour la création d'un nouveau livre
        */
        onNewBook(){
            this.router.navigate(['/books', 'new']);
        }

        /**
        *  supprimer un livre
        */
        onDeleteBook(book: Book){
            this.booksService.removeBook(book);
        }

        /**
        * voir un livre
        * @param {number} id 
        */
        onViewBook(id: number){
            this.router.navigate(['/books', 'view',])
        }

        ngOnDestroy(){
            this.booksService.booksSubject.unsubscribe();
        }

    }


dans `book-list.component.html`

    <div class="row">
    <div class="col-xs-12">
        <h2>Vos livres</h2>
        <div class="list-group">
        <button
            class="list-group-item"
            *ngFor="let book of books; let i = index"
            (click)="onViewBook(i)">
            <h3 class="list-group-item-heading">
            {{ book.title }}
            <button class="btn btn-default pull-right" (click)="onDeleteBook(book)">
                <span class="glyphicon glyphicon-minus"></span>
            </button>
            </h3>
            <p class="list-group-item-text">{{ book.author }}</p>
        </button>
        </div>
        <button class="btn btn-primary" (click)="onNewBook()">Nouveau livre</button>
    </div>
    </div>

dans `single-book.component.ts`

    import { Component, OnInit } from '@angular/core';
    import { ActivatedRoute, Router } from '@angular/router';
    import { Book } from 'src/app/models/book.model';
    import { BooksService } from 'src/app/services/books/books.service';

    @Component({
    selector: 'app-single-book',
    templateUrl: './single-book.component.html',
    styles: [
    ]
    })
    export class SingleBookComponent implements OnInit {

        /**
        * la variable book doit contenir des objets de type Book
        */
        book: Book;

        constructor(
            private route: ActivatedRoute, 
            private booksService: BooksService,
            private router: Router
        ) { }

        /**
        * SingleBookComponent récupère le livre demandé par son id grâce à  getSingleBook() , 
        * et l'affiche dans son template 
        */
        ngOnInit(): void {
            // this.book contient l'instance de new Book('', '')
            this.book = new Book('', '');

            const id = this.route.snapshot.params['id'];
            this.booksService.getSingleBook(+id).then(
                (book: Book) => {
                    this.book = book;
                }
            );
        }

        onBack(){
            this.router.navigate(['/books']);
        }

    }


dans `single-book.component.html`

    <div class="row">
        <div class="col-xs-12">
            <h1>{{ book.title }}</h1>
            <h3>{{ book.author }}</h3>
            <p>{{ book.synopsis }}</p>
            <button class="btn btn-default" (click)="onBack()" >Retour</button>
        </div>
    </div>


Il ne reste plus qu'à créer  BookFormComponent , qui comprend un formulaire selon la méthode réactive 
et qui enregistre les données reçues grâce à  createNewBook()  :


dans `book-form.component.ts`
    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { Router } from '@angular/router';
    import { Book } from 'src/app/models/book.model';
    import { BooksService } from 'src/app/services/books/books.service';

    @Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styles: [
    ]
    })
    export class BookFormComponent implements OnInit {

        bookForm: FormGroup;

        constructor(
            private formBuilder: FormBuilder,
            private booksService: BooksService,
            private router: Router
        ) { }

        ngOnInit(): void {
            this.initForm();
        }

        initForm(){
            this.bookForm = this.formBuilder.group({
                title: ['', Validators.required],
                author: ['', Validators.required],
                synopsis: ''
            });
        }

        onSaveBook(){
            const title = this.bookForm.get('title').value;
            const author = this.bookForm.get('author').value;
            const synopsis = this.bookForm.get('synopsis').value;
            const newBook = new Book(title, author);
            newBook.synopsis = synopsis;

            this.booksService.createNewBook(newBook);
            this.router.navigate(['/books']);
        }

    }


dans `book-form.component.html`

    <div class="row">
        <div class="col-sm-8 col-sm-offset-2">
            <h2>Enregistrer un Nouveau livre</h2>
            <form [formGroup]="bookForm" (ngSubmit)="onSaveBook">

                <div class="form-group">
                    <label for="title">Titre</label>
                    <input type="text" id="title" class="form-control" formControlName="title">
                </div>

                <div class="form-group">
                    <label for="author">Auteur</label>
                    <input type="text" id="author" class="form-control" formControlName="author">
                </div>

                <div class="form-group">
                    <label for="synopsis">Synopsis</label>
                    <textarea id="sysnopsis" cols="30" rows="10" class="form-control" formControlName="synopsis"></textarea>
                </div>

                <button class="btn btn-success" type="submit" [disabled]="bookForm.invalid">Enregistrer</button>

            </form>
        </div>
    </div>

Et ça y est, l' application fonctionne ! 
Elle enregistre et lit notre liste de livres sur notre backend Firebase, 
rendant ainsi son fonctionnement totalement dynamique !
