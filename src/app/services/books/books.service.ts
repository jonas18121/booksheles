import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import firebase from 'firebase/app';

import DataSnapshot = firebase.database.DataSnapshot;


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

    /**
     * enregistrer la liste des livres dans la base de donnée
     */
    saveBooks(){
        firebase.database().ref('/books').set(this.books);
    }

    /**
     * afficher la liste des livres
     */
    getBooks(){
        firebase.database().ref('/books')
            .on('value', (data: DataSnapshot ) => {

                this.books = data.val() ? data.val() : [];
                this.emitBooks();
            });
    }

    /**
     * afficher un livre précis
     * @param {number} id 
     */
    getSingleBook(id: number)
    {
        return new Promise(
            (resolve, reject) => {
                firebase.database().ref('/books/' + id).once('value').then(
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
    createNewBook(newBook: Book)
    {
        this.books.push(newBook);
        this.saveBooks();
        this.emitBooks();
    }

    removeBook(book: Book)
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
