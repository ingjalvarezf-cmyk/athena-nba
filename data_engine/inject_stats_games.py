import os
from dotenv import load_dotenv
from supabase import create_client, Client
from nba_api.stats.endpoints import leaguegamefinder
import pandas as pd

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

try:
    print("Consultando servidor de la NBA (Filtro estricto: Solo Liga Principal '00')...")
    
    custom_headers = {
        'Host': 'stats.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com/'
    }
    
    # EL TRUCO: league_id_nullable='00' evita que el servidor busque en la WNBA y G-League
    gamefinder = leaguegamefinder.LeagueGameFinder(
        season_nullable='2023-24',
        league_id_nullable='00', 
        headers=custom_headers,
        timeout=60
    )
    
    games_df = gamefinder.get_data_frames()[0]
    games_df = games_df.fillna({ 'WL': 'N/A', 'PTS': 0 })
    games_subset = games_df.head(200).to_dict(orient='records')
    
    print(f"Inyectando muestra de {len(games_subset)} registros de partidos...")
    for g in games_subset:
        supabase.table("nba_games").upsert({
            "game_id": str(g['GAME_ID']),
            "team_id": int(g['TEAM_ID']),
            "game_date": str(g['GAME_DATE']),
            "matchup": str(g['MATCHUP']),
            "wl": str(g['WL']),
            "pts": int(g['PTS'])
        }).execute()
        
    print("\n[OK] EXTRACCIÓN E INYECCIÓN COMPLETADA. Revisa tu panel de Supabase.")
except Exception as e:
    print(f"\n[ERROR] Falló el proceso: {e}")