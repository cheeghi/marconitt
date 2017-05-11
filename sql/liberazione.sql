CREATE TABLE liberazione (
    id INT AUTO_INCREMENT PRIMARY KEY,
    giorno DATE NOT NULL,
    descrizione VARCHAR(500) NOT NULL,
    classe CHAR(3) NOT NULL,
    ore VARCHAR(30) NOT NULL
);