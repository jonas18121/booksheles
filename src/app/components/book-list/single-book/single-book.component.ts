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
