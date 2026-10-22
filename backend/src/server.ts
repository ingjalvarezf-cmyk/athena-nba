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
    .catch((err: unknown) => console.error("Error conectando a MongoDB:", err));
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
app.get("/api/games", async (req: import("express").Request, res: import("express").Response) => {
  try {
    const wl = typeof req.query.wl === "string" ? req.query.wl : undefined;
    const team = typeof req.query.team === "string" ? req.query.team : undefined;
    let filter: Record<string, unknown> = {};
    if (wl && wl !== 'ALL') filter.wl = wl;
    if (team && team !== 'ALL') {
      filter.matchup = { $regex: team,$options: 'i' };
    }
    const games = await Game.find(filter).sort({ game_date: -1 });
    res.json({ success: true, total: games.length, data: games });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Error interno" });
  }
});

// Endpoint para inyectar partidos reales
app.get("/api/seed", (_req: import("express").Request, res: import("express").Response) => {
  return res.status(410).json({
    success: false,
    message: "Endpoint deshabilitado por seguridad."
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));