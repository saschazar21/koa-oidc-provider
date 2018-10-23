import Configuration from '../config';

const configuration = new Configuration();

let grants;
const basic = [
  'authorization_code',
  'implicit',
];

export default async function grantTypes() {
  if (grants) {
    return grants;
  }

  const { features, scopes } = await configuration.getConfig();
  grants = [
    ...basic,
  ];
  if (features.clientCredentials) {
    grants.push('client_credentials');
  }
  if (features.alwaysIssueRefresh || scopes.includes('offline_access')) {
    grants.push('refresh_token');
  }
  return grants;
}
