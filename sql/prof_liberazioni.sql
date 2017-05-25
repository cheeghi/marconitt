CREATE TABLE prof_liberazione ( 
    liberazione INT NOT NULL,
    ora INT NOT NULL,
    professori VARCHAR(500),
    PRIMARY KEY(liberazione, ora),
    CONSTRAINT lib_fk FOREIGN KEY(liberazione) REFERENCES liberazione(id) ON DELETE CASCADE
);