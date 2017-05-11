##IMPORT
import requests
import json
import datetime
from datetime import date
from datetime import datetime
from datetime import timedelta
import mysql.connector

##DOC
__author__ = 'Elia Semprebon'
__description__ = 'Generatore della tabella users per marconitt'


##VARIABILI
global boolD
boolD = True


##FUNZIONI


def fn_eliminaUtenti():
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()

    sql = "TRUNCATE TABLE users;"
    cursore.execute(sql)


def fn_caricaProf():
    connessione = fn_generaconnessione()
    cursore = connessione.cursor()
    connessione2 = fn_generaconnessione()
    cursore2 = connessione2.cursor()

    sql = "SELECT `Column 0` FROM gpu004"
    cursore.execute(sql)

    for username in cursore:
        appo = str(username)
        appo = appo.replace("(", "")
        appo = appo.replace(")", "")
        appo = appo.replace(",", "")
        appo = appo.replace("u'", "")
        appo = appo.replace("'", "")
        appo = appo.lower()

        if(appo != "?"):
            sql = "INSERT INTO users VALUES('" + appo + "', false, '" + appo + "@marconivr.it" + "');"
            cursore2.execute(sql)

    cursore.close()
    cursore2.close()
    connessione.commit()
    connessione2.commit()
    connessione.close()
    connessione2.close()


def fn_generaconnessione():
    '''
    Funzione che genera e ritorna la connessione a mysql
    '''
    connessione = mysql.connector.connect(user='root', password='',host='127.0.0.1',database='marconitt')
    return connessione


##ELABORAZIONE
if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_eliminaUtenti()
    fn_caricaProf()
    
    if(boolD):
        print("Fine programma")
