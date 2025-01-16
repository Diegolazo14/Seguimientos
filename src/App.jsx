import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Importar la biblioteca para exportar a Excel
import database from "./FirebaseConfig";
import { ref, set } from "firebase/database";

function App() {
  const [stats, setStats] = useState({
    timeTeamRed: 0,
    timeTeamBlue: 0,
    golesTeamRed: 0,
    golesTeamBlue: 0,
    pasesTeamRed: 0,
    pasesTeamBlue: 0,
    tirosTeamRed: 0,
    tirosTeamBlue: 0,
    timeElapsed: 0,
    timePaused: 0,
  });

  const [golTimesRed, setGolTimesRed] = useState([]); // Registrar tiempos de goles del Equipo Rojo
  const [golTimesBlue, setGolTimesBlue] = useState([]); // Registrar tiempos de goles del Equipo Azul
  const [tiroTimesRed, setTiroTimesRed] = useState([]); // Registrar tiempos de tiros del Equipo Rojo
  const [tiroTimesBlue, setTiroTimesBlue] = useState([]); // Registrar tiempos de tiros del Equipo Azul

  const [active, setActive] = useState({ red: false, blue: false, paused: false, started: false });

  // Cronómetro de tiempo transcurrido
  useEffect(() => {
    let timer;
    if (active.started) {
      timer = setInterval(() => {
        setStats((prev) => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [active.started]);

  // Cronómetros de posesión y tiempo pausado
  useEffect(() => {
    let interval;
    if (active.red) {
      interval = setInterval(() => updateStats("timeTeamRed", 1), 1000);
    } else if (active.blue) {
      interval = setInterval(() => updateStats("timeTeamBlue", 1), 1000);
    } else if (active.paused) {
      interval = setInterval(() => updateStats("timePaused", 1), 1000);
    }
    return () => clearInterval(interval);
  }, [active]);

  // Función para actualizar estadísticas
  const updateStats = (key, value) => {
    setStats((prev) => {
      const updated = { ...prev, [key]: prev[key] + value };
      syncToFirebase(updated);
      return updated;
    });
  };

  // Sincronización con Firebase
  const syncToFirebase = (data) => {
    set(ref(database, "matchStats"), data);
  };

  // Formatear tiempo a hh:mm:ss
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Funciones para goles y tiros con registro de tiempos
  const handleGolRed = () => {
    const currentTime = formatTime(stats.timeElapsed);
    setGolTimesRed((prev) => [...prev, currentTime]);
    updateStats("golesTeamRed", 1);
  };

  const handleGolBlue = () => {
    const currentTime = formatTime(stats.timeElapsed);
    setGolTimesBlue((prev) => [...prev, currentTime]);
    updateStats("golesTeamBlue", 1);
  };

  const handleTiroRed = () => {
    const currentTime = formatTime(stats.timeElapsed);
    setTiroTimesRed((prev) => [...prev, currentTime]);
    updateStats("tirosTeamRed", 1);
  };

  const handleTiroBlue = () => {
    const currentTime = formatTime(stats.timeElapsed);
    setTiroTimesBlue((prev) => [...prev, currentTime]);
    updateStats("tirosTeamBlue", 1);
  };

  // Función para exportar datos a Excel
  const exportToExcel = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");

    const data = [
      {
        "Equipo Rojo - Goles": stats.golesTeamRed,
        "Equipo Rojo - Tiempos de Goles": golTimesRed.join(", "),
        "Equipo Rojo - Tiros": stats.tirosTeamRed,
        "Equipo Rojo - Tiempos de Tiros": tiroTimesRed.join(", "),
        "Equipo Rojo - Pases": stats.pasesTeamRed,
        "Equipo Rojo - Posesión": formatTime(stats.timeTeamRed),
        "Equipo Azul - Goles": stats.golesTeamBlue,
        "Equipo Azul - Tiempos de Goles": golTimesBlue.join(", "),
        "Equipo Azul - Tiros": stats.tirosTeamBlue,
        "Equipo Azul - Tiempos de Tiros": tiroTimesBlue.join(", "),
        "Equipo Azul - Pases": stats.pasesTeamBlue,
        "Equipo Azul - Posesión": formatTime(stats.timeTeamBlue),
        "Tiempo Transcurrido": formatTime(stats.timeElapsed),
        "Tiempo Pausado": formatTime(stats.timePaused),
        "Tiempo Jugado": formatTime(stats.timeTeamRed + stats.timeTeamBlue),
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos del Partido");

    XLSX.writeFile(wb, `Datos_Partido_${timestamp}.xlsx`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Seguimiento de Partido</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleGolRed}>Gol Equipo Rojo</button>
        <button onClick={handleGolBlue}>Gol Equipo Azul</button>
        <button onClick={handleTiroRed}>Tiro Equipo Rojo</button>
        <button onClick={handleTiroBlue}>Tiro Equipo Azul</button>
        <button onClick={exportToExcel} style={{ marginTop: "20px" }}>
          Exportar Datos a Excel
        </button>
      </div>
    </div>
  );
}

export default App;
