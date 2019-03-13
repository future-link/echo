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

#### GET request
- GET `/`  
  Without any parameter

#### Example response
```json
{
  "version": "0.0.0",
  "_links": {
    "self": "${API_ROOT}/"
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
    "self": "${API_ROOT}/users/bdc2d099-f36f-4b67-ac20-676bb84f57d6"
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
