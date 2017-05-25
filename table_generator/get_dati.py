##IMPORT
from datetime import datetime
import mysql.connector
import os

##DOC
__author__ = 'Elia Semprebon'
__description__ = "Generatore dei file .csv con i dati(prenotazioni, eventi, ...) dell'anno passato"


##VARIABILI
global boolD
boolD = True


##FUNZIONI


def fn_generaconnessione():
    '''
    Funzione che genera e ritorna la connessione a mysql
    '''
    connessione = mysql.connector.connect(user='root', password='',host='127.0.0.1',database='marconitt')
    return connessione


def fn_tablesToCsv():
    '''
    Funzione che prende i dati dalle tabelle Timetable, Prenotazioni, Eventi, Liberazioni e li mette in file csv
    '''
    anno = datetime.now().year
    directory = "year_" + str(anno)
    os.system("mkdir " + directory)
    
    #creating files
    f1 = open(directory + "\\prenotazioni.csv", "w")
    f2 = open(directory + "\\eventi.csv", "w")
    f3 = open(directory + "\\liberazioni.csv", "w")

    #creating the connection
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()

    #timetable and prenotazioni
    f1.write("giorno;ora;stanza;risorsa;professore1;professore2;who;isSchoolHour;approvata\n")
    query = "SELECT giorno, ora, stanza, risorsa, professore1, professore2, who, isSchoolHour, approvata" + " FROM timetable, prenotazioni WHERE timetable.id = prenotazioni.id;"
    cursore.execute(query)

    for c1, c2, c3, c4, c5, c6, c7, c8, c9 in cursore:
        try:
            riga = str(c1) + ";" + str(c2) + ";" + str(c3) + ";" + str(c4) + ";" + str(c5) + ";" + str(c6) + ";" + str(c7) + ";" + str(c8) + ";" + str(c9) + "\n"
            f1.write(riga)
        except:
            continue

    f1.close()

    #eventi
    f2.write("giorno;descrizione;oraInizio;oraFine;classi;stanze\n")
    query = "SELECT giorno, descrizione, oraInizio, oraFine, classi, stanze FROM eventi;"
    cursore.execute(query)

    for c1, c2, c3, c4, c5, c6 in cursore:
        try:
            riga = str(c1) + ";" + str(c2) + ";" + str(c3) + ";" + str(c4) + ";" + str(c5) + ";" + str(c6) + "\n"
            f2.write(riga)
        except:
            continue

    f2.close()

    #liberazioni
    f3.write("giorno;descrizione;classe;ore\n")
    query = "SELECT giorno, descrizione, classe, ore FROM liberazione;"
    cursore.execute(query)

    for c1, c2, c3, c4 in cursore:
        try:
            riga = str(c1) + ";" + str(c2) + ";" + str(c3) + ";" + str(c4) + "\n"
            f3.write(riga)
        except:
            continue

    f3.close()

    #closing the connection
    cursore.close()
    connessione.close()
    

##ELABORAZIONE
if __name__ == "__main__":
    if(boolD):
        print("inizio programma")
    
    fn_tablesToCsv()
    
    if(boolD):
        print("Fine programma")
