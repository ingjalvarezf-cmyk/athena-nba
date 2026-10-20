const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Conectarse a MongoDB usando tu llave secreta de Render
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("¡Conectado a la Base de Datos MongoDB!"))
    .catch(err => console.error("Error conectando a MongoDB:", err));
} else {
  console.log("Advertencia: No se detectó MONGO_URI. Configúralo en Render.");
}

// 1. Definimos la estructura de la tabla de la base de datos
const gameSchema = new mongoose.Schema({
  game_id: String,
  team_id: String,
  game_date: String,
  matchup: String,
  wl: String,
  pts: Number
});

// Este modelo nos permitirá buscar, agregar o borrar partidos reales
const Game = mongoose.model("Game", gameSchema);

// 2. La ruta que consulta Vercel: ahora lee datos reales desde la nube
app.get("/api/games", async (req, res) => {
  try {
    const { wl, team } = req.query;
    let filter = {};
    if (wl && wl !== 'ALL') filter.wl = wl;
    
    // Traemos los partidos desde la base de datos
    const games = await Game.find(filter);
    
    res.json({ success: true, total: games.length, data: games });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Ruta secreta para "sembrar" los datos la primera vez
app.get("/api/seed", async (req, res) => {
  try {
    // Limpia la BD y mete los partidos iniciales
    await Game.deleteMany({});
    const nbaGames = [
      { game_id: "0022300004", team_id: "1610612759", game_date: "25 oct 2023", matchup: "SAS vs. DAL", wl: "L", pts: 119 },
      { game_id: "0022300003", team_id: "1610612738", game_date: "25 oct 2023", matchup: "BOS @ NYK", wl: "W", pts: 108 },
      { game_id: "0022300003", team_id: "1610612752", game_date: "25 oct 2023", matchup: "NYK vs. BOS", wl: "L", pts: 104 },
      { game_id: "0022300004", team_id: "1610612742", game_date: "25 oct 2023", matchup: "DAL @ SAS", wl: "W", pts: 126 },
      { game_id: "0022300001", team_id: "1610612747", game_date: "24 oct 2023", matchup: "LAL @ DEN", wl: "L", pts: 107 },
      { game_id: "0022300001", team_id: "1610612743", game_date: "24 oct 2023", matchup: "DEN vs. LAL", wl: "W", pts: 119 },
      { game_id: "0022300002", team_id: "1610612756", game_date: "24 oct 2023", matchup: "PHX @ GSW", wl: "W", pts: 108 },
      { game_id: "0022300002", team_id: "1610612744", game_date: "24 oct 2023", matchup: "GSW vs. PHX", wl: "L", pts: 104 }
    ];
    await Game.insertMany(nbaGames);
    res.json({ success: true, message: "¡Base de datos sembrada con éxito!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));