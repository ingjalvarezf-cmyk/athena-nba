const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("¡Conectado a MongoDB Atlas!"))
    .catch(err => console.error("Error conectando a MongoDB:", err));
}

const gameSchema = new mongoose.Schema({
  game_id: String,
  team_id: String,
  game_date: String,
  matchup: String,
  wl: String,
  pts: Number
});

const Game = mongoose.model("Game", gameSchema);

// Endpoint de consulta con filtrado por resultado y búsqueda de equipo
app.get("/api/games", async (req, res) => {
  try {
    const { wl, team } = req.query;
    let filter = {};
    if (wl && wl !== 'ALL') filter.wl = wl;
    if (team && team !== 'ALL') {
      filter.matchup = { $regex: team,$options: 'i' };
    }
    const games = await Game.find(filter).sort({ game_date: -1 });
    res.json({ success: true, total: games.length, data: games });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para inyectar partidos reales
app.get("/api/seed", async (req, res) => {
  try {
    await Game.deleteMany({});
    const realNbaGames = [
      { game_id: "0022301201", team_id: "1610612738", game_date: "2024-04-14", matchup: "BOS vs. WAS", wl: "W", pts: 132 },
      { game_id: "0022301201", team_id: "1610612764", game_date: "2024-04-14", matchup: "WAS @ BOS", wl: "L", pts: 122 },
      { game_id: "0022301202", team_id: "1610612760", game_date: "2024-04-14", matchup: "OKC vs. DAL", wl: "W", pts: 135 },
      { game_id: "0022301202", team_id: "1610612742", game_date: "2024-04-14", matchup: "DAL @ OKC", wl: "L", pts: 86 },
      { game_id: "0022301203", team_id: "1610612747", game_date: "2024-04-14", matchup: "LAL @ NOP", wl: "W", pts: 124 },
      { game_id: "0022301203", team_id: "1610612740", game_date: "2024-04-14", matchup: "NOP vs. LAL", wl: "L", pts: 108 },
      { game_id: "0022301204", team_id: "1610612744", game_date: "2024-04-14", matchup: "GSW vs. UTA", wl: "W", pts: 123 },
      { game_id: "0022301204", team_id: "1610612762", game_date: "2024-04-14", matchup: "UTA @ GSW", wl: "L", pts: 116 },
      { game_id: "0022301205", team_id: "1610612743", game_date: "2024-04-14", matchup: "DEN vs. MEM", wl: "W", pts: 126 },
      { game_id: "0022301205", team_id: "1610612763", game_date: "2024-04-14", matchup: "MEM @ DEN", wl: "L", pts: 111 },
      { game_id: "0022301206", team_id: "1610612752", game_date: "2024-04-14", matchup: "NYK vs. CHI", wl: "W", pts: 120 },
      { game_id: "0022301206", team_id: "1610612741", game_date: "2024-04-14", matchup: "CHI @ NYK", wl: "L", pts: 119 },
      { game_id: "0022301207", team_id: "1610612749", game_date: "2024-04-14", matchup: "MIL @ ORL", wl: "L", pts: 88 },
      { game_id: "0022301207", team_id: "1610612753", game_date: "2024-04-14", matchup: "ORL vs. MIL", wl: "W", pts: 113 },
      { game_id: "0022301208", team_id: "1610612756", game_date: "2024-04-14", matchup: "PHX @ MIN", wl: "W", pts: 125 },
      { game_id: "0022301208", team_id: "1610612750", game_date: "2024-04-14", matchup: "MIN vs. PHX", wl: "L", pts: 106 }
    ];
    await Game.insertMany(realNbaGames);
    res.json({ success: true, count: realNbaGames.length, message: "¡Base de datos cargada con partidos reales de la NBA!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));