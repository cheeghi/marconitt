DROP DATABASE IF EXISTS marconitt;
CREATE DATABASE marconitt;
USE marconitt;
CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    admin BOOLEAN NOT NULL,
    mail VARCHAR(255) NOT NULL
);
CREATE TABLE aule (
    aula VARCHAR(25)
);
CREATE TABLE aule_eventi (
    aula VARCHAR(25)
);

INSERT INTO aule_eventi VALUES('A042'),('AULA MAGNA'),('A304');
CREATE TABLE eventi (
	id INT AUTO_INCREMENT PRIMARY KEY,
	giorno DATE NOT NULL,
	descrizione VARCHAR(500) NOT NULL,
	oraInizio CHAR(5) NOT NULL,
	oraFine CHAR(5) NOT NULL,
	classi VARCHAR(500) NOT NULL,
	stanze VARCHAR(20) NOT NULL
);
CREATE TABLE liberazione (
    id INT AUTO_INCREMENT PRIMARY KEY,
    giorno DATE NOT NULL,
    descrizione VARCHAR(500) NOT NULL,
    classe CHAR(3) NOT NULL,
    ore VARCHAR(30) NOT NULL
);
CREATE TABLE prenotazioni (
	id INT PRIMARY KEY,
	who VARCHAR(250) NOT NULL,
	isSchoolHour BOOLEAN DEFAULT FALSE,
	approvata BOOLEAN DEFAULT FALSE,
	CONSTRAINT id_fk FOREIGN KEY(id) REFERENCES timetable(id) ON DELETE CASCADE
);
CREATE TABLE prof_eventi (
	id INT,
	ora INT,
	professori VARCHAR(2000),
	CONSTRAINT eventi_fk FOREIGN KEY(id) REFERENCES eventi(id) ON DELETE CASCADE
);CREATE TABLE prof_liberazione ( 
    liberazione INT NOT NULL,
    ora INT NOT NULL,
    professori VARCHAR(500),
    PRIMARY KEY(liberazione, ora),
    CONSTRAINT lib_fk FOREIGN KEY(liberazione) REFERENCES liberazione(id) ON DELETE CASCADE
);
create table progetti(progetto varchar(255));

insert into progetti values('RFI');
insert into progetti values('I.N.S.I.E.M.E.');
insert into progetti values('Volkswagen');
insert into progetti values('Orientamento in entrata');
insert into progetti values('Orientamento in uscita');
insert into progetti values('Robotica - Machine learning');
CREATE TABLE timetable (
	id INT AUTO_INCREMENT PRIMARY KEY,
	giorno DATE,
	ora INT,
	stanza VARCHAR(20),
	UNIQUE(giorno, ora, stanza),
	risorsa VARCHAR(150) DEFAULT NULL,
	giorno_settimana INT,
	professore1 VARCHAR(250) DEFAULT NULL,
	professore2 VARCHAR(250) DEFAULT NULL
);