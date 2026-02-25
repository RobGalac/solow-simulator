import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. BASE DE DATOS ---
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const Scenario = sequelize.define('Scenario', {
  name: DataTypes.STRING,
  s: DataTypes.FLOAT,
  n: DataTypes.FLOAT,
  g: DataTypes.FLOAT,
  delta: DataTypes.FLOAT,
  alpha: DataTypes.FLOAT,
  k_star: DataTypes.FLOAT
});

// Sincronizar DB
sequelize.sync(); 
// Nota: Quité el 'await' del nivel superior para evitar problemas 
// si tu versión de Node es antigua. Sequelize lo maneja bien así.

// --- 2. RUTAS DE LA API (Lo que usa React) ---
app.get('/api/scenarios', async (req, res) => {
  const scenarios = await Scenario.findAll();
  res.json(scenarios);
});

app.post('/api/scenarios', async (req, res) => {
  try {
    const newScenario = await Scenario.create(req.body);
    res.json(newScenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 3. RUTA RAÍZ (LA SOLUCIÓN A TU ERROR) ---
// Esto debe ir ANTES de app.listen
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #27ae60;">✅ Servidor Node.js Activo</h1>
      <p>Tu Backend de Econometría está funcionando correctamente.</p>
      <p>Endpoints disponibles:</p>
      <a href="/api/scenarios">/api/scenarios</a>
    </div>
  `);
});

// --- 4. ENCENDER SERVIDOR ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
});