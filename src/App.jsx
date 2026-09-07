import { useEffect, useState } from 'react';
import FHIR from 'fhirclient';
import { startLogin } from './auth';
import { fetchLabObservations, parseObs, REFERENCE_RANGES } from './fhir';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

function App() {
  const [status, setStatus] = useState('idle');
  const [patientId, setPatientId] = useState(null);
  const [glucoseData, setGlucoseData] = useState([]);
  const [a1cData, setA1cData] = useState([]);

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
          const parsed = parseObs(bundle);
          const glucose = parsed.filter(item => item.type === 'GLUCOSE');
          const a1c = parsed.filter(item => item.type === 'A1C');
          setGlucoseData(glucose);
          setA1cData(a1c);
          console.log('a1c values:', a1c.map(x => x.num));
          setStatus(`SUCCESS: got ${parsed.length} observation(s)`);
        })
        .catch(err => {
          setStatus('ERROR');
          console.error('FAILED:', err);
        });
    }
  }, []);

  const dateFmt = (dateStr) => new Date(dateStr).toLocaleDateString();
  const numFmt = (value) => [`${value.toFixed(1)}`, undefined];

  const makeDot = (range, normalColor) => (props) => {
    const { cx, cy, payload, index } = props;
    const outOfRange = payload.num < range.low || payload.num > range.high;
    return (
      <circle
        key={`dot-${index}`}
        cx={cx}
        cy={cy}
        r={5}
        fill={outOfRange ? 'red' : normalColor}
        stroke={outOfRange ? 'red' : normalColor}
      />
    );
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vitals Trend Tracker</h1>
      <button onClick={startLogin}>Connect to SMART Sandbox</button>
      <p>Status: {status}</p>
      {patientId && <p>Authenticated for patient: {patientId}</p>}

      <h2>Glucose Trend (mg/dL)</h2>
      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        Normal range: {REFERENCE_RANGES.GLUCOSE.low}–{REFERENCE_RANGES.GLUCOSE.high} mg/dL.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={glucoseData} margin={{ bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={dateFmt} />
          <YAxis label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }} />
          <Tooltip labelFormatter={dateFmt} formatter={numFmt} />
          <ReferenceLine y={REFERENCE_RANGES.GLUCOSE.high} stroke="orange" strokeDasharray="4 4" />
          <ReferenceLine y={REFERENCE_RANGES.GLUCOSE.low} stroke="orange" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="num"
            stroke="#8884d8"
            name="Glucose"
            dot={makeDot(REFERENCE_RANGES.GLUCOSE, '#8884d8')}
          />
        </LineChart>
      </ResponsiveContainer>

      <h2>A1c Trend (%)</h2>
      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        Normal range: below {REFERENCE_RANGES.A1C.high}%.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={a1cData} margin={{ bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={dateFmt} />
          <YAxis
            label={{ value: '%', angle: -90, position: 'insideLeft' }}
            domain={[0, 8]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
          />
          <Tooltip labelFormatter={dateFmt} formatter={numFmt} />
          <ReferenceLine y={REFERENCE_RANGES.A1C.high} stroke="orange" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="num"
            stroke="#e07b39"
            name="A1c"
            dot={makeDot(REFERENCE_RANGES.A1C, '#e07b39')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
