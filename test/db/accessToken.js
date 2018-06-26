import dotenv from 'dotenv';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import test from 'ava';

import { configuration, initMongo } from '../../server/lib/db/mongo';
// import accessTokenModel from '../../server/lib/db/models/accessToken';
import clientModel from '../../server/lib/db/models/client';
import userModel from '../../server/lib/db/models/user';

dotenv.config();
chai.use(chaiAsPromised);

// let AccessToken;
let Client;
let User;
// let client;
let mongoose;
let user;
// let token;

test.before(async () => {
  const config = {
    ...configuration,
    pass: process.env.MONGO_PASSWORD,
    user: process.env.MONGO_USER,
  };
  mongoose = await initMongo(process.env.MONGO_HOST, process.env.MONGO_PORT, config);
  // AccessToken = await accessTokenModel(mongoose);
  Client = await clientModel(mongoose);
  User = await userModel(mongoose);
});

test.serial('should create a user model', async () => {
  user = new User({
    email: 'john@doe.com',
    family_name: 'Doe',
    given_name: 'John',
    password: 'somepassword',
  });
});

test.serial('should create a client model', async () => {
  const client = new Client({
    // eslint-disable-next-line no-underscore-dangle
    owner: user.toJSON()._id,
    redirect_uris: 'https://localme.com',
    client_name: 'Pizzabot',
  });
  // eslint-disable-next-line no-underscore-dangle
  chai.expect(client.toJSON()).to.have.property('owner', user.toJSON()._id);
});

// test('should create an Access Token model', async () => {
//   token = new AccessToken({
//     // eslint-disable-next-line no-underscore-dangle
//     accountId: user.toJSON()._id,
//     // eslint-disable-next-line no-underscore-dangle
//     clientId: client.toJSON()._id,
//     // eslint-disable-next-line no-underscore-dangle
//     aud: [client.toJSON()._id],
//     exp: Date.now(),
//     grantId: 'someId',
//     iat: Date.now(),
//     iss: 'AVA Test Server',
//     jti: 'Some JTI string',
//     scope: 'A scope',
//   });
//   // eslint-disable-next-line no-underscore-dangle
//   chai.expect(token.toJSON()).to.have.property('sub', user.toJSON()._id);
// });
