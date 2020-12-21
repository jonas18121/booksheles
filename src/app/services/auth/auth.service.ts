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
    createNewUser(email: string, password: string)
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
    signInUser(email: string, password: string)
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
    signOutUser()
    {
        firebase.auth().signOut();
    }
}
