import { CollectionReference, Firestore, DocumentSnapshot, DocumentData, Timestamp } from '@google-cloud/firestore'
import { Session, SessionRef, UserRef } from '../../model'
import { SessionRepository } from '../../repositories'

export class FirestoreSessionRepository implements SessionRepository {
  private sessions: CollectionReference

  constructor(private db: Firestore) {
    this.sessions = db.collection('sessions')
  }

  async fetchByRef(ref: SessionRef): Promise<Session | null> {
    const doc = await this.sessions.doc(ref.id).get()
    return docToSession(doc)
  }

  async save(session: Session): Promise<void> {
    await this.sessions.doc(session.id).set(sessionToDoc(session))
  }
}

function docToSession(doc: DocumentSnapshot): Session | null {
  const data = doc.data()
  if (data == null) return null
  return new Session({
    id: doc.id,
    user: new UserRef(data.userId),
    client: data.client,
    createdAt: data.createdAt.toDate()
  })
}

function sessionToDoc(session: Session): DocumentData {
  return {
    userId: session.user.id,
    client: session.client,
    createdAt: Timestamp.fromDate(session.createdAt)
  }
}