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
