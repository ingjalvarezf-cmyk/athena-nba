import os
import time
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from nba_api.stats.static import teams
from nba_api.stats.endpoints import teamgamelog

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

try:
    print("1. Cargando catálogo local de equipos...")
    nba_teams = teams.get_teams()
    
    # Haremos la prueba con solo 3 equipos para asegurar que la conexión no se caiga
    test_teams = nba_teams[:3]
    
    custom_headers = {
        'Host': 'stats.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com/'
    }

    print(f"\n2. Iniciando extracción sigilosa ({len(test_teams)} equipos de prueba)...")
    
    for team in test_teams:
        team_id = team['id']
        team_name = team['full_name']
        print(f"-> Solicitando datos de {team_name}...")
        
        # Endpoint más ligero: Historial de un solo equipo
        log = teamgamelog.TeamGameLog(
            team_id=team_id, 
            season='2023-24',
            headers=custom_headers,
            timeout=30
        )
        df = log.get_data_frames()[0]
        
        # Limpiar datos nulos
        df = df.fillna({ 'WL': 'N/A', 'PTS': 0 })
        games_subset = df.to_dict(orient='records')
        
        for g in games_subset:
            supabase.table("nba_games").upsert({
                "game_id": str(g['Game_ID']),
                "team_id": team_id,
                "game_date": str(g['GAME_DATE']),
                "matchup": str(g['MATCHUP']),
                "wl": str(g['WL']),
                "pts": int(g['PTS'])
            }).execute()
            
        print(f"   [OK] {len(games_subset)} partidos guardados. Esperando 3 segundos...")
        time.sleep(3) # PAUSA VITAL PARA EVITAR BLOQUEO
        
    print("\n[OK] PRUEBA DE EXTRACCIÓN EQUIPO POR EQUIPO COMPLETADA.")
except Exception as e:
    print(f"\n[ERROR] Falló el proceso: {e}")