DROP TABLE IF EXISTS squad_players;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS players;

CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    club TEXT,
    pos TEXT,
    price REAL,
    points INTEGER,
    status TEXT,
    image TEXT
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    team_name TEXT,
    fav_club TEXT,
    budget REAL DEFAULT 100.0,
    wildcard_active INTEGER DEFAULT 0
);

CREATE TABLE squad_players (
    user_id INTEGER,
    player_id INTEGER,
    is_captain INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(player_id) REFERENCES players(id)
);

-- THIS PART IS CRITICAL:
INSERT INTO players (name, club, pos, price, points, status, image) VALUES 
('Courtois', 'Real Madrid', 'GK', 7.0, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Thibaut_Courtois_2018.jpg?width=300'),
('Ederson', 'Man City', 'GK', 6.5, 6, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Ederson_Moraes_2018.jpg?width=300'),
('Carvajal', 'Real Madrid', 'DEF', 6.5, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Dani_Carvajal_2018.jpg?width=300'),
('Robertson', 'Liverpool', 'DEF', 7.0, 9, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Andy_Robertson_2018.jpg?width=300'),
('R. Araújo', 'Barcelona', 'DEF', 6.0, 6, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Ronald_Ara%C3%BAjo_2022.jpg?width=300'),
('T. Hernández', 'AC Milan', 'DEF', 6.5, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Theo_Hern%C3%A1ndez_2021.jpg?width=300'),
('A. Davies', 'Bayern', 'DEF', 7.0, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Alphonso_Davies_2023.jpg?width=300'),
('Saliba', 'Arsenal', 'DEF', 6.0, 6, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/William_Saliba_2023.jpg?width=300'),
('Bellingham', 'Real Madrid', 'MID', 11.0, 10, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Jude_Bellingham_2023.jpg?width=300'),
('Foden', 'Man City', 'MID', 9.5, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Phil_Foden_2023.jpg?width=300'),
('De Bruyne', 'Man City', 'MID', 10.0, 10, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Kevin_De_Bruyne_2018.jpg?width=300'),
('Rodri', 'Man City', 'MID', 8.0, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Rodri_2023.jpg?width=300'),
('Musiala', 'Bayern', 'MID', 9.0, 8, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Jamal_Musiala_2023.jpg?width=300'),
('Saka', 'Arsenal', 'MID', 9.5, 9, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Bukayo_Saka_2022.jpg?width=300'),
('Leão', 'AC Milan', 'FWD', 8.5, 7, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Rafael_Le%C3%A3o_2022.jpg?width=300'),
('Mbappé', 'PSG', 'FWD', 12.5, 9, 'suspended', 'https://en.wikipedia.org/wiki/Special:FilePath/Kylian_Mbapp%C3%A9_2018.jpg?width=300'),
('Haaland', 'Man City', 'FWD', 12.0, 15, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Erling_Haaland_2023.jpg?width=300'),
('Vinicius Jr', 'Real Madrid', 'FWD', 10.5, 11, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Vinicius_Junior_2023.jpg?width=300'),
('L. Martínez', 'Inter Milan', 'FWD', 9.5, 9, 'fit', 'https://en.wikipedia.org/wiki/Special:FilePath/Lautaro_Mart%C3%ADnez_2023.jpg?width=300');