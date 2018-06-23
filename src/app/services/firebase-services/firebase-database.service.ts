import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FirebaseDatabaseService {

  constructor(private angularFirestore: AngularFirestore) {
    angularFirestore.firestore.settings({ timestampsInSnapshots: true });
  }

  getCollection(collectionName: string): Observable<any> {
    // return this.angularFirestore.collection(collectionName).valueChanges();
    return this.angularFirestore.collection(collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addDocument(collectionName: string, object: Object, id: string) {
    const jsonString = JSON.stringify(object);
    this.angularFirestore.collection(collectionName).doc(id).set(JSON.parse(jsonString));
  }

  updateDocument(collectionName: string, object: Object, id: string) {
    const jsonString = JSON.stringify(object);
    this.angularFirestore.collection(collectionName).doc(id).update(JSON.parse(jsonString));
  }

  addDocumentNoId(collectionName: string, object: Object): Promise<any> {
    const jsonString = JSON.stringify(object);
    return this.angularFirestore.collection(collectionName).add(JSON.parse(jsonString));
  }

  getDocumentById(collectionName: string, id: string): Observable<any> {
    return this.angularFirestore.doc(collectionName + '/' + id).valueChanges();
  }

  getCollectionWhere(collectionName: string, field: string, operator: any, value: any): Observable<any> {
    return this.angularFirestore.collection(collectionName, ref => ref.where(field, operator, value)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log('found: ' + JSON.stringify(data));
        return { id, ...data };
      }))
    );
  }

  getCollectionWithSpecificValues(collectionName: string, values: string[]): Observable<any> {
    return this.angularFirestore.collection(collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log('index= ' + values.indexOf(data.username));
        if (values.indexOf(data.username) >= 0) {
          console.log('id: ' + id + 'found: ' + JSON.stringify(data));
          return { id, ...data };
        }
      }))
    );
  }

}
