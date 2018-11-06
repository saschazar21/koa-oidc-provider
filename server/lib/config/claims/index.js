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
    'email',
    'family_name',
    'gender',
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
    'name',
    'nickname',
    'picture',
    'preferred_username',
  ],
  website: ['website'],
};

export { claims as default };
