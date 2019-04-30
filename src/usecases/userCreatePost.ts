import { Usecase }from './type'
import { UserRef, Post, ValidationError } from '../model'

export type UserCreatePost = (arg: { userRef: UserRef, text: string }) => Promise<Post>

export const userCreatePost: Usecase<UserCreatePost> = ({ userRepository, postRepository }) => async ({ userRef, text }) => {
  const user = await userRepository.fetchByRef(userRef)
  if(user == null) throw new ValidationError('user not found')

  const post = user.createPost({ text })
  await postRepository.save(post)

  return post
}