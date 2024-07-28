from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app,origins=["http://localhost:5173"])

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="ipl_db",
        user="postgres",
        password="Subhro@02"
    )

# 1. Teams API
@app.route('/api/teams')
def get_teams():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT DISTINCT team_bat FROM ipl_matches AS teams ")
    teams = [row['team_bat'] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(teams)

# 2. Players API
@app.route('/api/players')
def get_players():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT DISTINCT player FROM (SELECT bat AS player FROM ipl_matches UNION SELECT bowl AS player FROM ipl_matches) AS players ORDER BY player")
    players = [row['player'] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(players)

# 3. Matches API
@app.route('/api/matches')
def get_matches():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT DISTINCT p_match, team_bat || ' vs ' || team_bowl AS teams, date FROM ipl_matches ORDER BY date DESC LIMIT 100")
    matches = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(matches)

# 4. Seasons API
@app.route('/api/seasons')
def get_seasons():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT DISTINCT year FROM ipl_matches ORDER BY year DESC")
    seasons = [row['year'] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(seasons)

# 5. Team Performance API
@app.route('/api/team-performance')
def get_team_performance():
    team = request.args.get('team')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT 
            COUNT(*) FILTER (WHERE winner = %s) AS wins,
            COUNT(*) FILTER (WHERE winner != %s AND winner != 'No Result') AS losses,
            COUNT(*) FILTER (WHERE winner = 'No Result') AS ties
        FROM (
            SELECT DISTINCT p_match, winner
            FROM ipl_matches
            WHERE team_bat = %s OR team_bowl = %s
        ) AS team_matches
    """, (team, team, team, team))
    performance = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify(performance)

# 6. Player Stats API
@app.route('/api/player-stats')
def get_player_stats():
    player = request.args.get('player')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Batting stats
    cur.execute("""
            SELECT 
                SUM(CAST(batruns AS INTEGER)) AS total_runs,
                SUM(CAST(ballfaced AS INTEGER)) AS balls_faced,
                ROUND(
                    CASE
                        WHEN SUM(CAST(ballfaced AS FLOAT)) = 0 THEN 0
                        ELSE CAST(SUM(CAST(batruns AS FLOAT)) / SUM(CAST(ballfaced AS FLOAT)) * 100 AS NUMERIC)
                    END, 2
                ) AS strike_rate,
                ROUND(
                CAST(
                    CASE 
                    WHEN COUNT(CASE WHEN outcome = 'out' THEN 1 END) = 0 THEN SUM(CAST(batruns AS FLOAT))
                    ELSE SUM(CAST(batruns AS FLOAT)) / COUNT(CASE WHEN outcome = 'out' THEN 1 END)
                    END AS NUMERIC
                ), 2
                ) AS average
                FROM ipl_matches
                WHERE bat = %s
    """, (player,))
    batting_stats = cur.fetchone()
    
    # Bowling stats
    cur.execute("""
        SELECT 
            SUM(CAST(bowlruns AS INTEGER)) AS runs_conceded,
            COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END) AS wickets,
            ROUND(CAST(SUM(CAST(bowlruns AS FLOAT)) / NULLIF(COUNT(*) / 6.0, 0) AS NUMERIC), 2) AS economy_rate,
            ROUND(CAST(SUM(CAST(bowlruns AS FLOAT)) / NULLIF(COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END), 0) AS NUMERIC), 2) AS average,
            ROUND(CAST(CAST(COUNT(*) AS FLOAT) / NULLIF(COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END), 0) AS NUMERIC), 2) AS strike_rate
        FROM ipl_matches
        WHERE bowl = %s;

    """, (player,))
    bowling_stats = cur.fetchone()
    
    cur.close()
    conn.close()
    return jsonify({"batting": batting_stats, "bowling": bowling_stats})

# 7. Match Summary API
@app.route('/api/match-summary')
def get_match_summary():
    match_id = request.args.get('match_id')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT 
            p_match,
            team_bat,
            team_bowl,
            SUM(CAST(score AS INTEGER)) AS total_runs,
            COUNT(CASE WHEN outcome = 'out' THEN 1 END) AS wickets,
            date,
            ground,
            winner
        FROM ipl_matches
        WHERE p_match = %s
        GROUP BY p_match, team_bat, team_bowl, date, ground, winner
        ORDER BY p_match, team_bat
    """, (match_id,))
    innings = cur.fetchall()
    
    cur.execute("""
        SELECT 
            bat AS player,
            SUM(CAST(batruns AS INTEGER)) AS runs,
            COUNT(CASE WHEN outcome = 'out' THEN 1 END) AS wickets,
            CASE 
                WHEN SUM(CAST(batruns AS INTEGER)) >= 50 THEN 'Fifty'
                WHEN COUNT(CASE WHEN outcome = 'out' THEN 1 END) >= 3 THEN 'Three-fer'
                ELSE 'Notable performance'
            END AS achievement
        FROM ipl_matches
        WHERE p_match = %s
        GROUP BY bat
        HAVING SUM(CAST(batruns AS INTEGER)) >= 50 OR COUNT(CASE WHEN outcome = 'out' THEN 1 END) >= 3
        ORDER BY SUM(CAST(batruns AS INTEGER)) DESC, COUNT(CASE WHEN outcome = 'out' THEN 1 END) DESC
        LIMIT 5
    """, (match_id,))
    key_performances = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return jsonify({
        "innings": innings,
        "key_performances": key_performances
    })

# 8. Season Overview API
@app.route('/api/season-overview')
def get_season_overview():
    year = request.args.get('year')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Team performance
    cur.execute("""
        SELECT 
            team,
            COUNT(*) FILTER (WHERE winner = team) AS wins
        FROM (
            SELECT DISTINCT p_match, team_bat AS team, winner
            FROM ipl_matches
            WHERE year = %s
            UNION
            SELECT DISTINCT p_match, team_bowl AS team, winner
            FROM ipl_matches
            WHERE year = %s
        ) AS team_matches
        GROUP BY team
        ORDER BY wins DESC
        LIMIT 10
    """, (year, year))
    team_performance = cur.fetchall()
    
    # Top scorers
    cur.execute("""
        SELECT 
            bat AS name,
            SUM(CAST(batruns AS INTEGER)) AS runs
            FROM ipl_matches
            WHERE year = %s
            GROUP BY bat
            ORDER BY runs DESC
            LIMIT 5
    """, (year,))
    top_scorers = cur.fetchall()

    # Top Wicket-takers
    cur.execute("""
        SELECT 
            bowl AS name,
            COUNT(CASE WHEN outcome = 'out' THEN 1 END) AS wickets
            FROM ipl_matches
            WHERE year = %s
            GROUP BY bowl
            ORDER BY COUNT(CASE WHEN outcome = 'out' THEN 1 END) DESC
            LIMIT 5
    """, (year,))
    top_bowlers = cur.fetchall()
    
    # Season highlights (this is a placeholder - you might want to store this data separately)
    highlights = [
        f"Most runs: {top_scorers[0]['name']} ({top_scorers[0]['runs']} runs)",
        f"Most wickets: {top_bowlers[0]['name']} ({top_bowlers[0]['wickets']} wickets)",
        f"Most wins: {team_performance[0]['team']} ({team_performance[0]['wins']} wins)"
    ]
    
    cur.close()
    conn.close()
    
    return jsonify({
        "team_performance": team_performance,
        "top_scorers": top_scorers,
        "top_bowlers": top_bowlers,
        "highlights": highlights
    })

    # Add this new endpoint
@app.route('/api/team-season-performance')
def get_team_season_performance():
    team = request.args.get('team')
    if not team:
        return jsonify({"error": "Team parameter is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        WITH team_matches AS (
            SELECT DISTINCT p_match, year, winner,
                CASE 
                    WHEN team_bat = %s THEN team_bat
                    WHEN team_bowl = %s THEN team_bowl
                END AS team
            FROM ipl_matches
            WHERE team_bat = %s OR team_bowl = %s
        )
        SELECT 
            year,
            COUNT(*) AS total_matches,
            COUNT(*) FILTER (WHERE winner = %s) AS wins,
            COUNT(*) FILTER (WHERE winner != %s AND winner != 'No Result') AS losses,
            COUNT(*) FILTER (WHERE winner = 'No Result') AS ties
        FROM team_matches
        GROUP BY year
        ORDER BY year
    """, (team, team, team, team, team, team))

    seasons = cur.fetchall()

    # Calculate win percentage and add it to each season's data
    for season in seasons:
        total_decided = season['total_matches'] - season['ties']
        season['win_percentage'] = round((season['wins'] / total_decided * 100), 2) if total_decided > 0 else 0

    cur.close()
    conn.close()
    return jsonify(seasons)


    # Add this new endpoint to your Flask application

@app.route('/api/player-matchup')
def get_player_matchup():
    batsman = request.args.get('batsman')
    bowler = request.args.get('bowler')
    
    if not batsman or not bowler:
        return jsonify({"error": "Both batsman and bowler parameters are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            COUNT(*) AS balls_faced,
            SUM(CAST(batruns AS INTEGER)) AS runs_scored,
            SUM(CASE WHEN outcome = 'out' THEN 1 ELSE 0 END) AS dismissals,
            ROUND(CAST(SUM(CAST(batruns AS FLOAT)) / NULLIF(COUNT(*), 0) * 100 AS NUMERIC), 2) AS strike_rate,
            ROUND(
            CAST(
                CASE 
                WHEN COUNT(CASE WHEN outcome = 'out' THEN 1 END) = 0 THEN SUM(CAST(batruns AS FLOAT))
                ELSE SUM(CAST(batruns AS FLOAT)) / COUNT(CASE WHEN outcome = 'out' THEN 1 END)
                END AS NUMERIC
            ), 2
            ) AS average,
            ROUND(CAST(SUM(CAST(batruns AS FLOAT)) / NULLIF(COUNT(*) / 6, 0) AS NUMERIC), 2) AS economy_rate
        FROM ipl_matches
        WHERE bat = %s AND bowl = %s
    """, (batsman, bowler))

    matchup = cur.fetchone()

    cur.close()
    conn.close()

    return jsonify(matchup)

    # 6. Scat
@app.route('/api/batscatter')
def get_batscatter_stats():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Batting Scatterplot
    cur.execute("""
        SELECT 
            bat AS batsman,
            ROUND(
                CASE
                    WHEN SUM(CAST(ballfaced AS FLOAT)) = 0 THEN 0
                    ELSE CAST(SUM(CAST(batruns AS FLOAT)) / SUM(CAST(ballfaced AS FLOAT)) * 100 AS NUMERIC)
                END, 2
            ) AS strike_rate,
            ROUND(
                CAST(
                    CASE 
                        WHEN COUNT(CASE WHEN outcome = 'out' THEN 1 END) = 0 THEN SUM(CAST(batruns AS FLOAT))
                        ELSE SUM(CAST(batruns AS FLOAT)) / COUNT(CASE WHEN outcome = 'out' THEN 1 END)
                    END AS NUMERIC
                ), 2
            ) AS average
        FROM ipl_matches
        GROUP BY bat
        HAVING COUNT(DISTINCT p_match) > 25
        ORDER BY batsman;
    """)
    bat_stats = cur.fetchall()
    
    cur.close()
    conn.close()
    return jsonify(bat_stats)

@app.route('/api/bowlscatter')
def get_bowlscatter_stats():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Bowling Scatterplot
    cur.execute("""
        SELECT 
            bowl AS bowler,
            ROUND(CAST(SUM(CAST(bowlruns AS FLOAT)) / NULLIF(COUNT(*) / 6.0, 0) AS NUMERIC), 2) AS economy,
            ROUND(CAST(SUM(CAST(bowlruns AS FLOAT)) / NULLIF(COUNT(CASE WHEN outcome = 'out' AND dismissal != 'run out' THEN 1 END), 0) AS NUMERIC), 2) AS average
        FROM ipl_matches
        GROUP BY bowl
        HAVING COUNT(DISTINCT p_match) > 25 
    """)
    bowl_stats = cur.fetchall()
    
    cur.close()
    conn.close()
    return jsonify(bowl_stats)

    # 6. Player Stats API
@app.route('/api/player-performance')
def get_player_statsbyyear():
    player = request.args.get('player')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Batting stats
    cur.execute("""
            SELECT 
                year,
                SUM(CAST(batruns as INTEGER)) as runs,
                ROUND(
                    CASE
                        WHEN SUM(CAST(ballfaced AS FLOAT)) = 0 THEN 0
                        ELSE CAST(SUM(CAST(batruns AS FLOAT)) / SUM(CAST(ballfaced AS FLOAT)) * 100 AS NUMERIC)
                    END, 2
                ) AS strike_rate,
                ROUND(
                CAST(
                    CASE 
                    WHEN COUNT(CASE WHEN outcome = 'out' THEN 1 END) = 0 THEN SUM(CAST(batruns AS FLOAT))
                    ELSE SUM(CAST(batruns AS FLOAT)) / COUNT(CASE WHEN outcome = 'out' THEN 1 END)
                    END AS NUMERIC
                ), 2
                ) AS average
            FROM ipl_matches
            WHERE bat = %s
            GROUP BY year
            ORDER BY year
    """, (player,))
    stats = cur.fetchall()
    
    cur.close()
    conn.close()
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True)