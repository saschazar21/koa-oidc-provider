# Configuration Manual

The following is the specific configuration manual for koa-oidc-provider. Additional information concerning certain parts may be looked up in [node-oidc-provider's configuration](https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md) document.

Contents:

* [Default Configuration](#default-configuration)
* [Custom Configuration](#custom-configuration)
* [Variables](#variables)
  * [Setup Variables](#setup-variables)
  * [MongoDB Variables](#mongodb-variables)

## Default Configuration

The default configuration is tightly coupled with node-oidc-provider's default configuration. The source code may be found in the [`server/lib/config`](/server/lib/config) folder.

## Custom Configuration

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
* **MONGO_URL**: Set the MongoDB connection URL, to combine HOST, PORT & DB, e.g. `localhost:27017/admin`