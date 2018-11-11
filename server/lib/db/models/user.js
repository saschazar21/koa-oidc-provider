import { initMongo } from '../mongo';
import { safeIdFactory } from '../../tools/id';
import { passwordHash, compareHash } from '../../tools/password';
import { isEmail, isUrl } from '../../tools/regex';

/**
 * User model:
 * {
    address,
    birthdate,
    email,
    email_verified,
    family_name,
    gender,
    given_name,
    locale,
    middle_name,
    name,
    phone_number,
    phone_number_verified,
    nickname,
    picture,
    preferred_username,
    profile,
    updated_at,
    website,
    zoneinfo,
  },
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

function sanitizeName(name) {
  return name
    .trim()
    .charAt(0)
    .toUpperCase() + name.substr(1);
}

export default async function userModel(customClient) {
  const mongoose = customClient || await initMongo();

  if (mongoose.models.User) {
    return mongoose.models.User;
  }

  const userSchema = new mongoose.Schema({
    _id: {
      default: () => safeIdFactory(16),
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    address: {
      street_address: String,
      locality: String,
      region: String,
      postal_code: String,
      country: String,
    },
    birthdate: Date,
    email: {
      lowercase: true,
      required: true,
      type: String,
      unique: true,
      validate: {
        validator: isEmail,
        message: '{VALUE} is not a valid e-mail address, please check again',
      },
    },
    email_verified: {
      default: false,
      type: Boolean,
    },
    family_name: {
      required: true,
      type: String,
    },
    gender: {
      lowercase: true,
      type: String,
      enum: ['female', 'male', 'other'],
    },
    given_name: {
      required: true,
      type: String,
    },
    locale: String,
    middle_name: String,
    phone_number: String,
    phone_number_verified: {
      default: false,
      type: Boolean,
    },
    nickname: String,
    picture: {
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URI starting with http(s)',
      },
    },
    preferred_username: {
      type: String,
    },
    profile: {
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URI starting with http(s)',
      },
    },
    website: {
      type: String,
      validate: {
        validator: isUrl,
        message: '{VALUE} is not a valid URI starting with http(s)',
      },
    },
    zoneinfo: String,
  }, {
    toJSON: {
      virtuals: true,
    },
  });

  userSchema.virtual('name')
    .get(function getName() { return `${this.given_name} ${this.family_name}`; });

  userSchema.pre('findOneAndUpdate', async function updatePassword() {
    let update = this.getUpdate().$set;

    if (update.given_name) {
      update = {
        ...update,
        given_name: sanitizeName(update.given_name),
      };
    }
    if (update.family_name) {
      update = {
        ...update,
        family_name: sanitizeName(update.family_name),
      };
    }
    if (update.password) {
      update = {
        ...update,
        password: await passwordHash(update.password),
      };
    }

    return this.update(update);
  });

  userSchema.pre('save', async function genPasswd(next) {
    // TODO: Set default profile picture
    // if (!this.picture) {
    //   this.picture = await cat();
    // }

    if (this.isModified('family_name')) {
      this.family_name = sanitizeName(this.family_name);
    }
    if (this.isModified('given_name')) {
      this.given_name = sanitizeName(this.given_name);
    }

    if (!this.isModified('password')) {
      return next();
    }
    this.password = await passwordHash(this.password);
    return next();
  });

  userSchema.methods.correctPassword = async function correctPasswd(plaintext) {
    if (!plaintext) {
      return false;
    }
    return compareHash(plaintext, this.password);
  };

  return mongoose.model('User', userSchema);
}
