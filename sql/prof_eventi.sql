CREATE TABLE prof_eventi (
	id INT,
	ora INT,
	professori VARCHAR(2000),
	PRIMARY KEY(id, ora),
	CONSTRAINT eventi_fk FOREIGN KEY(id) REFERENCES eventi(id) ON DELETE CASCADE
);