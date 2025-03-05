/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { RtdbService } from './services/rtdb/rtdb.service';
import { FirebaseStorageService } from '../../shared/services/firebase-storage/firebase-storage.service';
import { RtdbController } from './controllers/rtdb.controller';
import * as admin from 'firebase-admin';
import { firebaseConfig, serviceAccount } from './firebase.config';

const imports: any[] = [

];

const providers: any[] = [
  FirestoreService,
  RtdbService,
  FirebaseStorageService,
  // FirebaseService,
  {
    provide: 'FirebaseAdmin',
    useValue: admin.initializeApp({
      credential: admin.credential.cert(
        serviceAccount as admin.ServiceAccount,
      ),
      //****** !!!! For production, PLEASE ensure the databaseURL and storage bucket are stored securely e.g in environment variables
      databaseURL: firebaseConfig.databaseURL,
      storageBucket: firebaseConfig.storageBucket,
    }),
  },
];

const allExports = imports.concat(providers);
@Module({
  providers,
  imports,
  exports: allExports,
  controllers: [RtdbController],
})
export class FirebaseModule { }
