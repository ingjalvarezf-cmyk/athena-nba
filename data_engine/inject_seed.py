import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

print("Ejecutando Plan D: Inyección de Semilla Estática (Bypass de Firewall)...")

# Semilla de datos reales de la temporada 2023-24 (Opening Week)
real_games_seed = [
    {"game_id": "0022300001", "team_id": 1610612747, "game_date": "2023-10-24", "matchup": "LAL @ DEN", "wl": "L", "pts": 107},
    {"game_id": "0022300001", "team_id": 1610612743, "game_date": "2023-10-24", "matchup": "DEN vs. LAL", "wl": "W", "pts": 119},
    {"game_id": "0022300002", "team_id": 1610612756, "game_date": "2023-10-24", "matchup": "PHX @ GSW", "wl": "W", "pts": 108},
    {"game_id": "0022300002", "team_id": 1610612744, "game_date": "2023-10-24", "matchup": "GSW vs. PHX", "wl": "L", "pts": 104},
    {"game_id": "0022300003", "team_id": 1610612738, "game_date": "2023-10-25", "matchup": "BOS @ NYK", "wl": "W", "pts": 108},
    {"game_id": "0022300003", "team_id": 1610612752, "game_date": "2023-10-25", "matchup": "NYK vs. BOS", "wl": "L", "pts": 104},
    {"game_id": "0022300004", "team_id": 1610612742, "game_date": "2023-10-25", "matchup": "DAL @ SAS", "wl": "W", "pts": 126},
    {"game_id": "0022300004", "team_id": 1610612759, "game_date": "2023-10-25", "matchup": "SAS vs. DAL", "wl": "L", "pts": 119}
]

try:
    print(f"Inyectando {len(real_games_seed)} partidos clave para habilitar el backend...")
    for g in real_games_seed:
        supabase.table("nba_games").upsert(g).execute()
    
    print("\n[OK] INYECCIÓN COMPLETADA. La base de datos tiene partidos listos.")
    print("El firewall de la NBA ha sido esquivado. Podemos regresar al Backend Node.js.")
except Exception as e:
    print(f"\n[ERROR] Falló la inyección en Supabase: {e}")