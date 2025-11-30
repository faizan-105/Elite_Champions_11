/* server.js - MASTER VERSION (DB Fix + All Features) */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to DB (Creates file if missing)
const db = new sqlite3.Database('./fantasy.db', (err) => {
    if (err) console.error("DB Error:", err);
    else console.log("Connected to SQLite DB.");
});

// Initialize Database (Self-Healing)
const initSQL = `
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, club TEXT, pos TEXT, price REAL, points INTEGER, status TEXT, image TEXT
    );
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE, password TEXT, team_name TEXT, fav_club TEXT, budget REAL DEFAULT 100.0, wildcard_active INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS squad_players (
        user_id INTEGER, player_id INTEGER, is_captain INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(player_id) REFERENCES players(id)
    );
`;

db.exec(initSQL, (err) => {
    if (!err) {
        db.get("SELECT count(*) as count FROM players", (err, row) => {
            if (row.count === 0) {
                console.log("Seeding Database...");
                const players = [
                    ['Courtois', 'Real Madrid', 'GK', 7.0, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Thibaut_Courtois_2018.jpg?width=300'],
                    ['Ederson', 'Man City', 'GK', 6.5, 6, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Ederson_Moraes_2018.jpg?width=300'],
                    ['Carvajal', 'Real Madrid', 'DEF', 6.5, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Dani_Carvajal_2018.jpg?width=300'],
                    ['Robertson', 'Liverpool', 'DEF', 7.0, 9, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Andy_Robertson_2018.jpg?width=300'],
                    ['R. Araújo', 'Barcelona', 'DEF', 6.0, 6, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Ronald_Ara%C3%BAjo_2022.jpg?width=300'],
                    ['T. Hernández', 'AC Milan', 'DEF', 6.5, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Theo_Hern%C3%A1ndez_2021.jpg?width=300'],
                    ['A. Davies', 'Bayern', 'DEF', 7.0, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Alphonso_Davies_2023.jpg?width=300'],
                    ['Saliba', 'Arsenal', 'DEF', 6.0, 6, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/William_Saliba_2023.jpg?width=300'],
                    ['Bellingham', 'Real Madrid', 'MID', 11.0, 10, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Jude_Bellingham_2023.jpg?width=300'],
                    ['Foden', 'Man City', 'MID', 9.5, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Phil_Foden_2023.jpg?width=300'],
                    ['De Bruyne', 'Man City', 'MID', 10.0, 10, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Kevin_De_Bruyne_2018.jpg?width=300'],
                    ['Rodri', 'Man City', 'MID', 8.0, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Rodri_2023.jpg?width=300'],
                    ['Musiala', 'Bayern', 'MID', 9.0, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Jamal_Musiala_2023.jpg?width=300'],
                    ['Saka', 'Arsenal', 'MID', 9.5, 9, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Bukayo_Saka_2022.jpg?width=300'],
                    ['Leão', 'AC Milan', 'FWD', 8.5, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Rafael_Le%C3%A3o_2022.jpg?width=300'],
                    ['Mbappé', 'PSG', 'FWD', 12.5, 9, 'suspended', 'https://en.wikipedia.org/wiki/Special:FilePath/Kylian_Mbapp%C3%A9_2018.jpg?width=300'],
                    ['Haaland', 'Man City', 'FWD', 12.0, 15, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Erling_Haaland_2023.jpg?width=300'],
                    ['Vinicius Jr', 'Real Madrid', 'FWD', 10.5, 11, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Vinicius_Junior_2023.jpg?width=300'],
                    ['L. Martínez', 'Inter Milan', 'FWD', 9.5, 9, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Lautaro_Mart%C3%ADnez_2023.jpg?width=300']
                ];
                const stmt = db.prepare("INSERT INTO players (name, club, pos, price, points, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
                players.forEach(p => stmt.run(p));
                stmt.finalize();
            }
        });
    }
});

// --- API ENDPOINTS ---

app.get('/api/players', (req, res) => {
    db.all("SELECT * FROM players", [], (err, rows) => res.json(rows));
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT id, team_name, budget FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if(err || !row) return res.status(401).json({success: false, msg: "Invalid credentials"});
        res.json({success: true, user: row});
    });
});

app.post('/api/signup', (req, res) => {
    const { email, password, teamName, favClub } = req.body;
    db.run("INSERT INTO users (email, password, team_name, fav_club) VALUES (?, ?, ?, ?)", [email, password, teamName, favClub], function(err) {
        if(err) return res.status(400).json({success: false, msg: "Email exists"});
        res.json({success: true, userId: this.lastID});
    });
});

app.get('/api/user/:id', (req, res) => {
    db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, user) => {
        if(!user) return res.status(404).json({error: "User not found"});
        db.all("SELECT p.*, sp.is_captain FROM players p JOIN squad_players sp ON p.id = sp.player_id WHERE sp.user_id = ?", [req.params.id], (err, squad) => {
            res.json({ user, squad });
        });
    });
});

// Buy with Positional Limits
app.post('/api/buy', (req, res) => {
    const { userId, playerId } = req.body;
    db.get("SELECT budget, wildcard_active FROM users WHERE id = ?", [userId], (err, user) => {
        const sql = `SELECT p.pos, p.id FROM squad_players sp JOIN players p ON sp.player_id = p.id WHERE sp.user_id = ?`;
        db.all(sql, [userId], (err, squad) => {
            if(squad.length >= 11) return res.json({success:false, msg: "Squad Full"});

            db.get("SELECT * FROM players WHERE id = ?", [playerId], (err, player) => {
                if(squad.find(s => s.id === player.id)) return res.json({success:false, msg: "Already owned"});
                if(user.budget < player.price && !user.wildcard_active) return res.json({success:false, msg: "Not enough funds"});

                // POSITIONAL LIMITS
                const LIMITS = { 'GK': 1, 'DEF': 4, 'MID': 4, 'FWD': 2 };
                const count = squad.filter(s => s.pos === player.pos).length;
                if(count >= LIMITS[player.pos]) return res.json({success:false, msg: `Max ${LIMITS[player.pos]} ${player.pos}s!`});

                const newBudget = user.wildcard_active ? user.budget : (user.budget - player.price);
                db.run("INSERT INTO squad_players (user_id, player_id) VALUES (?, ?)", [userId, playerId]);
                db.run("UPDATE users SET budget = ? WHERE id = ?", [newBudget, userId]);
                res.json({success: true, msg: "Player Bought"});
            });
        });
    });
});

app.post('/api/sell', (req, res) => {
    const { userId, playerId } = req.body;
    db.get("SELECT price FROM players WHERE id = ?", [playerId], (err, player) => {
        db.run("DELETE FROM squad_players WHERE user_id = ? AND player_id = ?", [userId, playerId]);
        db.run("UPDATE users SET budget = budget + ? WHERE id = ?", [player.price, userId]);
        res.json({success: true, msg: "Player Sold"});
    });
});

// Captain Feature
app.post('/api/captain', (req, res) => {
    const { userId, playerId } = req.body;
    db.run("UPDATE squad_players SET is_captain = 0 WHERE user_id = ?", [userId], () => {
        db.run("UPDATE squad_players SET is_captain = 1 WHERE user_id = ? AND player_id = ?", [userId, playerId], () => {
            res.json({success: true});
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});