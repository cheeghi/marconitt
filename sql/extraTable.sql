CREATE TABLE prenotazioni (
	id INT PRIMARY KEY,
	who VARCHAR(250) NOT NULL,
	isSchoolHour BOOLEAN DEFAULT FALSE,
	FOREIGN KEY(id) REFERENCES timetable(id)
);


CREATE TABLE aulamagna (
	id INT NOT NULL,
	occupante VARCHAR(250) NOT NULL,
	PRIMARY KEY(id, occupante),
	FOREIGN KEY(id) REFERENCES timetable(id)
);