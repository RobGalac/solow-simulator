# Solow Growth Engine 📈

Aplicación interactiva Full Stack para la simulación de crecimiento económico basada en el modelo de Solow-Swan (Romer, Cap 1).

**Tecnologías:** React (Vite) + Node.js (Express) + SQLite + D3.js + MDX.

## Características
- ⚛️ **Simulación en Tiempo Real:** Visualización dinámica con D3.js.
- 🎛️ **Control Total:** Ajuste de parámetros ($s, n, g, \delta, \alpha$) al vuelo.
- 💾 **Persistencia de Datos:** Backend en Node.js que guarda escenarios en SQLite.
- 📄 **Narrativa Interactiva:** Tesis integrada usando MDX (Markdown + JSX).

## Cómo ejecutarlo localmente

Este proyecto usa una arquitectura cliente-servidor concurrente.

1. **Clonar el repositorio**
   ```bash
   git clone [https://github.com/TU_USUARIO/economic-growth-simulator.git](https://github.com/TU_USUARIO/economic-growth-simulator.git)
   cd economic-growth-simulator
   ```

Instalar dependencias
    Bash

    ```bash
    npm install
    ```
Ejecutar (Frontend + Backend)
Necesitas dos terminales:

Terminal 1 (Backend API - Puerto 3001):
    Bash
```bash
    node server.js
```
    Terminal 2 (Frontend React - Puerto 5173):
    Bash
```bash
    npm run dev
```
    Abrir en el navegador
    Visita http://localhost:5173


---

### ¿Cómo actualizarlo después?

Cada vez que hagas cambios (ej. agregues el Capítulo 2), solo repites:

```bash
git add .
git commit -m "Agregando Capítulo 2"
git push
```