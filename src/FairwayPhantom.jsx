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

  return ( ... ); // UI remains unchanged
}
