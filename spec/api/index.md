Echo API
===

- Follow http://stateless.co/hal_specification.html
- URL base is `/api`
- `${}` on example are variables. These have:
  
  variable name | description
  -- | --
  API_ROOT | Api root, such as `https://example.com/api`

Introduction
---
_WIP_

Common
---
- Field "_link" will be empty object when no links
- Field "_embedded" will be empty object when no embedded resource 
- All resources includes "self" link. It's for getting its resource.
- Following types can be used

```ts
type UUID = string // alias but it's UUID
```

Resources
---

### IndexResource
Get working API version.
This resource can not be created by users.

#### Get request
- GET `/`
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

#### Get resource
_Notice: This resource URL will not implemented at this moment. You can only access this resource from another resources that embed this resource._

#### Create resource
_WIP_

#### Example
```json
{
  "id": "1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b",
  "text": "OMG! My project was held back.",
  "author": "9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8",
  "_links": {
    "self": { "href": "${API_ROOT}/posts/1a2e11fd-5bb7-4680-8ff7-23ab48c21d4b" },
  },
  "_embedded": {
    "users": [
      {
        "id": "9db74ca5-b48f-4101-b4e4-b2fdf7a90dd8",
        "name": "MY HANDLE",
        "handle": "handle"
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
  author: UUID // on User
}
```

#### Links
None

#### Embedded Resource
field name | embedded resource
-- | --
users | `UserResource[]`
