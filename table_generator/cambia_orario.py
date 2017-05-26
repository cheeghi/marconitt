# -*- coding: cp1252 -*-
##IMPORT
import mysql.connector
import os
from datetime import datetime


##DOC
__author__ = 'Elia Semprebon'
__description__ = "Programma da eseguire quando cambia l'orario"


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


def fn_cambiaOrario():
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()
    connessione1 = fn_generaconnessione()
    cursore1 = connessione1.cursor()
    

    query = "SELECT giorno, ora, stanza, risorsa, professore1, professore2, who, isSchoolHour, approvata FROM timetable INNER JOIN prenotazioni ON timetable.id = prenotazioni.id"
    cursore.execute(query)
    query = "UPDATE timetable SET giorno = Null, stanza = Null, risorsa = Null, ora = Null, professore1 = Null, professore2 = Null"
    cursore1.execute(query)
    query = "ALTER TABLE prenotazioni DROP FOREIGN KEY id_fk"
    cursore1.execute(query)
    query = "TRUNCATE prenotazioni"
    cursore1.execute(query)
    query = "ALTER TABLE prenotazioni ADD CONSTRAINT id_fk FOREIGN KEY(id) REFERENCES timetable(id) ON DELETE CASCADE"
    
    print("carica_orario.py")
    os.system("C:\Python27\python.exe carica_orario.py\nPAUSE")
    
    for giorno, ora, stanza, risorsa, professore1, professore2, who, isSchoolHour, approvata in cursore:
        query = "SELECT risorsa FROM timetable WHERE giorno ='" + str(giorno) + "' AND ora = " + str(ora) + " AND stanza ='" + str(stanza) + "'"
        cursore1.execute(query)
        row = cursore1.fetchone()
          
        if(row == None):
            query = "SELECT id FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" + str(giorno) + "' AND ora = " + str(ora)
            cursore1.execute(query)
            _id = str(cursore1.fetchone())
            _id = _id.replace("(", "")
            _id = _id.replace(",)", "")
            
            if(str(isSchoolHour) == "0"):
                #è ora di scuola, tolgo la classe e sposto i professori
                try:
                    query = "SELECT professore1, professore2 FROM timetable WHERE giorno ='" + str(giorno) + "' AND ora = " + str(ora) + " AND risorsa = '" + risorsa + "'"
                    cursore1.execute(query)
                    
                    for prof1, prof2 in cursore1:
                        prof1 = prof1.replace("(", "")
                        prof1 = prof1.replace(",)", "")
                        prof2 = prof2.replace("(", "")
                        prof2 = prof2.replace(",)", "")
                        query = "UPDATE timetable SET professore1 = '" + prof1 + "', professore2 = '" + prof2 + "' WHERE id = " + _id
                        cursore1.execute(query)
                except:
                    query = "SELECT professore1 FROM timetable WHERE giorno ='" + str(giorno) + "' AND ora = " + str(ora) + " AND risorsa = '" + risorsa + "'"
                    cursore1.execute(query)
                    prof1 = str(cursore1.fetchone())
                    prof1 = prof1.replace("(", "")
                    prof1 = prof1.replace(",)", "")
                    
                    query = "UPDATE timetable SET professore1 = '" + prof1 + "', professore2 = Null WHERE id = " + _id
                    cursore1.execute(query)
                    
                query = "UPDATE timetable SET risorsa = Null, professore1 = Null, professore2 = Null WHERE giorno ='" + str(giorno) + "' AND ora = " + str(ora) + " AND risorsa = '" + risorsa + "'"
                cursore1.execute(query)

            query = "UPDATE timetable SET risorsa = '" + risorsa + "' WHERE id = " + _id
            cursore1.execute(query)
            
            query = "INSERT INTO prenotazioni VALUES(" + _id + ", '" + who + "', " + str(isSchoolHour) + ", " + str(approvata) + ")"
            cursore1.execute(query)
            print(query)
        else:
            print("è occupata")
            #inviare la mail
            
    cursore.close()
    connessione.commit()
    connessione.close()
    connessione1.commit()
    connessione1.close()


def fn_liberaRisorse():
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()
    connessione1 = fn_generaconnessione()
    cursore1 = connessione1.cursor()
    
    query = "SELECT giorno, descrizione, classe, ore FROM liberazione"
    cursore.execute(query)

    for giorno, descrizione, classe, ore in cursore:
        vett = ore.split(",")
        for i in vett:
            query = "UPDATE timetable SET risorsa = Null, professore1 = Null, professore2 = Null WHERE giorno ='" + str(giorno) + "' AND ora = " + str(i) + " AND risorsa = '" + classe + "'"
            cursore1.execute(query)
            
    connessione.commit()
    connessione.close()
    connessione1.commit()
    connessione1.close()

    
##ELABORAZIONE

if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_liberaRisorse()
    
    if(boolD):
        print("Fine programma")
