import { Post , PostRef } from '../model/post'

export interface PostRepository {
  fetchByRef(ref: PostRef): Promise<Post | null>
  fetchByRefs(refs: PostRef[]): Promise<(Post | null)[]>
  save(post: Post): Promise<void>
}
