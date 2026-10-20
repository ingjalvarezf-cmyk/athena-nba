const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Tus datos de prueba estáticos (como no tienes base de datos aún, simulamos la respuesta)
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

app.get("/api/games", (req, res) => {
  const { wl, team } = req.query;
  let filteredGames = nbaGames;

  if (wl && wl !== 'ALL') {
    filteredGames = filteredGames.filter(g => g.wl === wl);
  }
  
  // Aquí podrías agregar más lógica para filtrar por equipo si tuvieras los nombres
  
  res.json({
    success: true,
    total: filteredGames.length,
    data: filteredGames
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor de ATHENA NBA corriendo en el puerto ${PORT}`));