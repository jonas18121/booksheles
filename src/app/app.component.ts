import { Component } from '@angular/core';
// import * as firebase from 'firebase';

// import core firebase client (required)
import firebase from '@firebase/app';

// import Firebase Authentication (optional)
import 'firebase/auth';

// import Firebase Realtime Database (optional)
import 'firebase/database';

// import Cloud Firestore (optional)
import 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
    title = 'booksheles';

    constructor()
    {
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyBYGpIToiyw_pOZRaPQfokZNpLX6t-gue8",
            authDomain: "booksheles-7c89e.firebaseapp.com",
            projectId: "booksheles-7c89e",
            storageBucket: "booksheles-7c89e.appspot.com",
            messagingSenderId: "1008077620161",
            appId: "1:1008077620161:web:0f4dee5456c26c909fe540"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }
}
