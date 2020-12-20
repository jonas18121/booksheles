import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styles: [
  ]
})
export class SigninComponent implements OnInit {

    signinForm: FormGroup;
    errorMessage: string;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void 
    {
        this.initForm();
    }

    /**
     * On génére le formulaire selon la méthode réactive
     * les deux champs,  email  et  password , sont requis
     */
    initForm()
    {
        this.signinForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
        });
    }

    /**
     * On envoie les infomation que l'utilisateur entre dans le formulaire 
     * et on appel la méthode singInUser qui est dans authService,
     * si tout est bon, on envoies l'utilisateur vers la page /books 
     * sinon, on evoie une erreur 
     */
    onSubmit()
    {
        const email = this.signinForm.get('email').value;
        const password = this.signinForm.get('password').value;

        this.authService.signInUser(email, password).then(

            () => {
                this.router.navigate(['/books']);
            },
            (error) => {
                this.errorMessage = error;
            }
        );
    }

}
