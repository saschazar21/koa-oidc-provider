# API documentation

The following document lists the API routes for koa-oidc-provider. Further information may be looked up in the [configuration document](/docs/CONFIGURATION.md).

This document covers the following route sections:

* [Client Routes](#client-routes)
  * [GET /api/clients](#get-apiclients)
  * [GET /api/clients/:id/reset](#get-apiclientsidreset)
  * [POST /api/clients](#post-apiclients)
  * [PUT /api/clients/:id](#put-apiclientsid)
  * [DELETE /api/clients/:id](#delete-apiclientsid)
* [User Routes](#user-routes)
* [Token Routes](#token-routes)

## Client Routes

With koa-oidc-provider it is possible to not only register new clients, but also to modify them, reset their secrets and as well delete them.

### GET /api/clients

| **HTTP Header** | **Necessary Scopes** | **Example cURL Request** |
|-----------------|----------------------|------------------------|
| Authorization: Bearer <access_token> | client | `curl -H "Authorization: Bearer <access_token>" https://your-url.com/api/clients` |

Returns a list of clients containing client metadata, which is specified in the [OpenID Connect Dynamic Client Registration 1.0 spec](https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata), created by the user the access token belongs to:

```json
[
  {
    "active":true,
    "redirect_uris":[
      "https://pizzabot2.example.com/auth",
      "https://pizzabot_2.example.com/auth"
    ],
    "response_types":[
      "code"
    ],
    "grant_types":[
      "authorization_code",
      "refresh_token"
    ],
    "application_type":"web",
    "contacts":[],
    "id_token_signed_response_alg":"RS256",
    "token_endpoint_auth_method":"client_secret_basic",
    "require_auth_time":false,
    "default_acr_values":[],
    "request_uris":[],
    "_id":"WHIlFZGrBWm5NrMcZLq2HpMqrZUT33DI",
    "client_name":"Pizzabot 2",
    "client_id":"WHIlFZGrBWm5NrMcZLq2HpMqrZUT33DI"
  }
]
```

### GET /api/clients/:id/reset

| **HTTP Header** | **Necessary Scopes** | **Example cURL Request** |
|-----------------|----------------------|------------------------|
| Authorization: Bearer <access_token> | client client:edit | `curl -H "Authorization: Bearer <access_token>" https://your-url.com/api/clients/:id/reset` (Insert a correct Client ID in URL!)|

Resets a client's secret and returns the client object containing the new client secret:

```json
{
  "active":true,
  "redirect_uris":[
    "https://pizzabot2.example.com/auth",
    "https://pizzabot_2.example.com/auth"
  ],
  "response_types":[
    "code"
  ],
  "grant_types":[
    "authorization_code",
    "refresh_token"
  ],
  "application_type":"web",
  "contacts":[],
  "id_token_signed_response_alg":"RS256",
  "token_endpoint_auth_method":"client_secret_basic",
  "require_auth_time":false,
  "default_acr_values":[],
  "request_uris":[],
  "_id":"WHIlFZGrBWm5NrMcZLq2HpMqrZUT33DI",
  "client_name":"Pizzabot 2",
  "owner":"dwyOLCBwWivAvgBD",
  "client_id":"WHIlFZGrBWm5NrMcZLq2HpMqrZUT33DI",
  "client_secret":"lNJehsHpLsMAx80Idu0xORefl03j77PHHe~enpAG3YdqYFKwl~oE2LE~TeFqiePG",
  "__v":2
}
```

### POST /api/clients

| **HTTP Header** | **Necessary Scopes** | **Mandatory Fields** | **Example cURL Request** |
|-----------------|----------------------|------------------------|------------------------|
| Authorization: Bearer <access_token> | client client:create | `client_name`, `redirect_uris`  | `curl -X POST --http1.1 -H "Authorization: Bearer <access_token>" -d "client_name=Burgerbot&redirect_uris=https://burger_bot.example.com/auth" https://your-url.com/api/clients` |

Returns the newly created client as JSON object:

```json
{
  "active":true,
  "redirect_uris":[
    "https://burger_bot.example.com/auth"
  ],
  "response_types":[
    "code"
  ],
  "grant_types":[
    "authorization_code"
  ],
  "application_type":"web",
  "contacts":[],
  "id_token_signed_response_alg":"RS256",
  "token_endpoint_auth_method":"client_secret_basic",
  "require_auth_time":false,
  "default_acr_values":[],
  "request_uris":[],
  "client_name":"Burgerbot",
  "owner":"dwyOLCBwWivAvgBD",
  "_id":"wpNLB2RHxo4zxn8PFYDefXurV9ik79j0",
  "client_id":"wpNLB2RHxo4zxn8PFYDefXurV9ik79j0",
  "client_secret":"~09HMj1043ysvUlr3qCp9bjEzSutxI0gJ9IkEVrm7l9xnZVcOwuXA9eOko5sDXxA",
  "__v":0
}
```

### PUT /api/clients/:id

| **HTTP Header** | **Necessary Scopes** | **Example cURL Request** |
|-----------------|----------------------|------------------------|
| Authorization: Bearer <access_token> | client client:edit | `curl -X PUT --http1.1 -H "Authorization: Bearer <access_token>" -d "client_name=Burgerbot%20Demo" https://your-url.com/api/clients/:id` (Insert a correct Client ID in URL!) |

Updates an existing client with data transmitted in the POST body, afterwards, returns the whole new client object:

```json
{
  "active":true,
  "redirect_uris":[
    "https://burgerista.example.com/auth"
  ],
  "response_types":[
    "code"
  ],
  "grant_types":[
    "authorization_code"
  ],
  "application_type":"web",
  "contacts":[],
  "id_token_signed_response_alg":"RS256",
  "token_endpoint_auth_method":"client_secret_basic",
  "require_auth_time":false,
  "default_acr_values":[],
  "request_uris":[],
  "_id":"wpNLB2RHxo4zxn8PFYDefXurV9ik79j0",
  "client_name":"Burgerbot 1",
  "owner":"dwyOLCBwWivAvgBD",
  "client_id":"wpNLB2RHxo4zxn8PFYDefXurV9ik79j0",
  "__v":2
}
```

### DELETE /api/clients/:id

| **HTTP Header** | **Necessary Scopes** | **Example cURL Request** |
|-----------------|----------------------|------------------------|
| Authorization: Bearer <access_token> | client client:delete | `curl -X DELETE -H "Authorization: Bearer <access_token>" https://your-url.com/api/clients/:id` (Insert a correct Client ID in URL!) |

Deletes an existing client from the database and returns its last state as JSON:

```json
{
  "active":true,
  "redirect_uris":[
    "https://burger_bot.example.com/auth"
  ],
  "response_types":[
    "code"
  ],
  "grant_types":[
    "authorization_code"
  ],
  "application_type":"web",
  "contacts":[],
  "id_token_signed_response_alg":"RS256",
  "token_endpoint_auth_method":"client_secret_basic",
  "require_auth_time":false,
  "default_acr_values":[],
  "request_uris":[],
  "_id":"k2VeN88PRVJJbnUp6F8akvCoBAcHNExy",
  "client_name":"Burgerbot3",
  "owner":"dwyOLCBwWivAvgBD",
  "client_id":"k2VeN88PRVJJbnUp6F8akvCoBAcHNExy",
  "client_secret":"~09HMj1043ysvUlr3pQ7fbjEzSutxI0gJ9IkEVrm7l9xnZVcOwuXA9eOko5sDXxA",
  "__v":0
}
```

## User Routes

With koa-oidc-provider it is possible to not only register new clients, but also to modify them, reset their secrets and as well delete them.