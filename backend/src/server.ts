import express from 'express';
import * as dotenv from 'dotenv';
import { pool } from './config/db';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/api/games', async (req, res) => {
    try {
        const { wl, team } = req.query;
        let queryText = 'SELECT * FROM nba_games';
        const queryParams: any[] = [];
        const conditions: string[] = [];

        // Filtro por Victoria o Derrota
        if (wl && wl !== 'ALL') {
            queryParams.push(wl);
            conditions.push(`wl = $${queryParams.length}`);
        }

        // Filtro por Equipo (Buscamos la abreviatura dentro de la columna matchup)
        if (team && team !== 'ALL') {
            queryParams.push(`%${team}%`);
            conditions.push(`matchup LIKE $${queryParams.length}`);
        }

        // Ensamblamos la consulta SQL final
        if (conditions.length > 0) {
            queryText += ' WHERE ' + conditions.join(' AND ');
        }
        queryText += ' ORDER BY game_date DESC';

        const result = await pool.query(queryText, queryParams);
        
        const formattedData = result.rows.map(game => {
            const dateObj = new Date(game.game_date);
            const cleanDate = dateObj.toLocaleDateString('es-MX', {
                timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric'
            });
            return { ...game, game_date: cleanDate };
        });
        
        res.status(200).json({ success: true, total: formattedData.length, data: formattedData });
    } catch (error) {
        console.error("Error al consultar nba_games:", error);
        res.status(500).json({ success: false, error: 'Falla interna del servidor' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[OK] Servidor backend corriendo en el puerto ${PORT}`);
});