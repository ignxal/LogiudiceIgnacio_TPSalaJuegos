import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
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
}
