import { Model, Reference, Metadata, User, UserRef, Post, PostRef, Session, SessionRef, NotFoundError } from '../model'

type LinksMap = {
  [key: string]: Model | Reference
}

export function modelToJson(model: Model | null, embedded?: unknown): unknown {
  if (model == null) throw new NotFoundError('cannot find requested resource(s)')

  return {
    ...convertToJson(model!),
    _links: presentLinksMap(convertToLinksMap(model!)),
    _embedded: embedded || {},
  }
}

function convertToJson(model: Model): unknown {
  switch (model.type) {
    case 'Metadata':
      return meadataToJson(model)
    case 'User':
      return userToJson(model)
    case 'Post':
      return postToJson(model)
    case 'Session':
      return sessionToJson(model)
  }
}

function convertToLinksMap(model: Model): LinksMap {
  switch (model.type) {
    case 'Metadata':
      return metadataToLinks(model)
    case 'User':
      return userToLinks(model)
    case 'Post':
      return postToLinks(model)
    case 'Session':
      return sessionToLinks(model)
  }
}

function presentLinksMap(map: LinksMap): unknown {
  let res: any = {}
  for (const [k, v] of Object.entries(map)) {
    res[k] = convertToLink(v)
  }
  return res
}

function convertToLink(obj: Model | Reference): { href: string } {
  return { href: convertToPath(obj) }
}

function convertToPath(obj: Model | Reference): string {
  switch (obj.type) {
    case 'Metadata':
      return metadataToPath(obj)
    case 'Post':
      return postToPath(obj)
    case 'PostRef':
      return postRefToPath(obj)
    case 'User':
      return userToPath(obj)
    case 'UserRef':
      return userRefToPath(obj)
    case 'Session':
      throw 'unimplemented!'
    case 'SessionRef':
      throw 'unimplemented!'
  }
}

function meadataToJson(m: Metadata): unknown {
  return {
    version: m.version,
  }
}

function metadataToPath(_m: Metadata): string {
  return '/api/v1/'
}

function metadataToLinks(m: Metadata): LinksMap {
  return {
    self: m,
  }
}

function userToJson(u: User): unknown {
  return {
    id: u.id,
    handle: u.handle,
    name: u.name,
  }
}

function userToPath(u: User): string {
  return `/api/v1/users/${u.id}`
}

function userToLinks(u: User): LinksMap {
  return {
    self: u,
  }
}

function userRefToPath(u: UserRef): string {
  return `/api/v1/users/${u.id}`
}

function postToJson(p: Post): unknown {
  return {
    id: p.id,
    author: p.author.id,
    createdAt: p.createdAt.toISOString(),
    text: p.text,
    visibility: p.visibility,
  }
}

function postToPath(p: Post): string {
  return `/api/v1/posts/${p.id}`
}

function postToLinks(p: Post): LinksMap {
  return {
    self: p,
    author: p.author,
  }
}

function postRefToPath(p: PostRef): string {
  return `/api/v1/posts/${p.id}`
}

function sessionToJson(s: Session): unknown {
  return {
    token: s.id,
    client: s.client,
    createdAt: s.createdAt.toISOString()
  }
}

function sessionToLinks(s: Session): LinksMap {
  return {
    user: s.user
  }
}
