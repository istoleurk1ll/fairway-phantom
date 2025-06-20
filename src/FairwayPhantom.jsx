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
  const [selectedCourse, setSelectedCourse] = useState("crossingcreeks");
  const [selectedTee, setSelectedTee] = useState("white");
  const [darkMode, setDarkMode] = useState(false);
  const [courses, setCourses] = useState({
          },
    },
    crossingcreeks: {
      name: "Crossing Creeks Country Club",
      tees: {
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

  // Force clean state load to ensure no stale tee options (like Gold)
  useEffect(() => {
    setCourses({
      crossingcreeks: {
        name: "Crossing Creeks Country Club",
        tees: {
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
  }, []);
  const course = courses[selectedCourse];
  const availableTees = course.tees ? Object.keys(course.tees) : [];
  const isValidTee = course.tees && course.tees[selectedTee];
  // teeData moved below after validation

  useEffect(() => {
    if (selectedCourse && courses[selectedCourse]) {
      const tees = Object.keys(courses[selectedCourse].tees);
      if (!tees.includes(selectedTee)) {
        setSelectedTee(tees[0]);
      }
    }
  }, [selectedCourse]);

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
    // Full localStorage wipe to remove lingering gold tee and default course
    localStorage.removeItem("courses");
    localStorage.removeItem("selectedCourse");
    localStorage.removeItem("selectedTee");
    localStorage.removeItem("courses");

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

  if (!isValidTee || !course.tees[selectedTee]?.pars || !course.tees[selectedTee]?.yardages || course.tees[selectedTee].pars.length !== 18 || course.tees[selectedTee].yardages.length !== 18) return null;

  const validTee = availableTees.includes(selectedTee) ? selectedTee : availableTees[0];
  const teeData = course?.tees?.[validTee];

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fairway Phantom</h1>
        <div className="flex gap-2 items-center">
          <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded border">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={createCourse} className="px-3 py-1 rounded border">➕ Add Course</button>
        </div>
      </div>

      {weather && (
        <p className="mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {weather.name} — 🌡️ {weather.main.temp}°F, 💨 {weather.wind.speed} mph
        </p>
      )}

      <div className="mb-4">
        <label className="mr-2">Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => {
            const key = e.target.value;
            const tees = Object.keys(courses[key].tees);
            const validTee = tees.includes(selectedTee) ? selectedTee : tees[0];
            setSelectedCourse(key);
            setSelectedTee(validTee);
          }}
          className="border px-2 py-1 rounded"
        >
          {Object.entries(courses).map(([key, c]) => (
            <option key={key} value={key}>{c.name}</option>
          ))}
        </select>

        <label className="ml-4 mr-2">Tee:</label>
        <select
          value={selectedTee}
          onChange={(e) => setSelectedTee(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {availableTees.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full border text-center">
          <thead>
            <tr>
              <th className="border px-2">Hole</th>
              {holes.map((h) => (
                <th key={h} className="border px-2">{h}</th>
              ))}
              <th className="border px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <tr key={player}>
                <td className="border px-2">
                  <div className="flex flex-col items-center">
                    <span>{avatars[player] || '👤'}</span>
                    <input
                      value={player}
                      onChange={(e) => renamePlayer(idx, e.target.value)}
                      className="w-full border px-1 rounded text-center mt-1"
                    />
                  </div>
                </td>
                {holes.map((h) => (
                  <td key={h} className="border">
                    <input
                      type="number"
                      value={scores[player]?.[h] || ''}
                      onChange={(e) => updateScore(player, h, e.target.value)}
                      className="w-12 text-center border-none"
                    />
                  </td>
                ))}
                <td className="border font-bold">{getTotalScore(player)}</td>
              </tr>
            ))}
            <tr>
              <td className="border font-bold">Par</td>
              {teeData.pars.map((par, idx) => (
                <td key={idx} className="border">{par}</td>
              ))}
              <td className="border font-bold">{teeData.pars.reduce((a, b) => a + b, 0)}</td>
            </tr>
            <tr>
              <td className="border font-bold">Yardage</td>
              {teeData.yardages.map((y, idx) => (
                <td key={idx} className="border text-sm">{y}</td>
              ))}
              <td className="border font-bold text-sm">{teeData.yardages.reduce((a, b) => a + b, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={addPlayer} className="px-4 py-2 rounded border">➕ Add Player</button>
        <button onClick={resetRound} className="px-4 py-2 rounded border">🔄 Reset Round</button>
        <button onClick={exportScorecard} className="px-4 py-2 rounded border">📤 Export Scorecard</button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">🏆 Leaderboard</h2>
        <ul>
          {[...players].sort((a, b) => getTotalScore(a) - getTotalScore(b)).map((p, i) => (
            <li key={p} className="mb-1">{i + 1}. {avatars[p] || '👤'} {p} – {getTotalScore(p)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
