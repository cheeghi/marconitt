# -*- coding: cp1252 -*-
##IMPORT
import mysql.connector
import os
import requests
import json


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

    fout = open("appoggio.csv", "w")

    query = "SELECT giorno, ora, stanza, risorsa, professore1, professore2, who, isSchoolHour, approvata FROM timetable INNER JOIN prenotazioni ON timetable.id = prenotazioni.id"
    cursore.execute(query)

    for giorno, ora, stanza, risorsa, professore1, professore2, who, isSchoolHour, approvata in cursore:
        print(str(giorno) + ";" + str(ora) + ";" + str(stanza) + ";" + str(risorsa) + ";" + str(professore1) + ";" + str(professore2) + ";" + str(who) + ";" + str(isSchoolHour) + ";" + str(approvata))
        fout.write(str(giorno) + ";" + str(ora) + ";" + str(stanza) + ";" + str(risorsa) + ";" + str(professore1) + ";" + str(professore2) + ";" + str(who) + ";" + str(isSchoolHour) + ";" + str(approvata) + "\n")

    fout.close()

    query = "UPDATE timetable SET risorsa = Null, professore1 = Null, professore2 = Null"
    cursore.execute(query)
    query = "ALTER TABLE prenotazioni DROP FOREIGN KEY id_fk"
    cursore.execute(query)
    query = "TRUNCATE prenotazioni"
    cursore.execute(query)
    query = "ALTER TABLE prenotazioni ADD CONSTRAINT id_fk FOREIGN KEY(id) REFERENCES timetable(id) ON DELETE CASCADE"
    cursore.execute(query)
    connessione.commit()

    print("carica_orario.py")
    os.system("C:\Python27\python.exe carica_orario.py")

    fin = open("appoggio.csv", "r")
    line = fin.readline()

    while(line != ""):
        vett = line.split(";")
        giorno = vett[0]
        ora = vett[1]
        stanza = vett[2]
        risorsa = vett[3]
        who = vett[6]
        isSchoolHour = vett[7]
        approvata = vett[8]

        query = "SELECT risorsa FROM timetable WHERE giorno ='" + str(giorno) + "' AND ora = " + str(ora) + " AND stanza ='" + str(stanza) + "'"
        cursore.execute(query)
        row = cursore.fetchone()
        row = str(row).replace("(", "")
        row = str(row).replace(",)", "")

        if(row == "None"):
            query = "SELECT id FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" + str(giorno) + "' AND ora = " + str(ora)
            cursore.execute(query)
            _id = str(cursore.fetchone())
            _id = _id.replace("(", "")
            _id = _id.replace(",)", "")

            if(str(isSchoolHour) == "1"):
                if(boolD):
                    print("isSchoolHour")
                fn_sendMail(giorno, ora, stanza, who)
            else:
                query = "UPDATE timetable SET risorsa = '" + risorsa + "' WHERE id = " + _id
                cursore.execute(query)

                query = "INSERT INTO prenotazioni VALUES(" + _id + ", '" + who + "', " + str(isSchoolHour) + ", " + str(approvata) + ")"
                cursore.execute(query)
        else:
            if(boolD):
                print("occupata")
            fn_sendMail(giorno, ora, stanza, who)

        line = fin.readline()
    fin.close()

    cursore.close()
    connessione.commit()
    connessione.close()


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


def fn_sendMail(giorno, ora, stanza, who):
    url = "http://localhost:8080/api/mailsender"
    data = {'username': who, 'stanza': stanza, 'ora': ora, 'giorno': giorno}
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    r = requests.post(url, data=json.dumps(data), headers=headers)
    print(r)


##ELABORAZIONE

if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_cambiaOrario()
    fn_liberaRisorse()
    
    if(boolD):
        print("Fine programma")
