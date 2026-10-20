import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Activity, Trophy, Hash, Filter } from 'lucide-react';

interface Game { game_id: string; game_date: string; matchup: string; wl: string; pts: number; }

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para nuestros nuevos filtros
  const [filterWl, setFilterWl] = useState('ALL');
  const [filterTeam, setFilterTeam] = useState('ALL');

  // Cada vez que un filtro cambie, este useEffect volverá a llamar al backend
  useEffect(() => {
    setLoading(true);
    axios.get('/api/games', {
      params: { wl: filterWl, team: filterTeam }
    })
      .then(response => {
        setGames(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los partidos:", error);
        setLoading(false);
      });
  }, [filterWl, filterTeam]);

  const metrics = useMemo(() => {
    if (games.length === 0) return { total: 0, avgPts: 0, maxPts: 0 };
    const total = games.length;
    const avgPts = Math.round(games.reduce((acc, curr) => acc + curr.pts, 0) / total);
    const maxPts = Math.max(...games.map(g => g.pts));
    return { total, avgPts, maxPts };
  }, [games]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">ATHENA <span className="text-blue-600">NBA</span></h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Motor de Inteligencia Deportiva</p>
        </header>

        {/* NUEVA BARRA DE FILTROS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center text-gray-500 font-bold">
            <Filter size={20} className="mr-2" />
            <span>Filtros Dinámicos:</span>
          </div>
          <div className="flex space-x-4">
            <select 
              value={filterTeam} 
              onChange={(e) => setFilterTeam(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-bold"
            >
              <option value="ALL">Todos los Equipos</option>
              <option value="LAL">Lakers (LAL)</option>
              <option value="DEN">Nuggets (DEN)</option>
              <option value="GSW">Warriors (GSW)</option>
              <option value="PHX">Suns (PHX)</option>
              <option value="BOS">Celtics (BOS)</option>
              <option value="NYK">Knicks (NYK)</option>
              <option value="DAL">Mavericks (DAL)</option>
              <option value="SAS">Spurs (SAS)</option>
            </select>

            <select 
              value={filterWl} 
              onChange={(e) => setFilterWl(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-bold"
            >
              <option value="ALL">Cualquier Resultado</option>
              <option value="W">Solo Victorias</option>
              <option value="L">Solo Derrotas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><p className="text-lg text-gray-500 animate-pulse font-bold">Actualizando telemetría...</p></div>
        ) : games.length === 0 ? (
           <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100 text-gray-500 font-bold">No se encontraron partidos con estos filtros.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Hash size={24} /></div>
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Partidos Analizados</p><p className="text-3xl font-black text-gray-800">{metrics.total}</p></div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600"><Activity size={24} /></div>
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Promedio Puntos</p><p className="text-3xl font-black text-gray-800">{metrics.avgPts}</p></div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Trophy size={24} /></div>
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Puntuación Máxima</p><p className="text-3xl font-black text-gray-800">{metrics.maxPts}</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">Rendimiento Ofensivo</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={games} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="matchup" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="pts" name="Puntos" radius={[4, 4, 0, 0]} barSize={40}>
                      {games.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.wl === 'W' ? '#22c55e' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Enfrentamiento</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Resultado</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Puntos</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {games.map((game, index) => (
                      <tr key={`${game.game_id}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{game.game_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{game.matchup}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${ game.wl === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }`}>
                            {game.wl === 'W' ? 'VICTORIA' : 'DERROTA'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-bold">{game.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;