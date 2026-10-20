import os
from dotenv import load_dotenv
from supabase import create_client, Client
from nba_api.stats.static import teams

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key or "TU_PROYECTO" in url:
    print("[ERROR] Por favor configura SUPABASE_URL y SUPABASE_KEY en el archivo .env")
    exit(1)

try:
    supabase: Client = create_client(url, key)
    
    print("Obteniendo histórico de equipos de la NBA...")
    nba_teams = teams.get_teams()
    
    print(f"Inyectando {len(nba_teams)} equipos en la bóveda de Supabase...")
    for team in nba_teams:
        data = {
            "id": team['id'],
            "full_name": team['full_name'],
            "abbreviation": team['abbreviation'],
            "nickname": team['nickname'],
            "city": team['city'],
            "state": team['state'],
            "year_founded": team['year_founded']
        }
        # upsert actualiza el registro si ya existe, evitando errores por duplicados
        supabase.table("nba_teams").upsert(data).execute()

    print("\n[OK] INYECCIÓN COMPLETADA. Revisa el Table Editor en Supabase.")
except Exception as e:
    print(f"\n[ERROR] Falló la inyección: {e}")