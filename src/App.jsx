import { startLogin } from './auth';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vitals Trend Tracker</h1>
      <button onClick={startLogin}>Connect to SMART Sandbox</button>
    </div>
  );
}

export default App;
