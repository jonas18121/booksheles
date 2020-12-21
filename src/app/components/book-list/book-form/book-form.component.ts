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
