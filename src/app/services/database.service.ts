import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private firestore: AngularFirestore) {}

  async create(collection: string, data: object) {
    if (!collection || !data) {
      return;
    }

    return await this.firestore.collection(collection).add(data);
  }
}
