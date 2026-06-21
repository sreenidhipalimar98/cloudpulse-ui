import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Overview } from './pages/Overview';
import { Infrastructure } from './pages/Infrastructure';
import { Pipelines } from './pages/Pipelines';
import { Alerts } from './pages/Alerts';
import { Costs } from './pages/Costs';
import { Diagnostics } from './pages/Diagnostics';
import './styles/tokens.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            padding: 'var(--space-6)',
            maxWidth: 1400,
          }}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/pipelines" element={<Pipelines />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/costs" element={<Costs />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
