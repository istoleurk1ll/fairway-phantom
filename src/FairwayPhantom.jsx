// Full app with Course Builder, Dark Mode Toggle, and Leaderboard
import { useState, useEffect } from "react";

import { MapPin } from "lucide-react";

export default function FairwayPhantom() {
  const [players, setPlayers] = useState(["Player 1"]);
  const [avatars, setAvatars] = useState({});
  const [scores, setScores] = useState({});
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("default");
  const [selectedTee, setSelectedTee] = useState("default");
  const [selectedTee, setSelectedTee] = useState("gold");
  const [darkMode, setDarkMode] = useState(false);
  const [courses, setCourses] = useState({
    augusta: {
      name: "Augusta National",
      tees: {
        masters: {
          pars: [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 5, 3, 4, 5, 3, 4, 4],
          yardages: [445, 575, 350, 240, 495, 180, 450, 570, 460, 460, 505, 555, 155, 445, 530, 170, 440, 465],
        },
      },
    },
    crossingcreeks: {
      name: "Crossing Creeks Country Club",
      tees: {
        gold: {
          pars: [4,5,4,4,4,3,4,3,5,4,3,5,3,4,3,5,4,5],
          yardages: [390,541,395,319,380,206,341,200,587,388,225,545,211,383,151,533,269,592]
        },
        blue: {
          pars: [4,5,4,4,4,3,4,3,5,4,3,5,3,4,3,5,4,5],
          yardages: [377,510,370,307,360,181,345,173,541,359,201,534,197,341,138,507,243,571]
        },
        white: {
          pars: [4,5,4,4,4,3,4,3,5,4,3,5,3,4,3,5,4,5],
          yardages: [357,488,349,288,344,173,332,148,481,355,189,517,178,316,128,507,243,549]
        },
        red: {
          pars: [4,5,4,4,4,3,4,3,5,4,3,5,3,4,3,5,4,5],
          yardages: [313,453,298,274,325,139,293,122,434,245,225,417,144,306,116,305,214,459]
        }
      }
    },
    alpine: {
      name: "Alpine Golf Course",
      tees: {
        blue: {
          pars: [4,3,5,3,4,4,4,4,3,4,3,5,4,4,4,4,4,4],
          yardages: [345,120,565,125,370,385,385,360,240,330,160,590,350,345,400,330,351,425]
        },
        white: {
          pars: [4,3,5,3,4,4,4,4,3,4,3,5,4,4,4,4,4,4],
          yardages: [335,110,550,115,350,367,377,340,225,320,148,570,346,335,350,320,341,395]
        },
        red: {
          pars: [4,3,5,3,4,4,4,4,3,4,3,5,4,4,4,4,4,4],
          yardages: [320,100,460,100,310,300,346,250,200,300,132,400,300,310,270,300,290,295]
        }
      }
    },
    default: {
      name: "Custom Course",
      tees: {
        default: {
          pars: Array(18).fill(4),
          yardages: Array(18).fill(400),
        },
      },
    },
  });

  const holes = Array.from({ length: 18 }, (_, i) => i + 1);
  const course = courses[selectedCourse];
  const availableTees = course.tees ? Object.keys(course.tees) : [];
  const teeData = course.tees?.[selectedTee] || course.tees?.[availableTees[0]] || { pars: [], yardages: [] };

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
        setError("Could not load weather data.");
      }
    });
  }, []);

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem("players"));
    const savedScores = JSON.parse(localStorage.getItem("scores"));
    const savedAvatars = JSON.parse(localStorage.getItem("avatars"));
    if (savedPlayers) setPlayers(savedPlayers);
    if (savedScores) setScores(savedScores);
    if (savedAvatars) setAvatars(savedAvatars);
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
    const newPlayer = `Player ${players.length + 1}`;
    const avatar = prompt("Enter emoji or initials for avatar (e.g. 🧢 or JD):", "👤");
    const updatedAvatars = { ...avatars, [newPlayer]: avatar || "👤" };
    setAvatars(updatedAvatars);
    localStorage.setItem("avatars", JSON.stringify(updatedAvatars));
    const newPlayer = `Player ${players.length + 1}`;
    const updated = [...players, newPlayer];
    setPlayers(updated);
    localStorage.setItem("players", JSON.stringify(updated));
  };

  const renamePlayer = (index, newName) => {
    const updated = [...players];
    updated[index] = newName;
    setPlayers(updated);
    localStorage.setItem("players", JSON.stringify(updated));
  };

  const getTotalScore = (player) =>
    holes.reduce((sum, h) => sum + (parseInt(scores[player]?.[h]) || 0), 0);

  const resetRound = () => {
    setScores({});
    setPlayers(["Player 1"]);
    localStorage.removeItem("players");
    localStorage.removeItem("scores");
  };

  const exportScorecard = () => {
    const text = players.map((p) => `${p}: ${getTotalScore(p)}`).join("\n");
    const file = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "scorecard.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const createCourse = () => {
    const name = prompt("Course name?");
    if (!name) return;
    const tee = prompt("Tee name?") || "default";
    const pars = prompt("Enter 18 pars, comma separated:").split(",").map(Number);
    const yardages = prompt("Enter 18 yardages, comma separated:").split(",").map(Number);
    setCourses((prev) => ({
      ...prev,
      [name.toLowerCase().replace(/\s+/g, "")]: {
        name,
        tees: {
          [tee.toLowerCase()]: { pars, yardages }
        }
      }
    }));
  };

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fairway Phantom</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="px-2 py-1 border rounded">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Course:</label>
        <select value={selectedCourse} onChange={(e) => {
            const courseKey = e.target.value;
            setSelectedCourse(courseKey);
            const defaultTee = Object.keys(courses[courseKey].tees)[0];
            setSelectedTee(defaultTee);
          } className="border px-2 py-1 rounded">
          {Object.entries(courses).map(([key, c]) => (
            <option key={key} value={key}>{c.name}</option>
          ))}
        </select>
        {course.tees && (
          <>
            <label className="ml-4 mr-2 font-semibold">Tee Box:</label>
            <select value={selectedTee} onChange={(e) => setSelectedTee(e.target.value)} className="border px-2 py-1 rounded">
              {Object.keys(course.tees).map((tee) => (
                <option key={tee} value={tee}>{tee.toUpperCase()}</option>
              ))}
            </select>
          </>
        )}
        <button onClick={createCourse} className="ml-4 px-2 py-1 bg-blue-600 text-white rounded">➕ Add Course</button>
      </div>
      {weather && (
        <p className="mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {weather.name} — 🌡️ {weather.main.temp}°F, 💨 {weather.wind.speed} mph
        </p>
      )}
      {error && <p className="text-red-600 mb-2">⚠️ {error}</p>}
      <div className="mb-4 space-x-2">
        <button onClick={addPlayer} className="bg-green-600 text-white px-2 py-1 rounded">➕ Add Player</button>
        <button onClick={resetRound} className="bg-yellow-600 text-black px-2 py-1 rounded">🔄 Reset</button>
        <button onClick={exportScorecard} className="bg-purple-600 text-white px-2 py-1 rounded">📄 Export</button>
      </div>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="border px-2">Hole</th>
            <th className="border px-2">Par</th>
            <th className="border px-2">Yardage</th>
            {players.map((player, idx) => (
              <th key={idx} className="border px-2">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">{avatars[player] || "👤"}</span>
                  <input value={player} onChange={(e) => renamePlayer(idx, e.target.value)} className="w-full border px-1 rounded text-center mt-1" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holes.map((h) => (
            <tr key={h}>
              <td className="border px-2 font-bold">{h}</td>
              <td className="border px-2">{teeData.pars[h - 1]}</td>
              <td className="border px-2">{teeData.yardages[h - 1]}</td>
              {players.map((p, i) => (
                <td key={i} className="border px-2">
                  <input
                    type="number"
                    value={scores[p]?.[h] || ""}
                    onChange={(e) => updateScore(p, h, e.target.value)}
                    className="w-full border px-1 rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="border font-bold px-2">Total</td>
            {players.map((p, i) => (
              <td key={i} className="border font-bold px-2">{getTotalScore(p)}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">🏆 Leaderboard</h2>
        <ul>
          {[...players].sort((a, b) => getTotalScore(a) - getTotalScore(b)).map((p, i) => (
            <li key={i}>{i + 1}. {p} - {getTotalScore(p)} strokes</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
