import { Firestore, CollectionReference, DocumentSnapshot, DocumentData, Timestamp,  } from '@google-cloud/firestore'
import { Post, PostRef, UserRef } from '../../model'
import { PostRepository } from '../../repositories'

export class FirestorePostRepository implements PostRepository {
  private posts: CollectionReference

  constructor(private db: Firestore) {
    this.posts = db.collection('posts')
  }

  async fetchByRef(ref: PostRef): Promise<Post | null> {
    const doc = await this.posts.doc(ref.id).get()
    return docToPost(doc)
  }

  async fetchByRefs(refs: PostRef[]): Promise<Array<Post | null>> {
    const docRefs = refs.map(ref => this.posts.doc(ref.id))
    const docs = await this.db.getAll(...docRefs)
    return docs.map(docToPost)
  }

  async save(post: Post): Promise<void> {
    await this.posts.doc(post.id).set(postToDoc(post))
  }
}

function docToPost(doc: DocumentSnapshot): Post | null {
  const data = doc.data()
  if(data == null) return null

  return new Post({
    id: doc.id,
    author: new UserRef(data.authorId),
    createdAt: data.createdAt.toDate(),
    text: data.text,
    visibility: data.visibility
  })
}

function postToDoc(post: Post): DocumentData {
  return {
    authorId: post.author.id,
    createdAt: Timestamp.fromDate(post.createdAt),
    text: post.text,
    visibility: post.visibility
  }
}