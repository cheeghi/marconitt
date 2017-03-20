CREATE TABLE timetable (
	id INT AUTO_INCREMENT PRIMARY KEY,
	giorno DATE NOT NULL,
	ora INT NOT NULL,
	stanza VARCHAR(20) NOT NULL,
	UNIQUE(giorno, ora, stanza),
	risorsa VARCHAR(150) DEFAULT NULL,
	giorno_settimana INT
);