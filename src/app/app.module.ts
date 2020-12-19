import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from  '@angular/router';




////////////////////// S E R V I C E S //////////////////////
import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { BooksService } from './services/books/books.service';



////////////////////// C O M P O N E N T //////////////////////
import { AppComponent } from './app.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { SingleBookComponent } from './components/book-list/single-book/single-book.component';
import { BookFormComponent } from './components/book-list/book-form/book-form.component';
import { HeaderComponent } from './components/header/header.component';


////////////////////// R O U T E //////////////////////

const appRoutes: Routes = [
    {path: 'auth/signup', component: SignupComponent},
    {path: 'auth/signin', component: SigninComponent},
    {path: 'books', component: BookListComponent},
    {path: 'books/new', component: BookFormComponent},
    {path: 'books/view/:id', component: SingleBookComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        SignupComponent,
        SigninComponent,
        BookListComponent,
        SingleBookComponent,
        BookFormComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        AuthService,
        AuthGuardService,
        BooksService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
