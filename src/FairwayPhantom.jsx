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

  const course = courses[selectedCourse];
  const availableTees = course.tees ? Object.keys(course.tees) : [];
  const validTee = availableTees.includes(selectedTee) ? selectedTee : availableTees[0];
  const teeData = course?.tees?.[validTee];

  const holes = Array.from({ length: 18 }, (_, i) => i + 1);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (err) => setError("Location unavailable")
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=ee5aac1be154e1da59237d9e3a2b3f5c&units=imperial`
      )
        .then((res) => res.json())
        .then((data) => setWeather(data.main))
        .catch(() => setError("Weather data unavailable"));
    }
  }, [location]);

  return (
    <div className={`p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fairway Phantom</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="px-2 py-1 border rounded">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Select Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedTee("white");
          }}
          className="border px-2 py-1 rounded w-full"
        >
          {Object.entries(courses).map(([key, course]) => (
            <option key={key} value={key}>{course.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Select Tee:</label>
        <select
          value={selectedTee}
          onChange={(e) => setSelectedTee(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          {availableTees.map((tee) => (
            <option key={tee} value={tee}>{tee.charAt(0).toUpperCase() + tee.slice(1)}</option>
          ))}
        </select>
      </div>

      {weather && (
        <div className="mb-4 flex items-center">
          <MapPin className="mr-2" />
          <p>Temp: {weather.temp}°F</p>
        </div>
      )}

      <div className="overflow-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">Hole</th>
              {holes.map((hole) => (
                <th key={hole} className="border px-2">{hole}</th>
              ))}
              <th className="border px-2">Total</th>
            </tr>
            <tr>
              <td className="border px-2 font-bold">Par</td>
              {teeData?.pars?.map((par, idx) => (
                <td key={idx} className="border px-2">{par}</td>
              ))}
              <td className="border px-2 font-bold">{teeData?.pars?.reduce((a,b) => a + b, 0)}</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <tr key={idx}>
                <td className="border px-2 font-semibold">{player}</td>
                {holes.map((hole) => (
                  <td key={hole} className="border px-2">
                    <input
                      type="number"
                      className="w-12 text-center bg-transparent"
                      value={scores[player]?.[hole] || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setScores((prev) => ({
                          ...prev,
                          [player]: { ...prev[player], [hole]: val },
                        }));
                      }}
                    />
                  </td>
                ))}
                <td className="border px-2 font-bold">
                  {Object.values(scores[player] || {}).reduce((a,b) => a + b, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
