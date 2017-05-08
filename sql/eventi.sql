CREATE TABLE eventi (
	id INT AUTO_INCREMENT PRIMARY KEY,
	giorno DATE NOT NULL,
	descrizione VARCHAR(500) NOT NULL,
	oraInizio CHAR(5) NOT NULL,
	oraFine CHAR(5) NOT NULL,
	classi VARCHAR(500) NOT NULL,
	stanze VARCHAR(20) NOT NULL
);


CREATE TABLE prof_eventi (
	id INT,
	ora INT,
	professori VARCHAR(2000),
	PRIMARY KEY(id, ora),
	FOREIGN KEY(id) REFERENCES eventi(id)
);