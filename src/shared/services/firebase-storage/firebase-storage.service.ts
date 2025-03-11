/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";
import { firebaseConfig } from 'src/integrations/firebase/firebase.config';
@Injectable()
export class FirebaseStorageService {
    private readonly firebaseApp: admin.app.App;
    private storage = this.getStorage();

    constructor() { }

    private getStorage() {
        return admin.storage().bucket(firebaseConfig.storageBucket).storage.bucket(firebaseConfig.databaseURL);
    }


    // private uploadTask(filePath: string, file: File): Observable<string> {

    //     return new Observable<string>((subscriber) => {
    //         const fileRef = this.storage// Replace with your storage path

    //         const uploadTask = fileRef.put(file);

    //         uploadTask.on(
    //             'state_changed',
    //             snapshot => {
    //                 // Observe state change events such as progress, pause, and resume
    //                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    //                 switch (snapshot.state) {
    //                     case 'paused':
    //                         break;
    //                     case 'running':
    //                         break;
    //                 }
    //             },
    //             error => {
    //                 // Handle unsuccessful uploads
    //                 console.error('Error:', error);
    //             },
    //             () => {
    //                 // Handle successful uploads on complete
    //                 uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
    //                     // Do something with the download URL
    //                     subscriber.next(downloadURL);
    //                 });
    //             }
    //         );
    //     });

    // }
}
