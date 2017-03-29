CREATE TABLE prenotazioni (
	id INT PRIMARY KEY,
	who VARCHAR(250) NOT NULL,
	FOREIGN KEY(id) REFERENCES timetable(id)
);


CREATE TABLE aulamagna (
	id INT NOT NULL,
	occupante VARCHAR(250) NOT NULL,
	PRIMARY KEY(id, occupante),
	FOREIGN KEY(id) REFERENCES timetable(id)
);

SELECT giorno,ora, stanza, risorsa, who FROM timetable, prenotazioni WHERE timetable.id = prenotazioni.id;
	