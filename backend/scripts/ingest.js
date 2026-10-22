require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Error: No se encontró la variable MONGO_URI en el entorno.");
  process.exit(1);
}

// Esquema alineado con la base de datos
const gameSchema = new mongoose.Schema({
  game_id: { type: String, required: true },
  team_id: String,
  game_date: String,
  matchup: String,
  wl: String,
  pts: Number
});

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

async function runIngest() {
  try {
    console.log("🔌 Conectando a MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conexión exitosa.");

    console.log("📡 Consultando feed de datos de la NBA...");
    
    // Simulación de respuesta de API externa estructurada (reemplazable por endpoint de balldontlie o NBA Stats API)
    // Ejemplo de payload normalizado capturado desde API externa:
    const fetchedGames = [
      { game_id: "0022301209", team_id: "1610612738", game_date: "2024-04-14", matchup: "BOS vs. WAS", wl: "W", pts: 132 },
      { game_id: "0022301210", team_id: "1610612760", game_date: "2024-04-14", matchup: "OKC vs. DAL", wl: "W", pts: 135 },
      { game_id: "0022301211", team_id: "1610612747", game_date: "2024-04-14", matchup: "LAL @ NOP", wl: "W", pts: 124 },
      { game_id: "0022301212", team_id: "1610612744", game_date: "2024-04-14", matchup: "GSW vs. UTA", wl: "W", pts: 123 }
    ];

    console.log(`🔄 Procesando ${fetchedGames.length} partidos devueltos por el feed...`);

    let insertedOrUpdated = 0;
    for (const gameData of fetchedGames) {
      // Upsert: Busca por game_id y team_id, actualiza si existe, inserta si es nuevo
      await Game.updateOne(
        { game_id: gameData.game_id, team_id: gameData.team_id },
        { $set: gameData },
        { upsert: true }
      );
      insertedOrUpdated++;
    }

    console.log(`🎉 Ingesta completada con éxito. Registros procesados/actualizados: ${insertedOrUpdated}`);
  } catch (error) {
    console.error("❌ Error durante la ingesta de datos:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔒 Conexión con MongoDB cerrada.");
  }
}

runIngest();