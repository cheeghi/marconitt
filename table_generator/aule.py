##IMPORT
import requests
import json
import mysql.connector


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


def fn_getstanze(obj):
    '''
    Funzione che ritorna un vettore con le stanze, prendendo l'oggetto in json
    '''
    stanze = obj["rooms"]

    for i in stanze:
        if(i == "" or i == None):
            stanze.remove(i)
        
    return stanze


def fn_tabaule():
    '''
    Funzione che genera la tabella aule
    '''
    req = requests.get("http://localhost:80/api.php")
    obj = json.loads(req.text)
    aule = fn_getstanze(obj)

    connessione = fn_generaconnessione()
    cursore = connessione.cursor()
    
    query = "TRUNCATE aule"
    cursore.execute(query)
    
    for i in aule:
        if(i[0] != "P" and i[0] != "D" and i[1] != "G"):
            query =  "INSERT INTO aule VALUES('" + i + "')"
            cursore.execute(query)

    connessione.commit()
    connessione.close()


##ELABORAZIONE
if __name__ == "__main__":
    if(boolD):
        print("inizio programma")

    fn_tabaule()
    
    if(boolD):
        print("Fine programma")
