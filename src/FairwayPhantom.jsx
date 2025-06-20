import { useState, useEffect } from "react";

export default function FairwayPhantom() {
  const [players, setPlayers] = useState(["Player 1"]);
  const [scores, setScores] = useState({});
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const holes = Array.from({ length: 18 }, (_, i) => i + 1);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = pos.coords;
      setLocation(coords);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&ee5aac1be154e1da59237d9e3a2b3f5c&units=imperial`
      );
      const data = await res.json();
      setWeather(data);
    });
  }, []);

  const updateScore = (player, hole, value) => {
    setScores((prev) => ({
      ...prev,
      [player]: { ...prev[player], [hole]: value },
    }));
  };

  const addPlayer = () => {
    setPlayers([...players, `Player ${players.length + 1}`]);
  };

  const getTotalScore = (player) => {
    return holes.reduce((sum, h) => sum + (parseInt(scores[player]?.[h]) || 0), 0);
  };

  const generateScorecard = () => {
    let text = "Fairway Phantom - Scorecard\n\n";
    players.forEach((player) => {
      text += `${player}: Total ${getTotalScore(player)}\n`;
      holes.forEach((h) => {
        text += `  Hole ${h}: ${scores[player]?.[h] || "-"}\n`;
      });
      text += "\n";
    });
    navigator.clipboard.writeText(text).then(() => {
      alert("Scorecard copied to clipboard!");
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fairway Phantom</h1>
      {weather && (
        <div className="mb-4">
          <p>📍 {weather.name}</p>
          <p>🌡️ {weather.main.temp}°F | 💨 {weather.wind.speed} mph</p>
        </div>
      )}
      <button onClick={addPlayer} className="mb-4 p-2 bg-green-600 text-white rounded">
        ➕ Add Player
      </button>
      <button onClick={generateScorecard} className="ml-2 mb-4 p-2 bg-blue-600 text-white rounded">
