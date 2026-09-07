import { useEffect, useState } from 'react';
import FHIR from 'fhirclient';
import { startLogin } from './auth';
import { fetchLabObservations } from './fhir';

function App() {
  const [status, setStatus] = useState('idle');
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    if (window.location.pathname === '/callback') {
      setStatus('exchange code for token');
      FHIR.oauth2.ready()
        .then(client => {
          setStatus('authenticated, fetch labs');
          setPatientId(client.patient.id);
          return fetchLabObservations(client, client.patient.id);
        })
        .then(bundle => {
          console.log('observation bundle:', bundle);
          setStatus(`SUCCESS : got ${bundle.entry?.length ?? 0} observation(s), look at console`);
        })
        .catch(err => {
          setStatus('ERROR');
          console.error('FAILED:', err);
        });
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vitals Trend Tracker</h1>
      <button onClick={startLogin}>Connect to SMART Sandbox</button>
      <p>Status: {status}</p>
      {patientId && <p>Authenticated for patient: {patientId}</p>}
    </div>
  );
}

export default App;
