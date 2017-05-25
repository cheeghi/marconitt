CREATE TABLE timetable (
	id INT AUTO_INCREMENT PRIMARY KEY,
	giorno DATE,
	ora INT,
	stanza VARCHAR(20),
	UNIQUE(giorno, ora, stanza),
	risorsa VARCHAR(150) DEFAULT NULL,
	giorno_settimana INT,
	professore1 VARCHAR(250) DEFAULT NULL,
	professore2 VARCHAR(250) DEFAULT NULL,
);