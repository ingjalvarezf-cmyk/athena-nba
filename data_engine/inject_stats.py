import os
from dotenv import load_dotenv
from supabase import create_client, Client
from nba_api.stats.static import players
from nba_api.stats.endpoints import leaguegamefinder
import pandas as pd

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

try:
    print("1. Verificando Jugadores (Upsert rápido)...")
    all_players = players.get_players()
    active_players = [p for p in all_players if p['is_active']]
    
    # Redujimos los prints de jugadores para enfocarnos en los partidos
    for p in active_players:
        supabase.table("nba_players").upsert({
            "id": p['id'],
            "full_name": p['full_name'],
            "is_active": p['is_active']
        }).execute()
    print("[OK] Jugadores sincronizados.")

    print("\n2. Consultando servidor de la NBA (Modo incognito, timeout=120s)...")
    
    # Disfrazamos la petición como un navegador de Windows
    custom_headers = {
        'Host': 'stats.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com/'
    }
    
    gamefinder = leaguegamefinder.LeagueGameFinder(
        season_nullable='2023-24',
        headers=custom_headers,
        timeout=120
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