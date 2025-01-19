import React, { useState } from "react";
const XLSX = window.XLSX;

function App() {
  const [stats, setStats] = useState({
    golesTeamRed: 0,
    golesTeamBlue: 0,
    pasesTeamRed: 0,
    pasesTeamBlue: 0,
    tirosTeamRed: 0,
    tirosTeamBlue: 0,
  });

  const exportData = () => {
    const data = [
      ["Equipo", "Goles", "Pases", "Tiros"],
      ["Equipo Rojo", stats.golesTeamRed, stats.pasesTeamRed, stats.tirosTeamRed],
      ["Equipo Azul", stats.golesTeamBlue, stats.pasesTeamBlue, stats.tirosTeamBlue],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas");
    XLSX.writeFile(wb, "estadisticas.xlsx");
  };

  return (
    <div>
      <h1>Estadísticas</h1>
      <button onClick={() => setStats({...stats, golesTeamRed: stats.golesTeamRed + 1})}>
        Gol Rojo
      </button>
      <button onClick={() => setStats({...stats, golesTeamBlue: stats.golesTeamBlue + 1})}>
        Gol Azul
      </button>
      <button onClick={exportData}>Exportar Datos</button>
    </div>
  );
}

export default App;
