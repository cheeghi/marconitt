CREATE TABLE eventi (
	id INT AUTO_INCREMENT PRIMARY KEY,
	giorno DATE NOT NULL,
	oraInizio CHAR(5) NOT NULL,
	oraFine CHAR(5) NOT NULL,
	ore VARCHAR(20) NOT NULL,
	AM BOOLEAN NOT NULL,
	_304 BOOLEAN NOT NULL,
	_042 BOOLEAN NOT NULL,
	classi VARCHAR(500) NOT NULL,
	professori VARCHAR(2000),
	UNIQUE(giorno, ore, AM),
	UNIQUE(giorno, ore, _304),
	UNIQUE(giorno, ore, _042),
);
	