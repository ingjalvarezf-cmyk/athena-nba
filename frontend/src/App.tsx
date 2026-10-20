import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// URL directa y definitiva de tu servidor en Render
const API_URL = "https://athena-nba.onrender.com";

interface Game {
  game_id: string;
  team_id: string;
  game_date: string;
  matchup: string;
  wl: string;
  pts: number;
}

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [filterWl, setFilterWl] = useState<string>('ALL');
  const [filterTeam, setFilterTeam] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/games`, {
          params: { wl: filterWl, team: filterTeam }
        });
        if (response.data.success) {
          setGames(response.data.data);
        }
      } catch (error) {
        console.error("Error al cargar los partidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [filterWl, filterTeam]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ATHENA <span className="text-blue-600">NBA</span></h1>
        <p className="text-sm text-gray-600">Motor de Inteligencia Deportiva</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">🔍 Filtros Dinámicos:</span>
        </div>
        <div className="flex gap-4">
          <select 
            value={filterTeam} 
            onChange={(e) => setFilterTeam(e.target.value)}
            className="border rounded-lg p-2 text-sm bg-white"
          >
            <option value="ALL">Todos los Equipos</option>
          </select>
          <select 
            value={filterWl} 
            onChange={(e) => setFilterWl(e.target.value)}
            className="border rounded-lg p-2 text-sm bg-white"
          >
            <option value="ALL">Cualquier Resultado</option>
            <option value="W">Victorias (W)</option>
            <option value="L">Derrotas (L)</option>
          </select>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-6 text-center">
        {loading ? (
          <p className="text-gray-500">Cargando partidos desde la nube...</p>
        ) : games.length === 0 ? (
          <p className="text-gray-500">No se encontraron partidos con estos filtros.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {games.map((game, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-xs bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{game.matchup}</p>
                  <p className="text-xs text-gray-500">{game.game_date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${game.wl === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {game.wl} ({game.pts} pts)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}