
CREATE TABLE aulamagna (
	id INT NOT NULL,
	occupante VARCHAR(250) NOT NULL,
	PRIMARY KEY(id, occupante),
	FOREIGN KEY(id) REFERENCES timetable(id)
);