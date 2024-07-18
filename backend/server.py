from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(database="ipl_db", user="postgres", password="Subhro@02", host="localhost", port="5432")

@app.route('/api/team-performance')
def get_team_performance():
    team = request.args.get('team')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT batting_team, SUM(runs_scored) as total_runs, COUNT(CASE WHEN wicket THEN 1 END) as wickets_lost
        FROM ipl_matches
        WHERE batting_team = %s
        GROUP BY batting_team
    """, (team,))
    performance = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(performance)

@app.route('/api/player-stats')
def get_player_stats():
    player = request.args.get('player')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT 
            batsman, 
            SUM(batsman_runs) as total_runs, 
            SUM(batsman_balls_faced) as balls_faced,
            ROUND(CAST(SUM(batsman_runs) AS FLOAT) / NULLIF(SUM(batsman_balls_faced), 0) * 100, 2) as strike_rate
        FROM ipl_matches
        WHERE batsman = %s
        GROUP BY batsman
    """, (player,))
    batting_stats = cur.fetchall()
    
    cur.execute("""
        SELECT 
            bowler, 
            SUM(bowler_runs) as runs_conceded, 
            SUM(bowler_wickets) as wickets_taken,
            ROUND(CAST(SUM(bowler_runs) AS FLOAT) / NULLIF(SUM(bowler_overs), 0), 2) as economy_rate
        FROM ipl_matches
        WHERE bowler = %s
        GROUP BY bowler
    """, (player,))
    bowling_stats = cur.fetchall()
    
    cur.close()
    conn.close()
    return jsonify({"batting": batting_stats, "bowling": bowling_stats})

@app.route('/api/match-summary')
def get_match_summary():
    match_id = request.args.get('match_id')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT 
            match_id, 
            innings, 
            batting_team, 
            bowling_team, 
            MAX(innings_runs) as total_runs, 
            MAX(innings_wickets) as wickets,
            MAX(innings_balls) / 6 as overs
        FROM ipl_matches
        WHERE match_id = %s
        GROUP BY match_id, innings, batting_team, bowling_team
        ORDER BY innings
    """, (match_id,))
    summary = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(summary)

if __name__ == '__main__':
    app.run(debug=True)