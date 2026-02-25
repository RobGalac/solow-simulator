import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Recibimos la nueva prop 'isAnimating'
const SolowChart = ({ params, autoZoom, isAnimating }) => { 
  const d3Container = useRef(null);

  useEffect(() => {
    if (params && d3Container.current) {
      const { s, n, g, delta, alpha } = params;
      const denom = n + g + delta;
      
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove();

      const width = 600;
      const height = 350;
      const margin = { top: 30, right: 30, bottom: 40, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // --- LÓGICA DE ZOOM INTELIGENTE ---
      let maxK;
      
      // 1. Calculamos el k* actual
      const current_k_star = Math.pow(s / denom, 1 / (1 - alpha));

      // 2. Calculamos el k* MÁXIMO que alcanzará la animación (s=0.60)
      // Esto sirve para fijar el escenario en "Modo Cine"
      const max_s_animation = 0.60;
      const max_possible_k = Math.pow(max_s_animation / denom, 1 / (1 - alpha));

      if (autoZoom) {
        if (isAnimating) {
           // MODO CINE: Si está animando, fijamos la cámara al tamaño máximo
           // Así la curva crece pero los ejes NO se mueven.
           maxK = Math.max(max_possible_k * 2.5, 0.5);
        } else {
           // MODO MICROSCOPIO: Si está pausado, ajuste apretado al valor actual
           maxK = Math.max(current_k_star * 2.5, 0.5);
        }
      } else {
        // MODO FIJO (Default): Referencia estándar alta
        maxK = Math.pow(0.55 / denom, 1 / (1 - alpha)) * 1.5;
      }
      
      // --- DEFINIR ESCALAS ---
      const x = d3.scaleLinear()
        .domain([0, maxK]) 
        .range([0, innerWidth]);

      // Calculamos Y máximo necesario
      const maxY_investment = s * Math.pow(maxK, alpha);
      const maxY_break = denom * maxK;
      const maxY_calculated = Math.max(maxY_investment, maxY_break);

      // Si anima, también fijamos Y al máximo posible para evitar saltos verticales
      const maxY_animation = 0.60 * Math.pow(maxK, alpha); // s=0.60
      const maxY_animation_cap = Math.max(maxY_animation, denom * maxK);

      const y = d3.scaleLinear()
        .domain([0, (autoZoom && isAnimating) ? maxY_animation_cap * 1.1 : (autoZoom ? maxY_calculated * 1.1 : 6)]) 
        .range([innerHeight, 0]);

      // --- DIBUJO ---
      const gChart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const data = d3.range(0, maxK, maxK/150).map(k => ({
        k,
        invReal: s * Math.pow(k, alpha),
        invBreak: denom * k
      }));

      // Ejes y Grid
      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y);

      gChart.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .append("text")
        .attr("y", 35).attr("x", innerWidth / 2)
        .attr("fill", "#555").style("font-size", "12px")
        .text("Capital por trabajador efectivo (k)");

      gChart.append("g")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)").attr("y", -45).attr("x", -innerHeight / 2)
        .attr("fill", "#555").style("font-size", "12px")
        .text("Inversión");

      gChart.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""))
        .attr("stroke-opacity", 0.1);

      // Curvas
      const lineReal = d3.line().x(d => x(d.k)).y(d => y(d.invReal));
      const lineBreak = d3.line().x(d => x(d.k)).y(d => y(d.invBreak));
      const areaGrowth = d3.area()
        .x(d => x(d.k)).y0(d => y(d.invBreak)).y1(d => y(d.invReal))
        .defined(d => d.invReal >= d.invBreak);

      gChart.append("path").datum(data).attr("fill", "#2ecc71").attr("fill-opacity", 0.2).attr("d", areaGrowth);
      gChart.append("path").datum(data).attr("fill", "none").attr("stroke", "#2980b9").attr("stroke-width", 3).attr("d", lineReal);
      gChart.append("path").datum(data).attr("fill", "none").attr("stroke", "#c0392b").attr("stroke-width", 2).attr("stroke-dasharray", "5,5").attr("d", lineBreak);

      // Punto de Equilibrio
      gChart.append("circle")
        .attr("cx", x(current_k_star))
        .attr("cy", y(denom * current_k_star))
        .attr("r", 6).attr("fill", "gold").attr("stroke", "black");

      // --- TOOLTIP (Interacción Ratón) ---
      const focus = gChart.append("g").style("display", "none");
      focus.append("line").attr("class", "hover-line").attr("y1", 0).attr("y2", innerHeight).style("stroke", "#999").style("stroke-dasharray", "3,3").style("opacity", 0.5);
      focus.append("circle").attr("r", 5).attr("fill", "white").attr("stroke", "#2980b9").attr("stroke-width", 2);
      
      const tooltipBg = focus.append("rect").attr("width", 140).attr("height", 60).attr("x", 10).attr("y", -30).attr("fill", "white").attr("stroke", "#ccc").attr("rx", 5).style("opacity", 0.9);
      const txtK = focus.append("text").attr("x", 18).attr("y", -10).style("font-size", "12px").style("font-weight", "bold");
      const txtInv = focus.append("text").attr("x", 18).attr("y", 10).style("font-size", "12px").attr("fill", "#2980b9");
      const txtDep = focus.append("text").attr("x", 18).attr("y", 25).style("font-size", "11px").attr("fill", "#c0392b");

      gChart.append("rect")
        .attr("width", innerWidth).attr("height", innerHeight)
        .style("fill", "none").style("pointer-events", "all")
        .on("mouseover", () => focus.style("display", null))
        .on("mouseout", () => focus.style("display", "none"))
        .on("mousemove", mousemove);

      const bisect = d3.bisector(d => d.k).left;

      function mousemove(event) {
        const x0 = x.invert(d3.pointer(event)[0]);
        const i = bisect(data, x0, 1);
        if (i >= data.length) return;
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = (d0 && d1) ? (x0 - d0.k > d1.k - x0 ? d1 : d0) : (d0 || d1);

        focus.attr("transform", `translate(${x(d.k)},${y(d.invReal)})`);
        txtK.text(`Capital: ${d.k.toFixed(2)}`);
        txtInv.text(`Inv: ${d.invReal.toFixed(2)}`);
        txtDep.text(`Dep: ${d.invBreak.toFixed(2)}`);

        if (x(d.k) > innerWidth - 150) {
            tooltipBg.attr("x", -150);
            txtK.attr("x", -142); txtInv.attr("x", -142); txtDep.attr("x", -142);
        } else {
            tooltipBg.attr("x", 10);
            txtK.attr("x", 18); txtInv.attr("x", 18); txtDep.attr("x", 18);
        }
      }

    }
  }, [params, autoZoom, isAnimating]); // Importante: dependencia isAnimating agregada

  return (
    <div style={{border: '1px solid #ddd', borderRadius: '8px', padding: '10px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
        <svg className="d3-component" viewBox="0 0 600 350" style={{width: '100%', height: 'auto'}} ref={d3Container} />
    </div>
  );
}

export default SolowChart;