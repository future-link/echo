import { UUID, Post, PostRef } from '../../model'
import { PostRepository } from '../../repositories'

export class MemPostRepository implements PostRepository {
  private posts: Map<UUID, Post>

  constructor(posts: Post[]) {
    this.posts = new Map(posts.map(p => [p.id, p]))
  }

  fetchByRef(ref: PostRef): Promise<Post | null> {
    return Promise.resolve(this.posts.get(ref.id) || null)
  }

  fetchByRefs(refs: PostRef[]): Promise<(Post | null)[]> {
    return Promise.all(refs.map(ref => this.fetchByRef(ref)))
  }

  async save(post: Post): Promise<void> {
    this.posts.set(post.id, post)
  }
}
