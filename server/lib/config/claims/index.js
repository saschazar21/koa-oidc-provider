export const claims = {
  acr: null,
  sid: null,
  auth_time: null,
  iss: null,
  address: ['address'],
  email: ['email', 'email_verified'],
  openid: ['sub'],
  profile: [
    'birthdate',
    'gender',
    'family_name',
    'given_name',
    'name',
    'nickname',
    'phone_number',
    'picture',
    'preferred_username',
    'profile',
    'website',
  ],
  user: [
    'nickname',
    'preferred_username',
    'picture',
    'name',
  ],
  website: ['website'],
};

export { claims as default };
