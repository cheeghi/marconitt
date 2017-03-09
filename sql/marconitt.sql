DROP DATABASE IF EXISTS marconitt;
CREATE DATABASE marconitt;
USE marconitt;

CREATE TABLE prenotazioni (
	aula CHAR(10),
	ora INT,
	PRIMARY KEY(aula, ora)
);