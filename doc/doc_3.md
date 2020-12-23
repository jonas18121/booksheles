# Créer une application complète avec Angular et Firebase

## Storage

`Créer un storage dans notre compte dans firebase.com`, pour que ça s'enregistre dans le site

Dans ce chapitre, on va apprendre à utiliser l'API Firebase Storage afin de permettre à l'utilisateur d'ajouter une photo du livre, 
de l'afficher dans SingleBookComponent et de la supprimer si on supprime le livre, 
afin de ne pas laisser des photos inutilisées sur le serveur.



Tout d'abord, on va ajouter une méthode dans BooksService qui permet d'uploader une photo.

dans `books.service.ts`

    uploadFile(file: File) {
        return new Promise(
            (resolve, reject) => {
                const almostUniqueFileName = Date.now().toString();
                const upload = firebase.storage().ref()
                    .child('images/' + almostUniqueFileName + file.name).put(file);
                    upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    () => {
                        console.log('Chargement…');
                    },
                    (error) => {
                        console.log('Erreur de chargement ! : ' + error);
                        reject();
                    },
                    () => {
                        resolve(upload.snapshot.ref.getDownloadURL());
                    }
                );
            }
        );
    }


On va analyser cette méthode :
    - `firebase.storage.TaskEvent.STATE_CHANGED` = ont veut réagir a chaque changement d'état du téléchargement
    - `upload.snapshot.ref.getDownloadURL()` =  lié l'url de l'image directement avec la base de donnée et aussi dans le component qui affiche l'image 

l'action de télécharger un fichier prend du temps, donc on créer une méthode asynchrone qui retourne une Promise ;

la méthode prend comme argument un fichier de type File ;

    - afin de créer un nom unique pour le fichier 
    (évitant ainsi d'écraser un fichier qui porterait le même nom que celui que l'utilisateur essaye de charger), 
    on crée un string à partir de  Date.now() , qui donne le nombre de millisecondes passées depuis le 1er janvier 1970 ;

on crée ensuite une tâche de chargement  upload  :
    - `firebase.storage().ref()` vous retourne une référence à la racine de votre bucket Firebase,
    - la `méthode child()` retourne une référence au `sous-dossier images` 
    et à un nouveau fichier dont le nom est l'identifiant unique + le nom original du fichier 
    (permettant de garder le format d'origine également),

On utilise ensuite la `méthode on()` de la tâche upload pour en suivre l'état, en y passant trois fonctions :
    - la première est déclenchée à chaque fois que des `données` sont `envoyées vers le serveur`,
    - la deuxième est déclenchée si le serveur renvoie une `erreur`,
    - la troisième est déclenchée lorsque le `chargement` est `terminé` et permet de retourner l'URL unique du fichier chargé.


Pour des applications à très grande échelle, la méthode Date.now() ne garantit pas à 100% un nom de fichier unique, 
mais pour une application de cette échelle, cette méthode suffit largement.

----------------------------------------------------------------------------------------------
Maintenant que le service est prêt, on va ajouter les fonctionnalités nécessaires à BookFormComponent.

dans `Book-form.component.ts`

on va crée ces 3 propriétés
    fileIsUploading = false;
    fileUrl: string;
    fileUploaded = false;


Ensuite, créez la méthode qui déclenchera uploadFile() et qui en récupérera l'URL retourné :

    onUploadFile(file: File) {
        this.fileIsUploading = true;
        this.booksService.uploadFile(file).then(
            (url: string) => {
                this.fileUrl = url;
                this.fileIsUploading = false;
                this.fileUploaded = true;
            }
        );
    }


    on modifie légèrement onSaveBook() pour prendre en compte l'URL de la photo si elle existe

    onSaveBook() {
        const title = this.bookForm.get('title').value;
        const author = this.bookForm.get('author').value;
        const synopsis = this.bookForm.get('synopsis').value;
        const newBook = new Book(title, author);
        newBook.synopsis = synopsis;
        if(this.fileUrl && this.fileUrl !== '') {
            newBook.photo = this.fileUrl;
        }
        this.booksService.createNewBook(newBook);
        this.router.navigate(['/books']);
    }


On va créer une méthode qui permettra de lier le  < input type="file">  
(que vous créerez par la suite) à la méthode  onUploadFile()

    detectFiles(event) {
        this.onUploadFile(event.target.files[0]);
    }


L'événement est envoyé à cette méthode depuis cette nouvelle section du template
Dans `book-form.component.ts` :

    <div class="form-group">
        <h4>Ajouter une photo</h4>
`        <input type="file" (change)="detectFiles($event)"`
            class="form-control" accept="image/*">

`        <p class="text-success" *ngIf="fileUploaded">Fichier chargé !</p>`

    </div>
`    <button class="btn btn-success" [disabled]="bookForm.invalid || fileIsUploading" type="submit">`
        Enregistrer

    </button>

`accept="image/*"` = accept des filier de format image, exemple des fichier aevc extention .png, .jpeg, .gif etc...

Dès que l'utilisateur choisit un fichier, l'événement est déclenché et le fichier est uploadé.  
`Le texte "Fichier chargé !" est affiché lorsque fileUploaded est true` , 
et `le bouton est désactivé quand le formulaire n'est pas valable ou quand fileIsUploading est true` .


Il ne reste plus qu'à afficher l'image, si elle existe, dans SingleBookComponent

    <div class="row">
    <div class="col-xs-12">
        <img style="max-width:400px;" *ngIf="book.photo" [src]="book.photo">
        <h1>{{ book.title }}</h1>
        <h3>{{ book.author }}</h3>
        <p>{{ book.synopsis }}</p>
        <button class="btn btn-default" (click)="onBack()">Retour</button>
    </div>
    </div>


Il faut également prendre en compte que si un livre est supprimé, il faut également en supprimer la photo. La nouvelle méthode removeBook() est la suivante :

dans `books.service.ts`

    removeBook(book: Book) {
        if(book.photo) {
        const storageRef = firebase.storage().refFromURL(book.photo);
            storageRef.delete().then(
                () => {
                console.log('Photo removed!');
                },
                (error) => {
                console.log('Could not remove photo! : ' + error);
                }
            );
        }
        const bookIndexToRemove = this.books.findIndex(
            (bookEl) => {
                if(bookEl === book) {
                return true;
                }
            }
        );
        this.books.splice(bookIndexToRemove, 1);
        this.saveBooks();
        this.emitBooks();
    }


Puisqu'il faut une référence pour supprimer un fichier avec la `méthode delete()`, 
vous passez l'URL du fichier à refFromUrl() pour en récupérer la référence.