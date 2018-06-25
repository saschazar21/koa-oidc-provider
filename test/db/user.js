import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { configuration, initMongo } from '../../server/lib/db/mongo';
import userModel from '../../server/lib/db/models/user';

chai.use(chaiAsPromised);

dotenv.config();
let connection;
let User;
let user;

test.serial('should connect to MongoDB', async () => {
  const config = {
    ...configuration,
    pass: process.env.MONGO_PASSWORD,
    user: process.env.MONGO_USER,
  };
  connection = await initMongo(process.env.MONGO_HOST, process.env.MONGO_PORT, config);
  User = await userModel(connection);
  chai.expect(typeof connection).to.equal('object');
});

test.serial('should create a user model and save to DB', async () => {
  user = new User({
    email: 'john@doe.com',
    family_name: 'Doe',
    given_name: 'John',
    password: 'somepassword',
  });
  return user.save();
});

test.serial('should check if hashed Password is correct', async () => {
  chai.expect(await user.correctPassword('somepassword')).to.equal(true);
});

test.serial('should delete the user model from DB', async () => {
  const u = user.toJSON();
  // eslint-disable-next-line no-underscore-dangle
  const result = await User.findById(u._id);
  chai.expect(result.toJSON()).to.deep.equal(u);
  // eslint-disable-next-line no-underscore-dangle
  return User.deleteOne({ _id: u._id });
});

test('should fail when providing no given_name', async () => {
  const newUser = {
    ...user.toJSON(),
    given_name: null,
  };
  return chai.expect(new User(newUser).save()).to.be.rejectedWith(Error);
});

test('should fail when providing malformed e-mail', async () => {
  const newUser = {
    ...user.toJSON(),
    email: 'johndoe',
  };
  return chai.expect(new User(newUser).save()).to.be.rejectedWith(Error);
});
