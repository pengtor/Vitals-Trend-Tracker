import { useEffect, useState } from 'react';
import FHIR from 'fhirclient';
import { startLogin } from './auth';

function App() {
  const [status, setStatus] = useState('idle');
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    if (window.location.pathname === '/callback') {
      setStatus('exchanging code for token...');
      FHIR.oauth2.ready()
        .then(client => {
          setStatus('success');
          setPatientId(client.patient.id);
        })
        .catch(err => {
          setStatus('error');
          console.error('Token exchange failed:', err);
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
