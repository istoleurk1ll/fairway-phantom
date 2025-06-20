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
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=ee5aac1be154e1da59237d9e3a2b3f5c&units=imperial`
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
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="border px-2">Hole</th>
            {players.map((player, idx) => (
              <th key={idx} className="border px-2">{player}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holes.map((hole) => (
            <tr key={hole}>
              <td className="border px-2">{hole}</td>
              {players.map((player, idx) => (
                <td key={idx} className="border px-2">
                  <input
                    type="number"
                    value={scores[player]?.[hole] || ""}
                    onChange={(e) => updateScore(player, hole, e.target.value)}
                    className="w-full border rounded px-1"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {location && (
        <div>
          <p>Latitude: {location.latitude.toFixed(4)}</p>
          <p>Longitude: {location.longitude.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}
