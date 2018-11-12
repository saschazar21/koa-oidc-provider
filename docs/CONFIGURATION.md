# Configuration Manual

The following is the specific configuration manual for koa-oidc-provider. Additional information concerning certain parts may be looked up in [node-oidc-provider's configuration](https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md) document.

Contents:

* [Default Configuration](#default-configuration)
* [Custom Configuration](#custom-configuration)
* [Variables](#variables)
  * [Setup Variables](#setup-variables)
  * [MongoDB Variables](#mongodb-variables)
  * [Redis Variables](#redis-variables)

## Default Configuration

The default configuration is tightly coupled with node-oidc-provider's default configuration. The source code may be found in the [`server/lib/config`](/server/lib/config) folder.

## Custom Configuration

The custom configuration in the `private/` directory divides itself into 3 different parts:

* **Keystore**: Either let yourself automatically create a JSON Web Keystore, or place a custom one as `jwks.json` file in the folder.
* **Base Client(s)**: Either let koa-oidc-provider create a random base client upon each start, or place a client configuration as `clients.js` file in the folder.
* **Custom Configuration file**: Place a custom `configuration.json` file in the folder.

### Keystore

By default, koa-oidc-provider looks for an existing `jwks.json` file in the `private/` directory and creates one, if none is present yet. This file holds the keystore needed for signing the JWTs. If you'd like to user your own keystore, create one in the format described in [Appendix A](https://tools.ietf.org/html/draft-ietf-jose-json-web-key-41#appendix-A) in the JSON Web Key IETF Draft.

```javascript
{
  "keys":[
    {
      "kty":"RSA",
      "kid":"enc-rs-0",
      "use":"enc",
      "e":"AQAB",
      "n":"hxIvXPJncPRVGQHVHyWyPsSdqHdEWtt4bHkiNERr9NzEcO_schmh_mc9Zjx7mlvRENgKRWiEqnMS4NJgBjnGIzU4mCKer98-tPHh4S1kag49NSsOtPY7C6FKbhhZyFSpnZjZ0O3NEeIdYLtKKdkTUW80iwJaztI_-pJnkXeoGn4EjpQJcaRAqEMS2JVvy6dTKdcWgkFj3IqcXDjDlKl8N7defSU316i3yC3tI-gEyGvt11QVZY9Gf7yiS9YIB9NMX5NSUzujrF8BekjhZ3p1C1IAqHuS-lRtYmr-x3Y6c3MdRR_zwRYEf_4Mwi2KpFkh50xiPGWtPMH-fcBo8TgLjw",
      "d":"MKOrypzAAzz5J_gw9vZsKY5D99Z7FvzRcL5uQsQg3Bxj4QeE7dGtNB-ZTKebGwrVTmt9x2DL5VVrBuq7CYLkhukzaBWPb2XE_wPbg2sFLevSvsKymRfSS23Zj6vVKP7T1ZylU0dPAZGbYqoPGuLAwiJ5mVVPvgqYX3M5OHkOX_tYJmUFN7l8IRnWY6nD1eTcyqumpcZX6yy8M2CnmmEEW6kJKXvD9Qy3eQxOrRfhYpqNrmSYAssqZqC5xm2G_IXrdQN9U1GhjG4facRwQSVaRyZkjZKz-JGx0fRQoi8SpK_VXF7juobwT1mECedSV-sUgZ803iw-TCyvCBNe1uXcgQ",
      "p":"51sTLMj0lW0R3VZf_m1UUTyjfk_BHAYUyBlpq-mHMM0P7GiKpG9sa5j20nPEFMfL6zwXOYzpI3hEgf9UnErvasABz16hCaiAMzKOsxazxU1NmFxA0JPPJaWI3yzbaJv72f5dYbbXOgZKm7vqYpzEY-jtgDPZz7WPwGMZv8dXQr0",
      "q":"lXV8khBQsKuYDGb1UW_u1ayLv5Rr01zrE0MEQYzXVKa735Gvxx53LANv8qrcy3D2RB1h7lZFfqYnw4pjE3XwHhOw5oEywqYm4MP0Nu7T7TheiAQfqtkCIVd1RhBH-sLJEuUAAmeBJYacfrLUo8kgq3VkXc9CfPAUna8Ep6np8js",
      "dp":"js4rztgYCOgzP8FiLYVEp4Rbkssd8vNZ_o2ZKZFTbm8VZiK9eXSBowTfTdZBcWZGW-RSnaZ5_fftqaR2kKa8k9MDCwJpOrH0uCV76dWYj7AAtowzQcwK8Dz2eHOS10Z5Nf0JnRgkT9-0S965dbc4jkcn2pum1cxHeERzj2o3Va0",
      "dq":"CqG-6M0MUGUEfe1dChwCS2To1AoE2ZZEiqw7w0X3k2gA-VhtvqZmJ9Vew05wQnCYtCO68a9lZir_rSNNBPdgy2LvNJaAO-SB439NAhNfNALMhrR0ZDznr-N-ziseU7JDh3qO05z1TOwUedbS1YvbLRc-uoWh3y1c6hKnLB4kLD0",
      "qi":"E1xLt8AQ0d-jj6EPxRFW5b7o-WeVYOmnhQF1uFe65AJBR81ROcx6f7ZijF7m0ImQ3sROJ7Dw1rCNrTRzIk-Cb5d2-Um9YPwothCqetB0fYiz2LzCGvtXmS-2EGXSSMpfSTvFN6DMLAFP5XCBsn9rbwZ0pCbi0dFAkiU5dpfRgfI"
    }
  ]
}
```

### Base Client(s)


### `configuration.json` file

By placing a `configuration.json` file in the `private/` directory, you're able to overwrite some of the default configuration and therefore customize the application.

To limit the available claims to the following three, just create a `configuration.json` file with the following contents.

```javascript
{
  "claims":{
    "email":[
      "email",
      "email_verified"
    ],
    "openid":[
      "sub"
    ],
    "profile":[
      "birthdate",
      "email",
      "family_name",
      "gender",
      "given_name",
      "name",
      "nickname",
      "phone_number",
      "picture",
      "preferred_username",
      "profile",
      "website"
    ]
  }
}
```

**CAUTION:** Currently only static configuration assets are supported, you won't be able to customize functions in certain configuration options. If you do, the application will break at runtime at last.

## Variables

Apart from customizing the default configuration, there is a list of environment variables for properly setting crucial connection parameters and so on:

### Setup Variables

Necessary environment variables for setting the issuer URL, enable registration, etc...

* **HOST**: Set the issuer domain, e.g. `HOST=your-url.com`
* **REGISTRATIOIN**: If environment variable is set, user registration will be enabled
* **DEBUG**: Set the amount of logging:
  * `info`: Will log general information (a verbose logging)
  * `error:*`: Will log different error messages
  * `oidc-provider:*`: Will log [node-oidc-provider's](https://github.com/panva/node-oidc-provider) messages

### MongoDB Variables

Environment variables for setting up a connection to MongoDB

* **MONGO_HOST**: Set the MongoDB hostname (default: `localhost`)
* **MONGO_PORT**: Set the MongoDB port (default: `27017`)
* **MONGO_DB**: Set the MongoDB database name (default: `admin`)
* **MONGO_USER**: Set the MongoDB user
* **MONGO_PASSWORD**: Set the according password

#### MongoDB All-in-one

* **MONGO_URL**: Set the MongoDB connection URL, to combine HOST, PORT & DB, e.g. `localhost:27017/admin`

### Redis Variables

* **REDIS_HOST**: Set the Redis hostname (default: `localhost`)
* **REDIS_PORT**: Set the Redis port (default: `6379`)
* **REDIS_DB**: Set the Redis database name
* **REDIS_USER**: Set the Redis user
* **REDIS_PASSWORD**: Set the password

#### Redis All-in-one

* **REDIS_PATH**: If connecting to Redis via socket, use this environment variable