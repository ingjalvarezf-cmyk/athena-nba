import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
});

pool.on('connect', () => {
    // Solo imprimimos si no se ha impreso antes para evitar spam
    if (!global.connectedMsg) {
        console.log('[OK] Conexión a Supabase establecida exitosamente.');
        global.connectedMsg = true;
    }
});