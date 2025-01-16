import React, { useState, useEffect } from "react";
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

  // Manejo de posesión y pausa
  const handlePossession = (team) => {
    setActive({ red: team === "red", blue: team === "blue", paused: false, started: true });
  };

  const handlePause = () => {
    setActive({ red: false, blue: false, paused: true, started: true });
  };

  const handleReset = () => {
    setStats({
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
    setActive({ red: false, blue: false, paused: false, started: false });
    syncToFirebase({
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
  };

  // Calcular porcentaje de posesión basado en tiempo jugado
  const totalTimePlayed = stats.timeTeamRed + stats.timeTeamBlue;
  const possessionRed = totalTimePlayed
    ? Math.round((stats.timeTeamRed / totalTimePlayed) * 100)
    : 0;
  const possessionBlue = totalTimePlayed
    ? Math.round((stats.timeTeamBlue / totalTimePlayed) * 100)
    : 0;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Seguimiento de Partido</h1>
      <div style={{ marginBottom: "20px" }}>
        <h2>Estadísticas</h2>
        <div>
          <span>Goles Equipo Rojo: {stats.golesTeamRed}</span>
          <button
            onClick={() => updateStats("golesTeamRed", 1)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
        </div>
        <div>
          <span>Goles Equipo Azul: {stats.golesTeamBlue}</span>
          <button
            onClick={() => updateStats("golesTeamBlue", 1)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
        </div>
        <div>
          <span>Pases Equipo Rojo: {stats.pasesTeamRed}</span>
          <button
            onClick={() => updateStats("pasesTeamRed", 1)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
        </div>
        <div>
          <span>Pases Equipo Azul: {stats.pasesTeamBlue}</span>
          <button
            onClick={() => updateStats("pasesTeamBlue", 1)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
        </div>
        <div>
          <span>Tiros Equipo Rojo: {stats.tirosTeamRed}</span>
          <button
            onClick={() => updateStats("tirosTeamRed", 1)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
        </div>
        <div>
          <span>Tiros Equipo Azul: {stats.tirosTeamBlue}</span>
          <button
            onClick={() => updateStats("tirosTeamBlue", 1)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
        </div>
        <p>Posesión Equipo Rojo: {formatTime(stats.timeTeamRed)}</p>
        <p>Posesión Equipo Azul: {formatTime(stats.timeTeamBlue)}</p>
        <p>Tiempo Transcurrido: {formatTime(stats.timeElapsed)}</p>
        <p>Tiempo Pausado: {formatTime(stats.timePaused)}</p>
        <p>Tiempo Jugado: {formatTime(totalTimePlayed)}</p>
        <div
          style={{
            display: "flex",
            height: "30px",
            background: "#ddd",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: `${possessionRed}%`,
              background: "red",
              textAlign: "center",
              color: "white",
            }}
          >
            {possessionRed}%
          </div>
          <div
            style={{
              width: `${possessionBlue}%`,
              background: "blue",
              textAlign: "center",
              color: "white",
            }}
          >
            {possessionBlue}%
          </div>
        </div>
      </div>
      <div>
        <button onClick={() => handlePossession("red")} style={{ marginRight: "10px" }}>
          Posesión Equipo Rojo
        </button>
        <button onClick={() => handlePossession("blue")} style={{ marginRight: "10px" }}>
          Posesión Equipo Azul
        </button>
        <button onClick={handlePause} style={{ marginRight: "10px" }}>
          Tiempo Pausado
        </button>
        <button onClick={handleReset}>Reiniciar Todo</button>
      </div>
    </div>
  );
}

export default App;
