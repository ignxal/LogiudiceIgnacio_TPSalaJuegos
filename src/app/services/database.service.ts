import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Questions } from '../models/questions';
import { Logos } from '../models/logos';
import { Surveys } from '../models/surveys';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  questionsCollection = 'questions';
  logosCollection = 'logos';
  surveyCollection = 'surveys';

  constructor(
    private firestore: AngularFirestore,
    private database: AngularFireDatabase
  ) {}

  async create(collection: string, data: object) {
    if (!collection || !data) {
      return null;
    }

    return await this.firestore.collection(collection).add(data);
  }

  getAll(collection: string) {
    if (!collection) {
      throw new Error('Collection name is required');
    }

    return this.firestore.collection(collection).get();
  }

  getDatabase(databaseName: string) {
    return this.database.list(`/${databaseName}`);
  }

  async getByFieldValue(collection: string, fieldName: string, value: string) {
    if (!collection || !fieldName || !value) {
      return null;
    }

    try {
      return await this.firestore
        .collection(collection, (ref) => ref.where(fieldName, '==', value))
        .get();
    } catch (err) {
      console.log('Error in getById: ', err);
      return null;
    }
  }

  getQuestions(): Observable<Questions[]> {
    return this.firestore
      .collection<Questions>(this.questionsCollection)
      .get()
      .pipe(
        map((querySnapshot) => {
          return querySnapshot.docs.map((doc) => doc.data());
        })
      );
  }

  getLogos(): Observable<Logos[]> {
    return this.firestore
      .collection<Logos>(this.logosCollection)
      .get()
      .pipe(
        map((querySnapshot) => {
          return querySnapshot.docs.map((doc) => doc.data());
        })
      );
  }

  updateByFieldValue(
    collection: string,
    fieldName: string,
    value: string,
    data: any
  ) {
    if (!collection || !fieldName || !value || !data) {
      return null;
    }

    return this.getByFieldValue(collection, fieldName, value)
      .then((res) => {
        if (!res) {
          return null;
        }

        return res?.subscribe({
          next(querySnapshot) {
            if (!querySnapshot || querySnapshot.empty) {
              console.log('Document not found');
              return null;
            }

            const docRef = querySnapshot.docs[0].ref;

            return docRef
              .update(data)
              .then(() => {
                return true;
              })
              .catch((err) => {
                console.log(err);
                return null;
              });
          },
          error(err) {
            console.log('Received an error: ' + err);
            return null;
          },
        });
      })
      .catch((err) => {
        console.log('Error in updateByFieldValue: ', err);
        return null;
      });
  }

  saveSurvey(survey: Surveys): Observable<any> {
    return new Observable((observer) => {
      this.firestore
        .collection(this.surveyCollection)
        .add(survey)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error al guardar el survey en Firestore', error);
          observer.error(error);
        });
    });
  }
}
