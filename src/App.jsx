import { useState, useEffect } from 'react';
import SolowChart from './SolowChart';
import Capitulo1 from './Capitulo1.mdx';
import './App.css';

function App() {
  // --- 1. ESTADOS ---
  const [params, setParams] = useState({
    s: 0.20, n: 0.02, g: 0.02, delta: 0.05, alpha: 0.33
  });
  
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [scenarioName, setScenarioName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  
  // NUEVO: Estado para el Zoom
  const [autoZoom, setAutoZoom] = useState(false);

  // ... (MANTÉN TODO EL CÓDIGO DE "EFECTOS" y "FETCH" IGUAL QUE ANTES) ...
  // Efecto para la Animación del Ahorro
  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setParams(prevParams => {
          let nextS = prevParams.s + 0.005;
          if (nextS > 0.60) nextS = 0.05; 
          return { ...prevParams, s: nextS };
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);
  
  // Cargar escenarios
  useEffect(() => { fetchScenarios(); }, []);

  const fetchScenarios = async () => { /* ... código igual ... */ };
  const handleSave = async () => { /* ... código igual ... */ };
  const loadScenario = (sc) => { /* ... código igual ... */ };

  // --- 3. RENDERIZADO ---
  return (
    <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* CABECERA (IGUAL) */}
      <header style={{ borderBottom: '2px solid #2c3e50', marginBottom: '30px', paddingBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Simulación Económica: Modelo de Solow</h1>
        <p style={{ color: '#7f8c8d', margin: '5px 0' }}>Plataforma interactiva React + Node.js + Econometría</p>
      </header>

      <div className="dashboard-panel" style={{ display: 'flex', gap: '30px', marginBottom: '50px', background: '#f8f9fa', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        {/* PANEL IZQUIERDO */}
        <div style={{ flex: '0 0 320px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>🎛️ Parámetros</h3>
          
          {/* CONTROL DE AHORRO */}
          <div style={{ marginBottom: '20px', background: '#e8f6f3', padding: '10px', borderRadius: '8px', border: '1px solid #d1f2eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontWeight: 'bold', color: '#2980b9' }}>Ahorro (s)</label>
              <button 
                onClick={() => setIsAnimating(!isAnimating)}
                style={{
                  background: isAnimating ? '#e74c3c' : '#27ae60',
                  color: 'white', border: 'none', borderRadius: '20px',
                  padding: '2px 10px', fontSize: '0.8em', cursor: 'pointer',
                  fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'
                }}
              >
                {isAnimating ? <span>⏸ Pausar</span> : <span>▶ Animar</span>}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="range" min="0" max="0.6" step="0.01" value={params.s} 
                onChange={(e) => { setIsAnimating(false); setParams({...params, s: parseFloat(e.target.value)}); }}
                style={{ flex: 1, cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 'bold', width: '45px', textAlign: 'right' }}>{(params.s * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* NUEVO: CONTROL DE ZOOM */}
          <div style={{ marginBottom: '15px', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#555', cursor: 'pointer' }} htmlFor="zoomCheck">
              🔍 Zoom Automático
            </label>
            <input 
              id="zoomCheck"
              type="checkbox" 
              checked={autoZoom}
              onChange={(e) => setAutoZoom(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          {/* RESTO DE CONTROLES (IGUALES) */}
          {[
            { label: "Crec. Pob. (n)", key: "n", max: 0.1, step: 0.001 },
            { label: "Tecnología (g)", key: "g", max: 0.1, step: 0.001 },
            { label: "Depreciación (δ)", key: "delta", max: 0.15, step: 0.001 },
            { label: "Capital Share (α)", key: "alpha", max: 0.9, step: 0.01, min: 0.1 }
          ].map((control) => (
            <div key={control.key} style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9em', color: '#555' }}>
                <span>{control.label}</span> 
                <span>{control.key === 'alpha' ? params[control.key].toFixed(2) : (params[control.key] * 100).toFixed(1) + '%'}</span>
              </label>
              <input 
                type="range" min={control.min || 0} max={control.max} step={control.step} value={params[control.key]} 
                onChange={(e) => setParams({...params, [control.key]: parseFloat(e.target.value)})}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          ))}

          <hr style={{ borderColor: '#ddd' }} />
          
          {/* SECCIÓN BASE DE DATOS (IGUAL) */}
          <h4 style={{ marginBottom: '10px' }}>💾 Guardar Escenario</h4>
          {/* ... (mantén el código de guardar/cargar igual) ... */}
           <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <input 
              type="text" placeholder="Nombre..." 
              value={scenarioName} onChange={(e) => setScenarioName(e.target.value)}
              style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button onClick={handleSave} style={{ background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}>💾</button>
          </div>
          <div style={{ background: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #eee' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '100px', overflowY: 'auto', fontSize: '0.85em' }}>
              {savedScenarios.map(sc => (
                <li key={sc.id} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <button onClick={() => loadScenario(sc)} style={{ marginRight: '5px', background: '#3498db', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}>Cargar</button>
                  {sc.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', flex: 1 }}>
            
            {/* AQUÍ PASAMOS LA PROPIEDAD NUEVA autoZoom */}
            <SolowChart params={params} autoZoom={autoZoom} isAnimating={isAnimating} />
          
          </div>
          
          {/* TARJETAS DE KPI (IGUALES) */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
             {/* ... (código de tarjetas igual) ... */}
              {[
               { label: "Capital (k*)", val: Math.pow(params.s / (params.n + params.g + params.delta), 1 / (1 - params.alpha)), color: '#2c3e50' },
               { label: "Producto (y*)", val: Math.pow(Math.pow(params.s / (params.n + params.g + params.delta), 1 / (1 - params.alpha)), params.alpha), color: '#2980b9' },
               { label: "Consumo (c*)", val: (1 - params.s) * Math.pow(Math.pow(params.s / (params.n + params.g + params.delta), 1 / (1 - params.alpha)), params.alpha), color: '#27ae60' }
             ].map((kpi, i) => (
               <div key={i} style={{ background: '#ecf0f1', padding: '10px', borderRadius: '6px' }}>
                 <small style={{ color: '#7f8c8d', fontSize: '0.85em' }}>{kpi.label}</small>
                 <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: kpi.color }}>
                   {kpi.val.toFixed(2)}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="tesis-content" style={{ background: 'white', padding: '50px', borderRadius: '8px', maxWidth: '900px', margin: '0 auto' }}>
        <Capitulo1 />
      </div>

    </div>
  );
}
export default App;