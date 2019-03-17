Echo Authorization Flow
===

Overview
---
- OAuth2 Implicit Flow の出来損ないのみ
- 将来的には OAuth2 に対応したい

About "OAuth2 Implicit Flow の出来損ない"
---

```uml
actor "Resource Owner"

"Resource Owner"-->"User Agent"
"User Agent"->"Client" : Request authz
"Client"-->"User Agent" : Return Authz URL with redirect URL
"User Agent"-->"Authorization Server": Open authz URL
"User Agent"->"Authorization Server": Accept
"Authorization Server"-->"Client" : Request redirect URL with token
"Client"->"User Agent" : Display successful

```

[![](./_resources/psuedo-implicit-flow.png)]()

### AuthZ URL
- Open `/auth/pauth` with following parametetrs


Field | Description | Optitonal
-- | -- | --
redirect_url | Accept URLs. After resource owner accepts redirect to redirect_url | No

### Redirect to redirect_url
Redirect to redirect_url with following parameters.

Field | Description
-- | --
token | string. It must be passed when call Echo API as "Authorization" header value.
