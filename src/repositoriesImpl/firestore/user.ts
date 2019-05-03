import { Firestore, CollectionReference, DocumentSnapshot, DocumentData, Timestamp } from '@google-cloud/firestore'
import { User, UserRef } from '../../model'
import { UserRepository } from '../../repositories'

export class FirestoreUserRepository implements UserRepository {
  private users: CollectionReference

  constructor(private db: Firestore) {
    this.users = db.collection('users')
  }

  async fetchByRef(ref: UserRef): Promise<User | null> {
    const doc = await this.users.doc(ref.id).get()
    return docToUser(doc)
  }

  async fetchByRefs(refs: UserRef[]): Promise<Array<User | null>> {
    const docRefs = refs.map(ref => this.users.doc(ref.id))
    const docs = await this.db.getAll(...docRefs)
    return docs.map(docToUser)
  }

  async fetchByHandle(handle: string): Promise<User | null> {
    const qs = await this.users
      .where('handle', '==', handle)
      .limit(1)
      .get()
    if (qs.empty) return null
    const doc = qs.docs[0]
    return docToUser(doc)
  }

  async save(user: User): Promise<void> {
    await this.users.doc(user.id).set(userToDoc(user))
  }
}

function docToUser(doc: DocumentSnapshot): User | null {
  const data = doc.data()
  if (data == null) return null
  return new User({
    id: doc.id,
    handle: data.handle,
    name: data.name,
    hashedPassword: data.hashedPassword,
    iconUrl: data.iconUrl,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  })
}

function userToDoc(user: User): DocumentData {
  return {
    handle: user.handle,
    name: user.name,
    hashedPassword: user.hashedPassword,
    iconUrl: user.iconUrl,
    createdAt: Timestamp.fromDate(user.createdAt),
    updatedAt: Timestamp.fromDate(user.updatedAt),
  }
}
