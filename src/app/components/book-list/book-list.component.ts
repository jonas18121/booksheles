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
        this.booksService.getBooks();
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
        this.router.navigate(['/books', 'view', id])
    }

    ngOnDestroy(){
        this.booksSubscription.unsubscribe();
    }

}
