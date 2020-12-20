import { Component } from '@angular/core';
// import * as firebase from 'firebase';

// import core firebase client (required)
import firebase from '@firebase/app';

// import Firebase Authentication (optional)
import '@firebase/auth';

// import Firebase Realtime Database (optional)
import '@firebase/database';

// import Cloud Firestore (optional)
import '@firebase/firestore';

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
            apiKey: "AIzaSyDtvIO_SEyG8ETGS4qtnCWL0qKf_AYDnBU",
            authDomain: "booksheles-8317f.firebaseapp.com",
            projectId: "booksheles-8317f",
            storageBucket: "booksheles-8317f.appspot.com",
            messagingSenderId: "212096825665",
            appId: "1:212096825665:web:7eda10bd0c27ae242849c0"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }
}
