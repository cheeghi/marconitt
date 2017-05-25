##IMPORT
import mysql.connector
import os
from datetime import datetime


##DOC
__author__ = 'Elia Semprebon'
__description__ = "Generatore della tabella centrale per marconitt e dei file con i dati dell'anno passato"


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
    cursore1 = connessione.cursor()
    

    query = "SELECT * FROM timetable INNER JOIN prenotazioni ON timetable.id = prenotazioni.id"
    cursore.execute(query)

    for i in cursore:
        print(i)

    query = "UPDATE timetable SET giorno = Null, stanza = Null, risorsa = Null, ora = Null, professore1 = Null, professore2 = Null"
    cursore.execute(query)
    
    #os.system("python carica_orario.py")

    
    
    cursore.close()
    connessione.commit()
    connessione.close()


##ELABORAZIONE
if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_cambiaOrario()
    
    if(boolD):
        print("Fine programma")
