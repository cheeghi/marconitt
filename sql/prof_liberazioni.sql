CREATE TABLE prof_liberazione ( 
    liberazione INT NOT NULL,
    ora INT NOT NULL,
    professori VARCHAR(500),
    PRIMARY KEY(liberazione, ora),
    FOREIGN KEY(liberazione) REFERENCES liberazione(id)
);