import { useState, useEffect } from "react";

export default function FairwayPhantom() {
  const [players, setPlayers] = useState(["Player 1"]);
  const [scores, setScores] = useState({});
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("default");

  const courses = {
    alpine: {
      name: "Alpine Golf Course",
      tees: {
        blue: {
          pars: [4, 3, 5, 3, 4, 4, 4, 4, 3, 4, 3, 5, 4, 4, 4, 4, 4, 4],
          yardages: [345, 120, 565, 125, 370, 385, 385, 360, 240, 330, 160, 590, 350, 345, 400, 330, 351, 425]
        },
        white: {
          pars: [4, 3, 5, 3, 4, 4, 4, 4, 3, 4, 3, 5, 4, 4, 4, 4, 4, 4],
          yardages: [335, 110, 550, 115, 350, 367, 377, 340, 225, 320, 148, 570, 346, 335, 350, 320, 341, 395]
        },
        red: {
          pars: [4, 3, 5, 3, 4, 4, 4, 4, 3, 4, 3, 5, 4, 4, 4, 4, 4, 4],
          yardages: [320, 100, 460, 100, 310, 300, 346, 250, 200, 300, 132, 400, 300, 310, 270, 300, 290, 295]
        }
      }
    },
    crossingcreeks: {
      name: "Crossing Creeks Country Club",
      tees: {
        gold: {
          pars: [4, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3, 5, 3, 4, 3, 5, 4, 5],
          yardages: [390, 541, 395, 319, 380, 206, 341, 200, 587, 388, 225, 545, 211, 383, 151, 533, 269, 592]
        },
        blue: {
          pars: [4, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3, 5, 3, 4, 3, 5, 4, 5],
          yardages: [377, 510, 370, 307, 360, 181, 345, 173, 541, 359, 201, 534, 197, 341, 138, 507, 243, 571]
        },
        white: {
          pars: [4, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3, 5, 3, 4, 3, 5, 4, 5],
          yardages: [357, 488, 349, 288, 344, 173, 332, 148, 481, 355, 189, 517, 178, 316, 128, 507, 243, 549]
        },
        red: {
          pars: [4, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3, 5, 3, 4, 3, 5, 4, 5],
          yardages: [313, 453, 298, 274, 325, 139, 293, 122, 434, 245, 225, 417, 144, 306, 116, 305, 214, 459]
        }
      }
    },
    crossingcreeks: {
      name: "Crossing Creeks Country Club",
      pars: [4, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3, 5, 3, 4, 3, 5, 4, 5],
      yardages: [390, 541, 395, 319, 380, 206, 341, 200, 587, 388, 225, 545, 211, 383, 151, 533, 269, 592]
    },
    default: {
      name: "Generic Course",
      pars: Array(18).fill(4),
      yardages: Array(18).fill(400)
    },
    augusta: {
      name: "Augusta National",
      pars: [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 5, 3, 4, 5, 3, 4, 4],
      yardages: [445, 575, 350, 240, 495, 180, 450, 570, 460, 495, 505, 550, 155, 440, 530, 170, 440, 465]
    }
  };

  const holes = Array.from({ length: 18 }, (_, i) => i + 1);
  const course = courses[selectedCourse];
  const [selectedTee, setSelectedTee] = useState("gold");
  const teeData = course.tees ? course.tees[selectedTee] : course;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const coords = pos.coords;
        setLocation(coords);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=ee5aac1be154e1da59237d9e3a2b3f5c&units=imperial`
        );
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Could not load weather data.");
      }
    }, (geoErr) => {
      console.error("Geolocation error:", geoErr);
      setError("Geolocation not available.");
    });
  }, []);

  const updateScore = (player, hole, value) => {
    setScores((prev) => {
      const updated = {
        ...prev,
        [player]: { ...prev[player], [hole]: value },
      };
      localStorage.setItem("scores", JSON.stringify(updated));
      return updated;
    });
  };

  const addPlayer = () => {
    setPlayers([...players, `Player ${players.length + 1}`]);
  };

  const getTotalScore = (player) => {
    return holes.reduce((sum, h) => sum + (parseInt(scores[player]?.[h]) || 0), 0);
  };

  const generateScorecard = () => {
    let text = `Fairway Phantom - ${course.name} (${selectedTee.toUpperCase()} Tee) Scorecard

`;
    players.forEach((player) => {
      text += `${player}: Total ${getTotalScore(player)}\n`;
      holes.forEach((h) => {
        text += `  Hole ${h} | Par ${course.pars[h - 1]} | Yardage ${course.yardages[h - 1]} | Score: ${scores[player]?.[h] || "-"}\n`;
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
      <div className="mb-4">
        <label className=\"mr-2 font-semibold\">Select Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {Object.entries(courses).map(([key, course]) => (
            <option key={key} value={key}>{course.name}</option>
          ))}
        </select>
        {course.tees && (
          <>
            <label className="ml-4 mr-2 font-semibold">Tee Box:</label>
            <select
              value={selectedTee}
              onChange={(e) => setSelectedTee(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              {Object.keys(course.tees).map((tee) => (
                <option key={tee} value={tee}>{tee.charAt(0).toUpperCase() + tee.slice(1)}</option>
              ))}
            </select>
          </>
        )}
      </div>
      {error && <div className="mb-4 text-red-600">⚠️ {error}</div>}
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
        📋 Copy Scorecard
      </button>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="border px-2">Hole</th>
            <th className="border px-2">Par</th>
            <th className="border px-2">Yardage</th>
            {players.map((player, idx) => (
              <th key={idx} className="border px-2">{player}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holes.map((hole) => (
            <tr key={hole}>
              <td className="border px-2 font-semibold">{hole}</td>
              <td className="border px-2">{teeData.pars[hole - 1]}</td>
              <td className="border px-2">{teeData.yardages[hole - 1]}</td>
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
          <tr>
            <td colSpan={3} className="border font-bold px-2">Total</td>
            {players.map((player, idx) => (
              <td key={idx} className="border font-bold px-2">
                {getTotalScore(player)}
              </td>
            ))}
          </tr>
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
