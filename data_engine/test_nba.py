from nba_api.stats.static import teams

nba_teams = teams.get_teams()
print("\n[OK] Conexión a NBA API exitosa.")
print(f"Total de equipos encontrados: {len(nba_teams)}")
print(f"Ejemplo: {nba_teams[0]['full_name']} (ID: {nba_teams[0]['id']})")