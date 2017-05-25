##IMPORT
import datetime
from datetime import date
from datetime import datetime
from datetime import timedelta
import mysql.connector
import os

##DOC
__author__ = 'Elia Semprebon'
__description__ = "Generatore della tabella centrale per marconitt e dei file con i dati dell'anno passato"


##VARIABILI
global boolD
boolD = True


##FUNZIONI


def fn_getstanze():
    '''
    Funzione che carica su vettore le aule dal DataBase
    '''
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()

    query = "SELECT * FROM aule;"
    cursore.execute(query);
    vett = []

    for i in cursore:
        aula = str(i)
        aula = aula.replace("(u'", "")
        aula = aula.replace("',)", "")
        vett.append(aula)

    connessione.commit()
    connessione.close()

    return vett


def fn_getgiorniscuola(nomefile):
    '''
    Funzione che genera i giorni di scuola, escludendo quindi le vacanze(prese da file), e li ritorna in un vettore
    '''
    fileI = open("periodo.csv", "r")
    line = fileI.readline()
    line = fileI.readline()
    giorni = line.split(";")
    
    data = giorni[0].split("-")
    giorno = int(data[0])
    mese = int(data[1])
    anno = int(data[2])
    start = date(anno, mese, giorno)

    data = giorni[1].split("-")
    giorno = int(data[0])
    mese = int(data[1])
    anno = int(data[2])
    end = date(anno, mese, giorno)
    
    if boolD:
        print(start)
        print(end)
        
    actual = start
    giorni = []
    ifile = open(nomefile, "r")
    inizio_vac = []
    fine_vac = []
    line = ifile.readline()
    line = ifile.readline()
    line = line.replace("\n", "")
    
    while(line != "" and line != None):
        vett = line.split(";")
        dati = vett[0].split("-")
        inizio_vac.append(date(int(dati[0]), int(dati[1]), int(dati[2])))
        dati = vett[1].split("-")
        fine_vac.append(date(int(dati[0]), int(dati[1]), int(dati[2])))
        line = ifile.readline()
        line = line.replace("\n", "")


    while(actual <= end):
        agg = True
        
        for i in range(0, len(inizio_vac)):
            if(actual >= inizio_vac[i] and actual <= fine_vac[i]):
                agg = False
            if(actual.weekday() == 6):
                agg = False

        if(agg):
            giorni.append(actual)
        actual += timedelta(1)

    return giorni


def fn_generaconnessione():
    '''
    Funzione che genera e ritorna la connessione a mysql
    '''
    connessione = mysql.connector.connect(user='root', password='',host='127.0.0.1',database='marconitt')
    return connessione


def fn_truncate():
    '''
    Funzione che tronca le tabelle
    '''
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()
    
    query = "TRUNCATE prenotazioni"
    cursore.execute(query)
    query = "TRUNCATE prof_eventi"
    cursore.execute(query)
    query = "TRUNCATE prof_liberazione"
    cursore.execute(query)
    query = "TRUNCATE users"
    cursore.execute(query)
    query = "ALTER TABLE prof_liberazione DROP FOREIGN KEY lib_fk"
    cursore.execute(query)
    query = "ALTER TABLE prof_eventi DROP FOREIGN KEY eventi_fk"
    cursore.execute(query)
    query = "ALTER TABLE prenotazioni DROP FOREIGN KEY id_fk"
    cursore.execute(query)
    query = "TRUNCATE liberazione"
    cursore.execute(query)
    query = "TRUNCATE eventi"
    cursore.execute(query)
    query = "TRUNCATE timetable"
    cursore.execute(query)

    query = "ALTER TABLE prenotazioni ADD CONSTRAINT id_fk FOREIGN KEY(id) REFERENCES timetable(id) ON DELETE CASCADE"
    cursore.execute(query)
    query = "ALTER TABLE prof_eventi ADD CONSTRAINT eventi_fk FOREIGN KEY(id) REFERENCES eventi(id) ON DELETE CASCADE"
    cursore.execute(query)
    query = "ALTER TABLE prof_liberazione ADD CONSTRAINT lib_fk FOREIGN KEY(liberazione) REFERENCES liberazione(id) ON DELETE CASCADE"
    cursore.execute(query)
    
    connessione.commit()
    connessione.close()


def fn_generarighe():
    '''
    Funzione che elimina, poi rigenera ed invia le righe della timetable al database mysql
    '''
    stanze = fn_getstanze()
    nomefile = "vacanze.csv"
    giorni = fn_getgiorniscuola(nomefile)
    ore = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    cont = 0
    appo = 500
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()

    if(boolD):
        print(len(ore))
        print(len(giorni))
        print(len(stanze))
    
    for g in giorni:
        for o in ore:
            for s in stanze:
                str_giorno = g.strftime("%Y-%m-%d")
                query = "INSERT INTO timetable(giorno, ora, stanza, giorno_settimana) VALUES (%s, %s, %s, %s);"
                dati = (str_giorno, str(o), s, str(g.weekday() + 1))
                cursore.execute(query, dati)
                cont += 1

                if (cont == appo):
                    if(boolD):
                        print("Cont= " + str(cont) + "     appo= " + str(appo))
                        
                    appo += 500
                    cursore.close()
                    connessione.commit()
                    connessione.close()
                    connessione = fn_generaconnessione()
                    cursore = connessione.cursor()
                    
    #query = "DELETE FROM timetable WHERE stanza IS NULL or stanza = ''"
    cursore.close()
    connessione.commit()
    connessione.close()


##ELABORAZIONE
if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_truncate()
    fn_generarighe()
    
    if(boolD):
        print("Fine programma")
