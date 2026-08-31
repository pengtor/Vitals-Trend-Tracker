import FHIR from 'fhirclient';

export const SMART_CONFIG = {
  clientId: 'vitals-trend-tracker',
  scope: 'launch/patient patient/Observation.read patient/Patient.read online_access openid fhirUser',
  iss: 'https://launch.smarthealthit.org/v/r4/sim/WzIsIiIsInZpdGFscy10cmVuZC10cmFja2VyIiwiQVVUTyIsMCwwLDAsIiIsIiIsIiIsIiIsIiIsIiIsIiIsMCwxLCIiXQ/fhir',
};

export function startLogin() {
  FHIR.oauth2.authorize({
    client_id: SMART_CONFIG.clientId,
    scope: SMART_CONFIG.scope,
    iss: SMART_CONFIG.iss,
    redirect_uri: '/callback',
  });
}
