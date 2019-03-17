Echo API
===

- Follow HAL: https://www.ietf.org/archive/id/draft-kelly-json-hal-08.txt
- URL base is `/api`
- `${}` on example are variables. These have:
  
  Name | Description
  -- | --
  API_ROOT | Api root, such as `https://example.com/api`

Introduction
---
_WIP_

Common
---
- Token is always required without any notiation.  
  Passed as "Authorization Header"
- Return 404 Not Found if there are no resource with given condition
- Field "_link" will be empty object when no links
- Field "_embedded" will be empty object when no embedded resource 
- All resources includes "self" link. It's for getting its resource.
- Following types can be used

```ts
type UUID = string // validated as UUID v4
type ISO8601 = string // validated as ISO8601
```

Resources
---

### IndexResource
Get working API version.
This resource can not be created by users.

#### Get request
- GET `/`
- No token required
- Without any parameter

#### Example response
```json
{
  "version": "0.0.0",
  "_links": {
    "self": { "href": "${API_ROOT}/" }
  },
  "_embedded": {}
}
```

#### State

```ts
interface {
  version: string // semver
}
```

#### Links
None

#### Embedded Resource
None


### UserResource


#### Get resource
_Notice: This resource URL will not implemented at this moment. You can only access this resource from another resources that embed this resource._

#### Example
```json
{
  "id": "bdc2d099-f36f-4b67-ac20-676bb84f57d6",
  "handle": "example",
  "name": null,
  "_links": {
    "self": { "href": "${API_ROOT}/users/bdc2d099-f36f-4b67-ac20-676bb84f57d6" }
  }
}
```

#### State

```ts
interface UserResource {
  id: UUID
  // service-level unique name: @handle
  handle: string
  name: string | null
}
```

#### Links
None

#### Embedded Resource
None

### PostResource
Represent of post that created by user.

#### Get resource
Get post with embed `UserResource`

_Notice: This resource URL will not implemented at this moment. You can only access this resource from another resources that embed this resource._

#### Create resource
Create with callee account.

- POST `/posts`
- Accept JSON request body
- Parameters
  Field|Description|Optional
  --|--|--|--
  `text`|something you shout|No
- Returns PostResource without any embedded resource.

#### Example
```json
{
  "id": "1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b",
  "text": "OMG! My project was held back.",
  "author": "9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8",
  "createdAt": "2019-03-13T18:53:53.838Z",
  "visibility": "public",
  "_links": {
    "self": { "href": "${API_ROOT}/posts/1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b" },
  },
  "_embedded": {
    "users": [
      {
        "id": "9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8",
        "name": "MY HANDLE",
        "handle": "handle",
        "_links": {
          "self": { "href": "${API_ROOT}/users/9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8" }
        },
        "_embedded": {}
      }
    ]
  }
}
```

#### State

```ts
interface {
  id: UUID
  text: string
  author: UUID // User.id
  createdAt: ISO8601
  visibility: "public" // Currently "public" only supported 
}
```

#### Links
None

#### Embedded Resource
Field | Resource | Description | Optional
-- | -- | -- | --
users | `UserResource[]` | Related users of this post | Yes

### FlowResource
- Flow have target users.
- You can get set of posts from flow. They are came from target users.
- Embed `PostResource[]` are sorted by PostResource.createdAt.
- Return HTTP 200 and empty _embedded.posts (`[]`) if there are no posts with parameter

#### Get timeline flow
Timeline is special flow. Their posts are from your following users.

- GET `/posts/flow/timeline`
- Parameters
  Field|Description|Optional
  --|--|--
  `max_id`|`Post.id`. If given returns posts created before `max_id`'s post.|No
  `min_id`|`Post.id`. If given returns postts created after `min_id`'s post.|No
- Callee can get 20 posts by one time.

#### Example
```json
{
  "id": "timeline",
  "count": 2,
  "_links": {
    "self": { "href": "${API_ROOT}/posts/flow/timeline" },
    "next": {
      "href": "${API_ROOT}/posts/flow/timeline?min_id=1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b"
    },
    "previous": {
      "href": "${API_ROOT}/posts/flow/timeline?max_id=670e347a-b3da-4575-af3c-d8e959dc1643"
    }
  },
  "_embedded": {
    "posts": [
      {
        "id": "1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b",
        "text": "OMG! My project was held back.",
        "author": "9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8",
        "createdAt": "2019-03-13T18:53:53.838Z",
        "visibility": "public",
        "_links": {
          "self": { "href": "${API_ROOT}/posts/1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b" },
        },
        "_embedded": {}
      },
      {
        "id": "670e347a-b3da-4575-af3c-d8e959dc1643",
        "text": "It's new one...",
        "author": "9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8",
        "createdAt": "2019-03-13T17:52:10.838Z",
        "visibility": "public",
        "_links": {
          "self": { "href": "${API_ROOT}/posts/670e347a-b3da-4575-af3c-d8e959dc1643" },
        },
        "_embedded": {}
      },
    ],
    "users": [
      {
        "id": "9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8",
        "name": "MY HANDLE",
        "handle": "handle",
        "_links": {
          "self": { "href": "${API_ROOT}/users/9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8" }
        },
        "_embedded": {}
      } 
    ]
  }
}
```

#### State

```ts
interface {
  id: "timeline"
  count: number // length of posts
}
```

#### Links
Field | Description | Optional
-- | -- | --
previous | to access more older post. for read more feature. | No
next | to wait for new posts | No

#### Embedded Resource
Field | Embedded resource | Description | Optional
-- | -- | -- | --
users | `UserResource[]` | Authors of posts | No
posts | `PostResource[]` | Without any embedded resource. They are sorted by createdAt desc | No
