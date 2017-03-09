DROP DATABASE IF EXISTS marconitt;
CREATE DATABASE marconitt;
USE marconitt;

CREATE TABLE prenotazioni (
	giorno DATE,
	aula CHAR(10),
	ora INT,
	PRIMARY KEY(giorno, aula, ora)
);